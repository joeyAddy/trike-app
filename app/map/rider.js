import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { UserCircleIcon } from "react-native-heroicons/outline";
import { QuestionMarkCircleIcon } from "react-native-heroicons/solid";
import { TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import CancelRideModal from "../../components/common/CancelRideModal";
import ConfirmPaymentModal from "../../components/common/ConfirmPaymentModal";
import { ActivityIndicator } from "react-native";
import LoadingModal from "../../components/common/LoadingModal";
import destinationIcon from "../../assets/destination.png";
import originIcon from "../../assets/origin.png";
import { Image } from "react-native";

const MapScreen = () => {
  const params = useLocalSearchParams();
  const [role, setRole] = useState("");

  const [location, setLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([]);

  const [rideInfo, setRideInfo] = useState();
  const [rideType, setRideType] = useState();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [confirmedPayment, setConfirmedPayment] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setRole(params.role);
  }, [params.role]);

  useEffect(() => {
    if (!params.rideType) setSearching(true);
    setRideType(params.rideType);
  }, [params.rideType]);

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

  useEffect(() => {
    if (rideInfo) console.log(rideInfo, "ride info");
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
          {location && coordinates && rideType ? (
            <View style={styles.container}>
              <CancelRideModal
                visible={showCancelModal}
                setVisible={setShowCancelModal}
              />
              <ConfirmPaymentModal
                visible={confirmedPayment}
                setVisible={setConfirmedPayment}
                setWaiting={setWaiting}
              />
              <LoadingModal
                setVisible={setWaiting}
                visible={waiting}
                text="Waiting for Rider to accept ride"
              />
              {location && coordinates && rideInfo ? (
                <View className="relative h-3/5">
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
                      description={"This is your current location"}
                    />
                    <Marker
                      coordinate={{
                        latitude: origin.latitude,
                        longitude: origin.longitude,
                      }}
                      title="Origin"
                      description={rideInfo.start_address}
                    >
                      <Image
                        source={originIcon}
                        style={{
                          resizeMode: "contain",
                          height: 50,
                          width: 50,
                        }}
                      />
                    </Marker>
                    <Marker
                      style={styles.markerStyle}
                      coordinate={{
                        latitude: destination.latitude,
                        longitude: destination.longitude,
                      }}
                      title="Destination"
                      description={rideInfo.end_address}
                    >
                      <Image
                        source={destinationIcon}
                        style={{
                          resizeMode: "contain",
                          height: 50,
                          width: 50,
                        }}
                      />
                    </Marker>
                    <Polyline
                      coordinates={coordinates}
                      strokeWidth={8}
                      strokeColor="#3b82f6"
                    />
                    <Polyline
                      coordinates={coordinates}
                      strokeWidth={4}
                      strokeColor="#93c5fd"
                    />
                  </MapView>
                  {rideInfo && (
                    <View className="absolute fill-blue-300 bottom-6 left-4 bg-white p-3 shadow-2xl shadow-black rounded-lg">
                      <Text className="font-bold text-green-800 text-lg">
                        Ride Information
                      </Text>
                      <View className="space-y-1">
                        <Text className="font-bold text-green-800 text-md">
                          Distance: <Text>{rideInfo.distance?.text}</Text>
                        </Text>
                        <Text className="font-bold text-green-800 text-md">
                          Duration: <Text>{rideInfo.duration?.text}</Text>
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View className=" h-3/5 flex-1 items-center justify-center space-y-4">
                  <ActivityIndicator size={40} color="#166534" />
                </View>
              )}
              <View className="h-2/5 relative bottom-0 space-y-4 bg-slate-50 shadow-2xl border-2 p-3 border-green-800 w-full rounded-tr-xl rounded-tl-xl">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row space-x-2">
                    <UserCircleIcon size={60} color="#166534" />
                    <View>
                      <Text className="font-bold">
                        {role !== "student" ? "Student Details" : "Trike Owner"}
                      </Text>
                      <Text className="text-green-800">
                        {role !== "student"
                          ? "Nafisa Somebody"
                          : "Abdul Somebody"}
                      </Text>
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
                        <Text className="text-green-800">{rideType}</Text>
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
                      if (role !== "rider") setShowPaymentModal(true);
                    }}
                    className="w-auto rounded-md items-center px-5 py-3 bg-green-800"
                  >
                    <Text className="text-xl text-white">
                      {role === "student" ? "Make Payment" : "Start Ride"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center space-y-4">
              <Text className="text-center font-bold text-xl">Loading map</Text>
              <ActivityIndicator size={100} color="#166534" />
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
  markerStyle: {
    width: 50,
    height: 50,
  },
});

export default MapScreen;