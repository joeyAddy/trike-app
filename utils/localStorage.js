import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveDetails = async (form, itemName) => {
  if (!form) return;
  try {
    // Convert the details object to a string
    const detailsString = JSON.stringify(form);

    // Save the details to local storage
    await AsyncStorage.setItem(itemName, detailsString);

    console.log("Details saved successfully!");
  } catch (error) {
    console.log("Error saving details:", error);
  }
};

export const getDetails = async (itemName) => {
  let savedInfo = null;
  try {
    // Retrieve the details from local storage
    const detailsString = await AsyncStorage.getItem(itemName);

    if (detailsString) {
      // Convert the details string back to an object
      savedInfo = JSON.parse(detailsString);

      console.log(itemName + " details retrieved successfully!");
      // console.log("Details:", savedInfo);
    } else {
      console.log("No registration details found.");
    }
  } catch (error) {
    console.log("Error retrieving registration details:", error);
  }

  if (savedInfo !== null) {
    console.log(savedInfo, "testing");
    return savedInfo;
  }
};

export const clearLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("Local storage cleared successfully!");
  } catch (error) {
    console.log("Error clearing local storage:", error);
  }
};
