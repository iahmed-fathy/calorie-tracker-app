import { createContext, useState } from "react";
import { formatDate } from "./utils";

const AppContext = createContext({
  totalCalories: 0,
  setTotalCalories: () => {},
});

export function AppContextProvider(props) {
  const { children } = props;

  const [totalCalories, setTotalCalories] = useState();
  const [fromDate, setFromDate] = useState(formatDate(new Date()));
  const [toDate, setToDate] = useState(formatDate(new Date()));
  const [loading, setLoading] = useState(false);

  const updateFromDate = (val) => {
    setFromDate(formatDate(val));
  };

  const updateToDate = (val) => {
    setToDate(formatDate(val));
  };

  return (
    <AppContext.Provider
      value={{
        totalCalories,
        setTotalCalories,
        updateFromDate,
        updateToDate,
        fromDate,
        toDate,
        setLoading,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };
