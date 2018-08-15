import React, { Component } from "react";
import { TextInput, Platform, StatusBar, StyleSheet, Text, View } from "react-native";

import Icon from "react-native-vector-icons/Feather";
import Picker from "react-native-picker";

import Button from "../../util/Button";

export default class OnlineTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IdText: "",
      TicketsNumber: 0
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log(params);
  }

  showPickerTickets() {
    Picker.init({
      pickerData: [1, 2, 3, 4, 5, 6],
      pickerConfirmBtnText: "確定",
      pickerCancelBtnText: "取消",
      pickerTitleText: "",
      pickerToolBarFontSize: 18,
      pickerFontSize: 18,
      pickerFontColor: [195, 223, 238, 100],
      pickerConfirmBtnColor: [195, 223, 238, 100],
      pickerCancelBtnColor: [195, 223, 238, 100],
      pickerTitleColor: [40, 44, 52, 5],
      pickerToolBarBg: [40, 44, 52, 5],
      pickerBg: [40, 44, 52, 5],
      onPickerConfirm: data => {
        this.setState({ TicketsNumber: data });
      }
    });
    Picker.show();
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
          <Button
            ButtonText={this.state.TicketsNumber <= 0 ? "選擇張數" : this.state.TicketsNumber + "張"}
            TextStyle={[styles.TextStyle, { fontSize: 20 }]}
            ButtonStyle={[styles.OnlineTicketsBtnStyle, { backgroundColor: "#aaa" }]}
            onPress={() => {
              this.showPickerTickets();
            }}
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
    backgroundColor: "rgb(40,44,52)",
    paddingTop: 20
  },
  OnlineTicketsList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
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
    alignItems: "center"
  },
  TextStyle: {
    fontSize: 20,
    color: "rgb(255,255,255)"
  }
});
