import React, {Component} from 'react';
import {Dimensions, Image, Platform, Pressable, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constant from '../util/constatnt_variables';
import WebServiceManager from '../util/webservice_manager';
// 경로를 위한 import
import Home from '../goods/list/components/home';
import AddGoods from '../goods/register/components/add_goods';
import MyPage from '../user/mypage';
import ShopHistory from '../user/shophistory'; //
import Notification from '../user/notification';

const Tab = createBottomTabNavigator(); // Tab 일 경우

const styles = StyleSheet.create({
  addGoods: {
    width: Dimensions.get('screen').width / 5.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
        notiesCount: null,

    }
}
  componentDidMount(){
    this.goGetNoties();
  }
  goGetNoties=()=>{
    this.getUserID().then((value) => {
        this.callGetNotiesAPI(value).then((response) => {
            this.setState({notiesCount:response.length});
        });
    })
  }
  async getUserID() {
    let obj = await AsyncStorage.getItem('obj')
    let parsed = JSON.parse(obj);
    if (obj !== null) {
        return parsed.id;
    }
    else {
        return false;
    }
  }

  //사용자 id값에 해당하는 모든 알림 받아오기 API
  async callGetNotiesAPI(userID) { //로그인 된 id값으로 모든알림정보 가져오는 API
    let manager = new WebServiceManager(Constant.serviceURL + "/GetNoties?id=" + userID);
    let response = await manager.start();
    if (response.ok)
        return response.json();
    else
        Promise.reject(response);
  }    

  render() {
    console.log('notiCount',this.state.notiesCount)
    return (
      <Tab.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerShown: true,
          tabBarActiveTintColor: '#0066FF',
          tabBarInactiveTintColor: '#BCBFC4',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            color: '#1e272e',
          },
          tabBarLabelStyle: {
            marginTop: -6,
            fontSize: 11,
            fontFamily: 'Pretendard-Regular',
          },
          tabBarItemStyle: {
            padding: 2,
          },
          tabBarActiveBackgroundColor: '#F2F2F2',
          unmountOnBlur: Platform.OS === 'android' ? true : false,
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            title: '홈',
            headerShown: false,
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../images/tab/home-icon/home-icon-active.png')
                      : require('../images/tab/home-icon/home-icon.png')
                  }
                />
              );
            },
          }}
        />
        {/*}
        <Tab.Screen
          name="ShopHistory"
          component={ShopHistory} // TODO 변경해줘야함
          options={{
            title: '쇼핑 내역',
            //headerShown: false,
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../images/tab/shop-history-icon/shop-history-icon-active.png')
                      : require('../images/tab/shop-history-icon/shop-history-icon.png')
                  }
                />
              );
            },
          }}
        />*/}
        <Tab.Screen
          name="MyPage"
          component={MyPage}
          options={{
            title: '내 정보',
            headerShown:false,
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../images/tab/my-page-icon/my-page-icon-active.png')
                      : require('../images/tab/my-page-icon/my-page-icon.png')
                  }
                />
              );
            },
          }}
        />
       
        <Tab.Screen
          name="Notice"
          component={Notification} // 변경해야됨
          options={{
            tabBarBadge:null,
            title: '알림',
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../images/tab/service-icon/service-icon-active.png')
                      : require('../images/tab/service-icon/service-icon.png')
                  }
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="AddGoods"
          component={AddGoods}
          initialParams={{imageURLs: []}}
          options={{
            title: '상품 등록',
            tabBarButton: props => {
              return (
                <Pressable {...props} style={styles.addGoods}>
                  <Image
                    source={require('../images/tab/add-goods-icon/add-goods-icon.png')}
                  />
                </Pressable>
              );
            },
            tabBarHideOnKeyboard:true,
          }}
        />
      </Tab.Navigator>
    );
  }
}
export default Tabs;
