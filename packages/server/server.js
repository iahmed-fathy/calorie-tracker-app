const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const generateRecords = require("./data-generator");

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Database setup in memory
const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQlite database.");
});

// Create table and populate with initial data
const setupDb = () => {
  db.run(
    "CREATE TABLE calorie_records (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, meal text, content text, calories integer)",
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Table created.");
        console.log("Generating random records");
        const data = generateRecords();
        console.log("Inserting random data into table");
        let stmt = db.prepare(
          "INSERT INTO calorie_records (date, meal, content, calories) VALUES (?, ?, ?, ?)"
        );
        for (let i = 0; i < data.length; i++) {
          const { date, meal, content, calories } = data[i];
          stmt.run(date, meal, content, calories);
        }
        stmt.finalize();
        console.log("Records inserted successfully.");
      }
    }
  );
};

setupDb();

// Server start and endpoints
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

/**
 * List API; lists all stored records.
 * If date query parameter is provided,
 * it returns records for the given date only
 * Example: GET /records?date=2023-1-7
 */
app.get("/records", (req, res) => {
  console.log("Received 'List' request");
  let sql;
  let params = [];

  if (req.query.date) {
    sql = `SELECT * FROM calorie_records WHERE date = ?`;
    params = [req.query.date];
  } else if (req.query.start_date && req.query.end_date) {
    sql = `SELECT * FROM calorie_records WHERE date BETWEEN ? AND ?`;
    params = [req.query.start_date, req.query.end_date];
  } else {
    sql = "SELECT * FROM calorie_records";
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return console.error(err.message);
    }
    res.json(rows);
  });
});
/**
 * Get single record API. It accepts 'id' as a parameter.
 * Returns the record for the given ID or '404' not found error if ID doesn't exist
 * Example: GET /records/300 => returns the details of the record with id == 300
 */
app.get("/records/:id", (req, res) => {
  const { id } = req.params;

  let sql = "SELECT * FROM calorie_records WHERE id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
      return console.error(err.message);
    }
    // If the query found a record, row will be an object representing that record,
    // otherwise it will be undefined.
    if (row) {
      res.send(row);
    } else {
      res.status(404).send("Record not found");
    }
  });
});

/**
 * Creates new record. The record is passed into the requesy body.
 * You need to pass 'date', 'meal', 'content' and 'calories' in order
 * for request to succeed.
 * Example POST /records (with request body filled)
 */
app.post("/records", (req, res) => {
  const { date, meal, content, calories } = req.body;

  // Simple validation
  if (!date || !meal || !content || !calories) {
    return res.status(400).send("Please provide all record fields.");
  }

  let sql =
    "INSERT INTO calorie_records (date, meal, content, calories) VALUES (?, ?, ?, ?)";
  db.run(sql, [date, meal, content, calories], (err) => {
    if (err) {
      res.status(500).send(err.message);
      return console.error(err.message);
    }
    res.status(200).send({ message: "Record inserted.", id: this.lastID });
  });
});

/**
 * Updates the record with a given id
 * 'id' is passed as a request parameter.
 * You need to pass all properties of the record: date, meal, content & calories
 * in order for the request to succeed.
 * Example: PUT /records/300 (with request body filled)
 */
app.put("/records/:id", (req, res) => {
  const { date, meal, content, calories } = req.body;
  const { id } = req.params;

  // Simple validation
  if (!date || !meal || !content || !calories) {
    return res.status(400).send("Please provide all record fields.");
  }

  let sql =
    "UPDATE calorie_records SET date = ?, meal = ?, content = ?, calories = ? WHERE id = ?";
  db.run(sql, [date, meal, content, calories, id], (err) => {
    if (err) {
      res.status(500).send(err.message);
      return console.error(err.message);
    }
    res.send("Record updated.");
  });
});

/**
 * Deletes the record with a given id
 * 'id' is passed as a request parameter.
 * Example: DELETE /records/300
 */
app.delete("/records/:id", (req, res) => {
  const { id } = req.params;

  let sql = "DELETE FROM calorie_records WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).send(err.message);
      return console.error(err.message);
    }

    if (this.changes === 0) {
      return res.status(404).send("Record not found");
    }

    res.send({ message: "Record deleted", changes: this.changes });
  });
});
