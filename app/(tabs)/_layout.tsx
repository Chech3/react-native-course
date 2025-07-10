import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({color}) => <Entypo name="home" size={24} color={color} />,
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({color}) => <Entypo name="login" size={24} color={color} />,
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
