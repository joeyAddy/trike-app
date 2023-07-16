import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";
import { clearLocalStorage, getDetails } from "../../utils/localStorage";
import { SafeAreaView } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Modal, PaperProvider, Portal, ProgressBar } from "react-native-paper";
import { HandThumbUpIcon, MapPinIcon } from "react-native-heroicons/solid";
import { TextInput } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Alert } from "react-native";
import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native";

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

  const [visible, setVisible] = useState(false);

  const containerStyle = {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 20,
    margin: 30,
    borderRadius: 8,
  };

  const data = [
    { key: "1", value: "Maths Department" },
    { key: "2", value: "ICT" },
    { key: "3", value: "IT Park" },
    { key: "4", value: "Faculty of Arts" },
    { key: "5", value: "Faculty of Science" },
    { key: "6", value: "Bursary" },
    { key: "7", value: "KASU Market" },
  ];
  const typeOfRide = [
    { key: "1", value: "Chatter" },
    { key: "2", value: "Inter Campus" },
    { key: "3", value: "Luggage Transport" },
    { key: "4", value: "Pick up and Delivery" },
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
      let signInInfo = null;
      let signUpInfo = null;

      signUpInfo = await getDetails("signupDetails");
      signInInfo = await getDetails("signinDetails");

      if (signUpInfo != null) {
        setSaveDetails(signUpInfo);
      } else if (signInInfo != null) {
        setSaveDetails(signInInfo);
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
          <Portal>
            <Modal
              dismissableBackButton={true}
              dismissable={true}
              visible={visible}
              onDismiss={() => {
                setVisible(false);
              }}
              contentContainerStyle={containerStyle}
            >
              <View className="w-3/4 bg-white shadow-2xl opacity-100 rounded-md self-center">
                <Text className="text-center text-lg font-semibold">
                  Searching for a ride
                </Text>
                <View className="items-center">
                  <ActivityIndicator size={150} />
                </View>
              </View>
            </Modal>
          </Portal>
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="space-y-8 mb-10"
          >
            <View className="rounded-md flex-row items-center border border-solid border-yellow-300 px-5">
              <TextInput
                className="h-8 my-2 flex-1"
                inputMode="search"
                secureTextEntry={true}
                // value={destination}
                // onChangeText={(text) => setDestination(text)}
                placeholder="Search Destination"
              />
              <TouchableOpacity>
                <MagnifyingGlassIcon size={20} color="#166534" />
              </TouchableOpacity>
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
                setSelected={(val) => setOrigin(val)}
                data={data}
                placeholder="Origin"
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
                setSelected={(val) => setDestination(val)}
                data={data}
                placeholder="Destination"
                save="key"
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
                save="key"
              />
            </View>
            <TouchableOpacity
              className="rounded-md bg-green-800 mt-20 py-3"
              onPress={() => {
                setVisible(true);
              }}
            >
              <Text className="text-xl text-center text-white">
                Search for ride
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default Reservation;
