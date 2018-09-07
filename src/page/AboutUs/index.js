import React, { Component } from "react";
import { Platform, Linking, StatusBar, StyleSheet, View } from "react-native";

import FeatherIcon from "react-native-vector-icons/Feather";
import { Snackbar } from "react-native-paper";

import Storage from "../../data/Storage/ChooseHistory";
import Button from "../../util/Button";

export default class AboutUS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SnackbarText: "",
      SnackbarVisible: false
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerTintColor: "rgb(255,255,255)",
    headerStyle: {
      backgroundColor: "rgb(40,44,52)"
    }
  });

  clearStorage() {
    Storage.Clear("PointOfDeparture");
    Storage.Clear("ArrivalPoint");
    this.setState(state => ({
      SnackbarVisible: !state.visible,
      SnackbarText: "記錄已清除"
    }));
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
        <Button
          ButtonIcon={<FeatherIcon name="users" size={20} color="rgb(255,255,255)" />}
          ButtonText={" 關於團隊"}
          TextStyle={styles.TextStyle}
          ButtonStyle={styles.TimeSelectionStyle}
          onPress={() => {}}
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
        <Button
          ButtonIcon={<FeatherIcon name="trash-2" size={20} color="rgb(255,255,255)" />}
          ButtonText={" 清理記錄"}
          TextStyle={styles.TextStyle}
          ButtonStyle={styles.TimeSelectionStyle}
          onPress={() => {
            this.clearStorage();
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
