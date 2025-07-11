const MEAL_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Snack"];
const FOOD_OPTIONS = [
  "Bread",
  "Egg",
  "Rice",
  "Pasta",
  "Beans",
  "Cheese",
  "Milk",
  "Butter",
  "Oil",
  "Chicken",
  "Beef",
  "Fish",
  "Shrimp",
  "Pepper",
  "Onions",
  "Tomato",
  "Apple",
  "Banana",
  "Mango",
  "Watermelon",
  "Strawberry",
  "Dates",
  "Peanuts",
  "Chips",
  "Biscuits",
  "Chocolate",
  "Pizza",
  "Burger",
  "Cake",
];
const RECORDS_PER_MEAL = 4;
const GENERATED_DAYS = 30;
const CALORIES_RANGE = [10, 200];

/**
 * Generates random records from the given meals and food options for 30 days.
 * The days start deceningly starting with day before yesterday
 * The generation skips a day in between every two generated days
 * The history would then go back to 2 months
 */
function generateRecords() {
  const result = [];

  const formatDate = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  for (let i = 1; i <= GENERATED_DAYS; i++) {
    const date = new Date();
    date.setDate(date.getDate() - 2 * i);

    const dateStr = formatDate(date);

    MEAL_OPTIONS.forEach((mealOption) => {
      for (let r = 0; r < RECORDS_PER_MEAL; r++) {
        result.push({
          date: dateStr,
          meal: mealOption,
          content:
            FOOD_OPTIONS[Math.floor(Math.random() * FOOD_OPTIONS.length)],
          calories:
            Math.floor(
              Math.random() * (CALORIES_RANGE[1] - CALORIES_RANGE[0])
            ) + CALORIES_RANGE[0],
        });
      }
    });
  }

  return result;
}

module.exports = generateRecords;
