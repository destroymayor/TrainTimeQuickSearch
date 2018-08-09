import React, { Component } from "react";
import { FlatList, Platform, StatusBar, StyleSheet, Text, View } from "react-native";

import Icon from "react-native-vector-icons/Feather";
import axios from "axios";

import getAuthorizationHeader from "../API/API";

export default class LiveBoardStation extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    axios.all([this.RequestLiveBoardStation(), this.RequestStationTimetable()]);
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
      this.setState({ StationTimetable: RequestStationTimetableData.data.StopTimes });
      console.log("取得指定[日期],[車次]的時刻表資料", RequestStationTimetableData.data.StopTimes);
    } catch (error) {}
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" ? <StatusBar barStyle="light-content" /> : null}
        <FlatList
          data={this.state.StationTimetable}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={10}
          renderItem={({ item }) => {
            return <View>{/* <Text>{item}</Text> */}</View>;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(40,44,52)"
  },
  TextStyle: {
    color: "rgb(255,255,255)"
  }
});
