import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, Image, Alert,BackHandler } from 'react-native';

import { template } from "../../styles/template/page_style";
import { styles } from "../../styles/buylist";
import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';

import Session from '../../util/session';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default class BuyList extends Component {
    constructor(props) {
        super(props);

        this.userID=0;
        this.state = {
            buyContents: [],
            isRefresh: false,
            emptyListViewVisible:1,
        }
    }

    componentDidMount() {
        if(Session.isLoggedin()){
            this.userID = Session.getValue('id');
            this.goGetGoods();
        }
        else 
            this.props.navigation.navigate('Login',{nextPage:'BuyList'});
        BackHandler.addEventListener("hardwareBackPress", this.backPressed);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }

    backPressed = () => {
        this.props.navigation.navigate('TabHome',{initialTabMenu:'MyPage'});
        return true;
    }

    goGetGoods = () => {
        this.callGetGoodsAPI().then((response) => {
            this.setState({ buyContents: response }, () => { this.handleEmptyListView() })
        });
    }

    handleEmptyListView=()=>{
        if(this.state.buyContents.length==0){
            this.setState({emptyListViewVisible:0});
        }
        else{
            this.setState({emptyListViewVisible:1});
        }
    }

    //등록된 상품 리스트 API
    async callGetGoodsAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetOrders?id=" + this.userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }

    render() {
       
        return (
            <View style={{ flex: 1, marginBottom: 10, }}>
                {this.state.emptyListViewVisible==1 && (<FlatList
                    data={this.state.buyContents}
                    renderItem={({ item, index }) => <ListItem index={index} item={item} goodsID={item.goodsID} id={item.id} navigation={this.props.navigation} refresh={this.goGetGoods} />}
                    refreshing={this.state.isRefresh}
                    onRefresh={this.goGetGoods}
                    scrollEventThrottle={16}
                />)}
                {this.state.emptyListViewVisible == 0 && (<EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetGoods} />)}
            </View>
        );
    }
}

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            imageURI: null,
            isDetailViewModal: false,
        };
    }

    componentDidMount() {

        this.callGetImageAPI().then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response); //blob을 읽어줌 읽은 놈이 reader
            reader.onloadend = () => {
                this.setState({ imageURI: reader.result }) //base64를 imageURI에 집어넣어준다

            } //끝까지 다 읽었으면 
        });
    }
    async callGetImageAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.goodsID + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }
    goDeliveryDetailScreen = () => {
        //임시 배송조회 가능(송장번호와 택배사는 이미 존재함)
        const logisInfo = { code: "04", invoice: "651969374875" };
        this.props.navigation.navigate('DeliveryDetail', { logisInfo: logisInfo });
    }
    goOrderDetailScreen = () => {
        this.props.navigation.navigate('OrderDetail', { id: this.props.id })
    }


    orderCompleteButtonClick = () => {
        Alert.alert(
            '',
            '구매확정하신 뒤에는 반품/교환 신청하실 수 없습니다',
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: '확인', onPress: () =>

                        this.callSetOrderCompleteAPI().then(() => {
                            console.log('state상태', this.props.item.status)
                            this.props.refresh();
                        })
                },
            ],
            { cancelable: false });
    }
    async callSetOrderCompleteAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/SetOrderComplete?id=" + this.props.id);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }
    handleDetailViewModal = () => {
        this.props.navigation.navigate('GoodsDetail', { id: this.props.goodsID, userID: this.props.item.userID });
    }
    goodsStatusText = (value) => {
        let goodsStatusText = ["배송준비중", "배송중", "배송완료"];
        return goodsStatusText[value - 1];
    }
    render() {
        const item = this.props.item;
        return (
            <>


                <View style={styles.itemView}>
                    <TouchableOpacity onPress={this.handleDetailViewModal}>
                        <View style={styles.dateView}>
                            <Text>주문일  </Text><Text style={styles.itemRegisterDateText}>{item.orderingDate.slice(2, 10)}</Text>
                        </View>
                        <View style={styles.productView}>
                            <View style={styles.productImageView}>

                                <Image
                                    source={{ uri: this.state.imageURI }}
                                    style={styles.productImage} />
                            </View>
                            <View style={styles.productInfo}>
                                <View style={styles.productInfoLeft}>

                                    <Text style={styles.itemNameText}>{item.goodsName}</Text>
                                    <Text style={styles.itemPriceText}>{item.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{"원"} <Text style={styles.text}> / {item.quantity}개 </Text></Text>
                                    <Text style={styles.itemNumberText}>{item.goodsNo}</Text>

                                </View>
                                <View style={styles.productInfoRight}>
                                    <View style={styles.productDistance}>
                                        <Text style={styles.itemDistanceText}>{this.goodsStatusText(item.status)}</Text>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.productButtonView}>
                        <View style={[styles.payInfoButtonView, { borderColor: 'blue' }]}>
                            <TouchableOpacity onPress={this.goOrderDetailScreen}><Text style={{ color: 'blue' }}>주문상세</Text></TouchableOpacity>
                        </View>
                        {item.status != 1 &&
                            <View style={[styles.payInfoButtonView, { borderColor: 'blue' }]}>
                                <TouchableOpacity onPress={this.goDeliveryDetailScreen}><Text style={{ color: 'blue' }}>배송조회</Text></TouchableOpacity>
                            </View>}
                        {item.status == 1 &&
                            <View style={styles.payInfoButtonView}>
                                <TouchableOpacity><Text >배송조회</Text></TouchableOpacity>
                            </View>}
                        {item.status == 2 &&
                            <View style={[styles.payInfoButtonView, { borderColor: 'blue' }]}>
                                <TouchableOpacity onPress={this.orderCompleteButtonClick}><Text style={{ color: 'blue' }}>구매확정</Text></TouchableOpacity>
                            </View>}
                        {item.status != 2 &&
                            <View style={styles.payInfoButtonView}>
                                <TouchableOpacity ><Text>구매확정</Text></TouchableOpacity>
                            </View>}
                    </View>
                </View>


            </>
        );
    }
}