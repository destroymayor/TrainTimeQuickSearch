import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import Icon from "react-native-vector-icons/Feather";
import Picker from "react-native-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import DateTimePickerTime from "react-native-modal-datetime-picker";

import Button from "../util/Button";
import StationCode from "../data/StationCode";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    const Dates = new Date();
    this.state = {
      QueryDates:
        Dates.getFullYear() +
        "-" +
        (Dates.getMonth() + 1 < 10 ? "0" : "") +
        (Dates.getMonth() + 1) +
        "-" +
        (Dates.getDate() < 10 ? "0" : "") +
        Dates.getDate(),
      QueryHours: (Dates.getHours() < 10 ? "0" : "") + Dates.getHours(),
      QueryMinutes: (Dates.getMinutes() < 10 ? "0" : "") + Dates.getMinutes(),
      isDateTimePickerVisible: false,
      isDateTimePickerTimeVisible: false,
      PointOfDeparture: "福隆",
      PointOfDepartureCode: "1810",
      ArrivalPoint: "牡丹",
      ArrivalPointCode: "1807"
    };
  }

  showPickerFromStation(SinceAndAfter) {
    Picker.init({
      pickerData: StationCode,
      pickerConfirmBtnText: "確定",
      pickerCancelBtnText: "取消",
      pickerTitleText: "請選擇起站",
      pickerToolBarFontSize: 18,
      pickerFontSize: 18,
      pickerConfirmBtnColor: [49, 151, 252, 5],
      pickerCancelBtnColor: [49, 151, 252, 5],
      pickerToolBarBg: [230, 230, 230, 5],
      pickerBg: [230, 230, 230, 5],
      onPickerConfirm: data => {
        switch (SinceAndAfter) {
          case "PointOfDeparture":
            this.setState({
              PointOfDeparture: data[1].slice(5),
              PointOfDepartureCode: data[1].split("-", 1)
            });
            break;
          case "ArrivalPoint":
            this.setState({
              ArrivalPoint: data[1].slice(5),
              ArrivalPointCode: data[1].split("-", 1)
            });
            break;
        }
        console.log(data[1].split("-", 1), data[1].slice(5));
      }
    });
    Picker.show();
  }

  hideDateTimePicker = () =>
    this.setState({
      isDateTimePickerVisible: false,
      isDateTimePickerTimeVisible: false
    });

  handleDatePicked = date => {
    this.setState({
      QueryDates:
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10 ? "0" : "") +
        (date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" : "") +
        date.getDate()
    });
    this.hideDateTimePicker();
  };

  handleDatePickedTime = date => {
    this.setState({
      QueryHours: (date.getHours() < 10 ? "0" : "") + date.getHours(),
      QueryMinutes: (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
    });

    console.log(date);
    this.hideDateTimePicker();
  };

  SiteInterchange() {
    this.setState({
      PointOfDeparture: this.state.ArrivalPoint,
      PointOfDepartureCode: this.state.ArrivalPointCode,
      ArrivalPoint: this.state.PointOfDeparture,
      ArrivalPointCode: this.state.PointOfDepartureCode
    });
  }

  RequestTrainTimeData() {
    //起訖站查詢
    const RequestUrl_TimeFilter =
      "$filter=OriginStopTime%2FArrivalTime%20gt%20'" + this.state.QueryHours + "%3A" + this.state.QueryMinutes + "'";
    const RequestUrl_Order = "$orderby=OriginStopTime%2FArrivalTime";
    const RequestUrl =
      "http://ptx.transportdata.tw/MOTC/v2/Rail/TRA/DailyTimetable/OD/" +
      this.state.PointOfDepartureCode +
      "/to/" +
      this.state.ArrivalPointCode +
      "/" +
      this.state.QueryDates +
      "?" +
      RequestUrl_TimeFilter +
      "&" +
      RequestUrl_Order +
      "&$format=JSON";

    //起迄站車票查詢
    const RequestUrl_Price =
      "http://ptx.transportdata.tw/MOTC/v2/Rail/TRA/ODFare/" +
      this.state.PointOfDepartureCode +
      "/to/" +
      this.state.ArrivalPointCode +
      "?&$format=JSON";
    this.props.navigation.navigate("QueryResult", { RequestUrl: RequestUrl });
  }

  render() {
    return (
      <View style={styles.container}>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          is24Hour={true}
          date={new Date()}
          titleIOS="請選擇日期"
          cancelTextIOS="取消"
          confirmTextIOS="確定"
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          neverDisableConfirmIOS={true}
          minimumDate={new Date()}
        />
        <DateTimePickerTime
          isVisible={this.state.isDateTimePickerTimeVisible}
          is24Hour={true}
          mode="time"
          date={new Date()}
          titleIOS="請選擇時間"
          cancelTextIOS="取消"
          confirmTextIOS="確定"
          onConfirm={this.handleDatePickedTime}
          onCancel={this.hideDateTimePicker}
          neverDisableConfirmIOS={true}
        />
        <View style={{ flexDirection: "row" }}>
          <Button
            ButtonText={"出發車站 " + this.state.PointOfDeparture}
            TextStyle={styles.TextStyle}
            ButtonStyle={styles.ButtonStyle}
            onPress={() => {
              this.showPickerFromStation("PointOfDeparture");
            }}
          />
          <Button
            ButtonText={<Icon name="refresh-cw" size={30} color="#2897ff" />}
            ButtonStyle={styles.IconStyle}
            onPress={() => {
              this.SiteInterchange();
            }}
          />
          <Button
            ButtonText={"到達車站 " + this.state.ArrivalPoint}
            TextStyle={styles.TextStyle}
            ButtonStyle={styles.ButtonStyle}
            onPress={() => {
              this.showPickerFromStation("ArrivalPoint");
            }}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Button
            ButtonIcon={<Icon name="calendar" size={20} color="#fff" />}
            ButtonText={" " + this.state.QueryDates}
            TextStyle={styles.TextStyle}
            ButtonStyle={styles.ButtonStyle}
            onPress={() => {
              this.setState({ isDateTimePickerVisible: true });
            }}
          />
          <Button
            ButtonIcon={<Icon name="clock" size={20} color="#fff" />}
            ButtonText={" " + this.state.QueryHours + ":" + this.state.QueryMinutes + " 出發"}
            TextStyle={styles.TextStyle}
            ButtonStyle={styles.ButtonStyle}
            onPress={() => {
              this.setState({ isDateTimePickerTimeVisible: true });
            }}
          />
        </View>
        <Button
          ButtonText={"查詢"}
          TextStyle={styles.TextStyle}
          ButtonStyle={styles.ButtonStyle}
          onPress={() => {
            this.RequestTrainTimeData();
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
    backgroundColor: "#F5FCFF"
  },
  IconStyle: {
    margin: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  ButtonStyle: {
    width: 150,
    height: 40,
    margin: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2897ff"
  },
  TextStyle: {
    color: "#fff"
  }
});
