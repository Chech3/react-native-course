import { Text, View, StyleSheet } from "react-native";
import { useAuth } from "@/lib/auth-context";
import { Button, useTheme } from "react-native-paper";
import ScreenWrapper from "@/components/screenWrapper";

export default function Index() {
  const { signOut } = useAuth();
  const { colors } = useTheme();
  return (
    <ScreenWrapper>
      <View style={[styles.view]}>
        <Text style={{ color: colors.tertiary }}>Hola</Text>
        <Button mode="text" icon="logout" onPress={signOut}>
          Logout
        </Button>
      </View>
    </ScreenWrapper>
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
    backgroundColor: "blue",
    color: "white",
    borderRadius: 4,
  },
});
