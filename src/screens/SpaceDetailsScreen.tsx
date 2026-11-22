
import React, { useLayoutEffect } from "react";

import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import type {
  RootStackParamList,
  StudySpace,
} from "../types";

import OccupancyBar from "../components/OccupancyBar";

type SpaceDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SpaceDetails"
> & {
  spaces: StudySpace[];
  favorites: string[];
  onToggleFavorite: (spaceId: string) => void;
};

export default function SpaceDetailsScreen({
  route,
  navigation,
  spaces,
  favorites,
  onToggleFavorite,
}: SpaceDetailsScreenProps) {

  // Find the space using only its ID.
  const space = spaces.find(
    (item) => item.id === route.params.spaceId
  );

  const isFavorite = space
    ? favorites.includes(space.id)
    : false;

  // Update the favorite button in the navigation header.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        space ? (
          <Pressable
            onPress={() => onToggleFavorite(space.id)}
            hitSlop={10}
            style={styles.headerFavorite}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={25}
              color="#D94363"
            />
          </Pressable>
        ) : undefined,
    });
  }, [
    navigation,
    space,
    isFavorite,
    onToggleFavorite,
  ]);

  // Show an error if the space ID does not exist.
  if (!space) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={45}
          color="#D94343"
        />

        <Text style={styles.notFoundTitle}>
          Space not found.
        </Text>

        <Text style={styles.notFoundText}>
          The study space you are looking for does not exist.
        </Text>
      </View>
    );
  }

  // Available slots exclude already booked slots.
  const availableSlots = space.slots.filter(
    (slot) => !space.bookedSlots.includes(slot)
  );

  const handleBooking = () => {
    navigation.navigate("Booking", {
      spaceId: space.id,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >

        {/* IMAGE PLACEHOLDER */}

        <View style={styles.imagePlaceholder}>
          <Ionicons
            name="image-outline"
            size={55}
            color="#9292A2"
          />

          <Text style={styles.imageText}>
            Study Space Image
          </Text>
        </View>

        {/* SPACE INFORMATION */}

        <View style={styles.content}>

          <Text style={styles.spaceName}>
            {space.name}
          </Text>

          <Text style={styles.location}>
            {space.building} · {space.floor}
          </Text>

          {/* AMENITIES */}

          <Text style={styles.sectionTitle}>
            Amenities
          </Text>

          <View style={styles.amenitiesContainer}>
            {space.amenities.map((amenity) => (
              <View
                key={amenity}
                style={styles.amenityChip}
              >
                <Text style={styles.amenityText}>
                  {amenity}
                </Text>
              </View>
            ))}
          </View>

          {/* OCCUPANCY */}

          <Text style={styles.sectionTitle}>
            Live Occupancy
          </Text>

          <OccupancyBar
            occupied={space.occupied}
            seats={space.seats}
          />

          {/* AVAILABLE SLOTS */}

          <Text style={styles.sectionTitle}>
            Available Slots Today
          </Text>

          {availableSlots.length > 0 ? (
            <View style={styles.slotsContainer}>
              {space.slots.map((slot) => {
                const isBooked =
                  space.bookedSlots.includes(slot);

                return (
                  <View
                    key={slot}
                    style={[
                      styles.slotChip,
                      isBooked && styles.bookedSlot,
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        isBooked && styles.bookedSlotText,
                      ]}
                    >
                      {slot}
                      {isBooked ? " · Booked" : ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.noSlots}>
              No available time slots.
            </Text>
          )}

          {/* DESCRIPTION */}

          <Text style={styles.sectionTitle}>
            About This Space
          </Text>

          <Text style={styles.description}>
            {space.description}
          </Text>

          <View style={styles.capacityInfo}>
            <Ionicons
              name="people-outline"
              size={19}
              color="#1A1751"
            />

            <Text style={styles.capacityText}>
              Total capacity: {space.seats} seats
            </Text>
          </View>

        </View>
      </ScrollView>

      {/* BOOK BUTTON */}

      <View style={styles.bottomContainer}>
        <Pressable
          style={[
            styles.bookButton,
            availableSlots.length === 0 &&
              styles.disabledButton,
          ]}
          onPress={handleBooking}
          disabled={availableSlots.length === 0}
        >
          <Text style={styles.bookButtonText}>
            Book This Space
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
  },

  scrollContent: {
    paddingBottom: 20,
  },

  imagePlaceholder: {
    height: 185,
    backgroundColor: "#E8E8F1",
    justifyContent: "center",
    alignItems: "center",
  },

  imageText: {
    fontSize: 12,
    color: "#77778A",
    marginTop: 8,
  },

  content: {
    padding: 18,
  },

  spaceName: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1A1751",
  },

  location: {
    fontSize: 12,
    color: "#77778A",
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1751",
    marginTop: 23,
    marginBottom: 10,
  },

  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  amenityChip: {
    backgroundColor: "#EEEEF7",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 7,
    marginBottom: 7,
  },

  amenityText: {
    fontSize: 11,
    color: "#1A1751",
    fontWeight: "500",
  },

  slotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  slotChip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCDCE5",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginRight: 7,
    marginBottom: 9,
  },

  slotText: {
    fontSize: 11,
    color: "#1A1751",
  },

  bookedSlot: {
    backgroundColor: "#EEEEF2",
    borderColor: "#EEEEF2",
  },

  bookedSlotText: {
    color: "#9999A8",
    textDecorationLine: "line-through",
  },

  noSlots: {
    fontSize: 12,
    color: "#D94343",
  },

  description: {
    fontSize: 13,
    lineHeight: 21,
    color: "#55556A",
  },

  capacityInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  capacityText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#55556A",
  },

  bottomContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#E8E8EF",
  },

  bookButton: {
    height: 50,
    backgroundColor: "#1A1751",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    backgroundColor: "#9999A8",
  },

  bookButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  headerFavorite: {
    paddingHorizontal: 8,
  },

  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 25,
  },

  notFoundTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#1A1751",
    marginTop: 12,
  },

  notFoundText: {
    fontSize: 13,
    color: "#77778A",
    textAlign: "center",
    marginTop: 8,
  },

});
