import { AppContext } from "@root/AppContext";
import { useState, useEffect, useContext } from "react";

export function useLoadData(url) {
  const [records, setRecords] = useState();
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fromDate, toDate } = useContext(AppContext);

  useEffect(() => {
    async function loadRecords() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          url ? url : `/api/records?start_date=${fromDate}&end_date=${toDate}`
        );

        if (response.status === 404) {
          throw new Error("Data not found (404)");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRecords(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
          console.error("Fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    }

    loadRecords();
  }, [refresh]);
  return [records, loading, error, setRefresh];
}
