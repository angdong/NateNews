import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { Pressable, TouchableOpacity } from "react-native";
import data from "../flask/ranking.json";

const { width } = Dimensions.get("window");
const Imagewidth = width * 0.3;
const SmallImageWidth = width * 0.15;

function PoliticMain({ navigation }) {
  const links = [];
  const titles = [];
  const categories = [];
  const presses = [];
  const dates = [];
  const contents = [];
  const images = [];
  var urlLink = "";
  const [result, setResult] = useState(null);

  const urlPushClick = (urls) => {
    console.log(`urlPushClicked`);
    fetch("http://192.168.11.162:5000/push_url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: urls }),
    })
      .then((response) => response.json())
      .then((data) => setResult(data.message))
      .catch((error) => setResult(error.message));
  };

  for (var key in data.spo) {
    links.push(key);
    titles.push(data.spo[key].title);
    categories.push(data.spo[key].category);
    presses.push(data.spo[key].press);
    dates.push(data.spo[key].date);
    contents.push(data.spo[key].content);
    for (var key2 in data.spo[key].image) {
      images.push(key2);
      break;
    }
  }

  const views = [];
  for (let i = 0; i < 5; i++) {
    const urlsend = links[i];
    const [aspectRatio, setAspectRatio] = useState(null);

    useEffect(() => {
      Image.getSize(
        images[0],
        (width, height) => {
          setAspectRatio(width / height);
        },
        (error) => {
          console.error(error);
        }
      );
    }, []);

    const isFirstView = i === 0; // check if it's the first view
    const imageWidth = isFirstView ? Imagewidth : SmallImageWidth; // set image width based on isFirstView
    const imageHeight = isFirstView ? Imagewidth * 0.7 : width * 0.12; // set image width based on isFirstView
    const num = isFirstView ? 2 : 1;
    const Istyle = isFirstView
      ? {
          width: imageWidth,
          aspectRatio,
          backgroundColor: "white",
        }
      : {
          width: imageWidth,
          height: imageHeight,
          backgroundColor: "black",
          resizeMode: "stretch",
        };

    const fview = isFirstView ? (
      <Image style={Istyle} source={{ uri: images[i] }} />
    ) : null;
    const nameView = isFirstView
      ? {
          marginLeft: "1%",
          width: width - (imageWidth + 20),
          justifyContent: "center",
          fontWeight: "bold",
        }
      : {
          marginLeft: "1%",
          width: width * 0.93,
          marginVertical: "2%",
          justifyContent: "center",
        };
    const newDivider = isFirstView ? (
      <View style={{ marginVertical: "3%" }} />
    ) : (
      <View style={styles.divider} />
    );

    views.push(
      <View styles={{ flex: 1 }} key={i}>
        {newDivider}
        <TouchableOpacity
          onPress={() => {
            urlPushClick(urlsend);
            console.log(urlsend); // call urlPushClick with the appropriate text
            navigation.navigate("PoliticContent", links[i]);
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            {fview}

            <View style={nameView}>
              <Text numberOfLines={num} style={{ fontWeight: "bold" }}>
                {titles[i].replace(/ /g, "\u00A0")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  const views2 = [];
  for (let i = 5; i < 15; i++) {
    const urlsend = links[i];

    views2.push(
      <View styles={{ flex: 1 }} key={i}>
        <View style={styles.divider} />
        <TouchableOpacity
          onPress={() => {
            urlPushClick(urlsend);
            console.log(urlsend); // call urlPushClick with the appropriate text
            navigation.navigate("PoliticContent", links[i]);
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Image
              style={{
                width: SmallImageWidth,
                height: width * 0.12,
                backgroundColor: "black",
                resizeMode: "stretch",
              }}
              source={{ uri: images[i] }}
            />

            <View
              style={{
                marginLeft: "1%",
                width: width * 0.8,
                justifyContent: "center",
              }}
            >
              <Text numberOfLines={1} style={{ fontWeight: "bold" }}>
                {titles[i].replace(/ /g, "\u00A0")}
              </Text>

              <Text style={{ fontSize: 12, marginTop: 3, color: "#d6ccc2" }}>
                {presses[i]}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          marginHorizontal: "3%",
          marginTop: "3%",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          얼음판 위엔 연아킴 비트위엔 vj 항상 기막힌
        </Text>
        <View style={{ flex: 1 }}>{views}</View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={[styles.middle]}>
          <Text>2030 부산 액스포</Text>
        </View>
        <View
          style={[
            styles.middle,
            { borderLeftWidth: 1 },
            { borderRightWidth: 1 },
          ]}
        >
          <Text>20대 대통령 윤석열</Text>
        </View>
        <View style={styles.middle}>
          <Text>코로나 19 현황</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          marginHorizontal: "3%",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          스포츠 주요뉴스
        </Text>

        <View style={{ flex: 1 }}>{views2}</View>
      </View>

      <View style={[styles.divider, { borderBottomWidth: 10 }]} />
    </ScrollView>
  );
}

export default PoliticMain;

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
    marginVertical: "1%",
  },
  firstViewContainer: {
    backgroundColor: "lightgrey",
    width: 150,
    justifyContent: "center",
  },
  mainnews: {
    marginVertical: "2%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    flexDirection: "row",
  },
  textcontainer: {
    flex: 1,
    marginLeft: "1%",
    backgroundColor: "white",
  },
  middle: {
    flex: 1,
    borderColor: "#e0e0e0",
    paddingVertical: "2%",

    marginVertical: "3%",
    borderTopWidth: 10,
    borderBottomWidth: 15,

    alignItems: "center",
    justifyContent: "center",
  },
});
