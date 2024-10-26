import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { BackHandler, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import firebase from "../Config";

const auth = firebase.auth();

export default function Authentification(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const currentId = auth.currentUser.uid;
        props.navigation.navigate("Accueil", { currentId });
      })
      .catch((error) => {
        setError("Email ou mot de passe incorrect");
      });
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.heading}>Bienvenue</Text>
        <View style={styles.inputContainer}>
          <FontAwesome5 name="user" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={styles.inputStyle}
            placeholder="Login"
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome5 name="lock" size={24} color="#666" style={styles.icon} />
          <TextInput
            secureTextEntry={true}
            style={styles.inputStyle}
            placeholder="Mot de passe"
            onChangeText={setPassword}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => BackHandler.exitApp()} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.createAccountText} onPress={() => props.navigation.navigate("NewUser")}>
          Créer un compte
        </Text>
        {/* Additional Design and Icons */}
        <View style={styles.additionalContent}>
          <Text style={styles.additionalText}>Se connecter avec :</Text>
          <View style={styles.socialIconsContainer}>
            <FontAwesome5 name="facebook" size={30} color="#3b5998" style={styles.socialIcon} />
            <FontAwesome5 name="google" size={30} color="#db4437" style={styles.socialIcon} />
            <FontAwesome5 name="apple" size={30} color="#000" style={styles.socialIcon} />
          </View>
        </View>
      </View>
      <StatusBar style="light" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
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
  inputStyle: {
    flex: 1,
    height: 40,
    fontSize: 18,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#4682a0",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  createAccountText: {
    marginTop: 15,
    color: "#333",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  additionalContent: {
    marginTop: 20,
    alignItems: "center",
  },
  additionalText: {
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  socialIcon: {
    fontSize: 30,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
