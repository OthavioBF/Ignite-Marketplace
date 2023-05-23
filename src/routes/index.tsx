import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { Box, useTheme } from "native-base";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/Loading";

export function Routes() {
  const { colors } = useTheme();
  const { user, isLoading } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[200];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  );
}
