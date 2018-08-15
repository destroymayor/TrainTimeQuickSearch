import React, { Component } from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";

import Icon from "react-native-vector-icons/Feather";

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
    color: "rgb(255,255,255)"
  }
});
