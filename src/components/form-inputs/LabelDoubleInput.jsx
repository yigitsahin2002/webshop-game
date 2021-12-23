import { useFormContext } from "react-hook-form";

import TextField from '@mui/material/TextField';

const LabelDoubleInput = ({ label, type, defaultValue, validation, ...rest }) => {
  const { register, errors } = useFormContext();
  return (
    <div className="input">
      <div className="label-and-input">
          {/* <label style={{color : "#121212"}} htmlFor={label}>{label}</label>
          <input
            {...register(label, validation)}
            defaultValue={defaultValue}
            placeholder={label}
            type={type}
            step="0.01"
            id={label}
            name={label}
            {...rest}
          /> */}
          <TextField
          {...register(label, validation)}
          id="outlined-number"
          label={label}
          type="number"
          placeholder={label}
          inputProps={{step: "0.01" }}
          InputLabelProps={{
            shrink: true,
          }}
          {...rest}
        />
      </div>
      <div className="error">
      {errors[label] && (
        <p data-cy="labelinput-error" className="text-red-500">
          {errors[label].message}
        </p>
      )}
      </div>
    </div>
  );
};

export default LabelDoubleInput;