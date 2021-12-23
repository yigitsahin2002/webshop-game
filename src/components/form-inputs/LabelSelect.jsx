import { useFormContext } from 'react-hook-form';

const LabelSelect = ({label, options, validation, ...rest}) => {
  const { register,  errors  } = useFormContext();
  return (
    <div className="input">
      <div className="label-and-input">
        <label className="selectLabel" htmlFor={label}>{label}</label>
        <select 
          {...register(label, validation)}
          {...rest}
          id={label}
          name={label}>
          <option value="">--choose a {label}--</option>
          {options.map((value) => (
            <option key={value.id} value={value.id}>
              {value.naam}
            </option>
          ))}
        </select>
      </div>
      <div className="error">{errors[label] && <p className="text-red-500">{errors[label].message}</p>}</div>
    </div>
  );
};

export default LabelSelect;