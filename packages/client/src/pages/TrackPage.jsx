import { NoResultFound, RecordList } from "@components/records";
import styles from "./TrackPage.module.css";
import { useLoadData } from "@root/utils/hooks";
import { useContext, useEffect } from "react";
import { AppContext } from "@root/AppContext";
import { Link } from "react-router-dom";

export function TrackPage() {
  const { fromDate, toDate, updateFromDate, updateToDate } =
    useContext(AppContext);

  const [records, loading, error, setRefresh] = useLoadData();

  const searchData = (event) => {
    if (event) event.preventDefault();
    setRefresh((pre) => pre + 1);
  };

  useEffect(() => {
    setRefresh((pre) => pre + 1);
  }, []);

  function onChangeFromDateHandler(event) {
    updateFromDate(event.target.value);
  }

  function onChangeToDateHandler(event) {
    updateToDate(event.target.value);
  }

  let content = <RecordList records={records} setRefresh={setRefresh} />;
  if (error) {
    content = <NoResultFound value={error} />;
  } else {
    content = loading ? (
      <NoResultFound value="Loading..." />
    ) : records?.length === 0 ? (
      <NoResultFound value="No Result Found" />
    ) : (
      <RecordList records={records} setRefresh={setRefresh} />
    );
  }

  return (
    <>
      <div className={styles.App}>
        <h1>Calorie Tracker</h1>
        <form className={styles.filterContainer}>
          <div className={styles.Filter}>
            <label htmlFor="listingDate">From Date:</label>
            <input
              name="fromDate"
              id="listingDate"
              type="date"
              value={fromDate}
              required
              onChange={onChangeFromDateHandler}
            />
          </div>
          <div className={styles.Filter}>
            <label htmlFor="listingDate">To Date:</label>
            <input
              name="toDate"
              id="listingDate"
              type="date"
              value={toDate}
              required
              onChange={onChangeToDateHandler}
            />
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.button}
              type="submit"
              onClick={searchData}
            >
              Search
            </button>
            <Link
              className={`${styles.addRecord} ${styles.button}`}
              to="create"
            >
              Add Record
            </Link>
          </div>
        </form>
        {content}
      </div>
    </>
  );
}
