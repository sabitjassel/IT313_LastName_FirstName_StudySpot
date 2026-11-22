
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type OccupancyBarProps = {
  occupied: number;
  seats: number;
};

export default function OccupancyBar({
  occupied,
  seats,
}: OccupancyBarProps) {
  const percentage =
    seats > 0 ? Math.min((occupied / seats) * 100, 100) : 0;

  const barColor =
    percentage < 50
      ? "#2E9D62"
      : percentage <= 80
      ? "#E5A000"
      : "#D94343";

  const status =
    percentage < 50
      ? "Quiet"
      : percentage <= 80
      ? "Busy"
      : "Almost full";

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.seatText}>
          {occupied}/{seats} seats occupied
        </Text>

        <Text style={[styles.statusText, { color: barColor }]}>
          {percentage.toFixed(0)}% · {status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 8,
  },
  barBackground: {
    height: 9,
    backgroundColor: "#E5E5ED",
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  seatText: {
    fontSize: 11,
    color: "#77778A",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
