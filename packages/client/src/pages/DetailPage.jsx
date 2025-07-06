import { Link, useParams } from "react-router-dom";
import styles from "./DetailPage.module.css";
import { NoResultFound } from "@root/components/records";
import { useLoadData } from "@root/utils/hooks";

export function DetailPage() {
  const params = useParams();
  const [recordData, , error] = useLoadData(`/api/records/${params.recordId}`);

  return error ? (
    <>
      <NoResultFound value={error} />
      <Link className={styles.link} to=".." relative="path">
        Back to last page
      </Link>
    </>
  ) : (
    <>
      <div className={styles.container}>
        <div className={styles.item}>
          <p>Date:</p>
          <p>{recordData?.date}</p>
        </div>
        <div className={styles.item}>
          <p>Meal:</p>
          <p>{recordData?.meal}</p>
        </div>
        <div className={styles.item}>
          <p>Content:</p>
          <p>{recordData?.content}</p>
        </div>
        <div className={styles.item}>
          <p>Calories:</p>
          <p>{recordData?.calories}</p>
        </div>
      </div>
      <Link to=".." relative="path">
        Back to last page
      </Link>
    </>
  );
}
