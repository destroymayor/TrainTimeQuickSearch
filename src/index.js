import React, { Component } from "react";
import { Platform } from "react-native";

import { StackNavigator, NavigationActions } from "react-navigation";

import HomePage from "./page/HomePage";
import QueryResult from "./page/QueryResults";

const Setup = StackNavigator(
  {
    HomePage: { screen: HomePage },
    QueryResult: { screen: QueryResult }
  },
  {
    initialRouteName: "HomePage",
    navigationOptions: {
      headerStyle: { backgroundColor: "rgb(200,200,200)" },
      headerBackTitle: " ",
      headerTintColor: "rgb(70,74,73)",
      gesturesEnabled: Platform.OS === "ios" ? true : false
    }
  }
);

const navigateOnce = getStateForAction => (action, state) => {
  const { type, routeName } = action;
  return state && type === NavigationActions.NAVIGATE && routeName === state.routes[state.routes.length - 1].routeName
    ? null
    : getStateForAction(action, state);
};

Setup.router.getStateForAction = navigateOnce(Setup.router.getStateForAction);

export default class App extends Component {
  render() {
    return <Setup onNavigationStateChange={null} />;
  }
}
