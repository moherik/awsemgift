import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { AnimatedFAB } from "react-native-paper";

import { FIELD_TYPE } from "../constants";

import TextInputID from "../components/TextInputID";
import SelectOption from "../components/SelectOption";

export default function DetailScreen({ route, navigation }) {
  const { form } = route.params;

  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => console.log(data);

  // 1: input (form dinamis, idpel1, idpel2, idpel3)
  // 2: list -> input (pulsa/paket data, tvkabel)
  // 3: input -> list (pdam, game online)

  function buildForm(field, formField, index) {
    if (field.type == FIELD_TYPE.TEXT_INPUT_ID) {
      return (
        <TextInputID
          {...field?.param}
          label={field.label}
          value={formField.value}
          placeholder={field.placeholder}
          onBlur={formField.onBlur}
          onChange={formField.onChange}
          autoFocus={index == 0}
        />
      );
    } else if (field.type == FIELD_TYPE.SELECT_OPTION) {
      return (
        <SelectOption
          type={field.contentType}
          data={field.data}
          label={field.label}
          placeholder={field.placeholder}
          onBlur={formField.onBlur}
          onChange={formField.onChange}
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
          padding: 20,
        }}
      >
        {form?.fields?.map((field, index) => (
          <Controller
            key={index}
            control={control}
            render={({ field: formField }) =>
              buildForm(field, formField, index)
            }
            name={field.name}
          />
        ))}
      </View>

      {form?.submit && (
        <AnimatedFAB
          icon={form.submit.icon}
          label={form.submit.label}
          extended={true}
          onPress={handleSubmit(onSubmit)}
          animateFrom="right"
          iconMode="dynamic"
          style={[
            { bottom: 16, right: 16, position: "absolute", elevation: 1 },
          ]}
        />
      )}
    </>
  );
}
