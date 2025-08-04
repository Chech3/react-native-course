import { ScrollView, StyleSheet, View } from "react-native";
import { useAuth } from "@/lib/auth-context";
import { Button, useTheme, Text, Surface } from "react-native-paper";
import ScreenWrapper from "@/components/screenWrapper";
import {
  COMPLETIONS_COLLECTION_ID,
  DATABASE_ID,
  HABITS_COLLECTION_ID,
  RealTimeResponse,
  habitChannel,
  completeChannel,
  client,
  database,
} from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";
import { Habit, HabitCompletion } from "@/types/database.type";
import { useState, useEffect, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons/";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export default function Index() {
  const { signOut, user } = useAuth();
  const { colors } = useTheme();
  const [habit, setHabit] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<string[]>();

  const isHabitCompleted = (habitId: string) =>
    completedHabits?.includes(habitId);

  const swipeableRefs = useRef<{ [key: string]: any | null }>({});

  const renderLeftAction = () => (
    <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={32}
        color={colors.tertiary}
      />
    </View>
  );
  const renderRightAction = (habitId: string) => (
    <View style={styles.swipeActionRight}>
      {isHabitCompleted(habitId) ? (
        <Text style={{ color: colors.tertiary }}>Completed!</Text>
      ) : (
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={32}
          color={colors.tertiary}
        />
      )}
    </View>
  );

  const swipeableOpen = (direction: string, id: string) => {
    if (direction === "right") {
      handleDeleteHabit(id);
    } else if (direction === "left") {
      handleCompleteHabit(id);
    }

    swipeableRefs.current[id]?.close();
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      await database.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, id);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  };

  const handleCompleteHabit = async (id: string) => {
    if (!user || completedHabits?.includes(id)) return;
    try {
      const currentDate = new Date().toISOString();
      await database.createDocument(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        ID.unique(),
        {
          habit_id: id,
          user_id: user?.$id,
          completed_at: currentDate,
        }
      );

      const habits = habit?.find((h) => h.$id === id);
      if (!habits) return;

      await database.updateDocument(DATABASE_ID, HABITS_COLLECTION_ID, id, {
        streak_count: habits.streak_count + 1,
        last_completed: currentDate,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchHabits = async () => {
      if (!user || !user.$id) return;
      try {
        const response = await database.listDocuments(
          DATABASE_ID,
          HABITS_COLLECTION_ID,
          [Query.equal("user_id", user?.$id ?? "")]
        );
        setHabit(response.documents as Habit[]);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching habits:", error.message);
          return;
        }
      }
    };
    const unsubscribeHabit = client.subscribe(
      habitChannel,
      (response: RealTimeResponse) => {
        const isRelevant = response.events.some((event) =>
          event.includes("databases.*.collections.*.documents.*")
        );

        if (isRelevant) {
          fetchHabits();
        }
      }
    );

    const unsubscribeComplete = client.subscribe(
      completeChannel,
      (response: RealTimeResponse) => {
        const isRelevant = response.events.some((event) =>
          event.includes("databases.*.collections.*.documents.*")
        );

        if (isRelevant) {
          fetchTodayCompletions();
        }
      }
    );

    const fetchTodayCompletions = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const response = await database.listDocuments(
          DATABASE_ID,
          COMPLETIONS_COLLECTION_ID,
          [
            Query.equal("user_id", user?.$id ?? ""),
            Query.greaterThanEqual("completed_at", today.toISOString()),
          ]
        );
        const completions = response.documents as HabitCompletion[];
        setCompletedHabits(completions.map((c) => c.habit_id));
      } catch (error) {
        console.error(error);
      }
    };

    fetchHabits();
    fetchTodayCompletions();
    return () => {
      unsubscribeHabit();
      unsubscribeComplete();
    };
  }, [user]);

  return (
    <ScreenWrapper>
      <View style={[styles.container]}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Today&apos;s Habits
          </Text>
          <Button mode="text" icon="logout" onPress={signOut}>
            Logout
          </Button>
        </View>

        {habit.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.tertiary }}>No habits found</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {habit?.map((h) => (
              <Swipeable
                ref={(ref) => {
                  swipeableRefs.current[h.$id] = ref;
                }}
                key={h.$id}
                overshootLeft={false}
                overshootRight={false}
                renderLeftActions={renderLeftAction}
                renderRightActions={() => renderRightAction(h.$id)}
                onSwipeableOpen={(direction) => {
                  swipeableOpen(direction, h.$id);
                }}
              >
                <Surface
                  style={[
                    styles.card,
                    isHabitCompleted(h.$id) && styles.cardComplete,
                    { backgroundColor: colors.primaryContainer },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: colors.primary }]}>
                      {h.title}
                    </Text>
                    <Text style={[styles.cardDescription, { color: "gray" }]}>
                      {h.description}
                    </Text>

                    <View style={styles.cardFooter}>
                      <View
                        style={[
                          styles.streakBadge,
                          { backgroundColor: colors.fire },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="fire"
                          size={24}
                          color="orange"
                        />
                        <Text
                          style={[styles.streakText, { color: colors.scrim }]}
                        >
                          {h.streak_count} day streak
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.frequencyBadge,
                          { backgroundColor: colors.secondary },
                        ]}
                      >
                        <Text style={{ color: colors.tertiary }}>
                          {h.frequency.charAt(0).toUpperCase() +
                            h.frequency.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Surface>
              </Swipeable>
            ))}
          </ScrollView>
        )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardComplete: {
    opacity: 0.4,
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
    alignItems: "center",
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
    fontSize: 16,
  },
  frequencyBadge: {
    flexDirection: "row",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  frequencyText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },

  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },
});
