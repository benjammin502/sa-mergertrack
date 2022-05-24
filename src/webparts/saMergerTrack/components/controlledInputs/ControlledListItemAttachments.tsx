import { ListItemAttachments } from '@pnp/spfx-controls-react';
import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import { HookFormProps } from "./HookFormProps";



const ControlledListItemAttachments: React.FC<HookFormProps> = ({ name, control, label, defaultValue, required, rules, className, placeholder, inputLabel, children, helperText, context, titleText, peoplePickerWPclassName, peoplePickerCntrlclassName, listId, itemId }) => {
  const { getValues, formState: { errors } } = useForm();
  let listItemAttachmentsComponentReference = React.createRef<ListItemAttachments>();


  return (
    <Controller
      name={name}
      control={control}
      // defaultValue={defaultValue || null}
      rules={rules}
      render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => (
        <ListItemAttachments
          ref={listItemAttachmentsComponentReference}
          context={context}
          listId={listId}
          itemId={itemId}
          disabled={false}
        />
      )}
    />
  );
};

export default ControlledListItemAttachments;