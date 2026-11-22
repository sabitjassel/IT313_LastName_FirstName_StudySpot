
import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";

import { StudySpace } from "../types";
import OccupancyBar from "./OccupancyBar";

type SpaceCardProps = {
  space: StudySpace;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export default function SpaceCard({
  space,
  isFavorite,
  onPress,
  onToggleFavorite,
}: SpaceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>
            {space.name}
          </Text>

          <Text style={styles.location}>
            {space.floor} · {space.building}
          </Text>
        </View>

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
          hitSlop={10}
          style={styles.favoriteButton}
        >
          <Text style={styles.heart}>
            {isFavorite ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.details}>
        <Text style={styles.type}>
          {space.type}
        </Text>

        <Text style={styles.seats}>
          {space.seats} seats
        </Text>
      </View>

      <OccupancyBar
        occupied={space.occupied}
        seats={space.seats}
      />

      <View style={styles.amenities}>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    margin: 6,
    borderWidth: 1,
    borderColor: "#E8E8EF",
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1751",
  },
  location: {
    fontSize: 11,
    color: "#77778A",
    marginTop: 4,
  },
  favoriteButton: {
    paddingHorizontal: 5,
  },
  heart: {
    fontSize: 24,
    color: "#D94363",
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  type: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1A1751",
    backgroundColor: "#EEEEF7",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },
  seats: {
    fontSize: 11,
    color: "#77778A",
    marginLeft: 8,
  },
  amenities: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  amenityChip: {
    backgroundColor: "#F3F3F7",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  amenityText: {
    fontSize: 10,
    color: "#55556A",
  },
});
