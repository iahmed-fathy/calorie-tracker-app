import styles from "./NoResultFound.module.css";

export function NoResultFound(props) {
  const { value } = props;

  return (
    <div className={styles.noResult}>
      <h2>{value}</h2>
    </div>
  );
}
