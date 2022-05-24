import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import { HookFormProps } from "./HookFormProps";




const ControlledCurrencyTextField: React.FC<HookFormProps> = ({ name, control, label, defaultValue, required, rules, className, placeholder, inputLabel, helperText, currencySymbol, outputFormat, decimalCharacter, digitGroupSeparator }) => {
  const { setValue, formState: { errors } } = useForm();


  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || '0.00'}
      rules={rules}
      render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => (
        <CurrencyTextField
          value={value}
          onChange={onChange}
          variant="outlined"
          margin="dense"
          className={className}
          required={required}
          placeholder={placeholder}
          label={label}
          currencySymbol="$"
          decimalCharacter="."
          outputFormat="string"
          digitGroupSeparator=","
          error={!!error}
          helperText={error ? error?.message : null || helperText}
        />
      )}
    />
  );
};

export default ControlledCurrencyTextField;