import { Dimensions, StyleSheet } from 'react-native';
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;
export const styles = StyleSheet.create({ //export를 해주어야 다른 곳에서 사용할 수 있음

  text: { //공통
    //fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    color: 'black'
  },
  /* 상품 상세보기 */
  itemDetail_view: {
    width: "100%",
    height: "100%",
    backgroundColor: 'white',
    shadowColor: '#000',
    borderRadius: 6,
  },
  //tabBar
  tabBar_view: {
    height: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 1, //
    justifyContent: 'flex-end',
    paddingVertical: 3,
    backgroundColor: 'white'
  },
  tabBar_button: {
    width: "20%",
    height: "70%",
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: 'white',
  },
  //상품 상세보기
  itemInfo_view: {
    flex: 1,
    backgroundColor: 'white',
  },
  //이미지 

  goodsImage_view: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: "5%",
  },
  slideImage_view: {
    width: ScreenWidth,
    height: ScreenWidth / 1.3,
  },
  goods_image: {
    width: ScreenWidth,
    height: ScreenWidth / 1.3,
  },
  goods_modal_image: {
    width: "95%",
    height: 360,
    borderRadius: 10,
  },
  goods_modal_view: {
    borderRadius: 10,
    height: "100%",
    width: "100%",
    //borderWidth:1,
    marginVertical: "3%",
  },
  //상품 설명 부분
  productInfo_view: {
    borderTopWidth: 1,
    marginHorizontal: '5%',
    paddingBottom: 20,
    paddingTop: 15,
    //padding: 20,
    borderColor: '#E6E6E6',
    borderBottomWidth: 1,
  },
  //인증업체
  certificationMark_view: {
    //width: 64,
    //backgroundColor: '#E8EEF0',
    //borderRadius: 4,
    height:15,
    marginBottom: 10,
  },
  certificationMark_text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  //부품 이름, 번호
  goodsName_view: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  //가격
  detailPrice_view: {
    marginTop: 3,
    flexDirection: 'column',
    //alignItems: 'flex-end',
  },
  detailUnit_text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 17,
    color: '#000',
    lineHeight: 28,
  },
  remaining_view: {
    //marginLeft: 'auto',
    //marginBottom: 5,
    //paddingTop:15,
    //flexDirection: 'row',
    //alignItems:'center',
  },
  selectQuantity_view: {
    height: 42,
    width:36*3,
    borderRadius: 6,
    borderColor: '#D4D4D4',
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity_button: {
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

  // 상품 정보///////////////////////////////////////////////////////
  toggleDetail_view: {
    paddingVertical: 10,
    //paddingHorizontal:30,
    marginHorizontal: '5%'
  },
  toggleDetailTitle_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //marginBottom: 7,
  },
  toggleDetailItem: {
    marginVertical: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  toggleDetailItemTItle: {
    justifyContent: 'center',
    width: 75,
  },
  toggleDetailItemTItleText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#949CA1',
    lineHeight: 20,
  },
  toggleDetailTextArea: {
    marginTop: 5,
    marginBottom: 30,
  },
  detailHashTags_view: {
    marginTop: 15,
    flexDirection: 'column',
    flexWrap: 'wrap',
    //borderWidth:1,
  },
  tabBarBottom_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#E4E4E4',
    borderWidth: 1,
    height: 50,
    //width:"100%",
    //paddingHorizontal:20,
  },
  pick_view: {
    flex: 2
  },
  price_view: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buy_view: {
    flex: 3
  },
  edit_button_view: {
    flex: 2,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buy_button: {
    //borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: "100%",
    //borderRadius:5,
    backgroundColor: '#0066FF',
  },
  buyButton_text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#FFF',
  },
  pick_button: {
    backgroundColor: "white",
    //marginRight:10,
    //marginHorizontal:30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distance_text: {
    fontsize: 15,
    fontFamily: 'Pretendard-SemiBold'
  },
  // Detail 안에서의 수정한 View style------------------------------------------------------------------------------------------------
  //가격 수정 view style
  editGoodsPrice_input: {
    backgroundColor: 'white',
    height: 45,
    width: "60%",
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
    alignItems:'flex-end',
    justifyContent:'center',
  },
  editGoodsQuality: {
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 40,
    width: "72%",
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
  },
  genuine_view: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10
  },
  status_item: {
    flex: 1.5,
    alignItems: 'center',
  },
  genuine_row: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  // 상세설명 수정 view style
  editGoodsExplainInput_view: {
    marginTop: 10,
    backgroundColor: 'white',
    width: "100%",
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
  },
  // 해쉬태그 수정 view style
  hashTag_input: {
    backgroundColor: 'white',
    marginBottom: 15,
    paddingLeft: 20,
    height: 60,
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
    flexDirection: 'row',
  },
  textLayout_view: {
    flex: 8
  },
  btnLayout_view: {
    flex: 2,
  },
  errorMessage_text: {
    fontSize: 13,
    color: "#FD9C91",
    marginTop: -15,
  },
  tag_button: { //해시태그 버튼 
    marginTop: 5,
    width: 45,
    height: 45,
    backgroundColor: "#F1F1F3",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tagLayout_view: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 5,
  },
  tagStyle_view: { //해시태그 스타일
    alignSelf: 'flex-start',
    flexDirection: 'row',
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#E9E9F1",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
});