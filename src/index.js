import React, { Component } from "react";

import { createStackNavigator } from "react-navigation";

import HomePage from "./page/HomePage";
import QueryResult from "./page/QueryResults";

const Setup = createStackNavigator({
  HomePage: { screen: HomePage },
  QueryResult: { screen: QueryResult }
});

export default class App extends Component {
  render() {
    return <Setup onNavigationStateChange={null} />;
  }
}
