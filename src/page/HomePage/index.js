import React, { Component } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";

import FeatherIcon from "react-native-vector-icons/Feather";
import EntypoIcon from "react-native-vector-icons/Entypo";

import { Snackbar } from "react-native-paper";
import Picker from "react-native-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import DateTimePickerTime from "react-native-modal-datetime-picker";

import requestGeolocation from "../../util/RequestGeolocation";
import Button from "../../util/Button";

import StationCode from "../../data/StationCode";
import Storage from "../../data/Storage/ChooseHistory";

import { Object } from "core-js";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    const Dates = new Date();
    this.state = {
      SnackbarText: "",
      SnackbarVisible: false,
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

  componentWillMount() {
    //起站 storage load
    Storage.Load("PointOfDeparture")
      .then(ret => {
        this.setState({ PointOfDeparture: ret.name, PointOfDepartureCode: ret.code });
      })
      .catch(err => {});

    //迄站 storage load
    Storage.Load("ArrivalPoint")
      .then(ret => {
        this.setState({ ArrivalPoint: ret.name, ArrivalPointCode: ret.code });
      })
      .catch(err => {});
  }

  autoGeolocation() {
    requestGeolocation()
      .then(value => {
        StationCode.map(MainArea => {
          Object.keys(MainArea).map(MainAreaLocation => {
            MainArea[MainAreaLocation].map(LocationValue => {
              if (Object.keys(LocationValue)[0].includes(value.slice(0, -1))) {
                this.setState(state => ({
                  MainArea: MainAreaLocation,
                  PointOfDeparture: Object.keys(LocationValue)[0],
                  PointOfDepartureCode: Object.values(LocationValue)[0][0],
                  SnackbarVisible: !state.visible,
                  SnackbarText: "已查詢當地車站"
                }));
              }
            });
          });
        });
      })
      .catch(error => {
        console.log(error);
        this.setState(state => ({
          SnackbarVisible: !state.visible,
          SnackbarText: "請稍候在試"
        }));
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
      pickerFontColor: [249, 249, 249, 100],
      pickerConfirmBtnColor: [249, 249, 249, 100],
      pickerCancelBtnColor: [249, 249, 249, 100],
      pickerTitleColor: [40, 44, 52, 5],
      pickerToolBarBg: [40, 44, 52, 5],
      pickerBg: [40, 44, 52, 5],
      onPickerConfirm: data => {
        switch (SinceAndAfter) {
          case "PointOfDeparture":
            this.setState({
              MainArea: data[0],
              PointOfDeparture: data[1],
              PointOfDepartureCode: data[2]
            });
            Storage.Save({
              key: "PointOfDeparture",
              name: data[1],
              code: data[2]
            });
            break;
          case "ArrivalPoint":
            this.setState({
              ArrivalPoint: data[1],
              ArrivalPointCode: data[2]
            });
            Storage.Save({
              key: "ArrivalPoint",
              name: data[1],
              code: data[2]
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
    this.setState(state => ({
      PointOfDeparture: state.ArrivalPoint,
      PointOfDepartureCode: state.ArrivalPointCode,
      ArrivalPoint: state.PointOfDeparture,
      ArrivalPointCode: state.PointOfDepartureCode,
      SnackbarVisible: !state.visible,
      SnackbarText: "起迄站已轉換"
    }));
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
      PointOfDepartureCode: this.state.PointOfDepartureCode,
      ArrivalPoint: this.state.ArrivalPoint,
      ArrivalPointCode: this.state.ArrivalPointCode,
      QueryDates: this.state.QueryDates
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" ? <StatusBar barStyle="light-content" /> : null}
        <Snackbar
          duration={1200}
          visible={this.state.SnackbarVisible}
          onDismiss={() => this.setState({ SnackbarVisible: false })}>
          {this.state.SnackbarText}
        </Snackbar>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          is24Hour={true}
          locale={"zh-tw"}
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
          locale={"zh-tw"}
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
            ButtonText={this.state.PointOfDeparture + "站"}
            TextStyle={[styles.TextStyle, { fontSize: 20 }]}
            ButtonStyle={styles.StationSelectionStyle}
            onPress={() => {
              this.showPickerFromStation("PointOfDeparture");
            }}
          />
          <FeatherIcon style={[styles.IconStyle, { marginTop: 20 }]} name="chevron-right" size={35} color="rgb(255,255,255)" />
          <Button
            ButtonText={this.state.ArrivalPoint + "站"}
            TextStyle={[styles.TextStyle, { fontSize: 20 }]}
            ButtonStyle={styles.StationSelectionStyle}
            onPress={() => {
              this.showPickerFromStation("ArrivalPoint");
            }}
          />
        </View>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Button
            ButtonText={<FeatherIcon name="refresh-cw" size={35} color="rgb(255,255,255)" />}
            ButtonStyle={[styles.IconStyle, { marginRight: 15 }]}
            onPress={() => {
              this.SiteInterchange();
            }}
          />
          <Button
            ButtonText={<EntypoIcon name="location" size={35} color="rgb(255,255,255)" />}
            ButtonStyle={styles.IconStyle}
            onPress={() => {
              this.autoGeolocation();
            }}
          />
        </View>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Button
            ButtonIcon={<FeatherIcon name="calendar" size={20} color="rgb(255,255,255)" />}
            ButtonText={" " + this.state.QueryDates}
            TextStyle={[styles.TextStyle, { fontSize: 17 }]}
            ButtonStyle={styles.TimeSelectionStyle}
            onPress={() => {
              Picker.hide();
              this.setState({ isDateTimePickerVisible: true });
            }}
          />
          <Button
            ButtonIcon={<FeatherIcon name="clock" size={20} color="rgb(255,255,255)" />}
            ButtonText={" " + this.state.QueryHours + ":" + this.state.QueryMinutes + " 出發"}
            TextStyle={[styles.TextStyle, { fontSize: 17 }]}
            ButtonStyle={styles.TimeSelectionStyle}
            onPress={() => {
              Picker.hide();
              this.setState({ isDateTimePickerTimeVisible: true });
            }}
          />
        </View>
        <Button
          ButtonText={" 查詢"}
          ButtonIcon={<FeatherIcon name="search" size={20} color="rgb(255,255,255)" />}
          TextStyle={[styles.TextStyle, { fontSize: 20 }]}
          ButtonStyle={styles.TrainSearchStyle}
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
    paddingTop: Platform.OS === "ios" ? 20 : 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(40,44,52)"
  },
  StationSelectionStyle: {
    width: "40%",
    height: 60,
    padding: 8,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
    borderBottomWidth: 1,
    borderBottomColor: "rgb(255,255,255)"
  },
  TextStyle: {
    color: "rgb(255,255,255)",
    fontSize: 20
  },
  IconStyle: {
    margin: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  TimeSelectionStyle: {
    width: "40%",
    height: 50,
    margin: 10,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(57,152,137)",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowColor: "rgb(57,152,137)",
    shadowOffset: { height: 1, width: 1 }
  },
  TrainSearchStyle: {
    width: "60%",
    height: 50,
    margin: 10,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "rgb(255,255,255)",
    backgroundColor: "rgb(40,44,52)",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowColor: "#aaa",
    shadowOffset: { height: 2, width: 2 }
  }
});
