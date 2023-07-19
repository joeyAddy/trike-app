import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { clearLocalStorage, saveDetails } from "../../utils/localStorage";
import { hasEmptyFields } from "../../utils/forms";
import useAxiosPost from "../../services/useAxiosPost";
import { ActivityIndicator } from "react-native";
import { Alert } from "react-native";
import server from "../../constants/server";

const Signup = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState("");

  const [location, setLocation] = useState();

  const [form, setForm] = useState({
    name: "",
    matricNo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { data, loading, error, postData } = useAxiosPost();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // Handle permission not granted
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    setRole(params.role);

    if (params.role === "rider") {
      delete form.matricNo;
      console.log(form);
    }
  }, [params.role]);

  const handleSubmit = () => {
    // if (hasEmptyFields(form)) {
    //   return;
    // }
    // clearLocalStorage();
    // saveDetails(form);
    if (location != undefined) {
      form.origin = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      form.role = role;
      postData(`${server}user/signup`, form);
    }

    if (data) console.log(data);

    if (error) {
      console.log(JSON.stringify(error));
    }
    // router.push(`/dashboard/${role}`);
  };
  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="flex-1 px-6 ">
        <Text className="text-center text-3xl font-bold w-full mt-20">
          Sign up
        </Text>
        <View className="pt-16 space-y-10">
          <View className="rounded-md border border-solid border-yellow-300 px-5">
            <TextInput
              autoCapitalize="words"
              className="h-8 my-2 w-full"
              required
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="Full Name"
            />
          </View>
          {role === "student" && (
            <View className="rounded-md border border-solid border-yellow-300 px-5">
              <TextInput
                className="h-8 my-2 w-full"
                required
                value={form.matricNo}
                onChangeText={(text) => setForm({ ...form, matricNo: text })}
                placeholder="Matric No."
              />
            </View>
          )}
          <View className="rounded-md border border-solid border-yellow-300 px-5">
            <TextInput
              className="h-8 my-2 w-full"
              required
              inputMode="email"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              placeholder="Email"
            />
          </View>
          <View className="rounded-md border border-solid border-yellow-300 px-5">
            <TextInput
              className="h-8 my-2 w-full"
              required
              inputMode="text"
              secureTextEntry={true}
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              placeholder="Password"
            />
          </View>
          <View className="rounded-md border border-solid border-yellow-300 px-5">
            <TextInput
              className="h-8 my-2 w-full"
              required
              inputMode="text"
              secureTextEntry={true}
              value={form.confirmPassword}
              onChangeText={(text) =>
                setForm({ ...form, confirmPassword: text })
              }
              placeholder="Confirm Password"
            />
          </View>
          <TouchableOpacity
            className="rounded-md bg-green-800 item-center py-3"
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator size={20} color="white" />
            ) : (
              <Text className="text-xl text-center text-white">
                Create Account
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center items-center space-x-1 pt-5">
          <Text className="text-center">Already have an Account? </Text>
          <TouchableOpacity
            onPress={() => {
              if (role == undefined) return;
              router.push(`/signin/${role}`);
            }}
          >
            <Text className="font-semibold text-green-800">Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
