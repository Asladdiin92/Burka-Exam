import React, { useState } from "react";
import { Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { Button } from "../components/Button.js";
import { Input } from "../components/Input.js";
import { Notice } from "../components/Notice.js";
import { getProfile, updatePassword, updateProfile } from "../services/api.js";
import { COLORS, RADIUS, SPACING } from "../utils/theme.js";

export function ProfileScreen({ user, onUpdateUser, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile fields
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notifications, setNotifications] = useState(user?.notifications !== false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSaveProfile() {
    setError("");
    setSuccess("");
    if (!displayName || !email) {
      setError("Name and email are required.");
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile({
        displayName,
        phoneNumber,
        email,
        notifications
      });
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      if (onUpdateUser && result.user) {
        onUpdateUser(result.user);
      }
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    setError("");
    setSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setSuccess("Password updated successfully!");
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancelEdit() {
    setDisplayName(user?.displayName || "");
    setPhoneNumber(user?.phoneNumber || "");
    setEmail(user?.email || "");
    setNotifications(user?.notifications !== false);
    setIsEditing(false);
    setError("");
  }

  function handleCancelPassword() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
    setError("");
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>My Profile</Text>

        <Notice message={error} type="error" />
        <Notice message={success} type="success" />

        {isEditing ? (
          <>
            <Input
              label="Full Name"
              onChangeText={setDisplayName}
              placeholder="Your full name"
              value={displayName}
            />
            <Input
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              placeholder="your@email.com"
              value={email}
            />
            <Input
              keyboardType="phone-pad"
              label="Phone Number"
              onChangeText={setPhoneNumber}
              placeholder="0911000000"
              value={phoneNumber}
            />

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Telegram Link (Communication)</Text>
              <Text style={styles.fieldValue}>{user?.profile?.telegramLink || "Not set"}</Text>
              <Text style={styles.fieldNote}>Managed by admin</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Q&A (Questions & Answers)</Text>
              <Text style={styles.fieldValue}>{user?.profile?.qa || "Not set"}</Text>
              <Text style={styles.fieldNote}>Managed by admin</Text>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Enable Notifications</Text>
              <Switch
                onValueChange={setNotifications}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                value={notifications}
              />
            </View>

            <View style={styles.buttonRow}>
              <Button
                loading={loading}
                onPress={handleSaveProfile}
                style={[styles.button, styles.saveButton]}
              >
                Save
              </Button>
              <Button
                onPress={handleCancelEdit}
                style={[styles.button, styles.cancelButton]}
                variant="outline"
              >
                Cancel
              </Button>
            </View>
          </>
        ) : (
          <>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <Text style={styles.fieldValue}>{user?.displayName || "N/A"}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email</Text>
              <Text style={styles.fieldValue}>{user?.email || "N/A"}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Phone</Text>
              <Text style={styles.fieldValue}>{user?.phoneNumber || "Not set"}</Text>
            </View>

            {user?.profile?.telegramLink && (
              <TouchableOpacity
                onPress={() => Linking.openURL(user.profile.telegramLink).catch(() => {})}
                style={styles.field}
              >
                <Text style={styles.fieldLabel}>Join Our Telegram Channel</Text>
                <Text style={[styles.fieldValue, { color: COLORS.primary, textDecorationLine: 'underline' }]}>
                  📱 Tap here to join
                </Text>
                <Text style={styles.fieldNote}>Get updates, resources, and exam tips</Text>
              </TouchableOpacity>
            )}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Telegram Link (Communication)</Text>
              <Text style={styles.fieldValue}>{user?.profile?.telegramLink || "Not set"}</Text>
              <Text style={styles.fieldNote}>Managed by admin</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Q&A (Questions & Answers)</Text>
              <Text style={styles.fieldValue}>{user?.profile?.qa || "Not set"}</Text>
              <Text style={styles.fieldNote}>Managed by admin</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Notifications</Text>
              <Text style={styles.fieldValue}>{user?.notifications !== false ? "Enabled" : "Disabled"}</Text>
            </View>

            <Button onPress={() => setIsEditing(true)} style={styles.editButton}>
              Edit Profile
            </Button>
          </>
        )}
      </View>

      {!isEditing && (
        <View style={styles.card}>
          <Text style={styles.title}>Change Password</Text>

          {isChangingPassword ? (
            <>
              <Input
                label="Current Password"
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry
                value={currentPassword}
              />
              <Input
                label="New Password"
                onChangeText={setNewPassword}
                placeholder="Min 8 characters"
                secureTextEntry
                value={newPassword}
              />
              <Input
                label="Confirm New Password"
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
                value={confirmPassword}
              />

              <View style={styles.buttonRow}>
                <Button
                  loading={loading}
                  onPress={handleChangePassword}
                  style={[styles.button, styles.saveButton]}
                >
                  Update
                </Button>
                <Button
                  onPress={handleCancelPassword}
                  style={[styles.button, styles.cancelButton]}
                  variant="outline"
                >
                  Cancel
                </Button>
              </View>
            </>
          ) : (
            <Button onPress={() => setIsChangingPassword(true)} style={styles.passwordButton}>
              Change Password
            </Button>
          )}
        </View>
      )}

      {onLogout && (
        <View style={styles.card}>
          <Text style={[styles.title, { color: COLORS.danger }]}>Account Session</Text>
          <Text style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.md }}>
            Signing out will end your current session on this device.
          </Text>
          <Button
            icon="log-out-outline"
            onPress={onLogout}
            style={styles.logoutButton}
            variant="danger"
          >
            Log Out
          </Button>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    elevation: 2
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: SPACING.lg
  },
  field: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    marginBottom: 4
  },
  fieldValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500"
  },
  fieldNote: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: "italic",
    marginTop: 2
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.sm
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text
  },
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.sm
  },
  button: {
    flex: 1
  },
  saveButton: {
    flex: 1
  },
  cancelButton: {
    flex: 1
  },
  editButton: {
    marginTop: SPACING.md
  },
  passwordButton: {
    marginTop: SPACING.sm
  }
});
