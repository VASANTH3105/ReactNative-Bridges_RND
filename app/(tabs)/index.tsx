import React, { useEffect, useState } from "react";
import { NativeModules, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const { BatteryModule } = NativeModules;

const Index = () => {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const batteryInfo = await BatteryModule.getBatteryInfo();
        setInfo(batteryInfo);
        console.log("Battery Info Full:", batteryInfo);
      } catch (error) {
        console.error("Battery Error:", error);
      }
    }
    load();
  }, []);

  const batteryColor =
    info?.level < 20 ? "#d9534f" :
    info?.level < 50 ? "#f0ad4e" :
    "#5cb85c";

  const Item = ({ label, value }: { label: string; value: any }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <Text style={styles.header}>🔋 Battery Diagnostics</Text>

      {!info ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* MAIN BATTERY LEVEL CARD */}
          <View style={[styles.card, { borderLeftColor: batteryColor }]}>
            <Text style={styles.bigValue}>{info.level}%</Text>
            <Text style={styles.bigLabel}>Battery Level</Text>
          </View>

          {/* FULL INFO CARD */}
          <View style={styles.card}>
            <Item label="Charging" value={info.isCharging ? "Yes ⚡" : "No"} />
            <Item label="Charging Type" value={info.chargingType} />
            <Item label="Health" value={info.health} />
            <Item label="Temperature" value={`${info.temperature / 10} °C`} />
            <Item label="Voltage" value={`${info.voltage} mV`} />
            <Item label="Technology" value={info.technology} />
            <Item label="Battery Present" value={info.present ? "Yes" : "No"} />
            <Item label="Capacity (mAh)" value={info.capacityMah} />
            <Item label="Charge Counter (mAh)" value={info.chargeCounter} />
            <Item label="Current Now (mA)" value={info.currentNow} />
            <Item label="Energy (µWh)" value={info.energyCounter} />
            <Item label="Cycle Count" value={info.cycleCount ?? "N/A"} />
            <Item
              label="Remaining Charge Time"
              value={
                info.remainingChargingTime > 0
                  ? `${(info.remainingChargingTime / 60000).toFixed(1)} minutes`
                  : "Unknown"
              }
            />
          </View>

        </ScrollView>
      )}
    </SafeAreaProvider>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
    borderLeftWidth: 6,
    borderLeftColor: "#007bff",
  },
  bigValue: {
    fontSize: 42,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  bigLabel: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
    marginBottom: 8,
  },
  row: {
    marginVertical: 6,
  },
  label: {
    color: "#888",
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
});
