import React, { Component } from "react";
import { ActivityIndicator, FlatList, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

import getAuthorizationHeader from "../../API";

export default class QueryResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRenderView: false,
      notInformation: true,
      RequestData: [],
      RequestPrice: [],
      LiveBoardStation: []
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Text style={{ fontSize: 16, color: "rgb(255,255,255)" }}>
        {navigation.state.params.PointOfDeparture}
        <FeatherIcon name="chevron-right" size={16} color="rgb(255,255,255)" />
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

        //取得列車動態資料
        RequestTrainTimeData.data.map(item => {
          this.RequestLiveBoardStation(item.DailyTrainInfo.TrainNo);
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
      //console.log(RequestTrainPriceData.data[0].Fares);
    } catch (error) {}
  }

  // 取得列車即時準點/延誤時間資料
  async RequestLiveBoardStation(TrainNo) {
    const RequestUrl_LiveBoardStation =
      "http://ptx.transportdata.tw/MOTC/v2/Rail/TRA/LiveTrainDelay?$filter=TrainNo%20eq%20'" + TrainNo + "'&$format=JSON";
    try {
      const RequestLiveBoardData = await axios.get(RequestUrl_LiveBoardStation, {
        headers: getAuthorizationHeader()
      });
      this.state.LiveBoardStation.push(RequestLiveBoardData.data[0]);
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
              //判斷車種 改變icon顏色
              const TrainTypeColor = item.DailyTrainInfo.TrainTypeName.Zh_tw.includes("區間")
                ? "rgb(10,150,200)"
                : item.DailyTrainInfo.TrainTypeName.Zh_tw.includes("莒光")
                  ? "rgb(200,100,10)"
                  : item.DailyTrainInfo.TrainTypeName.Zh_tw.includes("自強")
                    ? "rgb(250,100,10)"
                    : "rgb(255,255,255)";
              //判斷車種名稱
              const TrainTypeNames = item.DailyTrainInfo.TrainTypeName.Zh_tw.includes("區間")
                ? "區間車"
                : item.DailyTrainInfo.TrainTypeName.Zh_tw.includes("莒光")
                  ? "莒光號"
                  : item.DailyTrainInfo.TrainTypeName.Zh_tw.includes("自強")
                    ? "自強號"
                    : item.DailyTrainInfo.TrainTypeName.Zh_tw;

              //列車動態判斷
              const LiveBoardStationName = this.state.LiveBoardStation.map(LiveBoardStationItem => {
                if (LiveBoardStationItem != undefined) {
                  if (LiveBoardStationItem.TrainNo == item.DailyTrainInfo.TrainNo) {
                    return LiveBoardStationItem.DelayTime > 0 ? (
                      <Text style={{ color: "rgb(230,100,10)" }} key={LiveBoardStationItem.TrainNo.toString()}>
                        延誤
                        {LiveBoardStationItem.DelayTime}分
                      </Text>
                    ) : null;
                  }
                }
              });
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
                    <View style={{ flexDirection: "row" }}>
                      <MaterialIcons name="train" size={35} color={TrainTypeColor} />
                      <Text style={[styles.TrainTimeDataListItemText, { marginTop: 11 }]}>{TrainTypeNames}</Text>
                    </View>
                    {/* 起點站及終點站 */}
                    <Text style={styles.TrainTimeDataListItemText}>
                      {item.DailyTrainInfo.StartingStationName.Zh_tw}{" "}
                      {<FeatherIcon name="chevron-right" size={15} color="rgb(255,255,255)" />}{" "}
                      {item.DailyTrainInfo.EndingStationName.Zh_tw}
                    </Text>
                  </View>
                  <View style={[styles.TrainTimeDataListItem, { alignItems: "center" }]}>
                    {/* 到達時間及行駛時間 */}
                    <Text style={styles.TrainTimeDataListItemText}>
                      {item.OriginStopTime.DepartureTime}{" "}
                      {<FeatherIcon name="chevron-right" size={15} color="rgb(255,255,255)" />}{" "}
                      {item.DestinationStopTime.ArrivalTime}
                    </Text>
                    <Text style={styles.TrainTimeDataListItemText}>行駛時間</Text>
                    <Text style={styles.TrainTimeDataListItemText}>
                      {this.TimeDifferenceCalculation(item.OriginStopTime.DepartureTime, item.DestinationStopTime.ArrivalTime)}
                    </Text>
                  </View>
                  <View style={[styles.TrainTimeDataListItem, { alignItems: "center" }]}>
                    <FeatherIcon name="chevron-right" size={25} color="rgb(255,255,255)" />
                    {LiveBoardStationName}
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
                <FeatherIcon name="alert-circle" size={40} color="rgb(255,255,255)" />
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
    flexWrap: "wrap",
    fontSize: 15
  },
  TextStyle: {
    color: "rgb(255,255,255)"
  }
});
