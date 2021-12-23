import { useFormContext } from "react-hook-form";

const LabelCheckbox = ({ label, type, validation, ...rest }) => {
  const { register, errors } = useFormContext();
  return (
    <div>
        <input
        {...register(label, validation)}
        type= "checkbox"
        id={label}
        name={label}
        {...rest}
      />
      <label style={{color : "#121212"}} htmlFor={label}>{label}</label>
      {errors[label] && (
        <p data-cy="labelcheckbox-error" className="text-red-500">
          {errors[label].message}
        </p>
      )}
    </div>
  );
};

export default LabelCheckbox;