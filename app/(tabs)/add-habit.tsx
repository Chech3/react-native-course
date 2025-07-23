import ScreenWrapper from "@/components/screenWrapper";
import { StyleSheet, View } from "react-native";
import {
  TextInput,
  SegmentedButtons,
  Button,
  Text,
  useTheme,
} from "react-native-paper";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { database, DATABASE_ID, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { ID } from "react-native-appwrite";
import { useRouter } from "expo-router";

const FREQUENCY_OPTIONS = ["daily", "weekly", "monthly"];
type Frequency = (typeof FREQUENCY_OPTIONS)[number];

export default function AddHabitScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Frequency>(FREQUENCY_OPTIONS[0]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const router = useRouter();

  const theme = useTheme();

  const handleSubmit = async () => {
    if (!user) return;
    try {
      await database.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          title,
          description,
          frequency,
          user_id: user.$id,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );

      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
      setError("An unexpected error occurred while adding the habit.");
      return;
    } finally {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Add Habit</Text>
        <TextInput
          style={styles.input}
          label="Title"
          mode="outlined"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          label="Description"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
        />

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
        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSubmit}
          disabled={!title || !description}
        >
          Add Habit
        </Button>
        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    textAlign: "center",
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
