import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  BackHandler,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Divider } from "react-native-elements";
import Modal from "react-native-modal";
import Icon2 from "react-native-vector-icons/Entypo";
import Icon3 from "react-native-vector-icons/Foundation";

const { width } = Dimensions.get("window");

const SportContent = ({ navigation }) => {
  const Pic1path = "../../assets/Images/ArticlePic1.png";
  const imgpath = "../../assets/1.webp";

  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);

  useEffect(() => {
    const handleBackButton = () => {
      if (isModalVisible1 || isModalVisible2) {
        setModalVisible1(false);
        setModalVisible2(false);
        return true; // indicate that the back key was handled
      }
      return false; // default behavior of back key
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackButton);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [isModalVisible1, isModalVisible2]);

  const toggleModal1 = () => {
    setModalVisible1(!isModalVisible1);
  };

  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
  };

  return (
    <SafeAreaView
      style={[styles.container, { borderWidth: 1, borderColor: "#e0e0e0" }]}
    >
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView style={{ flex: 1, borderWidth: 1, borderColor: "#e0e0e0" }}>
          {/* <Divider style={{ height: 30 }} /> */}
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <Text
              style={{
                fontSize: 17,
                ...Platform.select({
                  ios: {
                    fontFamily: "Futura",
                  },
                  android: {
                    fontFamily: "monospace",
                  },
                }),
              }}
            >
              경찰, '천공 의혹' 제기 김종대 前의원 조사…CCTV 확보 주력
              {"\n"}
            </Text>
            <Text style={{ color: "grey" }}>2023-02-08 22:14</Text>
            <Text style={{ color: "grey" }}>
              2023-02-09 18:56 {"<최종 수정>"}
            </Text>
            <Text style={{ color: "grey" }}>동아일보 원문</Text>
            <View
              style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}
            >
              {/*댓글 버튼*/}
              <TouchableOpacity style={{ marginRight: 15 }}>
                <Icon3 name="comments" size={30} color="black" />
              </TouchableOpacity>

              {/*공유 버튼*/}
              <TouchableOpacity>
                <Icon2 name="share-alternative" size={30} color="black" />
              </TouchableOpacity>
            </View>
            {/* 기사 제목, 날짜, 언론사 정보 가져와서 여기 넣기*/}
          </View>
          <Divider style={{ height: 5 }} />
          <Text
            style={{
              padding: 5,
              marginTop: 10,
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            "영상 삭제 여부도 확인 중"…120억대 사기 '인천 건축왕' 구속
          </Text>

          <TouchableOpacity onPress={toggleModal1}>
            <Image
              style={{
                width: width,
                height: 210,
                marginTop: 15,
                resizeMode: "stretch",
              }}
              source={require(imgpath)}
            />
          </TouchableOpacity>
          <Divider style={{ height: 5 }} />

          {/*Modal (팝업 바)*/}

          <View style={{ flex: 1 }}>
            <Text style={{ padding: 5, marginTop: 10, fontSize: 15 }}>
              (서울=연합뉴스) 임순현 기자 = 역술인 '천공'이 대통령 관저 이전
              결정에 관여했다는 의혹을 수사 중인 경찰이 지난달 명예훼손 혐의
              피고발인인 김종대 전 정의당 의원을 불러 조사했다.{"\n"}
              {"\n"} 경찰 국가수사본부 관계자는 20일 정례기자간담회에서 "천공
              의혹과 관련해 대통령실이 명예훼손으로 고발한 일부 피고발인을
              지난달 조사했다"고 밝혔다. {"\n"}
              {"\n"}해당 피고발인은 대통령실이 지난해 12월 1차로 고발한 김 전
              의원 등인 것으로 파악됐다.{"\n"}
              {"\n"}
              <Pressable
                onPress={toggleModal1}
                android_ripple={{ color: "#8EECF5" }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  backgroundColor: "#A3C4F3",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    // width: width,

                    fontSize: 15,
                  }}
                >
                  해당
                </Text>
              </Pressable>{" "}
              대통령실은 지난해 12월 의혹을 처음 제기한 김 전 의원 등을 경찰에
              고발했다. {"\n"}
              {"\n"}이달 3일에는 저서와 언론 인터뷰 등을 통해 "남영신 전
              육군참모총장이 '지난해 3월께 천공과 김용현 대통령 경호처장이
              참모총장 공관과 서울사무소를 사전 답사했다는 보고를 공관
              관리관으로부터 받았다'고 얘기했다"고 주장한 부승찬 전 국방부
              대변인과 이를 보도한 언론사 2곳을 추가로 고발했다{"\n"}
              {"\n"} 경찰은 또 천공이 육군참모총장 공관을 들렀다는 지난해 3월
              공관 폐쇄회로(CC)TV 영상 확보에도 주력하고 있다. 해당 영상이
              보관기간 규정 등을 준수해 삭제됐는지 여부도 확인 중이다{"\n"}
              {"\n"} 국수본 관계자는 "CCTV 영상 확보를 위해 수사 협조를
              요청했다"고 말했다.{"\n"}
              {"\n"} 경찰은 또 인천을 중심으로 120억원대 전세 보증금을 가로챈
              혐의를 받는 '건축왕' A(62)씨에 대해 새로운 증거를 확보해 이달 17일
              구속했다고 밝혔다.{"\n"}
              {"\n"} 경찰은 애초 지난해 12월 A씨와 공범 등의 구속영장을
              청구했으나 법원은 "피의자들이 심문에 임한 태도와 사회적 유대관계
              등을 종합해 볼 때 현 단계에서 구속의 필요성을 인정하기 어렵다"며
              기각한 바 있다.{"\n"}
              {"\n"}
              <Pressable
                onPress={toggleModal2}
                android_ripple={{ color: "#8EECF5" }}
                style={{
                  width: width * 0.95,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 4,

                  backgroundColor: "#A3C4F3",
                }}
              >
                <Text
                  style={{
                    // width: width,

                    fontSize: 15,
                  }}
                >
                  경찰은 이날 현재 A씨를 포함해 무자본 갭투자 7개 조직과
                  전세자금 대출 사기 15개 조직을 검거하는 등 378건 1천586명을
                  수사 중이라고도 밝혔다.
                </Text>
              </Pressable>
              {"\n"}이태원 참사 당시 '닥터카'의 현장 도착을 지연시켰다는 의혹을
              받는 더불어민주당 신현영 의원 수사와 관련해선 명지병원 관계자
              4명을 조사했다고 밝혔다. 이 사건을 수사 중인 서울경찰청
              반부패·공공범죄수사대는 지난달 20일 신 의원을 피의자 신분으로 불러
              한 차례 조사한 바 있다.
            </Text>
          </View>
          <Modal
            visible={isModalVisible1}
            style={styles.bottomModal}
            onRequestClose={toggleModal1}
          >
            <View style={styles.modalContent}>
              <Pressable style={styles.closeButton} onPress={toggleModal1}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
              <ScrollView>
                <Text style={{ padding: 5, marginTop: 10, fontSize: 15 }}>
                  대통령실은 지난해 12월 의혹을 처음 제기한 김 전 의원 등을
                  경찰에 고발했다. {"\n"}
                  {"\n"}이달 3일에는 저서와 언론 인터뷰 등을 통해 "남영신 전
                  육군참모총장이 '지난해 3월께 천공과 김용현 대통령 경호처장이
                  참모총장 공관과 서울사무소를 사전 답사했다는 보고를 공관
                  관리관으로부터 받았다'고 얘기했다"고 주장한 부승찬 전 국방부
                  대변인과 이를 보도한 언론사 2곳을 추가로 고발했다{"\n"}
                  {"\n"} 경찰은 또 천공이 육군참모총장 공관을 들렀다는 지난해
                  3월 공관 폐쇄회로(CC)TV 영상 확보에도 주력하고 있다. 해당
                  영상이 보관기간 규정 등을 준수해 삭제됐는지 여부도 확인 중이다
                  {"\n"}
                  {"\n"} 국수본 관계자는 "CCTV 영상 확보를 위해 수사 협조를
                  요청했다"고 말했다.{"\n"}
                  {"\n"} 경찰은 또 인천을 중심으로 120억원대 전세 보증금을
                  가로챈 혐의를 받는 '건축왕' A(62)씨에 대해 새로운 증거를
                  확보해 이달 17일 구속했다고 밝혔다.{"\n"}
                  {"\n"} 경찰은 애초 지난해 12월 A씨와 공범 등의 구속영장을
                  청구했으나 법원은 "피의자들이 심문에 임한 태도와 사회적
                  유대관계 등을 종합해 볼 때 현 단계에서 구속의 필요성을
                  인정하기 어렵다"며 기각한 바 있다.{"\n"}
                  {"\n"}
                </Text>
              </ScrollView>
            </View>
          </Modal>
          <Modal
            visible={isModalVisible2}
            style={styles.bottomModal}
            onRequestClose={toggleModal2}
          >
            <View style={styles.modalContent}>
              <Pressable style={styles.closeButton} onPress={toggleModal2}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
              <ScrollView>
                <Text style={{ padding: 5, marginTop: 10, fontSize: 15 }}>
                  mdoal2
                </Text>
              </ScrollView>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SportContent;
const styles = StyleSheet.create({
  // 기사 제목 style
  container: {
    flex: 1,
    width: width,
    paddingHorizontal: "1%",
    backgroundColor: "white",
  },
  item: {
    padding: 18,
    marginHorizontal: 0,
  },
  separator: {
    backgroundColor: "#e0e0e0",
    height: 1,
  },
  title: {
    fontSize: 16,
    ...Platform.select({
      ios: {
        fontFamily: "Futura",
      },
      android: {
        fontFamily: "monospace",
      },
    }),
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "7%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    height: "90%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red",
    borderRadius: 20,
    padding: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});
