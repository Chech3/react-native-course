import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#f5f5f5" },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: "#f5f5f5",
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
        }
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
