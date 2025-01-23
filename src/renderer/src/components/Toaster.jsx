import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./Toaster.module.css";

const Toaster = ({ variant, message, show }) => {
  if (!show) return null;

  return (
    <div className={clsx(styles.toaster, { [styles.open]: show })}>
      <div className={clsx(styles.toasterProperties, styles[variant])}>
        {message}
      </div>
    </div>
  );
};

Toaster.propTypes = {
  variant: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
};

export default Toaster;
