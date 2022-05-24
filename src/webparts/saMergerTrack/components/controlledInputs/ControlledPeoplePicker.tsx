import { PeoplePicker } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import { HookFormProps } from "./HookFormProps";





const ControlledPeoplePicker: React.FC<HookFormProps> = ({ name, control, defaultValue, required, rules, placeholder, context, titleText, peoplePickerWPclassName, peoplePickerCntrlclassName, principalTypes, styles, defaultSelectedUsers }) => {
  const { setValue, watch, getValues, formState: { errors } } = useForm();

  

  // const _getPeoplePickerItems = (items: any[]) => {
  //   console.log('Items:', items);
  // };


  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || null}
      rules={rules}
      render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => (
        <PeoplePicker
          context={context}
          titleText={titleText}
          personSelectionLimit={1}
          groupName={""} // Leave this blank in case you want to filter from all users
          showtooltip={true}
          required={required}
          onChange={(items: any[]) => {
            console.log(items);
            onChange(items[0].id);
            setValue(
              name,
              items[0].id
            );
          }}
          ensureUser={true}
          showHiddenInUI={false}
          principalTypes={principalTypes}
          resolveDelay={800}
          defaultSelectedUsers={defaultSelectedUsers}
          styles={styles}
        />
      )}
    />
  );
};

export default ControlledPeoplePicker;