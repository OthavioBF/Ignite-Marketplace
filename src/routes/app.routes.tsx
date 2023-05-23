import { useTheme } from "native-base";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";

import { House, Tag, SignOut } from "phosphor-react-native";
import { Home } from "../screens/Home";
import { MyAnnouncements } from "../screens/MyAnnouncements";
import { CreateAnnouncement } from "../screens/CreateAnnouncement";
import { PublishAnnouncement } from "../screens/PublishAnnouncement";
import { MyAnnouncementDetails } from "../screens/MyAnnouncementDetails";

import { Platform } from "react-native";
import { EmptyComponent } from "../components/EmptyComponent";
import { AnnouncementDetails } from "../screens/AnnouncementDetails";

type AppTabRoutes = {
  Home: undefined;
  MyAnnoucements: undefined;
  SignOut: undefined;
};

type AppStackRoutes = {
  TabRoutes: undefined;
  AnnouncementDetails: undefined;
  CreateAnnouncement: undefined;
  PublishAnnouncement: undefined;
  MyAnnouncementDetails: undefined;
};

export type AppNavigatorTabRoutesProps = BottomTabNavigationProp<AppTabRoutes>;
export type AppNavigatorStackRoutesProps =
  NativeStackNavigationProp<AppStackRoutes>;

function HomeTabs() {
  const { sizes, colors } = useTheme();

  const { Screen, Navigator } = createBottomTabNavigator<AppTabRoutes>();

  const iconSize = sizes[7];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.gray[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.gray[100],
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[10],
        },
      }}
    >
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
        }}
      />
      <Screen
        name="MyAnnoucements"
        component={MyAnnouncements}
        options={{
          tabBarIcon: ({ color }) => <Tag size={24} color={color} />,
        }}
      />

      <Screen
        name="SignOut"
        component={EmptyComponent}
        options={{
          tabBarIcon: () => <SignOut size={24} color="#EE7979" />,
        }}
      />
    </Navigator>
  );
}

export function AppRoutes() {
  const { Screen, Navigator } = createNativeStackNavigator<AppStackRoutes>();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="TabRoutes" component={HomeTabs} />

      <Screen name="AnnouncementDetails" component={AnnouncementDetails} />

      <Screen name="CreateAnnouncement" component={CreateAnnouncement} />

      <Screen name="PublishAnnouncement" component={PublishAnnouncement} />

      <Screen name="MyAnnouncementDetails" component={MyAnnouncementDetails} />
    </Navigator>
  );
}
