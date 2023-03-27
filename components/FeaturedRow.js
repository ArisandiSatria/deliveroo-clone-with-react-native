import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import SanityClient from "../sanity";
import RestaurantCard from "./RestaurantCard";
import { ArrowRightIcon } from "react-native-heroicons/outline";

const FeaturedRow = ({ id, title, description }) => {
  const [restaurant, setRestaurant] = useState([]);

  useEffect(() => {
    SanityClient.fetch(
      `
    *[_type == "featured" && _id == $id] {
      ...,
      restaurants[]->{
        ...,
        dishes[]->,
        type-> {
          name
        }
      }
    }[0]`,
      { id }
    ).then((data) => {
      setRestaurant(data?.restaurants);
    });
  }, [id]);

  return (
    <View>
      <View className="mt-4 flex-row items-center justify-between px-4">
        <Text className="font-bold text-lg">{title}</Text>
        {/* <AntDesign name="arrowright" size={24} color="#00CCBB" /> */}
        <ArrowRightIcon color="#00CCBB" />
      </View>
      <Text className="text-xs text-gray-500 px-4">{description}</Text>
      {/* RestaurantCard */}
      <ScrollView
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        showsHorizontalScrollIndicator={false}
        className="pt-4"
      >
        {restaurant.map((res) => (
          <RestaurantCard
            key={res._id}
            id={res._id}
            imgUrl={res.image}
            title={res.name}
            rating={res.rating}
            genre={res.type?.name}
            address={res.address}
            short_description={res.short_description}
            dishes={res.dishes}
            long={res.long}
            lat={res.lat}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default FeaturedRow;
