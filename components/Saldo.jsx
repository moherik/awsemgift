import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Divider,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

export default function Saldo() {
  const theme = useTheme();
  const navigation = useNavigation();

  const menus = [
    {
      label: "Akun",
      icon: "account",
      onPress: () => navigation.navigate('Account'),
    },
    {
      label: "Transfer",
      icon: "swap-vertical-bold",
      onPress: () => navigation.navigate('TransferSaldo'),
    },
    {
      label: "Tarik Tunai",
      icon: "account-cash",
      onPress: () => navigation.navigate('Cashout'),
    },
    {
      label: "Scan QR",
      icon: "qrcode-scan",
      onPress: () => navigation.navigate('ScanQR'),
    },
  ];

  return (
    <Surface>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar.Icon size={32} icon="wallet" />
          <View style={{ marginLeft: 15 }}>
            <Text variant="labelMedium">Saldo Anda</Text>
            <Text variant="bodyLarge" style={{ fontWeight: "600" }}>
              Rp50.000
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Button
            icon="plus-box"
            mode="contained"
            onPress={() => navigation.navigate('Topup')}
          >
            Topup
          </Button>
        </View>
      </View>
      <Divider/>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          padding: 10,
        }}
      >
        {menus.map((menu, index) => (
          <TouchableRipple style={{flex: 1}} onPress={menu.onPress} key={index}>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 5,
                gap: 4,
              }}
            >
              <Avatar.Icon
                size={42}
                icon={menu.icon}
                color={theme.colors.shadow}
                style={{ backgroundColor: theme.colors.primaryContainer }}
              />
              <Text lineBreakMode="clip" variant="bodySmall">{menu.label}</Text>
            </View>
          </TouchableRipple>
        ))}
      </View>
    </Surface>
  );
}
