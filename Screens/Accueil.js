import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { FontAwesome5 } from '@expo/vector-icons'; 

import Users from "./AccueilScreens/Users";
import MyGroups from "./AccueilScreens/MyGroups";
import MyProfile from "./AccueilScreens/MyProfile";

import firebase from "../Config";

const Tab = createMaterialBottomTabNavigator();

const Accueil = (props) => {
  const currentId = props.route.params.currentId;

  useEffect(() => {
    const updateUserConnectedStatus = async () => {
      try {
        const userRef = firebase.database().ref(`users/${currentId}`);
        await userRef.child("Connected").set(true);
      } catch (error) {
        console.log("Error updating user connected status:", error);
      }
    };

    updateUserConnectedStatus();


  }, [currentId]);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        barStyle={{ backgroundColor: '#128C7E' }} 
        shifting={false}
      >
        <Tab.Screen
          name="Users"
          component={Users}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="users" size={24} color={color} /> 
            ),
          }}
          initialParams={{ currentId }}
        />
        <Tab.Screen
          name="MyGroups"
          component={MyGroups}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="users" size={24} color={color} /> 
            ),
          }}
        />
        <Tab.Screen
          name="MyProfile"
          component={MyProfile}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="user-circle" size={24} color={color} /> 
            ),
          }}
          initialParams={{ currentId }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#128C7E',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#0D6E5E',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
  },
});

export default Accueil;
