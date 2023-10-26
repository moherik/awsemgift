import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-root-toast";

import { useLoader } from "../components/Loader";
import useAuth from "../hooks/useAuth";

export default function LoginScreen() {
  const navigation = useNavigation();
  const auth = useAuth();

  const { showModal, hideModal } = useLoader();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }) {
    try {
      showModal();

      await auth.signIn(email, password).then((res) => {
        if (!res) throw new Error("Gagal melakukan login");

        navigation.goBack();
      });
    } catch (error) {
      Toast.show(error?.message || "Terjadi kesalahan");
    } finally {
      hideModal();
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
            Masuk
          </Button>
          <Button mode="text" onPress={() => navigation.navigate("Register")}>
            Daftar Sekarang
          </Button>
        </View>
      </View>
    </View>
  );
}
