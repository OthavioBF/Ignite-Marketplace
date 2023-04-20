import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { SignIn } from "../screens/SignIn";
import { SignUp } from "../screens/SignUp";

type AuthRoutes = {
  signIn: undefined;
  signUp: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Screen, Navigator } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name='signIn' component={SignIn} />
      <Screen name='signUp' component={SignUp} />
    </Navigator>
  );
}