import React, { Component } from "react";
import { Text, TouchableOpacity } from "react-native";

export default class Button extends Component {
  render() {
    const { ButtonStyle, ButtonText, ButtonIcon, TextStyle, onPress } = this.props;
    return (
      <TouchableOpacity style={ButtonStyle} onPress={onPress}>
        <Text style={TextStyle}>
          {ButtonIcon}
          {ButtonText}
        </Text>
      </TouchableOpacity>
    );
  }
}
