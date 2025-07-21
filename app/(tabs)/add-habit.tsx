import ScreenWrapper from "@/components/screenWrapper";
import { StyleSheet, View } from "react-native";
import { TextInput, SegmentedButtons, Button } from "react-native-paper";
import { useState } from "react";

const FREQUENCY_OPTIONS = ["daily", "weekly", "monthly"];

export default function AddHabitScreen() {
  const [frequency, setFrequency] = useState(FREQUENCY_OPTIONS[0]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <TextInput style={styles.input} label="Title" mode="outlined" />
        <TextInput style={styles.input} label="Description" mode="outlined" />

        <View style={styles.frequencyContainer}>
          <SegmentedButtons
            style={styles.frequencyButtons}
            buttons={FREQUENCY_OPTIONS.map((freq) => ({
              value: freq,
              label: freq.charAt(0).toUpperCase() + freq.slice(1),
            }))}
            value={frequency}
            onValueChange={setFrequency}
          />
        </View>
        <Button style={styles.button} mode="contained" onPress={() => {}}>
          Add Habit
        </Button>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  input: { marginBottom: 16 },
  frequencyContainer: {
    marginBottom: 16,
  },

  frequencyButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {},
});
