import { View, Text } from "react-native";
import React from "react";
import { Modal, Portal } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const CancelRideModal = ({ visible, setVisible, setEmptyRiders }) => {
  const router = useRouter();
  const containerStyle = {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 20,
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
        <View className="w-3/4 space-y-4 bg-white shadow-2xl opacity-100 rounded-md self-center">
          <Text className="text-center text-lg font-semibold">
            Are you sure you want to cancel this ride?
          </Text>
          <View className="flex-row space-x-1 justify-between items-center">
            <TouchableOpacity
              onPress={() => {
                setEmptyRiders(true);
                router.back();
              }}
              className="w-auto px-5 rounded-md items-center py-3 bg-red-800"
            >
              <Text className="text-xl text-white">Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
              }}
              className="w-auto rounded-md items-center px-5 py-3 bg-green-800"
            >
              <Text className="text-xl text-white">No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default CancelRideModal;
