
import React, { useState } from "react";

import {
  Alert,
} from "react-native";

import {
  NavigationContainer,
} from "@react-navigation/native";

import AppNavigator from "./src/navigation/AppNavigator";

import { spaces as initialSpaces } from "./src/data/spaces";

import type {
  User,
  Booking,
} from "./src/types";

export default function App() {

  // ========================================
  // SHARED APP STATE
  // ========================================

  const [user, setUser] = useState<User | null>(null);

  const [favorites, setFavorites] = useState<string[]>([]);

  const [bookings, setBookings] = useState<Booking[]>([]);

  // ========================================
  // LOGIN
  // ========================================

  const handleLogin = (student: User) => {
    setUser(student);
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    setUser(null);
  };

  // ========================================
  // FAVORITES
  // ========================================

  const handleToggleFavorite = (spaceId: string) => {
    setFavorites((previousFavorites) => {
      if (previousFavorites.includes(spaceId)) {
        return previousFavorites.filter(
          (id) => id !== spaceId
        );
      }

      return [...previousFavorites, spaceId];
    });
  };

  // ========================================
  // BOOKING CONFIRMATION
  // ========================================

  const handleConfirmBooking = (booking: Booking): boolean => {
    const duplicate = bookings.some(
      (existingBooking) =>
        existingBooking.spaceId === booking.spaceId &&
        existingBooking.date === booking.date &&
        existingBooking.slot === booking.slot
    );

    if (duplicate) {
      Alert.alert(
        "Time Slot Unavailable",
        "This study space and time slot have already been booked. Please select another time."
      );

      return false;
    }

    setBookings((previousBookings) => [
      ...previousBookings,
      booking,
    ]);

    Alert.alert(
      "Booking Successful!",
      "Your study-space booking has been confirmed."
    );

    return true;
  };

  // ========================================
  // CANCEL BOOKING
  // ========================================

  const handleCancelBooking = (bookingId: string) => {
    setBookings((previousBookings) =>
      previousBookings.filter(
        (booking) => booking.id !== bookingId
      )
    );
  };

  // ========================================
  // UPDATE SPACE AVAILABILITY
  // ========================================

  const spaces = initialSpaces.map((space) => {
    const bookedSlotsForSpace = bookings
      .filter(
        (booking) =>
          booking.spaceId === space.id &&
          booking.date === new Date().toLocaleDateString()
      )
      .map((booking) => booking.slot);

    return {
      ...space,
      bookedSlots: [
        ...new Set([
          ...space.bookedSlots,
          ...bookedSlotsForSpace,
        ]),
      ],
    };
  });

  // ========================================
  // ACTIVE BOOKING COUNT
  // ========================================

  const activeBookingCount = bookings.length;

  // ========================================
  // APP NAVIGATION
  // ========================================

  return (
    <NavigationContainer>
      <AppNavigator
        user={user}
        spaces={spaces}
        favorites={favorites}
        bookings={bookings}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onToggleFavorite={handleToggleFavorite}
        activeBookingCount={activeBookingCount}
        onConfirmBooking={handleConfirmBooking}
        onCancelBooking={handleCancelBooking}
      />
    </NavigationContainer>
  );
}
