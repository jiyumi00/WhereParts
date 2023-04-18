import React, { Component , PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity,Dimensions} from 'react-native';

import { styles } from "../../styles/buy/picklist_1";

import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';
import FunctionUtil from '../../util/libraries_function';

import MapIcon from 'react-native-vector-icons/FontAwesome5';
import MapIcon2 from 'react-native-vector-icons/FontAwesome';

const ScreenHeight=Dimensions.get('window').height;
const ScreenWidth=Dimensions.get('window').width;

export default class ListItem extends PureComponent {
    constructor(props) {
        super(props);

        this.item = this.props.item;
        this.state = {
            imageURI: null,
            isDetailViewModal: false,
        };
    }

    componentDidMount() {
        this.callGetGoodsImageAPI().then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response); //blob을 읽어줌 읽은 놈이 reader
            reader.onloadend = () => {
                this.setState({ imageURI: reader.result }) //base64를 imageURI에 집어넣어준다

            } //끝까지 다 읽었으면 
        });
    }
    async callGetGoodsImageAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.item.id + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    goGoodsDetailScreen=()=> {
        this.props.navigation.push('GoodsDetail',{goodsID:this.item.id, sellerID:this.item.userID, distance:this.item.distance, refresh:this.props.refreshListener});
    }

    //부품번호에 대한 Goodle 검색창 보이기(Web View)
    goGoodsNumberWebView = () => {
        this.props.navigation.navigate('GoogleWebView', { url: 'http://www.google.com/search?q=' + this.item.number });
    }

    render() {
        const item = this.props.item;
        return (       
            <TouchableOpacity onPress={this.goGoodsDetailScreen}>
                <View style={styles.item_view}>
                    <View style={styles.listTop_view}>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text style={styles.itemName_text}>{item.name.length > 15 ? `${item.name.slice(0, 15)}...` : item.name}</Text>
                        </View>
                    </View>

                    <View style={styles.listBottom_view}>
                        <View style={styles.productImage_view}>
                            <Image
                                source={{ uri: this.state.imageURI }}
                                style={styles.productImage} />
                        </View>
                        <View style={styles.productInfoRight_view}>
                            <Text style={styles.itemPrice_text}>{FunctionUtil.getPrice(item.price)}{"원"}</Text>
                            <TouchableOpacity onPress={this.goGoodsNumberWebView}>
                                <Text style={styles.itemNumber_text}>{item.number.length > 13 ? `${item.number.slice(0, 13)}...` : item.number}</Text>
                            </TouchableOpacity>
                            <Text style={styles.itemDistance_text}><MapIcon name='map-marker-alt' color='#FF7566' size={11}></MapIcon> {item.distance}km</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}