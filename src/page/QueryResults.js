import React, { Component } from "react";
import { ActivityIndicator, FlatList, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Icon from "react-native-vector-icons/Feather";
import axios from "axios";

import Button from "../util/Button";
import getAuthorizationHeader from "../API/API";

export default class QueryResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRenderView: false,
      notInformation: true,
      RequestData: [],
      RequestPrice: []
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Text style={{ fontSize: 16, color: "rgb(255,255,255)" }}>
        {navigation.state.params.PointOfDeparture}
        <Icon name="chevron-right" size={16} color="rgb(255,255,255)" />
        {navigation.state.params.ArrivalPoint}
      </Text>
    )
  });

  componentDidMount() {
    this.RequestTrainTime();
  }

  async RequestTrainTime() {
    const { params } = this.props.navigation.state;
    try {
      const RequestTrainTimeData = await axios.get(params.RequestUrl, { headers: getAuthorizationHeader() });
      if (RequestTrainTimeData.data.length > 0) {
        this.setState({
          RequestData: RequestTrainTimeData.data,
          shouldRenderView: true
        });
      } else {
        this.setState({ notInformation: false });
      }
    } catch (error) {}
  }

  async RequestPrice() {
    const { params } = this.props.navigation.state;
    try {
      const RequestTrainPriceData = await axios.get(params.RequestUrl_Price, { headers: getAuthorizationHeader() });
      this.setState({ RequestPrice: RequestTrainPriceData.data[0].Fares });
      console.log(RequestTrainPriceData.data[0].Fares);
    } catch (error) {}
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
              const { params } = this.props.navigation.state;
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("LiveBoardStation", {
                      PointOfDeparture: params.PointOfDeparture,
                      PointOfDepartureCode: params.PointOfDepartureCode,
                      ArrivalPoint: params.ArrivalPoint,
                      TrainNo: item.DailyTrainInfo.TrainNo,
                      QueryDates: params.QueryDates
                    });
                  }}
                  style={styles.TrainTimeDataList}>
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
                      {item.DailyTrainInfo.StartingStationName.Zh_tw}{" "}
                      {<Icon name="chevron-right" size={15} color="rgb(255,255,255)" />}{" "}
                      {item.DailyTrainInfo.EndingStationName.Zh_tw}
                    </Text>
                  </View>
                  <View style={[styles.TrainTimeDataListItem, { alignItems: "center" }]}>
                    {/* 到達時間及行駛時間 */}
                    <Text style={styles.TrainTimeDataListItemText}>
                      {item.OriginStopTime.DepartureTime} {<Icon name="chevron-right" size={15} color="rgb(255,255,255)" />}{" "}
                      {item.DestinationStopTime.ArrivalTime}
                    </Text>
                    <Text style={styles.TrainTimeDataListItemText}>
                      {this.TimeDifferenceCalculation(item.OriginStopTime.DepartureTime, item.DestinationStopTime.ArrivalTime)}
                    </Text>
                  </View>
                  <View style={[styles.TrainTimeDataListItem, { alignItems: "center" }]}>
                    <Button
                      ButtonText={"訂票"}
                      TextStyle={styles.TextStyle}
                      ButtonStyle={styles.ButtonStyle}
                      onPress={() => {
                        this.props.navigation.navigate("OnlineTickets", {
                          OnlineTickets_PointOfDeparture: params.PointOfDeparture,
                          OnlineTickets_PointOfDepartureCode: params.PointOfDepartureCode,
                          OnlineTickets_ArrivalPoint: params.ArrivalPoint,
                          OnlineTickets_ArrivalPointCode: params.ArrivalPointCode,
                          OnlineTickets_TrainNo: item.DailyTrainInfo.TrainNo
                        });
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View style={[styles.container, { alignItems: "center" }]}>
            {this.state.notInformation ? (
              <ActivityIndicator size="large" color="rgb(255,255,255)" />
            ) : (
              <View style={[styles.container, { alignItems: "center" }]}>
                <Icon name="alert-circle" size={40} color="rgb(255,255,255)" />
                <Text style={[styles.TextStyle, { fontSize: 20, marginTop: 10 }]}>查無班次資訊</Text>
              </View>
            )}
          </View>
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
  TrainTimeDataList: {
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "rgb(255,255,255)",
    backgroundColor: "rgb(40,44,52)"
  },
  TrainTimeDataListItem: {
    width: "30%",
    justifyContent: "center",
    margin: 10
  },
  TrainTimeDataListItemText: {
    color: "rgb(255,255,255)",
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
    backgroundColor: "rgba(255,255,255,0.5)"
  },
  TextStyle: {
    color: "rgb(255,255,255)"
  }
});
