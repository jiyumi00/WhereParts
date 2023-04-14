import { StyleSheet, Dimensions } from 'react-native';
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  buyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 200,
    borderRadius: 5,
    backgroundColor: '#0066FF',
  },
  buyButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#FFF',
  },
  indexText:{
    fontSize: 16, 
    marginBottom:'3%',
    fontWeight: "bold", 
    color: 'black' 
  },
  indexView:{
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "lightgray",
    padding: 10,
    marginTop:10,
  },
  orderGoodsDetailText: {
    fontSize: 14,
    color: 'black',
  },
  priceText:{
    fontSize: 18,
    color:'black',
  },
  paymentButton:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: "auto",
    backgroundColor: '#0066FF', 
  },
  goListButton:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: "48%",
    borderRadius: 5,
    backgroundColor: '#0066FF',
  },

  //수량디자인
  selectQuantityView: {
    width:"auto",
    borderRadius: 6,
    borderColor: '#D4D4D4',
    borderWidth: 1,
    flexDirection: 'row',
    //alignItems:'flex-end'
  },
  quantityItemText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#000',
  },
  quantityItem: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityCount: {
    borderColor: '#D4D4D4',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  buttonView:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  //pay_complete
  goodsInfoView:{
    height:'30%',
    backgroundColor:'gray'
  },
  payInfoView:{
    flex:2,
  },

  //address
  total_container: {
    flex: 1,
    backgroundColor: 'white',

  },
  container: {
    flex: 1,
    marginTop: 30,
  },
  rowLayout: {
    flex: 1,
    flexDirection: 'row',
    //borderWidth:1,
  },
  textInput: {
    backgroundColor: '#F1F1F3',
    marginBottom: 15,
    marginRight: 15,
    paddingHorizontal: 10,

    height: 45,
    width: "100%",
    borderRadius: 10,
    borderColor: '#F1F1F3',
    borderWidth: 1,
  },

  title: {
    fontFamily: "Cochin",
    fontSize: 18,
    fontWeight:"bold",
    color: "black",
    marginBottom: 15,
  },

  btn: {
    //borderWidth:1,
    width: '36%',
    height: 45,
    backgroundColor: "black",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  btn_text: {
    fontFamily: "Cochin",
    fontSize: 15,
    color: "white",
  },
  text: {
    fontFamily: "Cochin",
    fontSize: 15,
    color: "black",
    marginLeft: 10,
    marginRight: 10,
  },
  number_text: {
    //borderWidth:1,
    width: '60%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: "#F1F1F3",
    borderRadius: 10,
    height: 45,
    marginBottom: 15,
    marginRight: 15,

  },
  address_text: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: "#F1F1F3",
    borderRadius: 10,
    height: 45,
    width: "100%",
    marginBottom: 15,
  },
  deliverView:{
    marginBottom:20,
    paddingBottom:10,
    borderBottomWidth:1,
    borderColor:'lightgray',
  },
  productImage: {
    flex: 1,
    //margin: 5,
    //width: 75,
    //height: 65,
    borderRadius: 6,
  },
})