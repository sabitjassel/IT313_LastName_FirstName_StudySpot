
import React from "react";

import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type {
  Booking,
  StudySpace,
} from "../types";

// ========================================
// PROPS
// ========================================

type BookingsScreenProps = {
  bookings: Booking[];
  spaces: StudySpace[];
  onCancelBooking: (bookingId: string) => void;
};

// ========================================
// BOOKING SCREEN
// ========================================

export default function BookingsScreen({
  bookings,
  spaces,
  onCancelBooking,
}: BookingsScreenProps) {

  // ========================================
  // CONFIRM CANCELLATION
  // ========================================

  const confirmCancellation = (booking: Booking) => {
    Alert.alert(
      "Cancel Booking?",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "Keep Booking",
          style: "cancel",
        },
        {
          text: "Cancel Booking",
          style: "destructive",
          onPress: () => onCancelBooking(booking.id),
        },
      ]
    );
  };

  // ========================================
  // BOOKING CARD
  // ========================================

  const renderBooking = ({ item }: { item: Booking }) => {

    const space = spaces.find(
      (space) => space.id === item.spaceId
    );

    return (
      <Pressable
        style={styles.bookingCard}
        onLongPress={() => confirmCancellation(item)}
        delayLongPress={500}
      >

        {/* CARD HEADER */}

        <View style={styles.cardHeader}>

          <View style={styles.iconContainer}>
            <Ionicons
              name="business-outline"
              size={23}
              color="#1A1751"
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.spaceName}>
              {space?.name ?? "Unknown Study Space"}
            </Text>

            <Text style={styles.location}>
              {space
                ? `${space.building} · ${space.floor}`
                : "Location unavailable"}
            </Text>
          </View>

          <View style={styles.statusChip}>
            <Text style={styles.statusText}>
              Confirmed
            </Text>
          </View>

        </View>

        {/* BOOKING DETAILS */}

        <View style={styles.detailsContainer}>

          <View style={styles.detailRow}>
            <Ionicons
              name="calendar-outline"
              size={17}
              color="#77778A"
            />

            <Text style={styles.detailText}>
              {item.date}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="time-outline"
              size={17}
              color="#77778A"
            />

            <Text style={styles.detailText}>
              {item.slot}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="people-outline"
              size={17}
              color="#77778A"
            />

            <Text style={styles.detailText}>
              {item.groupSize} student(s)
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="document-text-outline"
              size={17}
              color="#77778A"
            />

            <Text style={styles.purposeText}>
              {item.purpose}
            </Text>
          </View>

        </View>

        {/* CANCEL BUTTON */}

        <Pressable
          style={styles.cancelButton}
          onPress={() => confirmCancellation(item)}
        >
          <Ionicons
            name="close-circle-outline"
            size={17}
            color="#D94343"
          />

          <Text style={styles.cancelButtonText}>
            Cancel Booking
          </Text>
        </Pressable>

        <Text style={styles.longPressHint}>
          Tip: Long-press this card to cancel.
        </Text>

      </Pressable>
    );
  };

  // ========================================
  // MAIN LIST
  // ========================================

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          My Bookings
        </Text>

        <Text style={styles.headerSubtitle}>
          Manage your confirmed study-space reservations.
        </Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBooking}
        contentContainerStyle={[
          styles.listContent,
          bookings.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="calendar-outline"
              size={55}
              color="#B5B5C5"
            />

            <Text style={styles.emptyTitle}>
              No Bookings Yet
            </Text>

            <Text style={styles.emptyText}>
              Your confirmed study-space bookings will appear here.
            </Text>
          </View>
        }
      />

    </View>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 12,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#1A1751",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#77778A",
    marginTop: 5,
  },

  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 25,
  },

  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    padding: 15,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#E8E8EF",
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 11,
    backgroundColor: "#EEEEF7",
    justifyContent: "center",
    alignItems: "center",
  },

  titleContainer: {
    flex: 1,
    marginLeft: 10,
  },

  spaceName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1A1751",
  },

  location: {
    fontSize: 10,
    color: "#77778A",
    marginTop: 4,
  },

  statusChip: {
    backgroundColor: "#E4F5EA",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 15,
  },

  statusText: {
    fontSize: 9,
    color: "#25804B",
    fontWeight: "bold",
  },

  detailsContainer: {
    marginTop: 17,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: "#EEEEF2",
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },

  detailText: {
    fontSize: 11,
    color: "#55556A",
    marginLeft: 9,
  },

  purposeText: {
    flex: 1,
    fontSize: 11,
    color: "#55556A",
    marginLeft: 9,
  },

  cancelButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "#F1CACA",
    borderRadius: 9,
    marginTop: 7,
    gap: 7,
  },

  cancelButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#D94343",
  },

  longPressHint: {
    textAlign: "center",
    fontSize: 9,
    color: "#9999A8",
    marginTop: 9,
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 35,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1A1751",
    marginTop: 15,
  },

  emptyText: {
    fontSize: 12,
    color: "#77778A",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 7,
  },

});