import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { useAuth } from "@/lib/auth-context";
import { Button } from "react-native-paper";

export default function Index() {

  const { signOut } = useAuth();
  return (
    <View style={styles.view}>
      <Text>Hola</Text>
      <Link href="/login" style={styles.link}>
        Ir a Login
      </Link>
      <Button mode="text" icon="logout" onPress={signOut}>Logout</Button>
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    padding: 12,
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: 4
  }
});
