import React, { Component } from 'react';
import {
    Button, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback,
    Image, ImageBackground, Modal, Alert, BackHandler, NativeModules, Keyboard
} from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "../../../styles/register/addgoods";
import { template } from "../../../styles/template/page_style";

import IconCamera from 'react-native-vector-icons/Feather';
import IconMark from 'react-native-vector-icons/AntDesign';
import IconDelete from 'react-native-vector-icons/Ionicons';
import IconRadio from 'react-native-vector-icons/MaterialIcons';
import IconPopup from 'react-native-vector-icons/EvilIcons';
import IconQuantity from 'react-native-vector-icons/Feather';

import { Picker } from '@react-native-picker/picker';
import Constant from "../../../util/constatnt_variables";
import WebServiceManager from "../../../util/webservice_manager";
import GalleryX from '../../../util/gallery_x';
import { parse } from '@babel/core';
import { Dark_Gray, Light_Gray, Line_Color, Main_Color, Mark_Color, Sub_Color } from '../../../util/color';


class AddGoods extends Component {

    constructor(props) {
        super(props);
        this.nameRef = React.createRef();
        this.numberRef = React.createRef();
        this.priceRef = React.createRef();
        this.hashTagRef = React.createRef();

        this.cameraIcon = React.createRef();

        this.goodsQuality=Constant.getGoodsQuality();
        // 팝업메뉴위치
        this.cameraModalX = null;
        this.cameraModalY = null;
        this.id="";

        //안드로이드에서 정의한 모듈 가져옴
        const { ImageModule } = NativeModules;
        this.imageModule = ImageModule;

        this.state = {
            name: '',
            number: '',
            price: '',
            tagName: '',
            hashTag: [],
            quantity: 1,
            quality: 1, //상품상태
            genuine: 1,//정품, 비정품
            spec: "", //상품설명

            //goodsState:1, //상품상태
            //goodsGenuine:1, //비정품or정품

            validForm: false,

            check_genuine: true,
            check_non_genuine: false,
            allhashTag: "",

            cameraPopupMenuVisiable: false, //카메라 팝업메뉴 모달

            goodsDetailModal: false, // 어떤모달인지..? => 상품최종모달 goodsDetailModal
            imageDetailModal: false, // 이미지 크게보기 모달 imageDetailViewModal

            selectedImageIndex: 0, // selectedImageIndex
            filenames: [],
            imageURLs: [],
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

        this.getuserID().then((value) => {
            this.id=value;
        });
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    makeBinaryData() {
        let imageData = []; // 이미지 객체를 저장해 줄 배열 만들어주기
        //const imageURLs = this.props.route.params.imageInputValue;//VisionCamFlat에서 받은 ImageInputValue
        for (let i = 0; i < this.state.imageURLs.length; i++) { // 배열안에 있는 이미지의 갯수만큼 반복문 돌려주기
            const uri = this.state.imageURLs[i];
            const fileData = {
                uri: uri,
                type: "image/jpeg",
                name: 'photo.jpg',
            }
            imageData.push(fileData);// imageData 배열 안에 이미지의 객체들을 넣어줌            
        }
        return imageData; // 객체가 들어있는 배열을 리턴
    }

    uploadButtonClicked = () => { // 등록 버튼을 눌렀을 때 호출되는 함수
        const imageData = this.makeBinaryData();
        this.callUploadAPI(imageData).then((response) => {
            console.log(response);

            if (response.success == 1) {
                Alert.alert('상품등록이 성공되었습니다', '', [
                    { text: '확인', onPress: () => { this.props.navigation.navigate("Home") } },
                ]);
                for (let i = 0; i < imageData.length; i++) {
                    this.imageModule.deleteImage(imageData[i].uri, (message) => {
                        console.log(message);
                    }, (message) => {
                        console.log(message);
                    });
                }
            }
            else {
                Alert.alert("상품등록이 실패하였습니다.");
            }
        })
    }

    // 카메라 버튼 클릭goGalleryButtonClicked
    goodsCameraButtonClicked = () => {
        if (this.state.imageURLs.length == 5) {
            alert('이미지는 최대 5장까지 선택할 수 있어요');
        }
        else {
            this.setState({ cameraPopupMenuVisiable: true })
        }
    }

    //카메라, 갤러리에서 이미지 받아오는 함수
    getImageURL = (imageURLs) => {
        for (let i = 0; i < imageURLs.length; i++) {
            this.imageModule.getReduceImageUri(imageURLs[i], 3, (message) => {
                console.log('image error', message);
            }, (uri) => {
                console.log('image success', uri);
                this.onValueChange({ imageURLs: this.state.imageURLs.concat(uri) });
                /*this.setState({ imageURLs: this.state.imageURLs.concat(uri) });
                this.onValueChange();*/
            })
        }
        //this.setState({ imageURLs: this.state.imageURLs.concat(imageURLs) });   
    }

    // 품번 가지고오는 함수 getGoodsNo
    goPartsNo = (imageURI) => {
        this.callPartsNoAPI(imageURI).then((response) => {
            if (response.success === "1") {
                const partsNo = response.texts[0].replaceAll(" ", "");
                this.setState({ number: partsNo });
            }
            else {
                Alert.alert('부품번호 인식', '부품번호를 인식하지 못했습니다. 직접 입력하세요', [
                    { text: '확인', onPress: () => { this.setState({ number: "" }) } }]);
            }

            this.imageModule.deleteImage(imageURI, (imageURI) => {
                console.log(imageURI);
            }, (imageURI) => {
                console.log("delete success", imageURI);
            });
        });
    }

    //카메라로 이동
    goCameraScreen = () => {
        this.setState({ cameraPopupMenuVisiable: false });
        this.props.navigation.navigate("GoodsImageCamera", { onResultListener: this.getImageURL, imageLength: this.state.imageURLs.length });
    }
    //갤러리로 이동
    goGalleryScreen = () => {
        this.setState({ cameraPopupMenuVisiable: false });
        this.props.navigation.navigate("Gallery", { onResultListener: this.getImageURL, imageLength: this.state.imageURLs.length });
    }
    // 품번카메라로 이동 goCameraButtonClicked
    goCameraButtonClicked = () => {
        this.props.navigation.push("PartsNoCamera", { onResultListener: this.goPartsNo });
    }

    //해시태그 추가버튼을 누를때
    addTag = () => {
        const tagNames=this.state.tagName.split(' ');
    
        if(tagNames.slice(-1)[0]==''){
            tagNames.splice(tagNames.length-1)
        }
        if (this.state.hashTag.length< 7 && tagNames.length<7 && this.state.hashTag.length+tagNames.length<8) {
            /*this.addHashTag(tagNames).then(()=>{
                this.onValueChange();
            });*/
            this.onValueChange({hashTag: this.state.hashTag.concat(tagNames)});
        }
        else {
            this.setState({ hashTagError: false })
        }

        this.state.tagName = ""
        this.hashTagRef.clear();
    }
    //해시태그 특수문자 입력시 제거
    hashTagOnChangeText=(value)=>{
        const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/;
        let newTagName=value.replace(reg,'')
        this.setState({ tagName: newTagName})
    }

    // userID값 가져오는 함수
    async getuserID() {// getUserID 로 수정
        let obj = await AsyncStorage.getItem('obj') // 접속 중인 세션, 로컬스토리지 세션 따로생각, 로그인확인방법check
        let parsed = JSON.parse(obj);
        if (obj !== null) {
            return this.id = parsed.id;
        }
        else {
            return false;
        }
    }

    /*async addHashTag(tagNames){
        this.setState({ hashTag: this.state.hashTag.concat(tagNames) })
    }

    async removeHashTag(index) {
        this.setState({
            hashTag: this.state.hashTag.filter((_, indexNum) => indexNum !== index),
        })
    }

    async removeImage(index) {
        this.setState({
            imageURLs: this.state.imageURLs.filter((value, indexNum) => indexNum !== index)
        });
    }*/

    //해시태그 삭제할 때
    hashTagRemove = (index) => {
        /*this.removeHashTag(index).then(()=>{
            this.onValueChange();
        });*/
        this.onValueChange({hashTag: this.state.hashTag.filter((_, indexNum) => indexNum !== index)});
    }

    // -버튼 클릭
    minusNum = () => {
        if (this.state.quantity <= 1) {
            this.setState({ quantity: 1 })
        }
        else {
            this.setState({ quantity: this.state.quantity - 1 });
        }
    }

    //정품 클릭
    genuineCheck = () => {
        this.setState({ check_genuine: true, check_non_genuine: false, genuine: 1 });
    }
    //비정품 클릭
    non_genuineCheck = () => {
        this.setState({ check_non_genuine: true, check_genuine: false, genuine: 2 });
    }

    //이미지 삭제 버튼
    imageRemove = (index) => {
        /*this.removeImage(index).then(()=>{
            this.onValueChange();
        })*/
        this.onValueChange({imageURLs: this.state.imageURLs.filter((value, indexNum) => indexNum !== index)});
    };

    //상품등록하기 버튼활성화 조건
    onValueChange = (value) => {
        this.setState(value,()=>{
        let isValidForm = true;
        
        if (this.state.number.trim().length == 0) { // 조건 필요시 추가
            isValidForm = false;
        }
        if (this.state.name.trim().length == 0) {
            isValidForm = false;
        }
        if (this.state.price.trim().length == 0) {
            isValidForm = false;
        }
        if(this.state.price <= 0){
            isValidForm = false;
        }
        if (this.state.hashTag.length == 0) {
            isValidForm = false;
        }
        if (this.state.imageURLs.length == 0) {
            isValidForm = false;
        }
        /*if (this.state.spec.trim().length == 0) {
            isValidForm = false;
        }*/
        
        console.log("해시태그 길이", this.state.hashTag.length)
        this.setState({ validForm: isValidForm });
    });
        
    }

    //Web Service 시작
    // 이미지와 데이터를 서버로 보내주는 API
    async callUploadAPI(imageData) {
        let manager = new WebServiceManager(Constant.serviceURL + "/AddGoods", "post");
        filenames = []; //"file1","file2" ... 파일 이름들을 넣어줄 배열

        for (let i = 0; i < imageData.length; i++) { //리턴받은 이미지 객체 배열의 길이만큼 반복
            filenames.push("file" + (i + 1)); // 파일 이름들을 배열에 넣어줌
            manager.addBinaryData("file" + (i + 1), imageData[i]); //addBinaryData에 앞에는 이미지의 이름들 뒤에는 이미지 객체가 들어있는 배열
        }
        for (let i = 0; i < this.state.hashTag.length; i++) {
            this.state.allhashTag += this.state.hashTag[i] + ","
        }

        manager.addFormData("data", {
            userID: this.id, name: this.state.name, number: this.state.number,
            price: this.state.price, hashTag: this.state.allhashTag.replace(/,\s*$/, ""), quantity: this.state.quantity,
            quality: this.state.quality, genuine: this.state.genuine, spec: this.state.spec, filenames: filenames
        });
        console.log(this.state.quality)

        let response = await manager.start();// --끝났다
        if (response.ok) {
            return response.json();
        }
    }

    //사진으로부터 품번 인식 서비스 API
    async callPartsNoAPI(imageURI) {
        let manager = new WebServiceManager(Constant.externalServiceURL + "/api/paper/DetectTexts", "post");
        manager.addBinaryData("file", {
            uri: imageURI,
            type: "image/jpeg",
            name: "file"
        });
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }
    //Web Service 끝

    //UI관련
    //큰이미지뷰 모달 표시여부 및 모달 선택 인덱스
    handleModal = (index) => {
        this.setState({
            imageDetailModal: !this.state.imageDetailModal,
            selectedImageIndex: index
        })
    };
    //카메라,앨범선택 버튼 위치
    getViewSize = () => {
        this.cameraIcon.current.measure((fx, fy, width, height, px, py) => {
            this.cameraModalX = px + width - (width / 3);
            this.cameraModalY = py + height - (height / 2);
            //console.log('location:', fx, fy, width, height, px, py)
        })
    }
    //뒤로가기 했을 때 앱 종료
    backPressed = () => {
        Alert.alert(
            '상품등록을 취소하시겠습니까?',
            '작성한 모든 내용이 삭제됩니다',
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: '확인', onPress: () => this.props.navigation.navigate('Home') },
            ],
            { cancelable: false });
        return true;
    }

    keyboardDidShow = () => {
        console.log('Keyboard Shown');
    }

    keyboardDidHide = () => {
        console.log('Keyboard Hide');
        this.onValueChange();
    }

    render() {
        console.log(this.state.imageURLs)
        console.log('quality',this.state.quality)
        return (
            <>
                <View style={template.total_container}>
                    <ScrollView
                        onScroll={event => {
                            this.getViewSize(event.nativeEvent.contentOffset.y);
                        }}
                        showsVerticalScrollIndicator={false}>
                        <View style={template.container}>

                            {/*카메라 부분 */}
                            <View style={{flex:1}}>
                                <View style={styles.row_view}>
                                    <IconMark name="exclamationcircleo" size={15}></IconMark>
                                    <Text style={styles.camera_text}>  등록한 첫번째 사진이 대표이미지로 등록됩니다 </Text>
                                </View>
                                <View style={[styles.row_view,{marginBottom:10}]}>
                                    <View onLayout={(event) => { this.getViewSize(event) }} ref={this.cameraIcon}>
                                        <TouchableOpacity style={styles.camera_btn} onPress={this.goodsCameraButtonClicked}>
                                            <IconCamera name="camera" size={30} color={'black'}></IconCamera>
                                            <Text><Text style={{color: Main_Color}}>{this.state.imageURLs.length}</Text>/5</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/*이미지 뿌려주기 */}
                                    <FlatList
                                        showsHorizontalScrollIndicator={false}
                                        data={this.state.imageURLs}
                                        renderItem={(item) => <ImageRender image={item} imageDetailModal={this.handleModal} imageRemove={(index) => this.imageRemove(index)} />}
                                        horizontal={true}
                                    />
                                </View>

                                {/*카메라 모달 */}
                                <Modal
                                    animationType='fade'
                                    transparent={true}
                                    visible={this.state.cameraPopupMenuVisiable}
                                    onRequestClose={() => this.setState({ cameraPopupMenuVisiable: false })}>

                                    <ImageSelectorPopup x={this.cameraModalX} y={this.cameraModalY}
                                        closeCameraPopupMenu={() => this.setState({ cameraPopupMenuVisiable: false })}
                                        goCameraScreen={this.goCameraScreen}
                                        goGalleryScreen={this.goGalleryScreen} />
                                </Modal>

                                {/*이미지 모달 */}
                                <Modal visible={this.state.imageDetailModal}>
                                    <Button title="Back" onPress={this.handleModal} />
                                    <View style={styles.background_view}>
                                        <FlatList
                                            showsHorizontalScrollIndicator={false}
                                            data={this.state.imageURLs}
                                            renderItem={(item) => <ImageModal image={item} imageModal={this.handleModal} imageRemove={(index) => this.imageRemove(index)} />}
                                            horizontal={true} // 가로정렬
                                            initialScrollIndex={this.state.selectedImageIndex}
                                        />
                                    </View>
                                </Modal>
                            </View>

                            {/* 상품정보 부분 */}
                            <View style={{flex:2}}>
                                <Text style={styles.productinf_text}>상품 정보</Text>
                                {/*부품번호 */}
                                <View style={styles.product_textInput}>
                                    <View style={styles.row_view}>
                                        <View style={{flex:6}}>
                                            <Text>부품번호
                                            </Text>
                                            <TextInput
                                                ref={(c) => { this.numberRef = c; }}
                                                returnKeyType="next"
                                                onSubmitEditing={() => { this.nameRef.focus(); }}
                                                onChangeText={(value) => this.onValueChange({ number: value })}
                                                //onEndEditing={(event) => this.onValueChange()}
                                                value={this.state.number} // 띄워지는값
                                            />
                                        </View>
                                        <View style={{flex:1}}>
                                            <TouchableOpacity style={styles.add_btn} onPress={this.goCameraButtonClicked} >
                                                <IconCamera name="camera" size={30} color={'white'}></IconCamera>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                {/* 제목*/}
                                <View style={styles.product_textInput}>
                                    <Text>제목 (대표키워드)
                                    </Text>
                                    <TextInput
                                        ref={(c) => { this.nameRef = c; }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => { this.hashTagRef.focus(); }}
                                        onChangeText={(value) => this.onValueChange({ name: value })}
                                        //onEndEditing={(event) => this.onValueChange()}
                                    />
                                </View>


                                {/* 키워드 */}
                                <View style={styles.product_textInput}>
                                    <View style={styles.row_view}>
                                        <View style={{flex:6}}>
                                            <Text>키워드
                                                {this.state.hashTagError == false ? (
                                                    <Text style={styles.errormessage_text}>
                                                        * 1 - 7개 입력
                                                    </Text>
                                                ) : null}
                                            </Text>
                                            <TextInput
                                                ref={(c) => { this.hashTagRef = c; }}
                                                returnKeyType="next"
                                                onSubmitEditing={this.addTag}
                                                onChangeText={(value) => this.hashTagOnChangeText(value)}
                                                value={this.state.tagName}
                                            />
                                        </View>
                                        <View style={{flex:1}}>
                                            <TouchableOpacity style={[styles.add_btn,{backgroundColor: Line_Color}]} onPress={this.addTag}>
                                                <Text>추가</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                {/* 키워드 뿌려주기 */}
                                <View style={styles.hashtag_view}>
                                    {this.state.hashTag.map((item, i) =>
                                        <View style={styles.hashtag_add_view} key={i}>
                                            <Text>#{item}</Text>
                                            <TouchableOpacity onPress={() => this.hashTagRemove(i)}>
                                                <IconPopup name="close" size={15} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>


                                {/* 판매금액 */}
                                <View style={styles.product_textInput}>
                                    <Text>판매 금액 (개당)
                                    </Text>

                                    <TextInput
                                        ref={(c) => { this.priceRef = c; }}
                                        keyboardType="number-pad"
                                        onChangeText={(value) => this.onValueChange({ price: value })}
                                        //onEndEditing={(event) => this.onValueChange()}
                                    />
                                </View>

                                {/* 판매수량 */}
                                <View style={[styles.row_view,{marginBottom:10}]}>
                                    <View style={styles.center_view}>
                                        <Text>판매 수량</Text>
                                    </View>
                                    <View style={styles.sales_quantity_textInput}>
                                        <Text>{this.state.quantity}</Text>
                                    </View>
                                    <View style={styles.center_view}>
                                        <IconQuantity name="plus-square" size={40} color={Light_Gray} onPress={() => { this.setState({ quantity: this.state.quantity + 1 }) }}/>
                                       {/*  <TouchableOpacity activeOpacity={0.8} style={[styles.add_btn,{width: 40,height: 40,}]} onPress={() => { this.setState({ quantity: this.state.quantity + 1 }) }}>
                                            <Text style={[styles.btn_text,{fontSize:25}]}>+</Text>
                                        </TouchableOpacity> */}
                                    </View>
                                    <View style={styles.center_view}>
                                    <IconQuantity name="minus-square" size={40} color={Light_Gray} onPress={this.minusNum}/>
                                       {/*  <TouchableOpacity activeOpacity={0.8} style={[styles.add_btn,{width: 40,height: 40,justifyContent:'flex-start'}]} onPress={this.minusNum}>
                                            <Text style={[styles.btn_text,{fontSize:35,}]}>-</Text>
                                        </TouchableOpacity> */}
                                    </View>
                                </View>


                                {/*상품상태*/}
                                <View style={styles.status_textInput}>
                                    <Text>상품상태</Text>
                                    <Picker
                                        selectedValue={this.state.quality}
                                        onValueChange={(value, index) => { this.setState({ quality: value }) }}>
                                        {this.goodsQuality.map((item,i)=><Picker.Item label={item} key={i} value={i+1}/>)}
                                    </Picker>
                                </View>

                                {/*정품/비정품*/}
                                <View style={[styles.row_view,{marginBottom:10}]}>
                                    <View style={styles.center_view}>
                                        <Text>정품 인증</Text>
                                    </View>
                                    <View style={styles.center_view}>
                                        <TouchableOpacity activeOpacity={0.8} onPress={this.genuineCheck}>
                                            <View style={styles.row_view}>
                                                <IconRadio name={this.state.check_genuine ? "check-box" : "check-box-outline-blank"} size={30} color={'black'} />
                                                <Text> 정품</Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                    <View style={styles.center_view}>
                                        <TouchableOpacity activeOpacity={0.8} onPress={this.non_genuineCheck}>
                                            <View style={styles.row_view}>
                                                <IconRadio name={this.state.check_non_genuine ? "check-box" : "check-box-outline-blank"} size={30} color={'black'} />
                                                <Text> 비정품</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                {/* 상세내용*/}
                                <View style={styles.textDetailInput}>
                                    <Text>상세 내용</Text>
                                    <TextInput
                                        multiline={true}
                                        onChangeText={(value) => this.setState({ spec: value })}
                                        //onEndEditing={(event) => this.onValueChange()}
                                    />
                                </View>
                            </View>
                        </View>
                        {this.state.goodsDetailModal && (<GoodsDetailModal name={this.state.name} number={this.state.number} price={this.state.price} hashTag={this.state.hashTag}
                            quantity={this.state.quantity} quality={this.state.quality} genuine={this.state.genuine} spec={this.state.spec} statemodal={this.state.goodsDetailModal}
                            setstatemodal={() => this.setState({ goodsDetailModal: !this.state.goodsDetailModal })} upload={this.uploadButtonClicked} />)}

                        {/* 상품 등록하기 버튼 부분*/}
                        {this.state.validForm ?
                            (<TouchableOpacity activeOpacity={0.8} style={styles.activate_btn} onPress={() => this.setState({ goodsDetailModal: !this.state.goodsDetailModal })}>
                                <Text style={[styles.btn_text,{fontSize:17}]}>상품등록하기</Text>
                            </TouchableOpacity>)
                            : (<TouchableOpacity activeOpacity={0.8} style={[styles.activate_btn,{backgroundColor: Light_Gray}]}>
                                <Text style={[styles.btn_text,{fontSize:17}]}>상품등록하기</Text>
                            </TouchableOpacity>)}
                    </ScrollView>

                </View>
            </>
        )
    }
}

class ImageRender extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const imagePath = this.props.image.item;
        const imageIndex = this.props.image.index;
        console.log('imagePath',imagePath);
        
        return (
            <TouchableOpacity onPress={(index) => this.props.imageDetailModal(imageIndex)} >
                <Image source={{ uri: imagePath }} style={styles.image_view}
                />
                <View style={styles.imageDelete_view}>
                    <TouchableOpacity onPress={() => this.props.imageRemove(imageIndex)}>
                        <IconDelete name="close-circle" color="black" size={23}></IconDelete>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }
}

class ImageSelectorPopup extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const layout = { flex: 1, left: this.props.x, top: this.props.y };
        return (
            <>
                <TouchableOpacity onPress={this.props.closeCameraPopupMenu} style={{ flex: 1 }}>
                    <View style={layout} >
                        <TouchableWithoutFeedback>
                            <View style={styles.camera_modal_view}>
                                <View style={[styles.center_view,{borderRightWidth:1}]}>
                                    <TouchableOpacity onPress={this.props.goCameraScreen}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <IconPopup name="camera" size={25} color={'black'} ></IconPopup>
                                            <Text style={[styles.btn_text,{color:'black'}]}>카메라   </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.center_view}>
                                    <TouchableOpacity onPress={this.props.goGalleryScreen}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <IconPopup name="image" size={25} color={'black'} ></IconPopup>
                                            <Text style={[styles.btn_text,{color:'black'}]}>앨범</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableOpacity>
            </>
        )
    }
}

class ImageModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const imagePath = this.props.image.item;
        const imageIndex = this.props.image.index;

        return (
            <TouchableOpacity style={styles.modal_view} onPress={this.props.imageModal}>
                <View style={[styles.center_view,{marginTop:100}]}>
                    <ImageBackground source={{ uri: imagePath }} style={styles.image_modal_view}>
                        <TouchableOpacity onPress={() => this.props.imageRemove(imageIndex)}>
                            <IconDelete name="close" color="black" size={50}></IconDelete>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </TouchableOpacity >
        )
    }
}

class GoodsDetailModal extends Component {
    constructor(props) {
        super(props);
    }
    qulityValueText = (value) => {
        let qulityText = ["새제품이에요", "깨끗해요", "쓸만해요"];
        return qulityText[value - 1];
    }

    genuineValueText = (value) => {
        let genuineText = ["정품", "비정품"];
        return genuineText[value - 1];
    }
    render() {
        return (
            <>
                <Modal animationType='slide' transparent={true} visible={this.props.statemodal}>
                    <View style={[styles.center_view,{marginTop:22}]}>
                        <View style={styles.modal_search_view}>
                            <Text style={{fontFamily: 'Pretendard-SemiBold',fontSize: 20,color:'black'}}>등 록 확 인{"\n"}</Text>

                            <View style={{flexDirection:'row', marginBottom:'13%'}}>
                                <View style={{flex:1}}>
                                    <Text style={[styles.modal_text,]}>품        명</Text>
                                    <Text style={[styles.modal_text,]}>부품번호</Text>
                                    <Text style={[styles.modal_text,]}>가        격</Text>
                                    <Text style={[styles.modal_text,]}>판매개수</Text>
                                    <Text style={[styles.modal_text,]}>상품상태</Text>
                                    <Text style={[styles.modal_text,]}>정품/비정품</Text>            
                                </View>
                                <View style={{flex:1}}>
                                    <Text style={[styles.modal_text,{color:'black'}]}>{this.props.name.length>7 ? `${this.props.name.slice(0,7)}...`:this.props.name}</Text>
                                    <Text style={[styles.modal_text,{color:'black'}]}>{this.props.number.length>9 ? `${this.props.number.slice(0,9)}...`:this.props.number}</Text>
                                    <Text style={[styles.modal_text,{color:'black'}]}>{this.props.price}</Text>
                                    <Text style={[styles.modal_text,{color:'black'}]}>{this.props.quantity}</Text>
                                    <Text style={[styles.modal_text,{color:'black'}]}>{this.qulityValueText(this.props.quality)}</Text>
                                    <Text style={[styles.modal_text,{color:'black'}]}>{this.genuineValueText(this.props.genuine)}</Text>
                                </View>
                            </View>


                            <Text style={[styles.modal_text,{color:'black'}]}>{" 등록 하시겠습니까? "}</Text>
                            <View style={{flexDirection:'row', marginVertical:'3%'}}>
                                <TouchableOpacity  style={styles.modal_button} onPress={this.props.setstatemodal}><Text style={{color:'black'}}>취소</Text></TouchableOpacity>
                                <TouchableOpacity style={[styles.modal_button,{backgroundColor:Sub_Color}]} onPress={this.props.upload}><Text style={{color:'white'}}>확인</Text></TouchableOpacity>
                            </View>                      
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

export default AddGoods;