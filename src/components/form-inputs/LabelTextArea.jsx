import { useFormContext } from "react-hook-form";

import TextField from '@mui/material/TextField';

const LabelTextArea = ({ label, type, defaultValue, validation, ...rest }) => {
  const { register, errors } = useFormContext();
  return (
    <div className="input">
      <div className="label-and-input">
        {/*<label htmlFor={label}>{label}</label>
         <textarea className="textarea"
          {...register(label, validation)}
          maxLength="1000"
          defaultValue={defaultValue}
          placeholder={label}
          id={label}
          name={label}
          {...rest}
        ></textarea> */}
        <TextField
          {...register(label, validation)}
          {...rest}
          id={label}
          name={label}
          label={label}
          multiline
          inputProps={{maxLength: "1000" }}
          rows={4}
          placeholder={label}
          InputLabelProps={{
            shrink: true,
          }}
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

export default LabelTextArea;