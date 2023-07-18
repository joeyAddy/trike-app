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
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import RideRequestModal from "./RideRequestModal";

const RiderDashboard = ({ saveDetails, role }) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  console.log(saveDetails);
  return (
    <View className="text-center text-3xl font-bold w-full ">
      {role !== "" && (
        <LoadingModal
          setVisible={setVisible}
          visible={visible}
          text=" Searching for a ride"
          // route={`map/${role}`}
          role={role}
          setShowRequestModal={setShowRequestModal}
        />
      )}
      <RideRequestModal
        visible={showRequestModal}
        setVisible={setShowRequestModal}
      />
      <View className="w-full pb-10 flex-row items-center justify-between mt-5">
        <TouchableOpacity
          onPress={() => {
            clearLocalStorage();
            router.replace(`/signin/${role}`);
          }}
          className="items-center ml-auto"
        >
          <ArrowRightOnRectangleIcon size={50} color="#166534" />
          <Text className="font-semibold text-green-800">Log out</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity className="items-center">
          <UserCircleIcon size={50} color="#166534" />
          <Text className="font-semibold text-green-800">
            {saveDetails?.name}
          </Text>
        </TouchableOpacity> */}
      </View>
      <Text className="text-center text-4xl text-green-800 font-bold">
        Let's start
      </Text>
      <Text className="text-center text-4xl text-green-800 font-bold">
        {" "}
        your ride
      </Text>
      <View className="w-5/6 self-center items-center">
        <View className="w-full items-center pt-10">
          <UserCircleIcon size={150} color="#166534" />
        </View>
        <View className=" flex-row items-center justify-center space-x-1">
          <View className="h-5 w-5 rounded-full bg-green-500"></View>
          <Text className="text-xl text-center">Status: Online</Text>
        </View>
        <View className="w-full">
          <Text className="text-xl">Keke Owner: {saveDetails?.name}</Text>
          <Text className="text-xl">Keke place number: 234324</Text>
          <Text className="text-xl">Keke code: 4534</Text>
        </View>
      </View>
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
  );
};

export default RiderDashboard;
