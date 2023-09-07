import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";

import { supabase } from "../lib/supabase";

export default function RegisterScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      password: "",
    },
  });

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <View style={{ padding: 20 }}>
      <View style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Controller
          control={control}
          rules={{ required: true }}
          name="name"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              mode="outlined"
              textContentType="telephoneNumber"
              label="Nama Lengkap"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          rules={{ required: true }}
          name="phone"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              mode="outlined"
              textContentType="telephoneNumber"
              label="Nomor Telepon"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          rules={{ required: true }}
          name="password"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              mode="outlined"
              textContentType="password"
              label="Kata Sandi"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
      </View>
      <View style={{ display: "flex", gap: 10 }}>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          Daftar Sekarang
        </Button>
      </View>
    </View>
  );
}
