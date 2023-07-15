import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  CheckIcon,
  ShieldExclamationIcon,
  XCircleIcon,
} from "react-native-heroicons/solid";
import { getDetails } from "../../utils/localStorage";
import { Stack, useRouter, useSearchParams } from "expo-router";
import StudentDashboard from "../../components/student/StudentDashboard";
import RiderDashboard from "../../components/rider/RiderDashboard";
import { CheckBadgeIcon } from "react-native-heroicons/outline";
import { Modal, PaperProvider, Portal } from "react-native-paper";

const Dashboard = () => {
  const [role, setRole] = useState("");
  const [saveDetails, setSaveDetails] = useState(null);

  const [visible, setVisible] = useState(false);

  const containerStyle = {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 20,
    margin: 30,
    borderRadius: 8,
  };
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (saveDetails !== null) {
      setVisible(true);
    }
  }, [saveDetails]);

  useEffect(() => {
    (async () => {
      setRole(params.role);
      console.log(params.role, "role");

      let signInInfo = null;
      let signUpInfo = null;

      signUpInfo = await getDetails("signupDetails");
      signInInfo = await getDetails("signinDetails");

      if (signUpInfo != null) {
        setSaveDetails(signUpInfo);
      } else if (signInInfo != null) {
        setSaveDetails(signInInfo);
      }
    })();
  }, [params.role]);
  return (
    <PaperProvider>
      <SafeAreaView className="flex-1">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View className="flex-1 px-6 pt-5">
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
              <View className="w-3/4 bg-white shadow-2xl opacity-100 rounded-md self-center">
                <View>
                  <Pressable
                    onPress={() => {
                      setVisible(false);
                    }}
                  >
                    <XCircleIcon size={35} color="red" />
                  </Pressable>
                </View>
                <Text className="text-center text-lg font-semibold">
                  Welcome {saveDetails?.name}
                </Text>
                <View className="items-center">
                  <CheckBadgeIcon size={150} color="green" />
                </View>
                <Text className="text-center text-lg font-semibold">
                  You have successfully logged in
                </Text>
              </View>
            </Modal>
          </Portal>
          {saveDetails != null ? (
            role === "student" ? (
              <StudentDashboard saveDetails={saveDetails} role={role} />
            ) : (
              <RiderDashboard saveDetails={saveDetails} role={role} />
            )
          ) : (
            <View className="flex-1 items-center">
              <View className="w-full justify-center items-center mt-44">
                <ShieldExclamationIcon size={150} color="#991b1b" />
              </View>
              <Text className="text-3xl text-center mt-5">Unauthenticated</Text>
              <TouchableOpacity
                onPress={() => {
                  router.push(`/signin/${role}`);
                }}
                className="self-center my-10 px-5 py-4 rounded-md bg-green-800"
              >
                <Text className="text-lg text-white">Go to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default Dashboard;
