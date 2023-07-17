import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Modal, Portal } from "react-native-paper";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";

const LoadingModal = ({
  visible,
  setVisible,
  text,
  route,
  setShowRequestModal,
  role,
}) => {
  const router = useRouter();
  const containerStyle = {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 20,
    margin: 30,
    borderRadius: 8,
  };

  useEffect(() => {
    // setTimeout(() => {
    setVisible(false);
    if (role && role === "rider") setShowRequestModal(true);
    if (!route) return;
    router.push(`/${route}`);
    // }, 2000);
  }, []);
  return (
    <Portal>
      <Modal
        dismissableBackButton={true}
        // dismissable={true}
        visible={visible}
        onDismiss={() => {
          setVisible(false);
          if (route) router.push(`/${route}`);
          if (role && role === "rider") setShowRequestModal(true);
        }}
        contentContainerStyle={containerStyle}
      >
        <View className="w-3/4 bg-white shadow-2xl opacity-100 rounded-md self-center">
          <Text className="text-center text-lg font-semibold">{text}</Text>
          <View className="items-center">
            <ActivityIndicator size={150} color="#166534" />
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default LoadingModal;
