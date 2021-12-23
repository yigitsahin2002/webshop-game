import { useFormContext } from "react-hook-form";

import TextField from '@mui/material/TextField';

const LabelInput = ({ label, type, defaultValue, validation, ...rest }) => {
  const { register, errors } = useFormContext();
  return (
    <div className="input">
      <div className="label-and-input">
        <TextField 
          {...register(label, validation)} 
          type={type}
          name={label}
          id={label} 
          label={label}
          defaultValue={defaultValue}
          placeholder={label}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          {...rest}
        />
      </div>
      <div className="error">
        {errors[label] && (
          <p data-cy="labelinput-error">
            {errors[label].message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LabelInput;