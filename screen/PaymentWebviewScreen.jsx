import WebView from "react-native-webview";

export default function PaymentWebviewScreen({ route, children }) {
  const url = route.params.url;

  return <WebView source={{ uri: url }} />;
}
