import { View, Text } from "react-native";
import React from "react";
import { Modal, Portal } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ExclamationCircleIcon } from "react-native-heroicons/outline";
import { ActivityIndicator } from "react-native";

const NoResponseModal = ({
  visible,
  setVisible,
  text,
  buttonText,
  buttonActionText,
  handleSubmit,
  spinnerState,
}) => {
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
            {spinnerState ? buttonActionText : text}
          </Text>
          <View className="items-center w-full">
            {spinnerState ? (
              <ActivityIndicator size={150} color="green" />
            ) : (
              <ExclamationCircleIcon size={150} color="green" />
            )}
          </View>
          <View className="w-full items-center">
            <TouchableOpacity
              onPress={() => {
                handleSubmit();
              }}
              className="w-auto rounded-md items-center px-5 py-3 bg-green-800"
            >
              <Text className="text-xl text-white">
                {spinnerState ? buttonActionText : buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default NoResponseModal;
