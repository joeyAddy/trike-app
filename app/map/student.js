import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native";
import { Stack, useLocalSearchParams, useSearchParams } from "expo-router";
import { UserCircleIcon } from "react-native-heroicons/outline";
import { QuestionMarkCircleIcon } from "react-native-heroicons/solid";
import { TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import CancelRideModal from "../../components/common/CancelRideModal";
import PaymentModal from "../../components/common/PaymentModal";
import ConfirmPaymentModal from "../../components/common/ConfirmPaymentModal";
import { ActivityIndicator } from "react-native";
import LoadingModal from "../../components/common/LoadingModal";
import { GOOGLE_MAPS_API_KEY } from "../../secrets";
import destinationIcon from "../../assets/destination.png";
import originIcon from "../../assets/origin.png";
import riderIcon from "../../assets/rider.png";
import { Image } from "react-native";
import socketIOClient from "socket.io-client";
import useAxiosPost from "../../services/useAxiosPost";
import axios from "axios";
import { getDetails } from "../../utils/localStorage";
import calculateCabFee from "../../utils/calculateCabFee";
import RidersListModal from "../../components/student/RidersListModal";

const MapScreen = () => {
  const params = useLocalSearchParams();
  const [role, setRole] = useState("");

  const [location, setLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [amount, setAmount] = useState(0);

  const [origin, setOrigin] = useState({
    latitude: parseFloat(params?.origin.split(" ")[0]),
    longitude: parseFloat(params?.origin.split(" ")[1]),
  });
  const [destination, setDestination] = useState({
    latitude: parseFloat(params?.destination.split(" ")[0]),
    longitude: parseFloat(params?.destination.split(" ")[1]),
  });
  const [rideInfo, setRideInfo] = useState();
  const [rideType, setRideType] = useState();
  const [riders, setRiders] = useState();
  const [rider, setRider] = useState(null);
  const [emptyRiders, setEmptyRiders] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRidersListModal, setShowRidersListModal] = useState(false);
  const [confirmedPayment, setConfirmedPayment] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [match, setMatch] = useState();

  const [socket, setSocket] = useState(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const { data, loading, error, setLoading, postData } = useAxiosPost();

  //Url to backend
  const serverUrl = "http://192.168.242.151:8080";

  const socketConnection = socketIOClient(serverUrl, {
    transports: ["websocket"],
    extraHeaders: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  const connectToSocket = () => {
    setSocket(socketConnection);
    socketConnection.on("connection", (socket) => {
      console.log("connected");
      Alert.alert("connected");
    });
    // Event listeners
    socketConnection.on("match_found", (matchedData) => {
      // TODO: Handle the matched data (e.g., display it on the screen)
      setMatch(matchedData);
      console.log("Match found:", matchedData);
    });
  };

  const shareDetailsWithSocket = (details) => {
    if (socket !== null) {
      socket.emit("share_details", details);
    }
  };

  // Call this function when the component mounts to establish the connection
  useEffect(() => {
    connectToSocket();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (emptyRiders === true) {
      setRiders([]);
    }
  }, [emptyRiders]);

  // Code to handle the form submission and collect details goes here
  function handleSubmit() {
    const details = {
      location,
    };
    shareDetailsWithSocket(details);
  }

  useEffect(() => {
    if (match != undefined) setSearching(false);
  }, [match]);

  useEffect(() => {
    setRole(params.role);
  }, [params.role]);

  useEffect(() => {
    if (!params.rideType) return;
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
    // if (rideInfo) console.log(rideInfo, "ride info");
  }, []);

  useEffect(() => {
    const getDirections = async () => {
      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const points = data.routes[0].overview_polyline.points;
        const legs = data.routes[0].legs[0];

        if (points) {
          const coords = decodePolyline(points);
          setCoordinates(coords);
        }

        if (legs) setRideInfo(legs);
      } catch (error) {
        console.error(error, "error from direction");
      }
    };

    // if (
    //   origin.latitude &&
    //   origin.longitude &&
    //   destination.latitude &&
    //   origin.longitude
    // )
    getDirections();
  }, []);

  const decodePolyline = (encoded) => {
    const polyline = require("@mapbox/polyline");
    const decoded = polyline.decode(encoded);

    return decoded.map((point) => ({
      latitude: point[0],
      longitude: point[1],
    }));
  };

  useEffect(() => {
    if (!rideInfo && !rideType) return;
    (async () => {
      if (coordinates) {
        userDetails = await getDetails("userDetails");
        if (userDetails) {
          const data = {
            origin,
            destination,
            rideType,
            paymentMethod: params?.paymentMethod,
            to: params?.destinationMainText,
            from: params?.originMainText,
            coordinates,
            user: userDetails?._id,
            amount,
            rideInfo,
          };
          console.log(params.saveDetails.name, "userDetails");
          console.log(data, "payload");
          postData(`${server}ride`, data);
        }
      }
    })();
  }, [rideInfo, rideType]);

  useEffect(() => {
    if (data) {
      console.log(data);
      (async () => {
        const userDetails = await getDetails("userDetails");

        if (!userDetails) return;
        try {
          const response = await axios.get(
            `${server}ride/student/match?id=${userDetails._id}`
          );

          if (response) {
            console.log(response.data.data, "riders");
            setRiders(response.data.data);
            setShowRidersListModal(true);
          }
        } catch (error) {
          console.error("Error fetching rider profile:", JSON.stringify(error));
          return null;
        }
      })();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.log(JSON.stringify(error));
    }
  }, [error]);

  useEffect(() => {
    if (rideInfo) {
      const { totalFee } = calculateCabFee(
        parseFloat(rideInfo.distance?.text),
        600
      );
      setAmount(totalFee);
    }
  }, [rideInfo]);

  const handleMapReady = () => {
    setIsMapLoaded(true);
  };

  if (isMapLoaded === false)
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="font-bold text-yellow-400 text-large">
          Getting things ready...
        </Text>
      </View>
    );

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
                setEmptyRiders={setEmptyRiders}
              />
              <PaymentModal
                visible={showPaymentModal}
                setVisible={setShowPaymentModal}
                setConfirmedPayment={setConfirmedPayment}
                paymentMethod={params.paymentMethod}
              />
              <ConfirmPaymentModal
                visible={confirmedPayment}
                setVisible={setConfirmedPayment}
                setWaiting={setWaiting}
                handleSubmit={handleSubmit}
              />
              <LoadingModal
                setVisible={setWaiting}
                visible={waiting}
                text="Waiting for Rider to accept ride"
              />
              {!match && (
                <LoadingModal
                  setVisible={setSearching}
                  visible={searching}
                  text=" Searching for a ride"
                />
              )}
              {riders && (
                <RidersListModal
                  visible={showRidersListModal}
                  setVisible={setShowRidersListModal}
                  riders={riders}
                  setRider={setRider}
                  setRiders={setRiders}
                />
              )}
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
                    onMapReady={handleMapReady}
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
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                      }}
                      title="Rider"
                      description={"Rider location"}
                    >
                      <Image
                        source={riderIcon}
                        style={{
                          resizeMode: "contain",
                          height: 50,
                          width: 50,
                        }}
                      />
                    </Marker>
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
              <View className="h-fit relative bottom-0 space-y-1 bg-slate-50 shadow-2xl border-2 p-3 pb-5 border-green-800 w-full rounded-tr-xl rounded-tl-xl">
                {rider === null ? (
                  <>
                    <ActivityIndicator size={40} color="#166534" />
                    <Text className="text-center text-orange-800 font-bold">
                      Searching for rider...
                    </Text>
                  </>
                ) : (
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row space-x-2">
                      <UserCircleIcon size={60} color="#166534" />
                      <View>
                        <Text className="font-bold">Trike Owner</Text>
                        <Text className="text-green-800">
                          {rider.rider.user.name}
                        </Text>
                        <Text className="text-green-800">
                          {rider.rider.user.phone}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <QuestionMarkCircleIcon size={60} color="orange" />
                    </View>
                  </View>
                )}
                <Text className="text-center uppercase text-green-800 text-xl">
                  Ride details
                </Text>
                {amount ? (
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row justify-between items-center w-full">
                      <View className="space-y-3 w-1/2">
                        <View>
                          <Text className="font-bold">From</Text>
                          <Text className="text-green-800">
                            {params?.originMainText}
                          </Text>
                        </View>
                        <View>
                          <Text className="font-bold">Type of Ride</Text>
                          <Text className="text-green-800">{rideType}</Text>
                        </View>
                      </View>
                      <View className="space-y-3 w-1/2">
                        <View>
                          <Text className="font-bold text-right">To</Text>
                          <Text className="text-green-800 text-right">
                            {params?.destinationMainText}
                          </Text>
                        </View>
                        <View>
                          <Text className="font-bold text-right">Amount</Text>
                          <Text className="text-green-800 text-4xl font-bold text-right">
                            <Text className="line-through">N</Text> {amount}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ) : (
                  <ActivityIndicator size={40} color="166534" />
                )}
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
            <View className="flex-1 items-center justify-center space-y-4">
              <Text className="text-center font-bold text-xl">
                Loading map...
              </Text>
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
