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
import tw from "tailwind-react-native-classnames";

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
    <View style={tw`bg-gray-700 items-center justify-center p-6 pt-12 h-full`}>
      <FlatList
        style={tw`w-11/12`}
        data={cronologia}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View
              style={[
                tw`m-1 rounded-lg px-2 py-1 text-white bg-gray-600`,
                {maxWidth: '80%'},
                item.sorgente === "User"
                  ? tw`self-end`
                  : tw`self-start`,
              ]}
            >
              <Text style={tw`text-white`}>{item.messaggio}</Text>
            </View>
          );
        }}
      />

      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        <TextInput
          value={domanda}
          onChangeText={setDomanda}
          style={[tw`border border-white rounded-lg p-2 pt-1 text-white`, {
            minWidth: '80%',
            maxWidth: '80%',
            maxHeight: 200,
            textAlignVertical: "top"
          }]}
          multiline={true}
          numberOfLines={4}
        />
        <Pressable style={tw`w-10 h-10 bg-green-400 rounded-full items-center justify-center ml-1`} onPress={() => callChat(domanda)}>
          <Icon name="arrowright" color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;
