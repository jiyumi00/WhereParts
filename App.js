import React, { Component } from "react";
import { Alert, AppState } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";

import Stack from "./src/menu/stack_menu";
import Session from "./src/util/session";

//FCM
import messaging from '@react-native-firebase/messaging';
class App extends Component {

  constructor(props) {
    super(props);

    this.state={
      appState: AppState.currentState,
    }
  }

  componentDidMount() {
    this.handleFCMMessage();
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
      }
      if (this.state.appState.match(/active|foreground/) && nextAppState === 'background') {
        console.log('App has go to the background');
      }
      this.setState({ appState: nextAppState });
    });
  }

  componentWillUnmount() {
    this.appStateSubscription.remove();
  }

  handleFCMMessage() {
    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('백그라운드 상태에서 메시지가 왔습니다.', remoteMessage);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('앱이 완전히 메모리에서 제거된 상태에서 알림이 왔습니다.', remoteMessage);
        //setInitialRoute(remoteMessage.data.type); // e.g. "Settings
        if (remoteMessage.data.kind == "buy") {
          let pageInfo = { prevPage: "MyPage", nextPage: "BuyList" }
          Session.setPageInfoItem(pageInfo);
        }
        else if (remoteMessage.data.kind == "sell") {
          pageInfo = { prevPage: "MyPage", nextPage: "SalesList" }
          Session.setPageInfoItem(pageInfo);
        }
      }
    });
  }

  render() {
    return (

      <NavigationContainer>
        <Stack />
      </NavigationContainer>

    );
  }
}

export default App;