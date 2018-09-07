import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

export default class FavoriteRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = ({ navigation }) => ({});

  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <Text>我的最愛</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgb(40,44,52)"
  }
});
