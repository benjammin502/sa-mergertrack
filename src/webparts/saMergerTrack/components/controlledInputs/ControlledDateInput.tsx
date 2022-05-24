import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider
} from '@material-ui/pickers';
import 'date-fns';
import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import { HookFormProps } from "./HookFormProps";




const ControlledDateInput: React.FC<HookFormProps> = ({ name, control, label, defaultValue, required, rules, className, placeholder, inputLabel, children, helperText }) => {
  const [date, setDate] = React.useState<Date | null>(null);
  const { getValues, formState: { errors } } = useForm();
  const dateValue = getValues(name);

  // need to use useEffect here for when the component updates onChange, it React re-renders it. 
  // Thus, on a re-render useEffect combined with setDate will set the date input to use the value that was pushed to react-hook-form
  React.useEffect(() => {
    setDate(dateValue || null);
  }, [setDate, date]);


  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || null}
        rules={rules}
        render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => (
          <KeyboardDatePicker
            onBlur={onBlur}
            className={className}
            required={required}
            disableToolbar
            variant="inline"
            inputVariant='outlined'
            format="MM/dd/yyyy"
            margin="dense"
            autoOk
            error={!!error}
            helperText={error ? error?.message : helperText}
            // id="date-picker-inline"
            label={label}
            value={value}
            onChange={
              (e) => 
                onChange(e) // format(e, 'yyyy-MM-dd')
              }
          />
        )}
      />
    </MuiPickersUtilsProvider>
  );
};

export default ControlledDateInput;