import ScreenWrapper from "@/components/screenWrapper";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function StreaksScreen() {
  const { colors } = useTheme();
  return (
    <ScreenWrapper>
      <View style={[styles.view]}>
        <Text style={{ color: colors.tertiary }}>Streaks</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
  },
});
