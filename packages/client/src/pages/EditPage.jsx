import {
  useEffect,
  useReducer,
  useContext,
  useRef,
  useMemo,
  useState,
} from "react";
import styles from "./EditPage.module.css";
import { AppContext } from "@root/AppContext";
import { FormInput, Button } from "@common";
import { formatDate } from "@root/utils";
import { Link, useNavigate } from "react-router-dom";
import { use } from "react";

const defaultValue = {
  date: false,
  meal: false,
  content: false,
  calories: false,
};

function formReducer(state, action) {
  const { key, value, auxValue } = action;
  let valid;
  switch (key) {
    case "content":
      valid =
        (value === "sport" && auxValue < 0) ||
        (value !== "sport" && auxValue >= 0);
      return {
        ...state,
        content: !!value,
        calories: valid,
      };
    case "calories":
      valid =
        (auxValue === "sport" && value < 0) ||
        (auxValue !== "sport" && value >= 0);
      return {
        ...state,
        calories: !!value,
      };

    default:
      return {
        ...state,
        [key]: !!value,
      };
  }
}

export function EditPage() {
  const { totalCalories, updateFromDate, updateToDate } =
    useContext(AppContext);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [formState, dispatchFn] = useReducer(formReducer, defaultValue);

  const dateRef = useRef();
  const mealRef = useRef();
  const contentRef = useRef("");
  const caloriesRef = useRef(0);

  const {
    date: isDataValid,
    meal: isMealValid,
    content: isContentValid,
    calories: isCaloriesValid,
  } = formState;

  const isFormValid = useMemo(() => {
    return isDataValid && isMealValid && isContentValid && isCaloriesValid;
  }, [isDataValid, isMealValid, isContentValid, isCaloriesValid]);

  useEffect(() => {
    if (!isDataValid) {
      dateRef.current.focus();
    } else if (!isMealValid) {
      mealRef.current.focus();
    } else if (!isContentValid) {
      contentRef.current.focus();
    } else if (!isCaloriesValid) {
      caloriesRef.current.focus();
    }
  }, [isDataValid, isMealValid, isContentValid, isCaloriesValid]);

  const onBlurDateHandler = (event) => {
    dispatchFn({
      key: "date",
      value: formatDate(event.target.value),
    });
    updateFromDate(event.target.value);
    updateToDate(event.target.value);
  };

  const onBlurMaelHandler = (event) => {
    dispatchFn({
      key: "meal",
      value: event.target.value,
    });
  };
  const onBlurContentHandler = (event) => {
    dispatchFn({
      key: "content",
      value: event.target.value,
      auxValue: contentRef.current.value,
    });
  };

  const onBlurCaloriesHandler = (event) => {
    dispatchFn({
      key: "calories",
      value: Number(event.target.value),
      auxValue: Number(caloriesRef.current.value),
    });
  };

  async function save(record) {
    setError(null);
    try {
      const response = await fetch("/api/records", {
        method: "POST",
        body: JSON.stringify(record),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create new record");
      }

      return await response.json();
    } catch (error) {
      setError(error.message);
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const newRecord = {
        date: dateRef.current.value,
        meal: mealRef.current.value,
        content: contentRef.current.value,
        calories: Number(caloriesRef.current.value),
      };
      const setRecord = await save(newRecord);
      navigate("..?refresh=true");
    } catch (error) {
      alert("Failed to save record. Please try again.");
    }
  };
  function onChackedHandler(event) {
    if (event.target.checked === true) {
      contentRef.current.value = "sport";
      mealRef.current.value = "No Meal";
      caloriesRef.current.value = -100;
    } else {
      contentRef.current.value = "";
      mealRef.current.value = "";
      caloriesRef.current.value = "";
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmitHandler}>
      {error && (
        <p className={styles.warning}> You spent ({totalCalories}) calories</p>
      )}
      <FormInput
        label="Date:"
        id="date"
        type="date"
        onBlur={onBlurDateHandler}
        isValid={isDataValid}
        ref={dateRef}
        defaultValue={formatDate(new Date())}
      />

      <FormInput
        label="Meal:"
        id="meal"
        type="select"
        onBlur={onBlurMaelHandler}
        isValid={isMealValid}
        ref={mealRef}
      >
        <option value=""></option>
        <option value="No Meal">No Meal</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Snack">Snack</option>
      </FormInput>

      <FormInput
        label="Content:"
        id="content"
        type="text"
        onBlur={onBlurContentHandler}
        isValid={isContentValid}
        ref={contentRef}
      />

      <FormInput
        label="Calories:"
        id="calories"
        type="number"
        onBlur={onBlurCaloriesHandler}
        isValid={isCaloriesValid}
        ref={caloriesRef}
        max={contentRef.current.value === "sport" ? -1 : 10000}
        min={contentRef.current.value === "sport" ? -10000 : 0}
      />

      <div className={styles.sportCheckBox}>
        <input id="sportCheckBox" onChange={onChackedHandler} type="checkbox" />
        <label htmlFor="sportCheckBox">Sport</label>
      </div>
      <Button disabled={!isFormValid} variant="Btn" type="submit">
        Add Record
      </Button>
      <Link to=".." className={styles.closeBtn}>
        Close
      </Link>
    </form>
  );
}
