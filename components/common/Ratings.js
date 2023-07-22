import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const RatingDisplay = ({ rating }) => {
  // Assuming rating is a number between 0 and 5
  // You can add custom logic here to convert the rating to a specific number of stars

  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {[...Array(fullStars)].map((_, index) => (
        <Icon key={index} name="star" size={20} color="gold" />
      ))}
      {halfStar ? <Icon name="star-half" size={20} color="gold" /> : null}
      {[...Array(emptyStars)].map((_, index) => (
        <Icon key={index} name="star-o" size={20} color="gold" />
      ))}
      <Text style={{ marginLeft: 5 }}>{rating.toFixed(1)}</Text>
    </View>
  );
};

export default RatingDisplay;
