import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";

import useLoader from "../hooks/useLoader";
import api from "../lib/api";

export default function RegisterScreen() {
  const [userInfo, setUserInfo] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const { showLoader, dismissLoader } = useLoader();

  const theme = useTheme();
  const navigation = useNavigation();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      avatarUrl: "",
      authId: "",
      authType: "",
    },
  });

  async function onSubmit(formData) {
    try {
      showLoader();

      const user = await api.post("auth/register", formData);
      if (user.status != 200) throw new Error("Terjadi kesalahan");

      if (!user.data?.verifiedAt) {
        Toast.show("Email verifikasi dikirimkan ke email Anda.");
      } else {
        Toast.show("Silahkan login dengan akun Anda.");
      }

      navigation.goBack();
    } catch (error) {
      Toast.show(error.message || "Terjadi kesalahan");
    } finally {
      dismissLoader();
    }
  }

  async function googleSign() {
    try {
      const isHasService = await GoogleSignin.hasPlayServices();
      if (!isHasService) {
        throw new Error("Google play service tidak ditemukan");
      }

      const userInfo = await GoogleSignin.signIn();

      setUserInfo(userInfo);
      setValue("email", userInfo.user.email);
      setValue("name", userInfo.user.name);
      setValue("avatarUrl", userInfo.user.photo);
      setValue("authId", userInfo.user.id);
      setValue("authType", "google");
    } catch (err) {
      Toast.show(err.message || "Terjadi kesalahan");
    } finally {
      await GoogleSignin.signOut();
      dismissLoader();
    }
  }

  return (
    <View
      style={{
        ...styles.container,
        padding: 20,
        backgroundColor: theme.colors.background,
      }}
    >
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
              left={<TextInput.Icon icon="account" />}
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
              left={<TextInput.Icon icon="email" />}
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
              left={<TextInput.Icon icon="phone" />}
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
              secureTextEntry={!showPassword}
              label="Kata Sandi"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              left={<TextInput.Icon icon="key" />}
              right={
                <TextInput.Icon
                  icon={!showPassword ? "eye-outline" : "eye-off-outline"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
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

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
});
