import React, { Component, PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, } from 'react-native';

import { styles } from "../../../styles/list/home1";

import Constant from '../../../util/constatnt_variables';
import WebServiceManager from '../../../util/webservice_manager';
import FunctionUtil from '../../../util/libraries_function';

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

    goGoodsDetailScreen = () => {
        this.props.navigation.push('GoodsDetail', { goodsID: this.item.id, sellerID: this.item.userID, distance:this.item.distance, refresh: this.props.refreshListener });
    }

    render() {
        const item = this.props.item;
        return (
            <>
                <TouchableOpacity onPress={this.goGoodsDetailScreen}>
                    <View style={styles.listItem_view}>
                        <View style={styles.productImage_view}>
                            <Image
                                source={{ uri: this.state.imageURI }}
                                style={styles.product_image} />
                        </View>
                        <View style={styles.productInfo_view}>
                            <View style={[styles.productInfoDetail_view]}>
                                <Text style={styles.itemName_text}>{item.name}</Text>
                                <Text style={styles.itemDetail_text}>{item.number}</Text>
                            </View>
                            <View style={[styles.productInfoDetail_view,{justifyContent:'center'}]}>
                                <Text style={[styles.itemDetail_text, { color: '#EE636A' }]}>{item.distance}km</Text>
                                <Text style={styles.itemName_text}>{FunctionUtil.getPrice(item.price)}{"원"}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        );
    }
}