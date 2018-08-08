import React, { Component } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";

import Icon from "react-native-vector-icons/Feather";
import Picker from "react-native-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import DateTimePickerTime from "react-native-modal-datetime-picker";

import requestGeolocation from "../util/RequestGeolocation";
import Button from "../util/Button";
import StationCode from "../data/StationCode";
import { Object } from "core-js";

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
      MainArea: "臺北/基隆地區",
      PointOfDeparture: "福隆",
      PointOfDepartureCode: "1810",
      ArrivalPoint: "牡丹",
      ArrivalPointCode: "1807"
    };
  }

  componentDidMount() {
    this.autoGeolocation();
  }

  autoGeolocation() {
    requestGeolocation().then(value => {
      StationCode.map(MainArea => {
        Object.keys(MainArea).map(MainAreaLocation => {
          MainArea[MainAreaLocation].map(LocationValue => {
            if (Object.keys(LocationValue)[0].includes(value.slice(0, -1))) {
              this.setState({
                MainArea: MainAreaLocation,
                PointOfDeparture: Object.keys(LocationValue)[0],
                PointOfDepartureCode: Object.values(LocationValue)[0][0],
                ArrivalPoint: Object.keys(LocationValue)[0],
                ArrivalPointCode: Object.values(LocationValue)[0][0]
              });
            }
          });
        });
      });
    });
  }

  showPickerFromStation(SinceAndAfter) {
    Picker.init({
      wheelFlex: [1, 1, 0],
      selectedValue: [this.state.MainArea, this.state.PointOfDeparture, this.state.PointOfDepartureCode],
      pickerData: StationCode,
      pickerConfirmBtnText: "確定",
      pickerCancelBtnText: "取消",
      pickerTitleText: "",
      pickerToolBarFontSize: 18,
      pickerFontSize: 18,
      pickerFontColor: [255, 255, 255, 255],
      pickerConfirmBtnColor: [255, 255, 255, 255],
      pickerCancelBtnColor: [255, 255, 255, 255],
      pickerToolBarBg: [40, 44, 52, 255],
      pickerBg: [40, 44, 52, 255],
      onPickerConfirm: data => {
        switch (SinceAndAfter) {
          case "PointOfDeparture":
            this.setState({
              MainArea: data[0],
              PointOfDeparture: data[1],
              PointOfDepartureCode: data[2]
            });
            break;
          case "ArrivalPoint":
            this.setState({
              ArrivalPoint: data[1],
              ArrivalPointCode: data[2]
            });
            break;
        }
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
    this.props.navigation.navigate("QueryResult", {
      RequestUrl,
      RequestUrl_Price,
      PointOfDeparture: this.state.PointOfDeparture,
      ArrivalPoint: this.state.ArrivalPoint
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" ? <StatusBar barStyle="light-content" /> : null}
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
        <View>
          <Button
            ButtonText={"出發車站 " + this.state.PointOfDeparture}
            TextStyle={styles.TextStyle}
            ButtonStyle={styles.ButtonStyle}
            onPress={() => {
              this.showPickerFromStation("PointOfDeparture");
            }}
          />
          <Button
            ButtonText={<Icon name="refresh-cw" size={30} color="#ffffff" />}
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
            ButtonIcon={<Icon name="calendar" size={20} color="#222222" />}
            ButtonText={" " + this.state.QueryDates}
            TextStyle={styles.TextStyle}
            ButtonStyle={styles.ButtonStyle}
            onPress={() => {
              Picker.hide();
              this.setState({ isDateTimePickerVisible: true });
            }}
          />
          <Button
            ButtonIcon={<Icon name="clock" size={20} color="#222222" />}
            ButtonText={" " + this.state.QueryHours + ":" + this.state.QueryMinutes + " 出發"}
            TextStyle={styles.TextStyle}
            ButtonStyle={styles.ButtonStyle}
            onPress={() => {
              Picker.hide();
              this.setState({ isDateTimePickerTimeVisible: true });
            }}
          />
        </View>
        <Button
          ButtonText={"查詢"}
          TextStyle={styles.TextStyle}
          ButtonStyle={[styles.ButtonStyle, { width: "85%" }]}
          onPress={() => {
            Picker.hide();
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
    backgroundColor: "rgb(40,44,52)"
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
    backgroundColor: "rgb(139,205,239)"
  },
  TextStyle: {
    color: "#222222"
  }
});
