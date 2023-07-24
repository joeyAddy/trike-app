import { View, Text, TouchableOpacity } from "react-native";
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  MapPinIcon,
} from "react-native-heroicons/solid";
import {
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  QueueListIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";
import { clearLocalStorage } from "../../utils/localStorage";
import { useRouter } from "expo-router";
import LoadingModal from "../common/LoadingModal";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import RideRequestModal from "./RideRequestModal";
import RidesListModal from "./RidesListModal";
import NoResponseModal from "../common/NoResponseModal";
import useAxiosFetch from "../../services/useAxiosFetch";
import useAxiosPost from "../../services/useAxiosPost";
import { ActivityIndicator } from "react-native";
import { TextInput } from "react-native";
import { Alert } from "react-native";
import axios from "axios";

const RiderDashboard = ({ saveDetails, role }) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showNoResponseModal, setShowNoResponseModal] = useState(false);

  const { data, loading, error, postData } = useAxiosPost();

  const [hasProfile, setHasProfile] = useState(false);

  const [rides, setRides] = useState();
  const [selectedRide, setSelectedRide] = useState();
  const [riderInfo, setRiderInfo] = useState({
    user: saveDetails?._id,
    plateNumber: "",
    location: saveDetails?.origin,
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${server}rider?email=${saveDetails.email}`
        );

        if (response.data.data[0] !== undefined) {
          setIsLoading(false);
          setRiderInfo(response.data.data[0]);
          setHasProfile(true);
          console.log(response.data.data[0], "details");
        } else {
          setHasProfile(false);
          setIsLoading(false);
          // throw new Error(response.data.error_message);
        }
      } catch (error) {
        setHasProfile(false);
        setIsLoading(false);
        console.error("Error fetching rider profile:", error);
        return null;
      }
    })();
  }, []);

  useEffect(() => {
    if (data) {
      setRiderInfo(data.data);
      setHasProfile(true);
      console.log(data);
    }
    if (error) {
      console.log(error);
    }
  }, [data, error]);

  const handleProfileSubmit = () => {
    if (!riderInfo.plateNumber) return;
    Alert.alert(riderInfo.plateNumber);
    if (saveDetails.origin) postData(`${server}rider`, riderInfo);
  };

  const handleSearchSubmit = async () => {
    setVisible(true);
    try {
      const response = await axios.get(
        `${server}ride/rider/match?id=${riderInfo._id}`
      );

      if (response) {
        setVisible(false);
        setRides(response.data.data);
        setShowListModal(true);
        setShowNoResponseModal(false);
        // setShowRequestModal(true);
        console.log(response.data.data, "rides");
      } else {
        setVisible(false);
        // throw new Error(response.data.error_message);
      }
    } catch (error) {
      setVisible(false);
      setShowNoResponseModal(true);
      console.error("Error fetching rider profile:", JSON.stringify(error));
      return null;
    }
  };

  console.log(saveDetails);
  return (
    <View className="text-center text-3xl font-bold w-full ">
      {role !== "" && (
        <LoadingModal
          setVisible={setVisible}
          visible={visible}
          text="Searching for avalibale rides"
          // route={`map/${role}`}
          role={role}
        />
      )}
      <NoResponseModal
        visible={showNoResponseModal}
        setVisible={setShowNoResponseModal}
        text="No rides available in this location!"
        buttonText="Search Again"
        buttonActionText="Searching..."
        handleSubmit={handleSearchSubmit}
        spinnerState={visible}
      />
      {selectedRide && (
        <RideRequestModal
          visible={showRequestModal}
          setVisible={setShowRequestModal}
          ride={selectedRide}
        />
      )}
      {rides && (
        <RidesListModal
          visible={showListModal}
          setVisible={setShowListModal}
          setSelectedRide={setSelectedRide}
          rides={rides}
        />
      )}
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
      <Text className="text-center text-4xl text-green-800 font-bold">
        Let's start
      </Text>
      <Text className="text-center text-4xl text-green-800 font-bold">
        {" "}
        your ride
      </Text>
      {isLoading ? (
        <View className="my-20 item-center">
          <ActivityIndicator size={50} color="166534" />
        </View>
      ) : !hasProfile ? (
        <View className="my-20 items-center space-y-4">
          <Text className="text-center text-lg text-green-800">
            You don't yet have a Rider Profile. You need to provide your plate
            number for us to create a profile for you.
          </Text>
          <View className="rounded-md border border-solid border-yellow-300 px-5 w-full">
            <TextInput
              className="h-8 my-2 w-full"
              required
              value={riderInfo?.plateNumber}
              onChangeText={(text) =>
                setRiderInfo({ ...riderInfo, plateNumber: text })
              }
              placeholder="Plate Number"
            />
          </View>
          <TouchableOpacity
            disabled={riderInfo.plateNumber === ""}
            className="rounded-md bg-green-800 item-center py-3 w-full"
            onPress={handleProfileSubmit}
          >
            {loading ? (
              <ActivityIndicator size={20} color="white" />
            ) : (
              <Text className="text-xl text-center text-white">
                Create Profile
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View className="w-5/6 self-center items-center">
          <View className="w-full items-center pt-10">
            <UserCircleIcon size={150} color="#166534" />
          </View>
          <View className=" flex-row items-center justify-center space-x-1">
            <View className="h-5 w-5 rounded-full bg-green-500"></View>
            <Text className="text-xl text-center">Status: Online</Text>
          </View>
          <View className="w-full mt-3">
            <Text className="text-lg">Keke Owner: {saveDetails?.name}</Text>
            <Text className="text-lg">
              Plate Number: {riderInfo?.plateNumber}
            </Text>
            <Text className="text-lg">Code: {riderInfo?.vehicleCode}</Text>
          </View>
        </View>
      )}
      {hasProfile && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          vertical
          className="mt-5 space-y-4 pb-10"
        >
          <TouchableOpacity
            className="flex-row space-x-1"
            onPress={() => {
              // router.push(`/dashboard/${role}`);
            }}
          >
            <ArrowPathIcon size={30} color="#166534" />
            <Text className="text-xl text-green-800">Ride History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row space-x-1"
            onPress={() => {
              // router.push(`/dashboard/${role}`);
            }}
          >
            <QueueListIcon size={30} color="#166534" />
            <Text className="text-xl text-green-800">Transaction History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row space-x-1"
            onPress={() => {
              // router.push(`/dashboard/${role}`);
            }}
          >
            <CurrencyDollarIcon size={30} color="#166534" />
            <Text className="text-xl text-green-800">Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row space-x-1"
            onPress={() => {
              // router.push(`/dashboard/${role}`);
            }}
          >
            <CreditCardIcon size={30} color="#166534" />
            <Text className="text-xl text-green-800">Payment History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-md bg-green-800 mt-20 py-3"
            onPress={handleSearchSubmit}
          >
            <Text className="text-xl text-center text-white">
              Search for ride
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default RiderDashboard;
