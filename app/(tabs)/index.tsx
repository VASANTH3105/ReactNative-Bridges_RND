import React, { useEffect, useState } from "react";
import {
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const { BatteryModule } = NativeModules;

const Index = () => {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const batteryInfo = await BatteryModule.getBatteryInfo();
        setInfo(batteryInfo);
      } catch (error) {
        console.error("Battery Error:", error);
      }
    }
    load();
  }, []);

  const isiOS = Platform.OS === "ios";

  const batteryColor =
    info?.batteryPercent < 20
      ? "#d9534f"
      : info?.batteryPercent < 50
      ? "#f0ad4e"
      : "#5cb85c";

  const chargingTypeLabel = () => {
    if (!info?.isCharging) return "Not Charging";
    if (info?.pluggedAC) return "AC Charger";
    if (info?.pluggedUSB) return "USB";
    if (info?.pluggedWireless) return "Wireless";
    return isiOS ? "Unknown (iOS restricted)" : "Unknown";
  };

  const batteryHealthMap: Record<number, string> = {
    1: "Unknown",
    2: "Good",
    3: "Overheat",
    4: "Dead",
    5: "Over Voltage",
    6: "Failure",
    7: "Cold",
    "-1": isiOS ? "Unavailable on iOS" : "Unknown",
  };

  const capacityLevelMap: Record<number, string> = {
    "-1": isiOS ? "Unsupported on iOS" : "Unsupported",
    0: "Unknown",
    1: "Critical",
    2: "Low",
    3: "Normal",
    4: "High",
    5: "Full",
  };

  const Item = ({ label, value }: { label: string; value: any }) => (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{String(value)}</Text>
    </View>
  );

  const Section = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  if (!info) {
    return (
      <SafeAreaProvider style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>🔋 Battery Diagnostics</Text>

        {/* Battery Level Card */}
        <View style={[styles.levelCard, { borderColor: batteryColor }]}>
          <Text style={[styles.levelValue, { color: batteryColor }]}>
            {info.batteryPercent}%
          </Text>
          <Text style={styles.levelLabel}>Battery Level</Text>
        </View>

        <Section title="General Info">
          <Item label="Battery Present" value={info.present ? "Yes" : "No"} />
          <Item
            label="Health"
            value={batteryHealthMap[String(info.health)] || "Unknown"}
          />
          <Item label="Technology" value={info.technology} />
          <Item
            label="Temperature"
            value={
              isiOS || info.temperature === null || info.temperature < 0
                ? "Unavailable on iOS"
                : `${info.temperature} °C`
            }
          />
          <Item
            label="Voltage"
            value={
              isiOS || info.voltage < 0
                ? "Unavailable on iOS"
                : `${info.voltage} mV`
            }
          />
          {isiOS && (
            <Item
              label="Low Power Mode"
              value={info.lowPowerMode ? "Enabled" : "Disabled"}
            />
          )}
        </Section>

        <Section title="Charging Info">
          <Item label="Charging" value={info.isCharging ? "Yes ⚡" : "No"} />
          <Item label="Charging Type" value={chargingTypeLabel()} />
          <Item label="Charging Status Code" value={info.chargingStatus} />
        </Section>

        {!isiOS && (
          <>
            <Section title="Battery Performance">
              <Item label="Capacity (%)" value={info.capacityPercent} />
              <Item
                label="Charge Counter (µAh)"
                value={info.chargeCounter}
              />
              <Item label="Instant Current (µA)" value={info.currentNow} />
              <Item label="Average Current (µA)" value={info.currentAverage} />
              <Item label="Energy Counter (nWh)" value={info.energyCounter} />
            </Section>

            <Section title="Advanced (API 34+)">
              <Item label="Cycle Count" value={info.cycleCount ?? "N/A"} />
            </Section>

            <Section title="Advanced (API 36+)">
              <Item
                label="Capacity Level"
                value={capacityLevelMap[Number(info.capacityLevel)] ?? "N/A"}
              />
            </Section>
          </>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef0f4",
    padding: 16,
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 12,
  },

  levelCard: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 20,
    marginBottom: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    elevation: 3,
  },
  levelValue: {
    fontSize: 48,
    fontWeight: "900",
  },
  levelLabel: {
    marginTop: 6,
    fontSize: 16,
    color: "#555",
  },

  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },

  item: {
    marginVertical: 8,
  },
  itemLabel: {
    fontSize: 13,
    color: "#888",
  },
  itemValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginTop: 3,
  },
});
