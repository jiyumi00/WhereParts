//Home Style
import { Dimensions, StyleSheet } from 'react-native';
const ScreenHeight=Dimensions.get('window').height;
const ScreenWidth=Dimensions.get('window').width;
export const styles = StyleSheet.create({ //export를 해주어야 다른 곳에서 사용할 수 있음

  //Home
  //타이틀 
  homeTop_view: { //홈의 위의 디자인 담당
    width: ScreenWidth,
    height: 200,
    paddingTop:'10%',
   
    backgroundColor: '#E6EBF9',
    position: 'absolute',
  },
  title_view: { 
    marginTop:"5%",
   
  },
  
  row_title_view:{
    //borderWidth:1,
    width:'50%',
    paddingLeft:'5%',
    marginBottom:'3%',
    flexDirection:'row',
    backgroundColor:'#D6DFF5'
  },
  row_view: {
    paddingLeft:'5%',
    flexDirection: 'row',
  },
  title_text: {
  
    fontSize: 18,
    lineHeight: 30,
  },
  titleRegular_text: {
    fontFamily: 'Pretendard-Regular',
    color: '#113AE2',
  },
  title_text: {
    fontWeight:'600',
    color: '#113AE2',
  },
  titleBold_text: {
    fontWeight:'300',
    color: '#193067',
    fontSize:15,
  },
  description_text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 10,
    color: '#FFF',
    lineHeight: 21,
  },

  //검색창
  searchBar_view: { //home TextInput
    flexDirection: 'column',
    width: ScreenWidth,
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: "#E6EBF9",
  
  },
  searchSection:{
    borderWidth:1,
    borderColor:'#E3E6ED',
    borderRadius:10,
    width:'75%',
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',

  },
  search_input: { //Home TextInput 안에 글씨
    flex:1,
    backgroundColor: 'white',
    paddingLeft:5,
    borderRadius:10,
    fontSize: 14,
  },
  cameraSearch_button: { //공통사용
    marginLeft: 10,
    width: 50,
    height: 50,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  //sort 정렬바
  sortBar_view: { // 가로정렬
    backgroundColor: 'white',
    width:"100%",
    paddingVertical:"1%",
  
    
    flexDirection:'row',
    paddingTop:5
  },
  
  sortBar_text: { //최신순/오래된순 글씨
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#6495ED',
    fontSize: 13,
  },
  

  //list
  listItem_view: { //공통부분
    borderWidth:1,
    borderRadius:10,
    borderColor:'#E3E3E3',
    marginHorizontal:10,
    width:ScreenWidth/2.5,
    marginBottom:20,
    paddingBottom:'5%'
  },
  productImage_view: {
    alignItems:'center',
    paddingBottom:'2%'
  },
  product_image: {
    flex:1,
    width:(ScreenWidth/2.5),
    height: (ScreenWidth/3),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productInfo_view: {
    flex:3,
    height:70,
    flexDirection:'row',
    marginLeft:10,
    marginTop:5,
  
  },
  productInfoLeft_view:{
    //flex:4,
    paddingLeft:'5%'
  },
  productInfoRight_view:{
    flex:2,
    alignItems:'flex-end',
  },
  itemDetail_text:{
    fontsize:13,
    fontFamily:'200',
    color:'#0066FF'
  },
  itemName_text: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-Medium',
    color: '#000000',
  },
  itemPrice_text:{
    fontSize: 15,
    fontWeight: '200',
    fontFamily: 'Pretendard-Medium',
    color: '#000000',
  }
});