import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-root-toast";

import { useLoader } from "../components/Loader";
import { sender } from "../lib/sender";
import { STORAGE_TYPE, storage } from "../lib/storage";
import { setToken } from "../lib/token";

export default function LoginScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
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

      await sender({
        url: "users/login",
        data: { email, password },
        method: "POST",
      }).then((response) => {
        const data = response?.data;

        if (response.status != 200) {
          throw new Error(data.message);
        }

        if (data.token) setToken(data.token);
      });
    } catch (error) {
      console.log(error);
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
        justifyContent: "center",
        flex: 1,
        padding: 20,
        backgroundColor: theme.colors.primaryContainer,
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
