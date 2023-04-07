import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { Configuration, OpenAIApi } from "openai";

import { OPENAI_KEY, ORG_ID } from "@env";
import Icon from "react-native-vector-icons/AntDesign";

const configuration = new Configuration({
  organization: ORG_ID,
  apiKey: OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

interface IMessaggio {
  sorgente: string;
  messaggio: string;
}

const HomeScreen = () => {
  const [domanda, setDomanda] = useState<string>("");
  const [cronologia, setCronologia] = useState<IMessaggio[]>([]);

  const callChat = (domanda: string) => {
    setDomanda("");
    // setCronologia((prev) =>
    //   prev.concat([
    //     { sorgente: "User", messaggio: domanda },
    //     { sorgente: "ChatGPT", messaggio: "Rispostaaa" },
    //   ])
    // );
    openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: domanda,
          },
        ],
      })
      .then((res) => {
        let ricevuta = res.data.choices[0].message?.content;
        if (ricevuta !== undefined) {
          setCronologia((prev) =>
            prev.concat([
              { sorgente: "User", messaggio: domanda },
              { sorgente: "ChatGPT", messaggio: ricevuta as string },
            ])
          );
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.corpo}
        data={cronologia}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View
              style={[
                styles.messaggio,
                item.sorgente === "User"
                  ? styles.messaggioUser
                  : styles.messaggioChat,
              ]}
            >
              <Text style={styles.text}>{item.messaggio}</Text>
            </View>
          );
        }}
      />

      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        <TextInput
          value={domanda}
          onChangeText={setDomanda}
          style={styles.inputText}
          multiline={true}
          numberOfLines={4}
        />
        <Pressable style={styles.button} onPress={() => callChat(domanda)}>
          <Icon name="arrowright" color="white" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingTop: 48,
  },
  inputText: {
    minWidth: "80%",
    maxWidth: "80%",
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 12,
    padding: 6,
    textAlignVertical: "top",
    color: "white",
  },
  button: {
    height: 40,
    width: 40,
    backgroundColor: "#4ade80",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  messaggio: {
    margin: 4,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: "80%",
    color: "white",
    backgroundColor: "#475569",
  },
  messaggioUser: {
    alignSelf: "flex-end",
  },
  messaggioChat: {
    alignSelf: "flex-start",
  },
  text: {
    color: "white",
  },
  corpo: {
    flex: 3,
    width: "90%",
  },
});

export default HomeScreen;
