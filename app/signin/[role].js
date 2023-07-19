import { View, Text, SafeAreaView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { clearLocalStorage, saveDetails } from "../../utils/localStorage";
import { hasEmptyFields } from "../../utils/forms";

const Signin = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState("");

  const [form, setForm] = useState({
    matricNo: "",
    password: "",
  });

  useEffect(() => {
    setRole(params.role);

    if (params.role === "rider") {
      delete form.matricNo;
      setForm({ ...form, email: "" });
      console.log(form);
    }
  }, [params.role]);

  const handleSubmit = () => {
    if (hasEmptyFields(form)) {
      return;
    }

    // clearLocalStorage();
    saveDetails(form, "signupDetails");

    router.push(`/dashboard/${role}`);
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
          Sign In
        </Text>
        <View className="pt-16 space-y-10">
          <View className="rounded-md border border-solid border-yellow-300 px-5">
            <TextInput
              className="h-8 my-2 w-full"
              inputMode="text"
              value={role === "rider" ? form.email : form.matricNo}
              onChangeText={(text) => {
                if (role === "rider") {
                  setForm({ ...form, email: text });
                  return;
                }
                setForm({ ...form, matricNo: text });
              }}
              placeholder={`${role === "rider" ? "Email" : "Matric No"}`}
            />
          </View>

          <View className="rounded-md border border-solid border-yellow-300 px-5">
            <TextInput
              className="h-8 my-2 w-full"
              inputMode="text"
              secureTextEntry={true}
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              placeholder="Password"
            />
          </View>
          <View className="space-y-5">
            <View>
              <BouncyCheckbox
                size={25}
                fillColor="rgb(253 224 71)"
                unfillColor="#FFFFFF"
                text="Remember me"
                iconStyle={{ borderColor: "rgb(253 224 71)", borderRadius: 8 }}
                innerIconStyle={{ borderWidth: 2, borderRadius: 8 }}
                onPress={(isChecked) => {}}
              />
            </View>
            <View>
              <Text className="text-green-800 font-semibold">
                ForgotPassword?
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="rounded-md bg-green-800 py-3"
            onPress={handleSubmit}
          >
            <Text className="text-xl text-center text-white">Sign In</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center items-center space-x-1 pt-5">
          <Text className="text-center">Don't have an Account? </Text>
          <TouchableOpacity
            onPress={() => {
              if (role == undefined) return;

              router.push(`/signup/${role}`);
            }}
          >
            <Text className="font-semibold text-green-800">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Signin;
