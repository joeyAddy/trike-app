import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";
import { clearLocalStorage, getDetails } from "../../utils/localStorage";
import { SafeAreaView } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { PaperProvider, ProgressBar } from "react-native-paper";
import { HandThumbUpIcon, MapPinIcon } from "react-native-heroicons/solid";
import { SelectList } from "react-native-dropdown-select-list";
import GooglePlacesAutocomplete from "../../components/common/GoogleAutocomplete";
import { GOOGLE_MAPS_API_KEY } from "../../secrets";
import axios from "axios";

const Reservation = () => {
  const router = useRouter();

  const params = useLocalSearchParams();

  const [role, setRole] = useState("");

  const [saveDetails, setSaveDetails] = useState(null);

  const [progress, setProgress] = useState(0);
  const [progressColor, setProgressColor] = useState("red");

  const [destination, setDestination] = useState("");
  const [origin, setOrigin] = useState("");
  const [rideType, setRideType] = useState("");

  const [placeOriginId, setPlaceOriginId] = useState(null);
  const [placeDestinationId, setPlaceDestinationId] = useState(null);
  const [originMainText, setOriginMainText] = useState();
  const [destinationMainText, setDestinationMainText] = useState();

  const [paymentMethod, setPaymentMethod] = useState();

  useEffect(() => {
    if (placeOriginId == null) return;
    (async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_MAPS_API_KEY}&place_id=${placeOriginId}`
        );

        if (response.data.status === "OK") {
          setOrigin(
            `${response.data.result.geometry.location.lat} ${response.data.result.geometry.location.lng}`
          );
          const { address_components } = response.data.result;
          setOriginMainText(
            `${address_components[0].long_name}, ${address_components[1].long_name}, ${address_components[2].long_name}`
          );

          console.log(
            response.data.result.address_components[0].long_name,
            "details for origin"
          );
          console.log(
            response.data.result.address_components[2].long_name,
            "details for origin"
          );
        } else {
          throw new Error(response.data.error_message);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
        return null;
      }
    })();
  }, [placeOriginId]);

  useEffect(() => {
    if (placeDestinationId == null) return;
    (async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_MAPS_API_KEY}&place_id=${placeDestinationId}`
        );

        if (response.data.status === "OK") {
          setDestination(
            `${response.data.result.geometry.location.lat} ${response.data.result.geometry.location.lng}`
          );
          const { address_components } = response.data.result;
          setDestinationMainText(
            `${address_components[0].long_name}, ${address_components[1].long_name}, ${address_components[2].long_name}`
          );
          console.log(response.data.result.geometry, "details for destination");
        } else {
          throw new Error(response.data.error_message);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
        return null;
      }
    })();
  }, [placeDestinationId]);

  useEffect(() => {
    i;
  }, []);

  const handleSubmit = () => {
    router.push({
      pathname: `map/student`,
      params: {
        origin,
        destination,
        rideType,
        paymentMethod,
        originMainText,
        destinationMainText,
        role,
        saveDetails,
      },
    });
  };

  const typeOfRide = [
    { key: "1", value: "Chartered" },
    { key: "2", value: "Inter Campus" },
    { key: "3", value: "Luggage Transport" },
    { key: "4", value: "Pick up and Delivery" },
  ];
  const methodOfPayment = [
    { key: "cash", value: "Cash" },
    { key: "card", value: "Card" },
    { key: "transfer", value: "Transfer" },
  ];

  useEffect(() => {
    setRole(params.role);
  }, [params.role]);

  useEffect(() => {
    if (origin.trim() !== "") setProgress(0.5);
    if (destination.trim() !== "") setProgress(1);
    if (rideType.trim() !== "") setProgressColor("green");
  }, [progress, origin, destination, rideType]);

  useEffect(() => {
    (async () => {
      let userDetails = null;

      userDetails = await getDetails("userDetails");

      if (userDetails != null) {
        setSaveDetails(userDetails);
      } else {
        router.push("/signin");
      }
    })();
  }, []);
  return (
    <PaperProvider>
      <SafeAreaView className="flex-1">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View className="flex-1 px-6 pt-5">
          <View className="text-center text-3xl font-bold w-full">
            <View className="w-full pb-10 flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => {
                  clearLocalStorage();
                  router.replace(`/signin/${role}`);
                }}
                className="items-center"
              >
                <ArrowRightOnRectangleIcon size={50} color="#166534" />
                <Text className="font-semibold text-green-800">Log out</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <UserCircleIcon size={50} color="#166534" />
                <Text className="font-semibold text-green-800">
                  {saveDetails?.name}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="mb-16">
            <View className="p-0 w-[104%] mb-2 relative transition-all ease-in duration-300 -left-2 flex-row items-center justify-between">
              <MapPinIcon
                size={`${origin.trim() !== "" ? 25 : 20}`}
                color="#854d0e"
              />
              <HandThumbUpIcon
                size={`${destination.trim() !== "" ? 25 : 20}`}
                color="#166534"
              />
            </View>
            <ProgressBar
              progress={progress}
              color={progressColor}
              height={10}
              animationType="spring"
              indeterminate={false}
            />
            <View className="flex-row justify-between">
              <Text className="text-green-800">Origin</Text>
              <Text className="text-green-800">Destination</Text>
            </View>
          </View>
          <View className="space-y-8 mb-10">
            <View>
              <GooglePlacesAutocomplete
                apiKey={GOOGLE_MAPS_API_KEY}
                setPlaceId={setPlaceOriginId}
                placeholderText="origin"
              />
            </View>
            <View>
              <GooglePlacesAutocomplete
                apiKey={GOOGLE_MAPS_API_KEY}
                setPlaceId={setPlaceDestinationId}
                placeholderText="destination"
              />
            </View>
            <View>
              <SelectList
                inputStyles={{
                  color: "#a2a2a2",
                }}
                dropdownTextStyles={{
                  color: "#a2a2a2",
                }}
                dropdownItemStyles={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#fde047",
                }}
                boxStyles={{
                  borderRadius: 6,
                  borderColor: "#fde047",
                }}
                dropdownStyles={{
                  borderRadius: 6,
                  borderColor: "#fde047",
                }}
                setSelected={(val) => setRideType(val)}
                data={typeOfRide}
                placeholder="Type of Ride"
                save="value"
              />
            </View>
            <View>
              <SelectList
                inputStyles={{
                  color: "#a2a2a2",
                }}
                dropdownTextStyles={{
                  color: "#a2a2a2",
                }}
                dropdownItemStyles={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#fde047",
                }}
                boxStyles={{
                  borderRadius: 6,
                  borderColor: "#fde047",
                }}
                dropdownStyles={{
                  borderRadius: 6,
                  borderColor: "#fde047",
                }}
                setSelected={(val) => setPaymentMethod(val)}
                data={methodOfPayment}
                placeholder="Payment Method"
                save="value"
              />
            </View>

            <TouchableOpacity
              disabled={!origin || !destination || !rideType || !paymentMethod}
              className={`${
                !origin || !destination || !rideType || !paymentMethod
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } rounded-md bg-green-800 mt-20 py-3`}
              onPress={handleSubmit}
            >
              <Text className="text-xl text-center text-white">
                Search for ride
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default Reservation;
