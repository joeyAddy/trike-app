import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Modal, Portal } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
import { FlatList } from "react-native";

const RidesListModal = ({ visible, setVisible, rides, setSelectedRide }) => {
  const router = useRouter();
  const containerStyle = {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 20,
    margin: 30,
    borderRadius: 8,
  };

  useEffect(() => {
    console.log(rides[0].ride.user);
  }, []);

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
            showsVerticalScrollIndicator={false}
            data={rides}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  console.log(item);
                  router.push({
                    pathname: "/map/rider",
                    params: {
                      rideId: item.ride._id,
                    },
                  });
                  setVisible(false);
                }}
              >
                <View className="flex-row space-x-3 justify-between items-center border-b border-solid border-yellow-300 p-1">
                  <View className="w-7/12">
                    <Text className="text-lg text-green-800 font-bold">
                      {item.ride.user.name}
                    </Text>
                    <Text className="text-md text-green-800 ">
                      {item.ride.user.phone}
                    </Text>
                  </View>
                  <View className="items-start w-5/12 space-y-2">
                    <View className="flex-row items-center space-x-2">
                      <Icon name="road" size={12} color="orange" />
                      <Text className="text-xs text-green-800 truncate">
                        {item.ride.rideType}
                      </Text>
                    </View>
                    <View className="flex-row space-x-2 items-center">
                      <Icon name="wallet" size={12} color="green" />
                      <Text className="text-xs text-green-800 ">
                        {item.ride.paymentMethod}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `${item.ride._id + index}`}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </Modal>
    </Portal>
  );
};

export default RidesListModal;
