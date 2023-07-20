import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const GooglePlacesAutocomplete = ({ apiKey, setPlaceId, placeholderText }) => {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);

  const [hideList, setHideList] = useState(false);

  const handleInputChange = async (text) => {
    setHideList(false);
    setQuery(text);

    if (!text) {
      setPredictions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${text}`
      );

      setPredictions(response.data.predictions);
      console.log(response.data.predictions, "predictions");
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  return (
    <View className="rounded-md border border-solid border-yellow-300 px-5">
      <TextInput
        className="h-10 my-1"
        value={query}
        onChangeText={handleInputChange}
        placeholder={`Search for a ${placeholderText}...`}
      />
      {hideList
        ? null
        : predictions.length > 0 && (
            <FlatList
              data={predictions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setQuery(item.description);
                    setPlaceId(item.place_id);
                    setHideList(true);
                  }}
                >
                  <Text className="border-b border-solid border-yellow-300 p-3">
                    {item.description}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.place_id}
              keyboardShouldPersistTaps="always"
            />
          )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  prediction: {
    padding: 10,
    fontSize: 16,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});

export default GooglePlacesAutocomplete;
