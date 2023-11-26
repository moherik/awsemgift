import { useEffect, useRef, useState } from "react";
import { IconButton } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import WebView from "react-native-webview";
import * as Linking from "expo-linking";

export default function PaymentWebviewScreen({ route, navigation }) {
  const [loading, setLoading] = useState(true);

  const webviewUrl = route.params.url;

  const url = Linking.useURL();
  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);
    if (hostname == "payment" && path == "result") {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: "Home" },
            {
              name: "PaymentResult",
              params: queryParams,
            },
          ],
        })
      );
    }
  }

  const webViewRef = useRef();

  useEffect(() => {
    if (!loading) {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon="refresh"
            onPress={() => webViewRef.current?.reload()}
          />
        ),
      });
    }
  }, [navigation, loading]);

  function openExternalLink(req) {
    if (req.url.startsWith("awsemgit://")) {
      Linking.openURL(req.url);
      return false;
    } else {
      return true;
    }
  }

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: webviewUrl }}
      onLoadEnd={() => setLoading(false)}
      onShouldStartLoadWithRequest={openExternalLink}
    />
  );
}
