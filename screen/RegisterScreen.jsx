import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-root-toast";

import { supabase } from "../lib/supabase";
import { useLoader } from "../components/Loader";

export default function RegisterScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { showModal, hideModal } = useLoader();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit({ name, phone, email, password }) {
    try {
      showModal();

      const { data, error } = await supabase.from("users").insert({
        name,
        phone,
        email,
        password,
      });
      if (error) throw new Error();

      await supabase.auth.signUp({
        email,
        password,
        phone,
        options: { data },
      });
    } catch (error) {
      Toast.show("Terjadi kesalahan");
    } finally {
      hideModal();
    }
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
          name="email"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              mode="outlined"
              textContentType="emailAddress"
              label="Email"
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
