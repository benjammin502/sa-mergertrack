import { Control, FieldErrors, UseControllerProps } from "react-hook-form";

export interface HookFormProps {
  control: Control<any>;
  name: string;
  error?: FieldErrors<any>;
  rules?: UseControllerProps["rules"];
  defaultValue?: any;
  className?: any;
  required?: any;
  label?: string;
  classes?: any;
  onChange?: any;
  placeholder?: string;
  inputLabel?: string;
  helperText?: string;
  context?: any;
  titleText?: string;
  peoplePickerWPclassName?: string;
  peoplePickerCntrlclassName?: string;
  listId?: string;
  itemId?: number;
  principalTypes?: Array<any>;
  multiline?: boolean;
  rows?: number;
  styles?: any;
  defaultSelectedUsers?: string[];
  // currency textfield props
  currencySymbol?: string;
  outputFormat?: string;
  decimalCharacter?: string;
  digitGroupSeparator?: string;
  ref?: any;
  id?: string;
  options?: Array<any>;
  getOptionLabel?: any;
  style?: Object;
  renderInput?: any;
}