import { useFormContext } from "react-hook-form";

const LabelInput = ({ read, label, type, defaultValue, validation, ...rest }) => {
  const { register } = useFormContext();
  return (
      <div>
            <input
            readOnly={Boolean(read)}
            {...register(label, validation)}
            defaultValue={defaultValue}
            type={type}
            id={label}
            name={label}
            {...rest}
            />
      </div>
  );
};

export default LabelInput;