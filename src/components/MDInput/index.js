import { forwardRef } from "react";
import MDInputRoot from "components/MDInput/MDInputRoot";

const MDInput = forwardRef(({ error, success, disabled, ...rest }, ref) => (
  <MDInputRoot {...rest} ref={ref} ownerState={{ error, success, disabled }} />
));

MDInput.defaultProps = {
  error: false,
  success: false,
  disabled: false,
};

export default MDInput;
