import { Alert } from "react-native";

export const hasEmptyFields = (form) => {
  for (const key in form) {
    if (form.hasOwnProperty(key) && form[key].trim() === "") {
      Alert.alert(`${key} cannot be empty`);
      return true;
    }
  }
  return false;
};
