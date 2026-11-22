
import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import type {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import { Ionicons } from "@expo/vector-icons";

import type {
  RootStackParamList,
  TabParamList,
  User,
  StudySpace,
  Booking,
} from "../types";

// SCREENS

import LoginScreen from "../screens/LoginScreen";
import ExploreScreen from "../screens/ExploreScreen";
import SpaceDetailsScreen from "../screens/SpaceDetailsScreen";
import BookingScreen from "../screens/BookingScreen";
import BookingsScreen from "../screens/BookingsScreen";
import ProfileScreen from "../screens/ProfileScreen";

// ========================================
// APP NAVIGATOR PROPS
// ========================================

type AppNavigatorProps = {
  user: User | null;
  spaces: StudySpace[];
  favorites: string[];
  bookings: Booking[];

  onLogin: (user: User) => void;
  onLogout: () => void;
  onToggleFavorite: (spaceId: string) => void;
  onConfirmBooking: (booking: Booking) => boolean;
  onCancelBooking: (bookingId: string) => void;

  activeBookingCount: number;
};

// ========================================
// NAVIGATORS
// ========================================

const Stack =
  createNativeStackNavigator<RootStackParamList>();

const Tab =
  createBottomTabNavigator<TabParamList>();

// ========================================
// MAIN TAB PROPS
// ========================================

type MainTabsProps = {
  user: User;
  spaces: StudySpace[];
  favorites: string[];
  bookings: Booking[];

  onToggleFavorite: (spaceId: string) => void;
  onOpenSpace: (spaceId: string) => void;
  onCancelBooking: (bookingId: string) => void;

  activeBookingCount: number;
  onLogout: () => void;
};

// ========================================
// BOTTOM TAB NAVIGATION
// ========================================

function MainTabs({
  user,
  spaces,
  favorites,
  bookings,
  onToggleFavorite,
  onOpenSpace,
  onCancelBooking,
  activeBookingCount,
  onLogout,
}: MainTabsProps) {

  const icons: Record<
    keyof TabParamList,
    keyof typeof Ionicons.glyphMap
  > = {
    Explore: "search-outline",
    Bookings: "calendar-outline",
    Profile: "person-outline",
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#1A1751",
        tabBarInactiveTintColor: "#9292A2",

        tabBarStyle: {
          height: 62,
          paddingBottom: 7,
          paddingTop: 6,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },

        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={icons[route.name]}
            color={color}
            size={size}
          />
        ),
      })}
    >

      {/* EXPLORE TAB */}

      <Tab.Screen name="Explore">
        {() => (
          <ExploreScreen
            spaces={spaces}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onOpenSpace={onOpenSpace}
          />
        )}
      </Tab.Screen>

      {/* BOOKINGS TAB */}

      <Tab.Screen
        name="Bookings"
        options={{
          tabBarBadge:
            activeBookingCount > 0
              ? activeBookingCount
              : undefined,
        }}
      >
        {() => (
          <BookingsScreen
            bookings={bookings}
            spaces={spaces}
            onCancelBooking={onCancelBooking}
          />
        )}
      </Tab.Screen>

      {/* PROFILE TAB */}

      <Tab.Screen name="Profile">
        {() => (
          <ProfileScreen
            user={user}
            bookingCount={bookings.length}
            favoriteCount={favorites.length}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
}

// ========================================
// MAIN SCREEN PROPS
// ========================================

type MainScreenProps =
  NativeStackScreenProps<
    RootStackParamList,
    "Main"
  > & {
    user: User;
    spaces: StudySpace[];
    favorites: string[];
    bookings: Booking[];

    onToggleFavorite: (spaceId: string) => void;
    onCancelBooking: (bookingId: string) => void;

    activeBookingCount: number;
    onLogout: () => void;
  };

// ========================================
// MAIN SCREEN
// ========================================

function MainScreen({
  navigation,
  user,
  spaces,
  favorites,
  bookings,
  onToggleFavorite,
  onCancelBooking,
  activeBookingCount,
  onLogout,
}: MainScreenProps) {

  const handleOpenSpace = (spaceId: string) => {
    navigation.navigate("SpaceDetails", {
      spaceId,
    });
  };

  return (
    <MainTabs
      user={user}
      spaces={spaces}
      favorites={favorites}
      bookings={bookings}
      onToggleFavorite={onToggleFavorite}
      onOpenSpace={handleOpenSpace}
      onCancelBooking={onCancelBooking}
      activeBookingCount={activeBookingCount}
      onLogout={onLogout}
    />
  );
}

// ========================================
// ROOT APP NAVIGATOR
// ========================================

export default function AppNavigator({
  user,
  spaces,
  favorites,
  bookings,
  onLogin,
  onLogout,
  onToggleFavorite,
  activeBookingCount,
  onConfirmBooking,
  onCancelBooking,
}: AppNavigatorProps) {

  return (
    <Stack.Navigator
      key={user ? "signed-in" : "signed-out"}
      screenOptions={{
        headerTintColor: "#1A1751",

        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >

      {!user ? (

        // SIGNED OUT: LOGIN

        <Stack.Screen
          name="Login"
          options={{
            headerShown: false,
          }}
        >
          {() => (
            <LoginScreen
              onLogin={onLogin}
            />
          )}
        </Stack.Screen>

      ) : (

        // SIGNED IN: MAIN APPLICATION

        <>

          {/* MAIN BOTTOM TABS */}

          <Stack.Screen
            name="Main"
            options={{
              headerShown: false,
            }}
          >
            {(props) => (
              <MainScreen
                {...props}
                user={user}
                spaces={spaces}
                favorites={favorites}
                bookings={bookings}
                onToggleFavorite={onToggleFavorite}
                onCancelBooking={onCancelBooking}
                activeBookingCount={activeBookingCount}
                onLogout={onLogout}
              />
            )}
          </Stack.Screen>

          {/* SPACE DETAILS */}

          <Stack.Screen
            name="SpaceDetails"
            options={{
              title: "Space Details",
            }}
          >
            {(props) => (
              <SpaceDetailsScreen
                {...props}
                spaces={spaces}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
              />
            )}
          </Stack.Screen>

          {/* BOOKING MODAL */}

          <Stack.Screen
            name="Booking"
            options={{
              title: "Book Space",
              presentation: "modal",
              headerShown: true,
            }}
          >
            {(props) => {

              const selectedSpace = spaces.find(
                (space) =>
                  space.id === props.route.params.spaceId
              );

              if (!selectedSpace) {
                return (
                  <View style={styles.placeholder}>
                    <Text style={styles.placeholderTitle}>
                      Space not found.
                    </Text>
                  </View>
                );
              }

              return (
                <BookingScreen
                  {...props}
                  space={selectedSpace}
                  onConfirmBooking={onConfirmBooking}
                />
              );
            }}
          </Stack.Screen>

        </>

      )}

    </Stack.Navigator>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({

  placeholder: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  placeholderTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1751",
  },

});
