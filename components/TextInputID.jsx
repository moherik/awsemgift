import { TextInput, useTheme } from "react-native-paper";

export default function TextInputID({
  label,
  value,
  name,
  placeholder,
  onBlur,
  onChange,
  ...props
}) {
  const theme = useTheme();

  return (
    <TextInput
      {...props}
      mode="outlined"
      value={value}
      label={label}
      placeholder={placeholder || ""}
      onBlur={onBlur}
      onChangeText={onChange}
      style={{ backgroundColor: theme.colors.background }}
      right={<TextInput.Icon icon="account-box-multiple" onPress={() => {}} />}
    />
  );
}
