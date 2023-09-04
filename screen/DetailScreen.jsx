import { Controller, useForm } from "react-hook-form";
import { FlatList, View } from "react-native";
import { AnimatedFAB, IconButton, Text, TextInput } from "react-native-paper";
import TextInputID from "../components/TextInputID";
import SelectOption from "../components/SelectOption";

export default function DetailScreen({ route, navigation }) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  // 1: input (form dinamis, idpel1, idpel2, idpel3)
  // 2: list -> input (pulsa/paket data, tvkabel)
  // 3: input -> list (pdam, game online)

  const data = {
    form: [
      {
        label: "Pilih PDAM",
        name: "idpel2",
        placeholder: "Masukkan Nomor Pelanggan  ",
        info: "Masukkan nomor pelanggan",
        contentType: "select",
        type: "selectOption",
        data: [
          {
            label: 'PDAM Surabaya',
            value: 'PDAMSBY',
          },
          {
            label: 'PDAM Lamongan',
            value: 'PDAMLMG',
          }
        ]
      },
      {
        label: "Nomor Pelanggan",
        name: "idpel1",
        placeholder: "Masukkan Nomor Pelanggan  ",
        info: "Masukkan nomor pelanggan",
        type: "textInputID",
      },
    ],
    submit: {
      label: "Cek Tagihan",
      icon: "check-bold",
    },
  };

  function buildForm(form, field, index) {
    if (form.type == "textInputID") {
      return (
        <TextInputID
          {...form?.param}
          label={form.label}
          value={field.value}
          placeholder={form.placeholder}
          onBlur={field.onBlur}
          onChange={field.onChange}
          autoFocus={index == 0}
        />
      );
    } else if (form.type == "selectOption") {
      return (
        <SelectOption
          type={form.contentType}
          data={form.data}
          label={form.label}
          placeholder={form.placeholder}
          onBlur={field.onBlur}
          onChange={field.onChange}
          autoFocus={index == 0}
        />
      );
    }
  }

  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          margin: 20,
        }}
      >
        {data.form.map((form, index) => (
          <Controller
            key={index}
            control={control}
            render={({ field }) => buildForm(form, field, index)}
            name={form.name}
          />
        ))}
      </View>

      <AnimatedFAB
        icon={data.submit.icon}
        label={data.submit.label}
        extended={true}
        onPress={handleSubmit(onSubmit)}
        animateFrom="right"
        iconMode="dynamic"
        style={[{ bottom: 16, right: 16, position: "absolute", elevation: 1 }]}
      />
    </>
  );
}
