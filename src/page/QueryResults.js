import React, { Component } from "react";
import { ActivityIndicator, FlatList, Platform, StatusBar, StyleSheet, Text, View } from "react-native";

import Icon from "react-native-vector-icons/Feather";

import axios from "axios";
import jsSHA from "jssha";

import Button from "../util/Button";
import API from "../API/API";

export default class QueryResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRenderView: false,
      RequestData: [],
      RequestPrice: []
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Text style={{ fontSize: 16, color: "#ffffff" }}>
        {navigation.state.params.PointOfDeparture}
        <Icon name="chevron-right" size={16} color="#ffffff" />
        {navigation.state.params.ArrivalPoint}
      </Text>
    ),
    headerTintColor: "#ffffff",
    headerStyle: {
      backgroundColor: "rgb(40,44,52)"
    }
  });

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
    try {
      const RequestTrainTimeData = await axios.get(params.RequestUrl, { headers: this.getAuthorizationHeader() });
      if (RequestTrainTimeData.data.length > 0) {
        this.setState({
          RequestData: RequestTrainTimeData.data,
          shouldRenderView: true
        });
      }
    } catch (error) {}

    // try {
    //   const RequestTrainPriceData = await axios.get(params.RequestUrl_Price, { headers: this.getAuthorizationHeader() });
    //   this.setState({ RequestPrice: RequestTrainPriceData.data[0].Fares });
    //   console.log(RequestTrainPriceData.data[0].Fares);
    // } catch (error) {}
  }

  TimeDifferenceCalculation(OriginStopTime, DestinationStopTime) {
    const Dates = new Date();
    const DatesYearMonthDay =
      Dates.getFullYear() +
      "/" +
      (Dates.getMonth() + 1 < 10 ? "0" : "") +
      (Dates.getMonth() + 1) +
      "/" +
      (Dates.getDate() < 10 ? "0" : "") +
      Dates.getDate() +
      " ";

    const OriginStopTimeArrivalTime = new Date(DatesYearMonthDay + OriginStopTime);
    const DestinationStopTimeTime = new Date(DatesYearMonthDay + DestinationStopTime);
    const CalculateDate = new Date(DestinationStopTimeTime - OriginStopTimeArrivalTime);

    const ResultHours = CalculateDate.getUTCHours() === 0 ? "" : CalculateDate.getUTCHours() + "小時";
    const ResultMinutes = CalculateDate.getUTCMinutes() === 0 ? "" : CalculateDate.getUTCMinutes() + "分";

    return ResultHours + ResultMinutes;
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" ? <StatusBar barStyle="light-content" /> : null}
        {this.state.shouldRenderView ? (
          <FlatList
            data={this.state.RequestData}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={10}
            renderItem={({ item }) => {
              return (
                <View style={styles.TrainTimeDataList}>
                  <View style={styles.TrainTimeDataListItem}>
                    {/* 車次 山海線 */}
                    <Text style={styles.TrainTimeDataListItemText}>
                      {item.DailyTrainInfo.TrainNo}
                      {item.DailyTrainInfo.TripLine === 1 ? " - 山線" : item.DailyTrainInfo.TripLine === 2 ? " - 海線" : ""}
                    </Text>
                    {/* 火車類型 */}
                    <Text style={styles.TrainTimeDataListItemText}>{item.DailyTrainInfo.TrainTypeName.Zh_tw}</Text>
                    {/* 起點站及終點站 */}
                    <Text style={styles.TrainTimeDataListItemText}>
                      {item.DailyTrainInfo.StartingStationName.Zh_tw} {<Icon name="chevron-right" size={15} color="#222" />}{" "}
                      {item.DailyTrainInfo.EndingStationName.Zh_tw}
                    </Text>
                  </View>
                  <View style={[styles.TrainTimeDataListItem, { alignItems: "center" }]}>
                    {/* 到達時間及行駛時間 */}
                    <Text style={styles.TrainTimeDataListItemText}>
                      {item.OriginStopTime.ArrivalTime} {<Icon name="chevron-right" size={15} color="#222" />}{" "}
                      {item.DestinationStopTime.ArrivalTime}
                    </Text>
                    <Text style={styles.TrainTimeDataListItemText}>
                      {this.TimeDifferenceCalculation(item.OriginStopTime.ArrivalTime, item.DestinationStopTime.ArrivalTime)}
                    </Text>
                  </View>
                  <View style={[styles.TrainTimeDataListItem, { alignItems: "center" }]}>
                    <Button
                      ButtonText={"訂票"}
                      TextStyle={styles.TextStyle}
                      ButtonStyle={styles.ButtonStyle}
                      onPress={() => {}}
                    />
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <ActivityIndicator size="large" color="#2894ff" />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  TrainTimeDataList: {
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomWidth: 0.5,
    backgroundColor: "rgb(139,205,239)"
  },
  TrainTimeDataListItem: {
    width: "30%",
    justifyContent: "center",
    margin: 10
  },
  TrainTimeDataListItemText: {
    margin: 3,
    flexWrap: "wrap"
  },
  ButtonStyle: {
    width: 50,
    height: 30,
    margin: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(194,223,239)"
  },
  TextStyle: {
    color: "#222222"
  }
});
