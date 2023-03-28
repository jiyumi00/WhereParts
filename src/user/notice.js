import React, { Component, PureComponent } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';


import Constant from '../util/constatnt_variables';
import WebServiceManager from '../util/webservice_manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SellIcon from 'react-native-vector-icons/Feather';
import BuyIcon from 'react-native-vector-icons/FontAwesome';
import CircleIcon from 'react-native-vector-icons/FontAwesome';
import { template } from "../styles/template/page_style";
import { styles } from '../styles/notice';

export default class Notice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allNotiesInfo: [],
            //unNotiesInfo: [],
            allNotiesBarClicked: true, // 전체알림
            unNotiesBarClicked: false, // 미확인알림

            listRefresh:false,

        }
    }

    componentDidMount(){
        this.getUserID().then((value) => {
            this.callGetNotiesAPI(value).then((response) => {
                this.setState({ allNotiesInfo: response });
                //console.log(this.state.allNotiesInfo);
            })
        })
    }

    async callGetNotiesAPI(userID) { //로그인 된 id값으로 알림정보 가져오는 API
        let manager = new WebServiceManager(Constant.serviceURL + "/GetNoties?id=" + userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
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

    goAllNotiesListRefresh=()=>{
        this.getUserID().then((value) => {
            this.callGetNotiesAPI(value).then((response) => {
                this.setState({ allNotiesInfo: response },console.log("refreshCompolete"));
            })
        })
    }
    goUnNotiesListRefresh=()=>{
        this.getUserID().then((value) => {
            this.callGetNotiesAPI(value).then((response) => {
                this.setState({ allNotiesInfo: response },console.log("refreshCompolete1"));
            })
        })
    }

    allNotiesBarClicked = () => {
        this.setState({ allNotiesBarClicked: true, unNotiesBarClicked: false });
    }

    unNotiesBarClicked = () => {
        this.setState({ allNotiesBarClicked: false, unNotiesBarClicked: true });
    }

    render() {
        return (
            <View style={template.total_container}>
                <View style={[template.container,{marginTop:15}]}>
                    <View style={{ flexDirection: 'row', width: "100%", marginBottom:10 }}>
                        <View style={{ borderBottomWidth: this.state.allNotiesBarClicked ? 1 : 0, width: "50%", alignItems: 'center'}}>
                            <TouchableOpacity onPress={this.allNotiesBarClicked}><Text style={[styles.slidertext, { color: this.state.allNotiesBarClicked ? "#EE636A" : "black" }]}>전체알림</Text></TouchableOpacity>
                        </View>
                        <View style={{ borderBottomWidth: this.state.unNotiesBarClicked ? 1 : 0, width: "50%", alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.unNotiesBarClicked}><Text style={[styles.slidertext, { color: this.state.unNotiesBarClicked ? "#EE636A" : "black" }]}>미확인알림</Text></TouchableOpacity>
                        </View>
                    </View>
                    {this.state.allNotiesBarClicked == true && (<FlatList
                        data={this.state.allNotiesInfo}
                        renderItem={({ item, index }) => <AllNotiesList navigation={this.props.navigation} item={item} id={item.orderID} />}
                        refreshing={this.state.listRefresh}
                        onRefresh={this.goAllNotiesListRefresh}
                        scrollEventThrottle={16}
                    />)}
                    {this.state.unNotiesBarClicked == true && (<FlatList
                        data={this.state.allNotiesInfo}
                        renderItem={({ item, index }) => <UnNotiesList navigation={this.props.navigation} item={item} id={item.orderID} />}
                        refreshing={this.state.listRefresh}
                        onRefresh={this.goUnNotiesListRefresh}
                        scrollEventThrottle={16}
                    />)}
                </View>
            </View>
        );
    }
}

class AllNotiesList extends PureComponent {
    constructor(props) {
        super(props);
    }

    goListClicked=(value)=>{
        if(value.kind=='buy'){
            this.props.navigation.navigate('BuyList');
        }
        if(value.kind=='sell'){
            this.props.navigation.navigate('AddDelivery', {id:value.orderID,navigation:this.props.navigation});
        }
    }

    iconNameValue=(kind)=>{
        let icon='';
        if(kind=='buy'){
            icon="shopping-bag";
        }
        if(kind=='sell'){
            icon="file-text";
        }
        return icon
    }

    render() {
        const item = this.props.item;
        return (
            <>
                <TouchableOpacity onPress={()=>this.goListClicked(item)}>
                    <View style={styles.product}>
                        <View style={{flexDirection:'row',width:"100%"}}>
                            <View style={{flex:2,alignItems:'center',justifyContent:'center',marginLeft:7}}>
                                <SellIcon name={this.iconNameValue(item.kind)} size={40} color="#0066FF" style={{alignItems:'center',justifyContent:'center'}} />
                            </View>
                            <View style={{flex:8,paddingTop:10,paddingLeft:10}}>
                                <Text style={{fontSize:15,fontWeight:'bold', color:'black'}}>{item.title}<Text style={{color:'red'}}>{"   new"}</Text></Text>
                                <Text style={{color:'black'}}>{item.body}</Text>
                                <View style={{alignItems:'flex-end'}}>
                                    <Text style={{paddingRight:10,fontSize:12}}>{item.todate}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        );
    }
}

class UnNotiesList extends PureComponent {
    constructor(props) {
        super(props);
    }

    goListClicked=(value)=>{
        if(value.kind=='buy'){
            this.props.navigation.navigate('BuyList');
        }
        if(value.kind=='sell'){
            this.props.navigation.navigate('AddDelivery', {id:value.orderID,navigation:this.props.navigation});
        }
    }

    iconNameValue=(kind)=>{
        let icon='';
        if(kind=='buy'){
            icon="shopping-bag";
        }
        if(kind=='sell'){
            icon="file-text";
        }
        return icon
    }

    render() {
        const item = this.props.item;
        return (
            <>
                <TouchableOpacity onPress={()=>this.goListClicked(item)}>
                    <View style={styles.product}>
                        <View style={{flexDirection:'row',width:"100%"}}>
                            <View style={{flex:2,alignItems:'center',justifyContent:'center',marginLeft:7}}>
                                <SellIcon name={this.iconNameValue(item.kind)} size={40} color="#0066FF" style={{alignItems:'center',justifyContent:'center'}} />
                            </View>
                            <View style={{flex:8,paddingTop:10,paddingLeft:10}}>
                                <Text style={{fontSize:15,fontWeight:'bold', color:'black'}}>{item.title}<Text style={{color:'red'}}>{"   new"}</Text></Text>
                                <Text style={{color:'black'}}>{item.body}</Text>
                                <View style={{alignItems:'flex-end'}}>
                                    <Text style={{paddingRight:10,fontSize:12}}>{item.todate}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        );
    }
}