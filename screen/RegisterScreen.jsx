import { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Toast from "react-native-root-toast";

import useLoader from "../hooks/useLoader";

export default function RegisterScreen() {
  const [userInfo, setUserInfo] = useState();
  const { showLoader, dismissLoader } = useLoader();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit({ name, email, password }) {
    try {
      showLoader();
    } catch (error) {
      Toast.show("Terjadi kesalahan");
    } finally {
      dismissLoader();
    }
  }

  async function googleSign() {
    GoogleSignin.configure();

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      setUserInfo(userInfo);
    } catch (err) {
      Toast.show(err.message || "Terjadi kesalahan");
    } finally {
      dismissLoader();
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
      <View
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          Daftar Sekarang
        </Button>
        <Text style={{ textAlign: "center" }}>atau</Text>
        <Button mode="contained-tonal" onPress={googleSign} icon="google">
          Daftar Dengan Google
        </Button>
      </View>
    </View>
  );
}
