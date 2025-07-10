import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.view}>
      <Text>Hola</Text>
      <Link href="/login" style={styles.link}>
        Ir a Login
      </Link>
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
