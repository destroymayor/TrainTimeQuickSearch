import React, { Component } from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";

import FeatherIcon from "react-native-vector-icons/Feather";

import Storage from "../../data/Storage/ChooseHistory";
import Button from "../../util/Button";

export default class AboutUS extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = ({ navigation }) => ({
    headerTintColor: "rgb(255,255,255)",
    headerStyle: {
      backgroundColor: "rgb(40,44,52)"
    }
  });

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" ? <StatusBar barStyle="light-content" /> : null}
        <Text style={styles.TextStyle}>關於我們</Text>
        <Button
          ButtonIcon={<FeatherIcon name="trash-2" size={20} color="rgb(255,255,255)" />}
          ButtonText={" 清除歷史記錄"}
          TextStyle={styles.TextStyle}
          ButtonStyle={styles.TimeSelectionStyle}
          onPress={() => {
            Storage.Clear("PointOfDeparture");
            Storage.Clear("ArrivalPoint");
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
    width: 200,
    height: 60,
    margin: 10,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(57,152,137)",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowColor: "rgb(57,152,137)",
    shadowOffset: { height: 1, width: 1 }
  }
});
