import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "@root/AppContext";
import { Record } from "./Record";
import styles from "./RecordList.module.css";

export function RecordList(props) {
  const { totalCalories } = useContext(AppContext);
  const { records = [], setRefresh } = props;
  // [ ] SORT BY DATE
  const sortedData = [...records]?.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  return (
    <>
      <ul className={styles.list}>
        {totalCalories > 0 && <p>Total Calories: ({totalCalories})</p>}
        {sortedData?.map(
          (record) =>
            record.calories && (
              <li key={record.id} className={styles.listItem}>
                <Link to={`${record.id}`}>
                  <Record {...record} setRefresh={setRefresh} />
                </Link>
              </li>
            )
        )}
      </ul>
    </>
  );
}
