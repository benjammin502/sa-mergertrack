import TextField from "@material-ui/core/TextField";
import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import { HookFormProps } from "./HookFormProps";




const ControlledSelect: React.FC<HookFormProps> = ({ name, control, label, defaultValue, required, rules, className, placeholder, inputLabel, children }) => {
  const { formState: { errors }, setValue } = useForm();
  const [val, setVal] = React.useState('');

  // const handleChange = (e, onChange) => {
  //   setVal(e.target.value);
  //   setValue(
  //     name,
  //     e.target.value
  //   );
  // };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || ''}
      rules={rules}
      render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => (
        <TextField
          select
          value={value}
          onChange={onChange} // (e) => onChange(e)
          variant="outlined"
          margin="dense"
          required={required}
          label={label}
          error={!!error}
          className={className}
          helperText={error ? error?.message : null}
        >
          {children}
        </TextField>

      )}
    />
  );
};

export default ControlledSelect;