import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { RouteProp } from "@react-navigation/core";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { TextField, ActivityIndicator } from "@nativescript/core";

type AuthScreenProps = {
  route: RouteProp<any, "Auth">;
  navigation: FrameNavigationProp<any, "Auth">;
};

export function AuthScreen({ navigation }: AuthScreenProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // TODO: Implement actual authentication
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("Home");
    }, 1500);
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-3xl font-bold mb-8">Welcome Back</label>
      
      <textField
        className="input w-3/4 mb-4 p-4 rounded-lg bg-white"
        hint="Email"
        keyboardType="email"
        text={email}
        onTextChange={(args) => setEmail(args.value)}
      />

      <textField
        className="input w-3/4 mb-6 p-4 rounded-lg bg-white"
        hint="Password"
        secure={true}
        text={password}
        onTextChange={(args) => setPassword(args.value)}
      />

      <button
        className="btn w-3/4 p-4 rounded-lg bg-blue-500 text-white font-bold"
        onTap={handleLogin}
        isEnabled={!loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>

      <button
        className="btn w-3/4 mt-4 p-4 rounded-lg border-2 border-blue-500 text-blue-500 font-bold"
        onTap={() => navigation.navigate("Register")}
      >
        Create Account
      </button>
    </flexboxLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});