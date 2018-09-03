import React, { Component } from "react";
import { Platform, Linking, StatusBar, StyleSheet, View } from "react-native";

import FeatherIcon from "react-native-vector-icons/Feather";

import Storage from "../../data/Storage/ChooseHistory";
import Button from "../../util/Button";
import Snackbar from "../../util/Snackbar";

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
        <Button
          ButtonIcon={<FeatherIcon name="users" size={20} color="rgb(255,255,255)" />}
          ButtonText={" 關於團隊"}
          TextStyle={styles.TextStyle}
          ButtonStyle={styles.TimeSelectionStyle}
          onPress={() => {}}
        />
        <Button
          ButtonIcon={<FeatherIcon name="trash-2" size={20} color="rgb(255,255,255)" />}
          ButtonText={" 清理記錄"}
          TextStyle={styles.TextStyle}
          ButtonStyle={styles.TimeSelectionStyle}
          onPress={() => {
            Storage.Clear("PointOfDeparture");
            Storage.Clear("ArrivalPoint");
            Snackbar("記錄已清除", Snackbar.LENGTH_SHORT);
          }}
        />
        <Button
          ButtonIcon={<FeatherIcon name="mail" size={20} color="rgb(255,255,255)" />}
          ButtonText={" 聯絡我們"}
          TextStyle={styles.TextStyle}
          ButtonStyle={styles.TimeSelectionStyle}
          onPress={() => {
            Linking.openURL("https://oblador.github.io/react-native-vector-icons/");
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
    justifyContent: "flex-start",
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
    width: "100%",
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgb(255,255,255)",
    backgroundColor: "rgb(40,44,52)"
  }
});
