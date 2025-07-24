import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons/";
import { useTheme } from "react-native-paper";
import { View, StyleSheet  } from "react-native";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Tabs
        screenOptions={{
          headerTitleStyle: { color: colors.tertiary },
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerShown: true,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 0,
            position: "absolute",
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Today's habits",
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="calendar-today"
                size={size}
                color={color}
              />
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="streak"
          options={{
            title: "Streaks",
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="chart-line"
                size={size}
                color={color}
              />
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="add-habit"
          options={{
            title: "Add Habit",
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="plus-circle"
                size={size}
                color={color}
              />
            ),
          }}
        ></Tabs.Screen>
      </Tabs>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
});
