import { View, Text } from "react-native";
import React from "react";
import { Modal, Portal } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { CheckBadgeIcon } from "react-native-heroicons/outline";

const ConfirmPaymentModal = ({ visible, setVisible, setWaiting }) => {
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
        <View className="w-3/4 space-y-6 bg-white shadow-2xl opacity-100 rounded-md self-center">
          <View className="items-center">
            <CheckBadgeIcon size={150} color="green" />
          </View>
          <Text className="text-center text-lg font-semibold">
            Payment is Successful
          </Text>
          <Text className="text-center text-green-800 text-4xl font-bold">
            <Text className="line-through">N</Text> 550
          </Text>
          <View className="flex-row space-x-1 justify-between items-center">
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
                setWaiting(true);
              }}
              className="w-full rounded-md items-center px-5 py-3 bg-green-800"
            >
              <Text className="text-xl text-white">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default ConfirmPaymentModal;
