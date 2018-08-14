import React, { Component } from "react";

import { createStackNavigator, createBottomTabNavigator } from "react-navigation";

import Icon from "react-native-vector-icons/Feather";

import HomePage from "./page/HomePage";
import QueryResult from "./page/QueryResults";
import LiveBoardStation from "./page/LiveBoardStation";
import AboutUs from "./page/AboutUs";

const Index = createBottomTabNavigator(
  {
    查詢: { screen: HomePage },
    關於: { screen: AboutUs }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "查詢") {
          iconName = "clock";
        } else if (routeName === "訂票") {
          iconName = "shopping-cart";
        } else if (routeName === "關於") {
          iconName = "help-circle";
        }

        return <Icon name={iconName} size={20} color={tintColor} />;
      }
    }),
    tabBarPosition: "bottom",
    swipeEnabled: true,
    animationEnabled: true,
    scrollEnabled: true,
    backBehavior: "none",
    tabBarOptions: {
      style: { backgroundColor: "rgb(40,44,52)", borderTopWidth: 0 },
      labelStyle: { fontSize: 14 },
      activeTintColor: "rgb(255,255,255)",
      inactiveTintColor: "rgb(101,102,104)"
    }
  }
);

const Setup = createStackNavigator(
  {
    HomePage: { screen: Index, navigationOptions: { header: null } },
    QueryResult: { screen: QueryResult },
    LiveBoardStation: { screen: LiveBoardStation },
    AboutUs: { screen: AboutUs }
  },
  {
    initialRouteName: "HomePage",
    navigationOptions: {
      headerStyle: {
        backgroundColor: "rgb(40,44,52)"
      },
      headerTintColor: "rgb(255,255,255)"
    }
  }
);

export default class App extends Component {
  render() {
    return <Setup onNavigationStateChange={null} />;
  }
}
