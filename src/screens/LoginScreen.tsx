
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import type { User } from "../types";

type LoginScreenProps = {
  onLogin: (user: User) => void;
};

export default function LoginScreen({
  onLogin,
}: LoginScreenProps) {
  const [fullName, setFullName] = useState("");
  const [section, setSection] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setError("");

    onLogin({
      fullName: fullName.trim(),
      section: section.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>S</Text>
        </View>

        <Text style={styles.title}>StudySpot</Text>

        <Text style={styles.subtitle}>
          Find your perfect campus study space.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>

          <TextInput
            style={[
              styles.input,
              error ? styles.inputError : null,
            ]}
            placeholder="Enter your full name"
            placeholderTextColor="#9999A8"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setError("");
            }}
            autoCapitalize="words"
            returnKeyType="next"
          />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <Text style={styles.label}>Section</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. BSIT-3A"
            placeholderTextColor="#9999A8"
            value={section}
            onChangeText={setSection}
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>
              Log In
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Sign in to explore available study spaces.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#1A1751",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "bold",
  },
  title: {
    fontSize: 29,
    fontWeight: "bold",
    color: "#1A1751",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#77778A",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 42,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#303047",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    height: 49,
    borderWidth: 1,
    borderColor: "#DCDCE5",
    borderRadius: 9,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#222222",
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#D94343",
  },
  errorText: {
    color: "#D94343",
    fontSize: 11,
    marginTop: 6,
  },
  loginButton: {
    height: 50,
    backgroundColor: "#1A1751",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  footer: {
    fontSize: 11,
    color: "#9999A8",
    textAlign: "center",
    marginTop: 30,
  },
});
