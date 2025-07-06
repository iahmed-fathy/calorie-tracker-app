import { memo } from "react";
import styles from "./Button.module.css";

export const Button = memo((props) => {
  const { children, variant, disabled, type, ...rest } = props;
  return (
    <button
      type={type}
      {...rest}
      className={styles[`${variant}`]}
      disabled={disabled}
    >
      {children}
    </button>
  );
});
