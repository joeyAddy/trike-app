import { View, Text } from "react-native";
import React, { useState } from "react";
import { Divider, Modal, Portal } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const PaymentModal = ({ visible, setVisible, setConfirmedPayment }) => {
  const [cash, setCash] = useState(false);
  const [card, setCard] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const router = useRouter();
  const containerStyle = {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 20,
    height: "75%",
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
        <View className="w-11/12 h-full bg-white space-y-7  shadow-2xl opacity-100 rounded-md self-center">
          <Text className="text-center text-lg font-semibold">
            Select Payment Method
          </Text>
          <View className={`flex-row justify-between ${!transfer && "flex-1"}`}>
            <TouchableOpacity
              onPress={() => {
                setCash(true);
                setCard(false);
                setTransfer(false);
                // setVisible(false);
              }}
              className={`${
                cash === true ? "bg-yellow-500" : "bg-green-800"
              } h-20 w-20 relative rounded-md items-center p-3`}
            >
              {cash && (
                <View className="absolute -bottom-3 w-[145%] border-b-2 border-yellow-500"></View>
              )}
              <View className="absolute right-2 top-2 bg-white rounded-full h-5 w-5"></View>
              <Text
                className={`${
                  cash === true ? "text-green-800" : "text-yellow-500"
                } text-md mt-auto`}
              >
                Cash
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCard(true);
                setCash(false);
                setTransfer(false);
              }}
              className={`${
                card === true ? "bg-yellow-500" : "bg-green-800"
              } h-20 w-20 relative rounded-md items-center p-3`}
            >
              {card && (
                <View className="absolute -bottom-3 w-[145%] border-b-2 border-yellow-500"></View>
              )}
              <View className="absolute right-2 top-2 bg-white rounded-full h-5 w-5"></View>
              <Text
                className={`${
                  card === true ? "text-green-800" : "text-yellow-500"
                } text-md mt-auto`}
              >
                Card
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCard(false);
                setCash(false);
                setTransfer(true);
              }}
              className={`${
                transfer === true ? "bg-yellow-500" : "bg-green-800"
              } h-20 w-20 relative rounded-md items-center p-3`}
            >
              {transfer && (
                <View className="absolute -bottom-3 w-[145%] border-b-2 border-yellow-500"></View>
              )}
              <View className="absolute right-2 top-2 bg-white rounded-full h-5 w-5"></View>
              <Text
                className={`${
                  transfer === true ? "text-green-800" : "text-yellow-500"
                } text-md mt-auto`}
              >
                Transfer
              </Text>
            </TouchableOpacity>
          </View>
          {transfer && (
            <View className="flex-1">
              <Text className="uppercase text-lg font-bold text-green-800">
                Account Details
              </Text>
              <View className="mt-4">
                <Text className="text-lg text-green-800">
                  Account Name: <Text>Abdul Something</Text>
                </Text>
                <Divider style={{ marginVertical: 10 }} />
                <Text className="text-lg text-green-800">
                  Account Number: <Text>0984756364</Text>
                </Text>
                <Divider style={{ marginVertical: 10 }} />
                <Text className="text-lg text-green-800">
                  Bank Name: <Text>Abdul Bank</Text>
                </Text>
                <Divider style={{ marginVertical: 10 }} />
                <Text className="text-lg text-green-800">
                  Amout to be paid:{" "}
                  <Text className="text-center text-green-800 font-bold">
                    <Text className="line-through">N</Text> 550
                  </Text>
                </Text>
              </View>
            </View>
          )}

          <View className="items-center">
            <TouchableOpacity
              onPress={() => {
                if (cash === true) {
                  setConfirmedPayment(true);
                  setVisible(false);
                }
              }}
              className="w-full rounded-md items-center px-5 py-3 bg-yellow-500"
            >
              <Text className="text-xl text-white">Confirm Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default PaymentModal;
