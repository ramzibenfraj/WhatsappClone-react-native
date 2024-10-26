import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Keyboard, Dimensions } from "react-native";
import firebase from "../Config";
import Item from "../src/component/item";
import { FontAwesome5 } from '@expo/vector-icons';

const database = firebase.database();
const { height } = Dimensions.get("window");

export default function Chat(props) {
  const currentid = props.route.params.currentId;
  const secondid = props.route.params.secondId;

  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const [istypingVisible, setistypingVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [searchText, setSearchText] = useState("");

  const iddisc = currentid > secondid ? currentid + secondid : secondid + currentid;

  useEffect(() => {
    const ref_discussion = database.ref("discussion");
    const ref_la_disc = ref_discussion.child(iddisc);

    ref_la_disc.on("value", (snapshot) => {
      const dataArray = [];
      for (const key in snapshot.val()) {
        if (snapshot.val()[key].Time) dataArray.push(snapshot.val()[key]);
      }
      setData(dataArray);
    });

    return () => {
      ref_la_disc.off();
    };
  }, []);

  useEffect(() => {
    const ref_discussion = database.ref("discussion");
    const ref_la_disc = ref_discussion.child(iddisc);
    const ref_typing = ref_la_disc.child(secondid + "isTyping");
    ref_typing.on("value", (snapshot) => {
      setistypingVisible(snapshot.val());
    });

    return () => {
      ref_typing.off();
    };
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      ({ endCoordinates }) => {
        setKeyboardHeight(endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSend = () => {
    if (!msg.trim()) {
      alert("Message is empty");
      return;
    }

    const iddisc = currentid > secondid ? currentid + secondid : secondid + currentid;
    const ref_discussion = database.ref("discussion");
    const ref_la_disc = ref_discussion.child(iddisc);
    const key = ref_la_disc.push().key;
    const ref_un_msg = ref_la_disc.child(key);

    const dataToPush = {
      Time: new Date().toLocaleString(),
      Message: msg,
      Sender: currentid,
      Receiver: secondid,
    };

    ref_un_msg.set(dataToPush).then(() => {
      setMsg("");
    });
  };

  const filteredData = data.filter((item) =>
    item.Message.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Messages..."
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
      </View>
      <FlatList
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        data={filteredData}
        renderItem={({ item }) => <Item item={item} currentid={currentid} />}
      />
      <View style={[styles.inputContainer, { marginBottom: keyboardHeight }]}>
        <TextInput
          value={msg}
          onFocus={() => {
            const ref_discussion = database.ref("discussion");
            const ref_la_disc = ref_discussion.child(iddisc);
            const ref_typing = ref_la_disc.child(currentid + "isTyping");
            ref_typing.set(true);
          }}
          onBlur={() => {
            const ref_discussion = database.ref("discussion");
            const ref_la_disc = ref_discussion.child(iddisc);
            const ref_typing = ref_la_disc.child(currentid + "isTyping");
            ref_typing.set(false);
          }}
          onChangeText={(ch) => {
            setMsg(ch);
          }}
          textColor="white"
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#fff"
        />
        <TouchableOpacity
          onPress={handleSend}
          activeOpacity={0.7}
          style={styles.sendButton}
        >
          <FontAwesome5 name="paper-plane" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {istypingVisible && <Text style={styles.typingIndicator}>Typing...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Change background color
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    height: 40,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  messageList: {
    flex: 1,
    backgroundColor: "#dee2e3", // Change message list background color
  },
  messageListContent: {
    paddingBottom: 20,
  },
  typingIndicator: {
    color: "gray",
    alignSelf: "center",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#dee2e3", // Change border color
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#dee2e3", // Change input background color
    fontSize: 14,
    fontWeight: "bold",
    color: "black", // Change text color
    borderRadius: 25,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 123, 255, 0.6)",
  },
});
