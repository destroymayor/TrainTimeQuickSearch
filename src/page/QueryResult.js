import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

import axios from "axios";
import jsSHA from "jssha";

export default class QueryResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.RequestTrainTimeData();
  }

  getAuthorizationHeader() {
    const AppID = "d589440717e649fb8d67b065d46d1252";
    const AppKey = "uxMnkiJ3ZynHE0Bzog4DIW5tW_E";

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
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>result</Text>
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
  }
});
