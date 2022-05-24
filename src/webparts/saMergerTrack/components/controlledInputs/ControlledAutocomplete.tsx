import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import { HookFormProps } from "./HookFormProps";




const ControlledAutocomplete: React.FC<HookFormProps> = ({ name, control, label, defaultValue, required, rules, className, placeholder, inputLabel, children, helperText, multiline, id, options, getOptionLabel, renderInput, style }) => {
  const { setValue, formState: { errors } } = useForm();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || ''}
      rules={rules}
      render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => (
        <Autocomplete
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={className}
          id={id}
          options={options}
          getOptionLabel={getOptionLabel}
          style={style}
          renderInput={(params) => <TextField {...params} label={label} variant="outlined" margin="dense" required={required} error={!!error} helperText={error ? error?.message : null || helperText} />}
        />
      )}
    />
  );
};

export default ControlledAutocomplete;