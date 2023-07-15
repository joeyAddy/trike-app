import { View, Text, TouchableOpacity } from "react-native";
import { MapPinIcon } from "react-native-heroicons/solid";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";
import { clearLocalStorage } from "../../utils/localStorage";
import { useRouter } from "expo-router";

const StudentDashboard = ({ saveDetails, role }) => {
  const router = useRouter();
  console.log(saveDetails);
  return (
    <View className="text-center text-3xl font-bold w-full ">
      <View className="w-full pb-10 flex-row items-center justify-between mt-5">
        <TouchableOpacity
          onPress={() => {
            clearLocalStorage();
            router.replace(`/signin/${role}`);
          }}
          className="items-center"
        >
          <ArrowRightOnRectangleIcon size={50} color="#166534" />
          <Text className="font-semibold text-green-800">Log out</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <UserCircleIcon size={50} color="#166534" />
          <Text className="font-semibold text-green-800">
            {saveDetails?.name}
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center text-4xl text-green-800 font-bold">
        Let's start
      </Text>
      <Text className="text-center text-4xl text-green-800 font-bold">
        {" "}
        your ride
      </Text>
      <View className="w-full items-center py-10">
        <MapPinIcon size={150} color="#166534" />
      </View>
      <View className="w-4/5 self-center items-center">
        <Text className="text-2xl text-center">
          Choose the transport you need and we'll provide an easy & safe ride to
          your chosen destination
        </Text>
      </View>
      <TouchableOpacity
        className="rounded-md bg-green-800 mt-20 py-3"
        onPress={() => {
          router.push(`/dashboard/reservation`);
        }}
      >
        <Text className="text-xl text-center text-white">
          Make a reservation
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StudentDashboard;
