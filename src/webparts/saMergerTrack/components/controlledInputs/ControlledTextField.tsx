import TextField from "@material-ui/core/TextField";
import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import { HookFormProps } from "./HookFormProps";




const ControlledTextField: React.FC<HookFormProps> = ({ name, control, label, defaultValue, required, rules, className, placeholder, inputLabel, children, helperText, multiline, rows }) => {
  const { setValue, formState: { errors } } = useForm();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || ''}
      rules={rules}
      render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => (
        <TextField
          value={value}
          onChange={onChange}
          variant="outlined"
          multiline={multiline}
          rows={rows}
          margin="dense"
          className={className}
          required={required}
          placeholder={placeholder}
          label={label}
          error={!!error}
          helperText={error ? error?.message : null || helperText}
        />
      )}
    />
  );
};

export default ControlledTextField;