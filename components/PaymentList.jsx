import { useEffect, useState } from "react";
import { View } from "react-native";
import { List } from "react-native-paper";
import { Image } from "expo-image";

import api from "../lib/api";
import { currency } from "../lib/formatter";

export default function PaymentList({ onSelect, auth, price }) {
  const [paymentList, setPaymentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState();

  useEffect(() => {
    async function getPaymentList() {
      await api.get("general/payment-list").then((res) => {
        const paymentList = res.data?.filter((val) => {
          if (val.selected) handleSelectPayment(val.id);
          return val.isActive;
        });
        setPaymentList(paymentList);
      });
    }

    if (auth.userData) {
      getPaymentList();
    }
  }, [auth.userData]);

  function handleSelectPayment(paymentId) {
    setSelectedPayment(paymentId);
    onSelect(paymentId);
  }

  return (
    <View style={{ width: "100%" }}>
      {paymentList.map((payment, index) => (
        <List.Item
          key={payment.id || index}
          title={payment.label}
          disabled={payment.balance <= 0 || payment.balance < price}
          description={
            payment.id == "BALANCE"
              ? payment.balance > price
                ? currency(payment.balance)
                : currency(payment.balance) + " - saldo Anda tidak mencukupi"
              : payment.info
          }
          left={(props) =>
            payment.icon ? (
              <List.Icon {...props} icon={payment.icon} />
            ) : (
              <Image
                {...props}
                width={22}
                height={22}
                source={{ uri: `${BASE_URL}/${payment.logo}` }}
              />
            )
          }
          right={(props) =>
            payment.id == selectedPayment ? (
              <List.Icon
                {...props}
                icon="check-circle"
                color={theme.colors.primary}
              />
            ) : null
          }
          onPress={() => handleSelectPayment(payment.id)}
        />
      ))}
    </View>
  );
}
