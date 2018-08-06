import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import Icon from "react-native-vector-icons/Feather";

import axios from "axios";
import jsSHA from "jssha";

import API from "../API/API";

export default class QueryResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RequestData: ""
    };
  }

  componentDidMount() {
    this.RequestTrainTimeData();
  }

  getAuthorizationHeader() {
    const AppID = API.AppID;
    const AppKey = API.AppKey;

    const GMTString = new Date().toGMTString();
    const ShaObj = new jsSHA("SHA-1", "TEXT");
    ShaObj.setHMACKey(AppKey, "TEXT");
    ShaObj.update("x-date: " + GMTString);
    const HMAC = ShaObj.getHMAC("B64");
    const Authorization = 'hmac username="' + AppID + '", algorithm="hmac-sha1", headers="x-date", signature="' + HMAC + '"';

    return { Authorization: Authorization, "X-Date": GMTString };
  }

  async RequestTrainTimeData() {
    const { params } = this.props.navigation.state;
    console.log(params.RequestUrl);
    try {
      const response = await axios.get(params.RequestUrl, { headers: this.getAuthorizationHeader() });
      console.log(response.data);
      this.setState({
        RequestData: response.data
      });
    } catch (error) {
      console.error(error);
    }
  }

  TimeDifferenceCalculation(OriginStopTime, DestinationStopTime) {
    const Dates = new Date();
    const DatesYearMonthDay =
      Dates.getFullYear() +
      "-" +
      (Dates.getMonth() + 1 < 10 ? "0" : "") +
      (Dates.getMonth() + 1) +
      "-" +
      (Dates.getDate() < 10 ? "0" : "") +
      Dates.getDate() +
      " ";
    const OriginStopTimeArrivalTime = new Date(DatesYearMonthDay + OriginStopTime);
    const DestinationStopTimeArrivalTime = new Date(DatesYearMonthDay + DestinationStopTime);
    const TimeDifference = DestinationStopTimeArrivalTime.getTime() - OriginStopTimeArrivalTime.getTime();
    const DayNumberOfRemainingMilliseconds = TimeDifference % (24 * 3600 * 1000);
    const ArrivalTimeMinutesHours = Math.floor(DayNumberOfRemainingMilliseconds / (3600 * 1000));
    const HoursNumberOfRemainingMilliseconds = DayNumberOfRemainingMilliseconds % (3600 * 1000);
    const ArrivalTimeMinutes = Math.floor(HoursNumberOfRemainingMilliseconds / (60 * 1000));

    const ResultHours = ArrivalTimeMinutesHours === 0 ? "" : ArrivalTimeMinutesHours + "小時";
    const ResultMinutes = ArrivalTimeMinutes === 0 ? "" : ArrivalTimeMinutes + "分";

    return ResultHours + ResultMinutes;
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.RequestData}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={8}
          renderItem={({ item }) => {
            return (
              <View style={styles.TrainTimeDataList}>
                <View style={styles.TrainTimeDataListItem}>
                  <Text>
                    {item.DailyTrainInfo.TrainNo}
                    {item.DailyTrainInfo.TripLine === 1 ? " 山線" : item.DailyTrainInfo.TripLine === 2 ? " 海線" : ""}
                  </Text>
                  <Text>{item.DailyTrainInfo.TrainTypeName.Zh_tw}</Text>
                  <Text>
                    {item.DailyTrainInfo.StartingStationName.Zh_tw}=> {item.DailyTrainInfo.EndingStationName.Zh_tw}
                  </Text>
                </View>
                <View style={styles.TrainTimeDataListItem}>
                  <Text>
                    {item.OriginStopTime.ArrivalTime} {<Icon name="arrow-right" size={18} color="#222" />}{" "}
                    {item.DestinationStopTime.ArrivalTime}
                  </Text>
                  <Text>
                    {this.TimeDifferenceCalculation(item.OriginStopTime.ArrivalTime, item.DestinationStopTime.ArrivalTime)}
                  </Text>
                </View>
              </View>
            );
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
    backgroundColor: "#F5FCFF"
  },
  TrainTimeDataList: {
    justifyContent: "space-around",
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1
  },
  TrainTimeDataListItem: {
    justifyContent: "center",
    alignItems: "center"
  }
});
