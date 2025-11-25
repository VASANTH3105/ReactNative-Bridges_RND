import React, { useEffect, useState } from "react";
import { NativeModules, StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const { BatteryModule } = NativeModules;

const index = () => {
  const [battery, setBattery] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const level = await BatteryModule.getBatteryLevel();
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
    </SafeAreaProvider>
  );
};

export default index;

const styles = StyleSheet.create({});
