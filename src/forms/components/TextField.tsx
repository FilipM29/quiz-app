import { TextField as TextInput } from '@mui/material';
import type { InputHTMLAttributes, ReactNode } from 'react';
import type { ControllerProps, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

type ContainerProps<T extends FieldValues> = Pick<
  ControllerProps<T>,
  'name' | 'control' | 'defaultValue' | 'rules'
>;

type FieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'name' | 'value' | 'defaultValue'
>;

type ComponentProps = {
  label?: string;
  unit?: string | ReactNode;
};

export type TextFieldProps<T extends FieldValues> = ContainerProps<T> &
  FieldProps &
  ComponentProps;

export function TextField<T extends FieldValues>({
  name,
  control,
  label
}: TextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextInput
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
        />
      )}
    />
  );
}
