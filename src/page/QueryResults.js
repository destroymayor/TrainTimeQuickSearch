import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

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

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.RequestData}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={8}
          renderItem={({ item }) => {
            return (
              <View style={styles.TrainTimeDataItem}>
                <Text>
                  {item.DailyTrainInfo.TrainNo}
                  {item.DailyTrainInfo.TripLine === 1 ? " 山線" : item.DailyTrainInfo.TripLine === 2 ? " 海線" : ""}
                </Text>
                <Text>{item.DailyTrainInfo.TrainTypeName.Zh_tw}</Text>
                <Text>
                  {item.DailyTrainInfo.StartingStationName.Zh_tw}=> {item.DailyTrainInfo.EndingStationName.Zh_tw}
                </Text>
                <Text>
                  {item.OriginStopTime.ArrivalTime}> {item.DestinationStopTime.ArrivalTime}
                </Text>
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
  TrainTimeDataItem: {
    padding: 10,
    borderBottomWidth: 1
  }
});
