import { useEffect, useState } from "react";
import { List } from "react-native-paper";

import useAuth from "../hooks/useAuth";
import api from "../lib/api";
import { currency } from "../lib/formatter";
import { View } from "react-native";

export default function PaymentList({ onSelect, auth, price }) {
  const [paymentList, setPaymentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState();

  useEffect(() => {
    async function getPaymentList() {
      await api.get("general/payment-list").then((res) => {
        setPaymentList(res.data);
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
          style={{ paddingVertical: 2 }}
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
            payment.id == selectedPayment && (
              <List.Icon
                {...props}
                icon="check-circle"
                color={theme.colors.primary}
              />
            )
          }
          onPress={() => handleSelectPayment(payment.id)}
        />
      ))}
    </View>
  );
}
