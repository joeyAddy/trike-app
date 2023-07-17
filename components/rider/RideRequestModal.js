import { View, Text } from "react-native";
import React from "react";
import { Modal, Portal } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { CheckBadgeIcon, UserCircleIcon } from "react-native-heroicons/outline";

const RideRequestModal = ({ visible, setVisible, role }) => {
  const router = useRouter();
  const containerStyle = {
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 30,
    margin: 30,
    borderRadius: 8,
  };
  return (
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
        <View className="w-full space-y-6 bg-white shadow-2xl opacity-100 rounded-md self-center">
          <Text className="text-center uppercase text-green-800 text-xl">
            Ride details
          </Text>
          <View className="items-center">
            <UserCircleIcon size={150} color="green" />
            <Text className="text-green-800 font-bold text-lg">
              Nafisa Somebody
            </Text>
          </View>
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
                setVisible(false);
                if (!role) return;
                router.push(`/map/${role}`);
              }}
              className="w-full rounded-md items-center px-5 py-3 bg-green-800"
            >
              <Text className="text-xl text-white">Accept Ride Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default RideRequestModal;
