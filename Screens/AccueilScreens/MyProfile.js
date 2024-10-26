import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';

import firebase from "../../Config";
const database = firebase.database();
const storage = firebase.storage();

export default function MyProfile(props) {
  const currentId = props.route.params.currentId;

  const [Nom, setNom] = useState("");
  const [Prenom, setPrenom] = useState("");
  const [Telephone, setTelephone] = useState("");
  const [Pseudo, setPseudo] = useState("");
  const [UrlImage, setUrlImage] = useState("");

  useEffect(() => {
    const ref_users = database.ref("users");
    const user = ref_users.child(currentId);

    user.once("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNom(data.Nom);
        setPrenom(data.Prenom);
        setTelephone(data.Telephone);
        setPseudo(data.Pseudo);
        setUrlImage(data.UrlImage);
      }
    }).catch((error) => {
      alert(error);
    });
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setUrlImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    
    const ref = storage.ref("images");
    const childRef = ref.child("image");

    await childRef.put(blob);
    const url = await childRef.getDownloadURL();
    return url;
  };

  const handleDisconnect = async () => {
    try {
      const ref_users = database.ref("users");
      const user = ref_users.child(currentId);

      await user.child("Connected").set(false);

      props.navigation.navigate("Authentification", { currentId });
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.heading}>My Profile</Text>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={UrlImage ? { uri: UrlImage } : require("../../assets/profileIcon.png")}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <FontAwesome5 name="user" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          onChangeText={(text) => setNom(text)}
          placeholder="Nom"
          style={styles.input}
          value={Nom}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome5 name="user" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          onChangeText={(text) => setPrenom(text)}
          placeholder="Prenom"
          style={styles.input}
          value={Prenom}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome5 name="phone" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          onChangeText={(text) => setTelephone(text)}
          placeholder="Telephone"
          style={styles.input}
          keyboardType="phone-pad"
          value={Telephone}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome5 name="user" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          onChangeText={(text) => setPseudo(text)}
          placeholder="Pseudo"
          style={styles.input}
          value={Pseudo}
        />
      </View>
      <TouchableOpacity onPress={async () => {
          const url = await uploadImage(UrlImage);
          const ref_users = database.ref("users");
          const user = ref_users.child(currentId);

          if (!url || Nom.length === 0 || Prenom.length === 0 || Telephone.length === 0 || Pseudo.length === 0) {
            alert("Please fill all the fields");
            return;
          }

          user.set({
            Nom,
            Prenom,
            Telephone,
            Pseudo,
            UrlImage: url,
            Id: currentId,
          }).then(() => {
            alert("Profil enregistré");
            setNom("");
            setPrenom("");
            setTelephone("");
            setPseudo("");
          }).catch((error) => {
            alert(error);
          });
        }}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>      Save        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDisconnect} style={[styles.saveButton, styles.disconnectButton]}>
        <Text style={[styles.saveButtonText, { color: "#4682a0", backgroundColor: "#ffffff" }]}>Disconnect</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#ffffff",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: "#4682a0",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disconnectButton: {
    backgroundColor: "#ffffff",
    borderColor: "#4682a0",
    borderWidth: 2,
  },
});
