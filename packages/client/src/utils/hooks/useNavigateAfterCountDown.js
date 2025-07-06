import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useNavigateAfterCountDown(startCount, redirectLink) {
  const [counter, setCounter] = useState(startCount);
  const intervalHandler = useRef();
  const navigateToHome = useNavigate();

  useEffect(() => {
    if (counter === 0) {
      clearInterval(intervalHandler.current);
      navigateToHome(redirectLink);
    }
  }, [counter]);

  useEffect(() => {
    intervalHandler.current = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(intervalHandler.current);
    };
  }, []);
  return counter;
}
