import React, { Component } from "react";
import { ActivityIndicator, FlatList, Platform, StatusBar, StyleSheet, Text, View } from "react-native";

import Icon from "react-native-vector-icons/Feather";
import axios from "axios";

import getAuthorizationHeader from "../API/API";

export default class LiveBoardStation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRenderView: false,
      LiveBoardStation: [],
      StationTimetable: [],
      ItemAutoPosition: 0
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerTintColor: "rgb(255,255,255)",
    headerStyle: {
      backgroundColor: "rgb(40,44,52)"
    }
  });

  componentDidMount() {
    axios.all([this.RequestLiveBoardStation(), this.RequestStationTimetable()]).then(() => {
      this.setState({ shouldRenderView: true });
      this.scrollToIndexAutoTimer = setTimeout(() => {
        this.flatListRef.scrollToIndex({ animated: true, index: this.state.ItemAutoPosition });
      }, 1000);
    });
  }
  componentWillUnmount() {
    this.scrollToIndexAutoTimer && clearTimeout(this.scrollToIndexAutoTimer);
  }

  // 取得列車即時準點/延誤時間資料
  async RequestLiveBoardStation() {
    const { params } = this.props.navigation.state;
    const RequestUrl_LiveBoardStation =
      "http://ptx.transportdata.tw/MOTC/v2/Rail/TRA/LiveTrainDelay?$filter=TrainNo%20eq%20'" + params.TrainNo + "'&$format=JSON";
    try {
      const RequestLiveBoardData = await axios.get(RequestUrl_LiveBoardStation, {
        headers: getAuthorizationHeader()
      });
      this.setState({ LiveBoardStation: RequestLiveBoardData.data });
      console.log("取得列車即時準點/延誤時間資料", RequestLiveBoardData.data);
    } catch (error) {
      console.log(error);
    }
  }

  //取得指定[日期],[車次]的時刻表資料
  async RequestStationTimetable() {
    const { params } = this.props.navigation.state;
    const RequestUrl_StationTimetableData =
      "http://ptx.transportdata.tw/MOTC/v2/Rail/TRA/DailyTimetable/TrainNo/" +
      params.TrainNo +
      "/TrainDate/" +
      params.QueryDates +
      "?$format=JSON";

    try {
      const RequestStationTimetableData = await axios.get(RequestUrl_StationTimetableData, {
        headers: getAuthorizationHeader()
      });
      //item自動定位
      RequestStationTimetableData.data[0].StopTimes.map(item => {
        if (item.StationName.Zh_tw === params.PointOfDeparture.replace(new RegExp("【|】", "g"), "")) {
          this.setState({
            ItemAutoPosition: item.StopSequence - 1
          });
        }
      });

      this.setState({ StationTimetable: RequestStationTimetableData.data[0].StopTimes });
      console.log("取得指定[日期],[車次]的時刻表資料", RequestStationTimetableData.data[0].StopTimes);
    } catch (error) {}
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" ? <StatusBar barStyle="light-content" /> : null}
        {this.state.shouldRenderView ? (
          <FlatList
            style={{ paddingTop: 20 }}
            ref={ref => {
              this.flatListRef = ref;
            }}
            data={this.state.StationTimetable}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={10}
            renderItem={({ item }) => {
              const { params } = this.props.navigation.state;
              //列車即時動態 icon標記
              let InstantArrivalBoolean =
                item.StationName.Zh_tw === params.PointOfDeparture.replace(new RegExp("【|】", "g"), "")
                  ? "rgb(10,150,255)"
                  : item.StationName.Zh_tw === params.ArrivalPoint.replace(new RegExp("【|】", "g"), "")
                    ? "rgb(10,150,255)"
                    : "rgb(40,44,52)";

              let DelayTime = "";
              if (this.state.LiveBoardStation.length > 0) {
                // Icon顏色標記
                InstantArrivalBoolean =
                  this.state.LiveBoardStation[0].StationName.Zh_tw === item.StationName.Zh_tw
                    ? "rgb(200,100,10)"
                    : InstantArrivalBoolean;

                //判斷準點或延誤
                if (this.state.LiveBoardStation[0].StationName.Zh_tw === item.StationName.Zh_tw) {
                  DelayTime =
                    this.state.LiveBoardStation[0].DelayTime == 0
                      ? "準點"
                      : this.state.LiveBoardStation[0].DelayTime > 0
                        ? "延誤" + this.state.LiveBoardStation[0].DelayTime + "分"
                        : null;
                }
              }
              return (
                <View style={styles.LiveBoardStationList}>
                  <View style={[styles.LiveBoardStationListItem, { width: "25%" }]}>
                    <Text style={[styles.TextStyle, { fontSize: 18, marginBottom: 28 }]}>{item.StationName.Zh_tw}</Text>
                  </View>
                  <View style={[styles.LiveBoardStationListItem, { width: "15%" }]}>
                    <View style={styles.ArrivalIconList}>
                      <View style={[styles.ArrivalIconListItem, { backgroundColor: InstantArrivalBoolean }]} />
                      <View style={styles.ArrivalIconListItemRectangle} />
                    </View>
                  </View>
                  <View style={[styles.LiveBoardStationListItem, { width: "20%" }]}>
                    <Text Text style={[styles.TextStyle, { fontSize: 18, marginBottom: 28 }]}>
                      {DelayTime}
                    </Text>
                  </View>
                  <View style={[styles.LiveBoardStationListItem, { width: "40%" }]}>
                    <Text style={[styles.TextStyle, { fontSize: 18, marginBottom: 28 }]}>
                      {item.DepartureTime}
                      發車
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <ActivityIndicator size="large" color="rgb(255,255,255)" />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgb(40,44,52)"
  },
  LiveBoardStationList: {
    flexDirection: "row",
    alignItems: "center"
  },
  LiveBoardStationListItem: {
    alignItems: "center"
  },
  TextStyle: {
    color: "rgb(255,255,255)",
    textAlign: "center"
  },
  ArrivalIconList: {
    width: 100,
    height: 70,
    alignItems: "center"
  },
  ArrivalIconListItem: {
    width: 40,
    height: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 8,
    borderColor: "rgb(255,255,255)"
  },
  ArrivalIconListItemRectangle: {
    width: 20,
    height: 35,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0
  }
});
