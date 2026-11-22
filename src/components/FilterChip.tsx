
import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
} from "react-native";

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function FilterChip({
  label,
  selected,
  onPress,
}: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected && styles.selectedChip,
      ]}
    >
      <Text
        style={[
          styles.label,
          selected && styles.selectedLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DCDCE5",
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: "#1A1751",
    borderColor: "#1A1751",
  },
  label: {
    fontSize: 12,
    color: "#55556A",
    fontWeight: "500",
  },
  selectedLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
