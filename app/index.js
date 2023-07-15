import { View, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

const index = () => {
  const router = useRouter();
  const [role, setRole] = useState("");
  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex-1 px-6 items-center justify-center space-y-10">
        <Text className="text-4xl font-bold text-center">
          Are you a student or driver?
        </Text>
        <View className="flex-row space-x-5 items-center">
          <TouchableOpacity
            onPress={() => {
              router.push(`signup/student`);
            }}
            className="bg-green-800 rounded-md py-3 px-4 fill-yellow-800"
          >
            <Text className="text-xl text-white">Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push(`signin/rider`);
            }}
            className="bg-yellow-800 rounded-md py-3 px-4"
          >
            <Text className="text-xl text-white">Rider</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default index;
