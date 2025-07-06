import styles from "./FormInput.module.css";
import { forwardRef } from "react";

export const FormInput = forwardRef((props, ref) => {
  const { type, id, isValid, label, children, ...rest } = props;
  const inputElemet =
    type === "select" ? (
      <select
        required
        className={!isValid ? styles.error : ""}
        ref={ref}
        id={id}
        {...rest}
      >
        {children}
      </select>
    ) : (
      <input
        required
        type={type}
        id={id}
        className={!isValid ? styles.error : ""}
        ref={ref}
        {...rest}
      />
    );
  return (
    <div className={styles.container}>
      <label htmlFor={id}>{label}</label>
      {inputElemet}
    </div>
  );
});
