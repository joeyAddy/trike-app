import { View, Text } from "react-native";
import React from "react";
import { Modal, Portal } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { CheckBadgeIcon, UserCircleIcon } from "react-native-heroicons/outline";
import { FlatList } from "react-native";

const RidesListModal = ({ visible, setVisible, rides, setSelectedRide }) => {
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
        visible={visible}
        contentContainerStyle={containerStyle}
      >
        <View className="w-full space-y-6 bg-white shadow-2xl opacity-100 rounded-md self-center">
          <Text className="text-center uppercase text-green-800 text-xl">
            Avaliable rides
          </Text>
          <FlatList
            data={rides}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedRide(item);
                  setVisible(false);
                }}
              >
                <View className="flex-row justify-between items-center border-b border-solid border-yellow-300 p-3">
                  <View>
                    <Text className="text-lg text-green-800 font-bold">
                      {item.user.name}
                    </Text>
                    <Text className="text-md text-green-800 ">
                      {item.user.number}
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-md text-green-800 ">
                      {item.ridetype}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </Modal>
    </Portal>
  );
};

export default RidesListModal;
