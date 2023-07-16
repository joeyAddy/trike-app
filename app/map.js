import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import { UserCircleIcon } from "react-native-heroicons/outline";
import { QuestionMarkCircleIcon } from "react-native-heroicons/solid";
import { TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import CancelRideModal from "../components/common/CancelRideModal";
import PaymentModal from "../components/common//PaymentModal";
import ConfirmPaymentModal from "../components/common/ConfirmPaymentModal";
import { ActivityIndicator } from "react-native";

const MapScreen = () => {
  const [location, setLocation] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmedPayment, setConfirmedPayment] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // Handle permission not granted
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1">
          <Stack.Screen
            options={{
              headerShown: false,
            }}
          />
          {location ? (
            <View style={styles.container}>
              <CancelRideModal
                visible={showCancelModal}
                setVisible={setShowCancelModal}
              />
              <PaymentModal
                visible={showPaymentModal}
                setVisible={setShowPaymentModal}
                setConfirmedPayment={setConfirmedPayment}
              />
              <ConfirmPaymentModal
                visible={confirmedPayment}
                setVisible={setConfirmedPayment}
              />
              {location && (
                <MapView
                  className="h-2/3"
                  style={styles.map}
                  initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                    title="My Location"
                    description="This is my current location"
                  />
                </MapView>
              )}
              <View className="h-4/5 relative bottom-0 space-y-4 bg-slate-50 shadow-2xl border-2 p-3 border-green-800 w-full rounded-tr-xl rounded-tl-xl">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row space-x-2">
                    <UserCircleIcon size={60} color="#166534" />
                    <View>
                      <Text className="font-bold">Trike Owner</Text>
                      <Text className="text-green-800">Abdul Somebody</Text>
                      <Text className="text-green-800">09076453532</Text>
                    </View>
                  </View>
                  <View>
                    <QuestionMarkCircleIcon size={60} color="orange" />
                  </View>
                </View>
                <Text className="text-center uppercase text-green-800 text-xl">
                  Ride details
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row justify-between items-center w-full">
                    <View className="space-y-3">
                      <View>
                        <Text className="font-bold">From</Text>
                        <Text className="text-green-800">Kasu 1st gate</Text>
                      </View>
                      <View>
                        <Text className="font-bold">Type of Ride</Text>
                        <Text className="text-green-800">Chartered</Text>
                      </View>
                    </View>
                    <View className="space-y-3">
                      <View>
                        <Text className="font-bold">To</Text>
                        <Text className="text-green-800">Netherlands</Text>
                      </View>
                      <View>
                        <Text className="font-bold">Amount</Text>
                        <Text className="text-green-800 text-4xl font-bold">
                          <Text className="line-through">N</Text> 550
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className="flex-row space-x-1 justify-between items-center">
                  <TouchableOpacity
                    onPress={() => {
                      setShowCancelModal(true);
                    }}
                    className="w-auto px-5 rounded-md items-center py-3 bg-red-800"
                  >
                    <Text className="text-xl text-white">Cancel ride</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShowPaymentModal(true);
                    }}
                    className="w-auto rounded-md items-center px-5 py-3 bg-green-800"
                  >
                    <Text className="text-xl text-white">Make Payment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size={150} color="#166534" />
            </View>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default MapScreen;
