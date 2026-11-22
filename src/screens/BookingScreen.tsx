
import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import type {
  RootStackParamList,
  StudySpace,
  Booking,
} from "../types";

type BookingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Booking"
> & {
  space: StudySpace;
  onConfirmBooking: (booking: Booking) => void;
};

export default function BookingScreen({
  route,
  navigation,
  space,
  onConfirmBooking,
}: BookingScreenProps) {

  // ========================================
  // FORM STATE
  // ========================================

  const [selectedSlot, setSelectedSlot] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [purpose, setPurpose] = useState("");

  // ========================================
  // VALIDATION
  // ========================================

  const availableSlots = space.slots.filter(
    (slot) => !space.bookedSlots.includes(slot)
  );

  const slotValid =
    selectedSlot !== "" &&
    availableSlots.includes(selectedSlot);

  const purposeValid =
    purpose.trim().length >= 10;

  const groupSizeValid =
    groupSize >= 1 &&
    groupSize <= space.seats;

  const formValid =
    slotValid &&
    purposeValid &&
    groupSizeValid;

  // ========================================
  // GROUP SIZE CONTROLS
  // ========================================

  const decreaseGroupSize = () => {
    setGroupSize((previous) =>
      Math.max(1, previous - 1)
    );
  };

  const increaseGroupSize = () => {
    setGroupSize((previous) =>
      Math.min(space.seats, previous + 1)
    );
  };

  // ========================================
  // CONFIRM BOOKING
  // ========================================

  const handleConfirm = () => {
    if (!formValid) {
      return;
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      spaceId: space.id,
      date: new Date().toLocaleDateString(),
      slot: selectedSlot,
      groupSize: groupSize,
      purpose: purpose.trim(),
    };

    onConfirmBooking(newBooking);

    navigation.goBack();
  };

  // ========================================
  // INVALID SPACE
  // ========================================

  if (route.params.spaceId !== space.id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          Space not found.
        </Text>
      </View>
    );
  }

  // ========================================
  // BOOKING FORM
  // ========================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >

        {/* SPACE INFORMATION */}

        <View style={styles.spaceCard}>
          <View style={styles.spaceIcon}>
            <Ionicons
              name="business-outline"
              size={27}
              color="#1A1751"
            />
          </View>

          <View style={styles.spaceInfo}>
            <Text style={styles.spaceName}>
              {space.name}
            </Text>

            <Text style={styles.spaceLocation}>
              {space.building} · {space.floor}
            </Text>

            <Text style={styles.capacity}>
              Maximum capacity: {space.seats} seats
            </Text>
          </View>
        </View>

        {/* TIME SLOT SELECTION */}

        <Text style={styles.sectionTitle}>
          Select a Time Slot
        </Text>

        <Text style={styles.helperText}>
          Choose one available schedule.
        </Text>

        <View style={styles.slotsContainer}>
          {space.slots.map((slot) => {
            const isBooked =
              space.bookedSlots.includes(slot);

            const isSelected =
              selectedSlot === slot;

            return (
              <Pressable
                key={slot}
                disabled={isBooked}
                onPress={() => setSelectedSlot(slot)}
                style={[
                  styles.slotButton,
                  isSelected && styles.selectedSlot,
                  isBooked && styles.disabledSlot,
                ]}
              >
                <Text
                  style={[
                    styles.slotText,
                    isSelected && styles.selectedSlotText,
                    isBooked && styles.disabledSlotText,
                  ]}
                >
                  {slot}
                </Text>

                {isBooked && (
                  <Text style={styles.bookedLabel}>
                    Booked
                  </Text>
                )}

                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={17}
                    color="#FFFFFF"
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        {!slotValid && (
          <Text style={styles.errorText}>
            Please select an available time slot.
          </Text>
        )}

        {/* GROUP SIZE */}

        <Text style={styles.sectionTitle}>
          Group Size
        </Text>

        <Text style={styles.helperText}>
          Select the number of students attending.
        </Text>

        <View style={styles.stepperContainer}>
          <Pressable
            onPress={decreaseGroupSize}
            disabled={groupSize <= 1}
            style={[
              styles.stepperButton,
              groupSize <= 1 && styles.stepperDisabled,
            ]}
          >
            <Ionicons
              name="remove"
              size={22}
              color="#1A1751"
            />
          </Pressable>

          <Text style={styles.groupSizeText}>
            {groupSize}
          </Text>

          <Pressable
            onPress={increaseGroupSize}
            disabled={groupSize >= space.seats}
            style={[
              styles.stepperButton,
              groupSize >= space.seats &&
                styles.stepperDisabled,
            ]}
          >
            <Ionicons
              name="add"
              size={22}
              color="#1A1751"
            />
          </Pressable>
        </View>

        <Text style={styles.capacityHint}>
          1 to {space.seats} students
        </Text>

        {/* BOOKING PURPOSE */}

        <Text style={styles.sectionTitle}>
          Purpose of Booking
        </Text>

        <Text style={styles.helperText}>
          Explain why you want to use this space.
        </Text>

        <TextInput
          style={styles.purposeInput}
          placeholder="e.g. Group research and project discussion..."
          placeholderTextColor="#9999A8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={purpose}
          onChangeText={setPurpose}
          maxLength={250}
        />

        <Text style={styles.characterCount}>
          {purpose.trim().length}/250 characters
        </Text>

        {!purposeValid && (
          <Text style={styles.errorText}>
            Purpose must contain at least 10 characters.
          </Text>
        )}

        {/* BOOKING SUMMARY */}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Booking Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Space
            </Text>

            <Text style={styles.summaryValue}>
              {space.name}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Time
            </Text>

            <Text style={styles.summaryValue}>
              {selectedSlot || "Not selected"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Group Size
            </Text>

            <Text style={styles.summaryValue}>
              {groupSize} student(s)
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Date
            </Text>

            <Text style={styles.summaryValue}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* CONFIRM BUTTON */}

      <View style={styles.bottomContainer}>
        <Pressable
          onPress={handleConfirm}
          disabled={!formValid}
          style={[
            styles.confirmButton,
            !formValid && styles.disabledConfirmButton,
          ]}
        >
          <Text style={styles.confirmButtonText}>
            Confirm Booking
          </Text>
        </Pressable>

        {!formValid && (
          <Text style={styles.buttonHint}>
            Complete all required fields to continue.
          </Text>
        )}
      </View>

    </KeyboardAvoidingView>
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

  scrollContent: {
    padding: 18,
    paddingBottom: 30,
  },

  spaceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E8E8EF",
  },

  spaceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EEEEF7",
    justifyContent: "center",
    alignItems: "center",
  },

  spaceInfo: {
    flex: 1,
    marginLeft: 12,
  },

  spaceName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1A1751",
  },

  spaceLocation: {
    fontSize: 11,
    color: "#77778A",
    marginTop: 4,
  },

  capacity: {
    fontSize: 10,
    color: "#77778A",
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1A1751",
    marginTop: 24,
    marginBottom: 6,
  },

  helperText: {
    fontSize: 11,
    color: "#77778A",
    marginBottom: 12,
  },

  slotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  slotButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCDCE5",
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginRight: 8,
    marginBottom: 9,
  },

  selectedSlot: {
    backgroundColor: "#1A1751",
    borderColor: "#1A1751",
  },

  disabledSlot: {
    backgroundColor: "#EEEEF2",
    borderColor: "#EEEEF2",
    opacity: 0.65,
  },

  slotText: {
    fontSize: 11,
    color: "#1A1751",
    fontWeight: "500",
  },

  selectedSlotText: {
    color: "#FFFFFF",
  },

  disabledSlotText: {
    color: "#9999A8",
    textDecorationLine: "line-through",
  },

  bookedLabel: {
    fontSize: 9,
    color: "#D94343",
    marginLeft: 5,
  },

  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCDCE5",
    padding: 5,
  },

  stepperButton: {
    width: 42,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEEEF7",
    borderRadius: 8,
  },

  stepperDisabled: {
    opacity: 0.35,
  },

  groupSizeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1751",
    minWidth: 55,
    textAlign: "center",
  },

  capacityHint: {
    fontSize: 10,
    color: "#77778A",
    marginTop: 6,
  },

  purposeInput: {
    minHeight: 105,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCDCE5",
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
    color: "#222222",
  },

  characterCount: {
    fontSize: 10,
    color: "#9999A8",
    textAlign: "right",
    marginTop: 5,
  },

  errorText: {
    fontSize: 11,
    color: "#D94343",
    marginTop: 6,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#E8E8EF",
  },

  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1751",
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  summaryLabel: {
    fontSize: 11,
    color: "#77778A",
    flex: 1,
  },

  summaryValue: {
    fontSize: 11,
    color: "#303047",
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },

  bottomContainer: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8E8EF",
  },

  confirmButton: {
    height: 50,
    backgroundColor: "#1A1751",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledConfirmButton: {
    backgroundColor: "#A5A5B2",
  },

  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  buttonHint: {
    fontSize: 10,
    color: "#D94343",
    textAlign: "center",
    marginTop: 7,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  errorTitle: {
    color: "#D94343",
    fontSize: 18,
    fontWeight: "bold",
  },

});
