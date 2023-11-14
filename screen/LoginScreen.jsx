import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";

import useAuth from "../hooks/useAuth";
import useLoader from "../hooks/useLoader";
import api from "../lib/api";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const { showLoader, dismissLoader } = useLoader();
  const navigation = useNavigation();
  const auth = useAuth();
  const theme = useTheme();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSign({ email, password }) {
    try {
      showLoader();

      await auth.signIn({ email, password }).then((res) => {
        if (res?.code == "need-verify") {
          return handleVerify(email, res?.message);
        } else if (res?.status != 200) {
          throw new Error(res?.message || "Gagal melakukan login");
        }

        navigation.goBack();
      });
    } catch (error) {
      Toast.show(error?.message || "Terjadi kesalahan");
    } finally {
      dismissLoader();
    }
  }

  function handleVerify(email, message) {
    Alert.alert("Verifikasi Akun", message, [
      {
        text: "Batal",
        onPress: () => null,
      },
      { text: "OK", onPress: () => handleRequestVerify(email) },
    ]);
  }

  async function handleRequestVerify(email) {
    try {
      showLoader();

      await api.post("auth/verify", { email }).then((resp) => {
        if (resp.status != 200)
          throw new Error(resp.message || "Terjadi Kesalahan");

        Toast.show(resp.message);
      });
    } catch (err) {
      Toast.show(err.message || "Terjadi kesalahan");
    } finally {
      dismissLoader();
    }
  }

  async function handleGoogleSign() {
    try {
      const isHasService = await GoogleSignin.hasPlayServices();
      if (!isHasService) {
        throw new Error("Google play service tidak ditemukan");
      }

      const userInfo = await GoogleSignin.signIn();

      showLoader();

      const authId = userInfo.user.id;
      const email = userInfo.user.email;
      const password = userInfo.user.id;
      await auth
        .signIn({ email, password, type: "google" })
        .then(async (res) => {
          if (res?.code == "need-bind") {
            return await bindAccount({ email, authId, type: "google" });
          } else if (res?.status != 200) {
            throw new Error(res?.message || "Gagal melakukan login");
          }

          navigation.goBack();
        });
    } catch (err) {
      await GoogleSignin.signOut();
      Toast.show(err.message || "Terjadi kesalahan");
    } finally {
      dismissLoader();
    }
  }

  async function bindAccount({ email, authId, type }) {
    showLoader();

    try {
      const binding = await api.post("auth/bind", {
        email,
        authId,
        type,
      });
      if (!binding) {
        throw new Error("Error binding account");
      }

      await auth.signIn({ email, password: authId, type }).then((res) => {
        if (res?.status != 200) throw new Error("Gagal melakukan login");
        navigation.goBack();
      });
    } catch (err) {
      Toast.show(err.message || "Terjadi kesalahan");
    } finally {
      dismissLoader();
    }
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "column",
          padding: 20,
          borderRadius: 8,
        }}
      >
        <View style={{ display: "flex", gap: 10, marginBottom: 20 }}>
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
        <View style={{ display: "flex", gap: 10 }}>
          <Button mode="contained" onPress={handleSubmit(handleSign)}>
            Masuk
          </Button>
          <Text style={{ textAlign: "center" }}>atau</Text>
          <Button
            mode="contained-tonal"
            onPress={handleGoogleSign}
            icon="google"
          >
            Masuk Dengan Google
          </Button>
          <Button mode="text" onPress={() => navigation.navigate("Register")}>
            Daftar Sekarang
          </Button>
        </View>
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
