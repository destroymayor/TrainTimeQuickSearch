import React, { Component } from "react";
import { TextInput, Platform, StatusBar, StyleSheet, Text, View } from "react-native";

import Icon from "react-native-vector-icons/Feather";
import Button from "../util/Button";

export default class OnlineTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IdText: "",
      TicketsNumber: ""
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log(params);
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" ? <StatusBar barStyle="light-content" /> : null}
        <View style={styles.OnlineTicketsList}>
          <Icon name="user" size={20} color="rgb(255,255,255)" />
          <Text style={styles.TextStyle}>身分證字號</Text>
          <TextInput style={styles.TextInputStyle} onChangeText={IdText => this.setState({ IdText })} value={this.state.IdText} />
        </View>
        <View style={styles.OnlineTicketsList}>
          <Icon name="edit-2" size={20} color="rgb(255,255,255)" />
          <Text style={styles.TextStyle}>訂票張數</Text>
          <TextInput
            style={styles.TextInputStyle}
            onChangeText={TicketsNumber => this.setState({ TicketsNumber })}
            value={this.state.TicketsNumber}
          />
        </View>
        <View style={[styles.OnlineTicketsList, { justifyContent: "flex-end" }]}>
          <Button
            ButtonText={"下一步"}
            TextStyle={[styles.TextStyle, { fontSize: 20 }]}
            ButtonStyle={styles.OnlineTicketsBtnStyle}
            onPress={() => {}}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(40,44,52)"
  },
  OnlineTicketsList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  TextInputStyle: {
    width: "50%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1
  },
  OnlineTicketsBtnStyle: {
    width: "50%",
    height: 40,
    marginTop: 10,
    borderRadius: 35,
    backgroundColor: "rgb(57,152,137)",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowColor: "rgb(57,152,137)",
    shadowOffset: { height: 1, width: 1 }
  },
  TextStyle: {
    fontSize: 20,
    color: "rgb(255,255,255)"
  }
});
