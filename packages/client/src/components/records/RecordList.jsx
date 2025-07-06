import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "@root/AppContext";
import { Record } from "./Record";
import styles from "./RecordList.module.css";

export function RecordList(props) {
  const { totalCalories } = useContext(AppContext);
  const { records } = props;
  // [ ] SORT BY DATE
  return (
    <>
      <ul className={styles.list}>
        {totalCalories > 0 && <p>Total Calories: ({totalCalories})</p>}
        {records?.map(
          (record) =>
            record.calories && (
              <li key={record.id} className={styles.listItem}>
                <Link to={`${record.id}`}>
                  <Record {...record} />
                </Link>
              </li>
            )
        )}
      </ul>
    </>
  );
}
