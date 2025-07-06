import styles from "./RecordDate.module.css";
import { StyledRecordCell } from "@common";

export function RecordDate(props) {
  const dateObj = new Date(props.date);
  const month = dateObj.toLocaleString("default", { month: "long" });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return (
    <StyledRecordCell>
      <div className={styles["record__date--month"]}>{month}</div>
      <div className={styles["record__date--day"]}>{day}</div>
      <div className={styles["record__date--year"]}>{year}</div>
    </StyledRecordCell>
  );
}
