import { StyleSheet, View } from "react-native";
import { useAuth } from "@/lib/auth-context";
import { Button, useTheme, Text, Surface } from "react-native-paper";
import ScreenWrapper from "@/components/screenWrapper";
import { DATABASE_ID, HABITS_COLLECTION_ID, database } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import { Habit } from "@/types/database.type";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons/";

export default function Index() {
  const { signOut, user } = useAuth();
  const { colors } = useTheme();
  const [habit, setHabit] = useState<Habit[]>([]);

  const fetchHabits = async () => {
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user!.$id)]
      );
      setHabit(response.documents as Habit[]);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching habits:", error.message);
        return;
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchHabits();
  }, [user]);

  return (
    <ScreenWrapper>
      <View style={[styles.container]}>
        <View>
          <Text variant="headlineSmall" style={styles.title}>
            Today&apos;s Habits
          </Text>
          <Button mode="text" icon="logout" onPress={signOut}>
            Logout
          </Button>
        </View>

        {habit.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No habits found</Text>
          </View>
        ) : (
          <View>
            {habit?.map((h) => (
              <Surface style={styles.card} key={h.$id}>
                <View style={styles.cardContent} >
                  <Text style={[styles.cardTitle, {color: colors.primary}]}>{h.title}</Text>
                  <Text style={[styles.cardDescription, {color: "gray"}]}>{h.description}</Text>

                  <View style={styles.cardFooter}>
                    <View style={[styles.streakBadge, {backgroundColor: colors.fire}]}>
                      <MaterialCommunityIcons
                        name="fire"
                        size={24}
                        color="orange"
                      />
                      <Text style={[styles.streakText, {color: colors.scrim}]}>
                        {h.streak_count} day streak
                      </Text>
                    </View>
                    <View style={[styles.frequencyBadge, {backgroundColor: colors.secondary}]}>
                      <Text style={[styles.frequencyText, {color: colors.tertiary}]}>
                        {h.frequency.charAt(0).toUpperCase() + h.frequency.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Surface>
            ))}
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", 
    marginBottom: 24
  },
  title: {
    fontWeight: "bold"
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  streakBadge: {
    flexDirection: "row",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    marginLeft: 6,
    fontWeight: "bold",
    fontSize: 16
  },
  frequencyBadge: {
    flexDirection: "row",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  frequencyText: {
    fontWeight: "bold",
    fontSize: 16
  }
  
  
});
