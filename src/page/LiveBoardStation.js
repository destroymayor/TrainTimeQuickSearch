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
      LiveBoardStationData: [],
      StationTimetable: []
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
    });
  }

  // 取得列車即時準點/延誤時間資料
  async RequestLiveBoardStation() {
    const { params } = this.props.navigation.state;
    const RequestUrl_LiveBoardStation =
      "http://ptx.transportdata.tw/MOTC/v2/Rail/TRA/LiveBoard/Station/" + params.PointOfDepartureCode + "?$format=JSON";
    try {
      const RequestLiveBoardData = await axios.get(RequestUrl_LiveBoardStation, {
        headers: getAuthorizationHeader()
      });
      this.setState({ LiveBoardStation: RequestLiveBoardData.data });
      console.log("取得列車即時準點/延誤時間資料", RequestLiveBoardData.data);
    } catch (error) {}
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
            data={this.state.StationTimetable}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={10}
            renderItem={({ item }) => {
              return (
                <View style={styles.LiveBoardStationList}>
                  <View style={[styles.LiveBoardStationListItem, { width: "25%" }]}>
                    <Text style={[styles.TextStyle, { fontSize: 20, marginBottom: 28 }]}>{item.StationName.Zh_tw}</Text>
                  </View>
                  <View style={[styles.LiveBoardStationListItem, { width: "10%" }]}>
                    <View style={styles.ArrivalIconList}>
                      <View style={styles.ArrivalIconListItem} />
                      <View style={styles.ArrivalIconListItemRectangle} />
                    </View>
                  </View>
                  <View style={[styles.LiveBoardStationListItem, { width: "65%" }]}>
                    <Text style={[styles.TextStyle, { fontSize: 17, marginBottom: 28 }]}>
                      {item.ArrivalTime}
                      到站 / {item.DepartureTime}
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
