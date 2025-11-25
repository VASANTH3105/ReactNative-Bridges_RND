import React, { useEffect, useState } from "react";
import { NativeModules, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const { BatteryModule } = NativeModules;

const index = () => {
  const [battery, setBattery] = useState(null);
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const level = await BatteryModule.getBatteryLevel();
        const batteryInfo = await BatteryModule.getBatteryInfo();
        setInfo(batteryInfo);
        setBattery(level);
        console.log("Battery Level:", level);
      } catch (error) {
        console.error("Error fetching battery level:", error);
      }
    }
    load();
  }, []);
  return (
    <SafeAreaProvider
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Text>Battery: {battery} %</Text>
      <View>
      <Text>Level: {info?.level}%</Text>
      <Text>Charging: {info?.isCharging ? "Yes" : "No"}</Text>
      <Text>Type: {info?.chargingType}</Text>
      <Text>Health: {info?.health}</Text>
      <Text>Temperature: {info?.temperature / 10}°C</Text>
      <Text>Voltage: {info?.voltage} mV</Text>
    </View>
    </SafeAreaProvider>
  );
};

export default index;

const styles = StyleSheet.create({});
