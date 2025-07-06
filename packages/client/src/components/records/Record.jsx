import { useContext, useEffect } from "react";

import styles from "./Record.module.css";
import { RecordDate } from "./RecordDate";
import { StyledRecordCell } from "@common";
import { AppContext } from "@root/AppContext";

export function Record(props) {
  const { setTotalCalories } = useContext(AppContext);

  useEffect(() => {
    setTotalCalories((prev = 0) => prev + props.calories);
    return () => {
      setTotalCalories((prev = 0) => prev - props.calories);
    };
  });
  return (
    <ul className={styles.record}>
      <li>
        <RecordDate date={props.date} />
      </li>
      <li>{props.meal}</li>
      <li>{props.content}</li>
      <li className={styles["record-calories"]}>
        <StyledRecordCell>{props.calories}</StyledRecordCell>
      </li>
    </ul>
  );
}
