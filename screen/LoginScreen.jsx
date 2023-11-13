import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";

import useAuth from "../hooks/useAuth";
import useLoader from "../hooks/useLoader";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();
  const auth = useAuth();
  const { showLoader, dismissLoader } = useLoader();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }) {
    try {
      showLoader();

      await auth.signIn({ email, password }).then((res) => {
        if (!res) throw new Error("Gagal melakukan login");

        navigation.goBack();
      });
    } catch (error) {
      Toast.show(error?.message || "Terjadi kesalahan");
    } finally {
      dismissLoader();
    }
  }

  async function googleSign() {
    GoogleSignin.configure();

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      showLoader();

      const email = userInfo.user.email;
      const password = userInfo.user.id;
      await auth.signIn({ email, password, type: "google" }).then((res) => {
        console.log(res);
        if (res?.code == "need-bind") {
          console.log("bind hehe");
        } else if (res?.status != 200) {
          throw new Error(res?.message || "Gagal melakukan login");
        } else {
          navigation.goBack();
        }
      });
    } catch (error) {
      Toast.show(error.message || "Terjadi kesalahan");
    } finally {
      dismissLoader();
    }
  }

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        flex: 1,
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
          <Button mode="contained" onPress={handleSubmit(onSubmit)}>
            Masuk
          </Button>
          <Button mode="contained-tonal" onPress={googleSign} icon="google">
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
