import { useState, useEffect } from "react";

// ✅ عدّل hook ليأخذ apiUrl كـ state متغير وليس ثابت
export function useLoadData(initialApiUrl) {
  const [records, setRecords] = useState();
  const [apiUrl, setApiUrl] = useState(initialApiUrl);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!apiUrl) return;

    const controller = new AbortController();

    async function loadRecords() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });

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

    return () => controller.abort();
  }, [apiUrl]);
  return [records, loading, error, setApiUrl];
}
