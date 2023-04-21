import React, { Component, PureComponent } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import Constant from '../util/constatnt_variables';

import WebServiceManager from '../util/webservice_manager';
import EmptyListView from '../util/empty_list_view';
import CircleIcon from 'react-native-vector-icons/FontAwesome';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons'

import { template } from "../styles/template/page_style";
import { styles } from '../styles/notification';
import Session from '../util/session';

export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.contents=[];
        this.userID=Session.getUserID()

        this.state = {
            notiContents: [],
            allNotiesButton: true, // 전체알림선택 여부
            unReadNotiesButton: false, // 미확인알림 선택 여부

            isRefresh:false,
            emptyListViewVisible:1,
        }
    }

    componentDidMount(){
        this.goGetNoties();
    }

    goGetNoties=()=>{
            this.callGetNotiesAPI().then((response) => {
                console.log('noti data',response);
                this.contents=response;
                this.setState({notiContents:this.dataFiltering()},()=>{this.handleEmptyListView()});
            });
    }

    handleEmptyListView=()=>{
        if(this.state.notiContents.length==0){
            this.setState({emptyListViewVisible:0});
        }
        else{
            this.setState({emptyListViewVisible:1});
        }
    }

    //사용자 id값에 해당하는 모든 알림 받아오기 API
    async callGetNotiesAPI() { //로그인 된 id값으로 모든알림정보 가져오는 API
        let manager = new WebServiceManager(Constant.serviceURL + "/GetNoties?id=" + this.userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }    

    //noti리스트에서 삭제하는 API
    async callRemoveNotiAPI(id) {
        let manager = new WebServiceManager(Constant.serviceURL + "/RemoveNoti?id=" + id);
        let response = await manager.start();
        if(response.ok)
            return response.json();
        else    
            Promise.reject(response); 
    }

    //전체 알림 리스트 
    allNotiesClicked = () => {
        this.setState({allNotiesButton:true,unReadNotiesButton:false},()=>{this.setState({notiContents:this.dataFiltering()},()=>{this.handleEmptyListView()})});
    }

    //읽지 않은 알림 리스트
    unReadNotiesClicked = () => {
        this.setState({allNotiesButton:false,unReadNotiesButton:true},()=>{this.setState({notiContents:this.dataFiltering()},()=>{this.handleEmptyListView()})});
    }

    //필터링(reading=0 or reading=1, 읽지 않은 알람과 읽은 알람)
    dataFiltering() {
        let filteredContents = this.contents;
        if(this.state.unReadNotiesButton==true) {
            filteredContents = filteredContents.filter((content) => {
                if(content.reading==0)
                    return true;
            });
        }          
        return filteredContents;
    }

    //리스트의 항목에서 삭제 버튼 클릭시
    deleteItemListener(id) {
        console.log('delete ',id)
        this.callRemoveNotiAPI(id).then((response)=> {
            if(response.success==1) {
                let filteredContents = this.contents;
                filteredContents = filteredContents.filter((content)=> {
                    if(content.id!=id)
                        return true;
                });
                console.log('delete api ',response);
                this.contents=filteredContents;
                this.setState({notiContents:this.dataFiltering()});
            }
        });        
    }

    render() {
        return (
            <View style={template.baseContainer}>
                <View style={[template.container,{marginTop:15}]}>
                    <View style={styles.productTop_view}>
                        <View style={{ borderBottomWidth: this.state.allNotiesButton ? 1 : 0, width: "50%", alignItems: 'center'}}>
                            <TouchableOpacity onPress={this.allNotiesClicked}><Text style={[styles.slidertext, { color: this.state.allNotiesButton ? "#EE636A" : "black" }]}>전체알림</Text></TouchableOpacity>
                        </View>
                        <View style={{ borderBottomWidth: this.state.unReadNotiesButton ? 1 : 0, width: "50%", alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.unReadNotiesClicked}><Text style={[styles.slidertext, { color: this.state.unReadNotiesButton ? "#EE636A" : "black" }]}>미확인알림</Text></TouchableOpacity>
                        </View>
                    </View>
                    {this.state.emptyListViewVisible == 1 && (<FlatList
                        data={this.state.notiContents}
                        renderItem={({ item, index }) => <ItemList navigation={this.props.navigation} item={item} refreshListener={this.goGetNoties} deleteItemListener={(id)=>this.deleteItemListener(id)}/>}
                        refreshing={this.state.isRefresh}
                        onRefresh={this.goGetNoties}
                        scrollEventThrottle={16}
                    />)}
                    {this.state.emptyListViewVisible == 0 && (<EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetNoties} />)}
                </View>
            </View>
        );
    }
}
//리스트에 표시된 각 항목 클래스
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

    //항목 선택시 어디로 가는지... 구매 또는 판매에 따라...
    itemClicked=()=>{
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
        //판매 알람일 경우 이미 배송정보가 입력되었을 경우이므로...?????
        else if(kind=='sell'){
            this.callGetSellDetailAPI(orderID).then((response)=>{
                if(response.status==1){
                    this.props.refreshListener();
                    this.props.navigation.navigate('AddDelivery', {id:orderID,navigation:this.props.navigation});
                }
                else{
                    this.props.refreshListener();
                    this.props.navigation.navigate('SalesList', {saleState:2})
                }
            })
        }
    }

    //삭제 버튼 클릭시 상위 클래스의 listener호출
    deleteButtonClicked=()=> {
        this.props.deleteItemListener(this.props.item.id);
    }

    render() {
        const { body, todate, kind, reading } = this.props.item;
        return (
            <>
                <TouchableOpacity onPress={()=>this.itemClicked()}>
                    <View style={styles.product}>
                        <View style={[styles.listItem_view,{flex:1}]}>
                            <View style={[styles.circleIcon_view]}>
                                {/* buy, sell 판별하여 text 표시 */}
                                <View style={styles.itemkind_view}>
                                    <Text style={styles.itemkind_text}>{kind == 'buy' ? '구매' : '판매'}</Text>
                                </View>
                            </View>
                            <View style={styles.itemDetail_view}>
                                <Text style={styles.itemDetail_text}>
                                    <Text style={{ fontSize: 12 }}>{todate}</Text>
                                    {/* 읽었는지 읽지 않았는지 판별하여 text 표시 */}
                                    <Text style={{ color: 'red',fontSize:12 }}>{reading == 0 ? '  new' : null}</Text>
                                </Text>
                                <Text style={{ color: 'black' }}>{body}</Text>
                            </View>
                            <View style={{ position: 'absolute',marginLeft:"95%" }}>
                                <TouchableOpacity onPress={this.deleteButtonClicked}>
                                    <DeleteIcon name="close" size={18} color="#0066FF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        );
    }
}