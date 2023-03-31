import React, { Component, PureComponent } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity,RefreshControl } from 'react-native';

import Constant from '../util/constatnt_variables';

import WebServiceManager from '../util/webservice_manager';
import EmptyListView from '../util/empty_list_view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SellIcon from 'react-native-vector-icons/Feather';
import BuyIcon from 'react-native-vector-icons/FontAwesome';
import CircleIcon from 'react-native-vector-icons/FontAwesome';
import { template } from "../styles/template/page_style";
import { styles } from '../styles/notice';

export default class Notice extends Component {
    constructor(props) {
        super(props);
        this.contents=[];

        this.state = {
            notiContents: [],
            allNotiesButton: true, // 전체알림선택 여부
            unReadNotiesButton: false, // 미확인알림 선택 여부

            isRefresh:false,
            viewVisible:1,
        }
    }

    componentDidMount(){
        this.goGetNoties();
    }

    goGetNoties=()=>{
        this.getUserID().then((value) => {
            this.callGetNotiesAPI(value).then((response) => {
                console.log('noti data',response);
                this.contents=response;
                this.setState({notiContents:this.dataFiltering()},()=>{this.handleEmptyListView()});
            });
        })
    }

    handleEmptyListView=()=>{
        if(this.state.notiContents.length==0){
            this.setState({viewVisible:0});
        }
        else{
            this.setState({viewVisible:1});
        }
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

    //사용자 id값에 해당하는 모든 알림 받아오기
    async callGetNotiesAPI(userID) { //로그인 된 id값으로 모든알림정보 가져오는 API
        let manager = new WebServiceManager(Constant.serviceURL + "/GetNoties?id=" + userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }    

    //전체 알림
    allNotiesClicked = () => {
        this.setState({allNotiesButton:true,unReadNotiesButton:false},()=>{this.setState({notiContents:this.dataFiltering()},()=>{this.handleEmptyListView()})});
    }

    //읽지 않은 알림
    unReadNotiesClicked = () => {
        this.setState({allNotiesButton:false,unReadNotiesButton:true},()=>{this.setState({notiContents:this.dataFiltering()},()=>{this.handleEmptyListView()})});
    }

    //필터링(reading=0 or reading=1, 읽지 않은 알람과 읽은 알람)
    dataFiltering() {
        console.log('data filtering start');
        let filteredContents = this.contents;
        if(this.state.unReadNotiesButton==true) {
            filteredContents = filteredContents.filter((content) => {
                if(content.reading==0)
                    return true;
            });
        }          
        console.log('filtered contents',filteredContents);
        return filteredContents;
    }

    render() {
        return (
            <View style={template.total_container}>
                <View style={[template.container,{marginTop:15,marginLeft:10,marginRight:10}]}>
                    <View style={{ flexDirection: 'row', width: "100%", marginBottom:10 }}>
                        <View style={{ borderBottomWidth: this.state.allNotiesButton ? 1 : 0, width: "50%", alignItems: 'center'}}>
                            <TouchableOpacity onPress={this.allNotiesClicked}><Text style={[styles.slidertext, { color: this.state.allNotiesButton ? "#EE636A" : "black" }]}>전체알림</Text></TouchableOpacity>
                        </View>
                        <View style={{ borderBottomWidth: this.state.unReadNotiesButton ? 1 : 0, width: "50%", alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.unReadNotiesClicked}><Text style={[styles.slidertext, { color: this.state.unReadNotiesButton ? "#EE636A" : "black" }]}>미확인알림</Text></TouchableOpacity>
                        </View>
                    </View>
                    {this.state.viewVisible == 1 && (<FlatList
                        data={this.state.notiContents}
                        renderItem={({ item, index }) => <ItemList navigation={this.props.navigation} item={item} refreshListener={this.goGetNoties} />}
                        refreshing={this.state.isRefresh}
                        onRefresh={this.goGetNoties}
                        scrollEventThrottle={16}
                    />)}
                    {this.state.viewVisible == 0 && (<EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetNoties} />)}
                </View>
            </View>
        );
    }
}
class ItemList extends PureComponent {
    constructor(props) {
        super(props);
    }

    async callSetReadNotiAPI(id) {
        let manager = new WebServiceManager(Constant.serviceURL +"/SetReadNoti?id="+id);
        let response = await manager.start();
        if(response.ok)
            return response.json();
    }
    async callGetSellDetailAPI(orderID) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetSellDetail?id=" + orderID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }
    goListClicked=()=>{
        const {id, orderID, kind, reading} = this.props.item;
        console.log('orderID',orderID)
        if(reading==0){
            this.callSetReadNotiAPI(id).then((response)=>{
                //console.log('success',response);
            })
        }

        if(kind=='buy'){
            this.props.refreshListener();
            this.props.navigation.navigate('BuyList');
        }
        else if(kind=='sell'){
            this.callGetSellDetailAPI(orderID).then((response)=>{
                if(response.status==1){
                    this.props.refreshListener();
                    this.props.navigation.navigate('AddDelivery', {id:orderID,navigation:this.props.navigation});
                }
                else{
                    this.props.refreshListener();
                    this.props.navigation.navigate('SalesList')
                }
            })
        }
    }

    render() {
        const { body, todate, kind, reading } = this.props.item;
       
        return (
            <>
                <TouchableOpacity onPress={()=>this.goListClicked()}>
                    <View style={styles.product}>
                        <View style={{flexDirection:'row',width:"100%"}}>
                            <View style={{flex:2,alignItems:'center',justifyContent:'center',marginLeft:7}}>
                                {/*<SellIcon name={this.iconNameValue(kind)} size={40} color="#0066FF" style={{alignItems:'center',justifyContent:'center'}} />*/}                              
                                <CircleIcon name="circle-thin" size={60} color="#0066FF" style={{position:'absolute',paddingTop:10}} />
                                {/* buy, sell 판별하여 text 표시 */}
                                <Text style={{ color: "#0066FF", paddingTop: 10, fontWeight: 'bold', fontSize: 16 }}>{kind=='buy' ? '구매':'판매'}</Text>           
                            </View>
                            <View style={{flex:8,paddingTop:5,paddingLeft:10}}>
                                <Text style={{fontSize:15,fontWeight:'bold', color:'black'}}>
                                    <Text style={{fontSize:12}}>{todate}</Text>
                                    {/* 읽었는지 읽지 않았는지 판별하여 text 표시 */}
                                    <Text style={{color:'red'}}>{reading==0 ? '  new':null}</Text>
                                </Text>
                                <Text style={{color:'black'}}>{body}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        );
    }
}