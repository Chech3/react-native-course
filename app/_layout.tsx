import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "../lib/theme"; // Tus temas personalizados
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loadingUser } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup && !loadingUser) {
      router.replace("/auth");
    } else if (user && inAuthGroup && !loadingUser) {
      router.replace("/");
    }
  }, [user, router, segments, loadingUser]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider>
        <RouteGuard>
          <PaperProvider theme={theme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
              ></Stack.Screen>
            </Stack>
          </PaperProvider>
        </RouteGuard>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
