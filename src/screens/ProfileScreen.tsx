
import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
} from "react-native";

import type { User } from "../types";

type ProfileScreenProps = {
  user: User;
  bookingCount: number;
  favoriteCount: number;
  onLogout: () => void;
};

export default function ProfileScreen({
  user,
  bookingCount,
  favoriteCount,
  onLogout,
}: ProfileScreenProps) {

  const [remindersEnabled, setRemindersEnabled] =
    useState(true);

  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const confirmLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: onLogout,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        My Profile
      </Text>

      {/* AVATAR */}

      <View style={styles.avatar}>
        <Text style={styles.initials}>
          {initials || "ST"}
        </Text>
      </View>

      {/* STUDENT INFORMATION */}

      <Text style={styles.name}>
        {user.fullName}
      </Text>

      <Text style={styles.section}>
        {user.section}
      </Text>

      {/* STATISTICS */}

      <View style={styles.statsContainer}>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {bookingCount}
          </Text>

          <Text style={styles.statLabel}>
            Bookings
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {favoriteCount}
          </Text>

          <Text style={styles.statLabel}>
            Favorites
          </Text>
        </View>

      </View>

      {/* BOOKING REMINDERS */}

      <View style={styles.reminderCard}>

        <View style={styles.reminderTextContainer}>
          <Text style={styles.reminderTitle}>
            Booking Reminders
          </Text>

          <Text style={styles.reminderDescription}>
            Enable booking reminder preferences.
          </Text>
        </View>

        <Switch
          value={remindersEnabled}
          onValueChange={setRemindersEnabled}
          trackColor={{
            false: "#D1D1D8",
            true: "#A5A1D6",
          }}
          thumbColor={
            remindersEnabled ? "#1A1751" : "#FFFFFF"
          }
        />

      </View>

      {/* LOG OUT */}

      <Pressable
        style={styles.logoutButton}
        onPress={confirmLogout}
      >
        <Text style={styles.logoutText}>
          Log Out
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
    alignItems: "center",
    padding: 24,
  },

  heading: {
    alignSelf: "flex-start",
    fontSize: 25,
    fontWeight: "bold",
    color: "#1A1751",
    marginBottom: 30,
  },

  avatar: {
    width: 105,
    height: 105,
    borderRadius: 55,
    backgroundColor: "#1A1751",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  initials: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  name: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1A1751",
    textAlign: "center",
  },

  section: {
    fontSize: 14,
    color: "#77778A",
    marginTop: 6,
  },

  statsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 14,
    marginTop: 30,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 22,
    alignItems: "center",
    elevation: 2,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1751",
  },

  statLabel: {
    fontSize: 13,
    color: "#77778A",
    marginTop: 5,
  },

  reminderCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  reminderTextContainer: {
    flex: 1,
    paddingRight: 10,
  },

  reminderTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1A1751",
  },

  reminderDescription: {
    fontSize: 12,
    color: "#77778A",
    marginTop: 5,
  },

  logoutButton: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#D94343",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },

  logoutText: {
    color: "#D94343",
    fontSize: 15,
    fontWeight: "bold",
  },

});
