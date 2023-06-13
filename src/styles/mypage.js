import { StyleSheet, Dimensions } from 'react-native';
import { colors } from "../styles/template/page_style";
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;
export const styles = StyleSheet.create({


    //내정보 부분
    viewHeaderLayout: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,

    },//
    container: {
        margin: 15,
    },
    item1: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    item2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },//

    name_text: {
        color:colors.black,
        fontWeight: 'bold',
        fontSize: 20,
    },

    btn: {
        justifyContent: 'center',
        backgroundColor:colors.white,
        borderRadius: 20,
        shadowColor: colors.black,
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 5,
    },//

    btn_text: {
        fontFamily: 'pretendard',
        fontWeight:'bold',
        textAlign: 'center',
        color:colors.black,
        marginTop: 10,
    },//
   
    input: {
        borderColor: colors.medium,
        backgroundColor: colors.white,
        position: 'relative'
    },
    search_btn: {
        position: 'absolute',
        top: 5,
        right: 15,
    },
    page_view: {
        position: 'absolute',
        width: '100%',
        top: ScreenHeight * 0.83
        //borderWidth:1,
    },
    outputStyle: {
        borderColor: colors.light,
        borderWidth: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    outputStyle_sub:{
        borderRightWidth:0.5,
        borderRightColor:colors.medium
    },
    center:{
        justifyContent:'center',
        alignItems:'center',
    },
    //설정 부분
    viewBodyLayout: {
        //borderWidth:1,
    },//
    

    btn_logout_text: {
        fontFamily: "normal medium 14px/16px Pretendard",
        color: "white",

    },//
    modal_background: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: '100%',
    },
    modal1: {
        paddingTop: 50,
        paddingBottom: 25,
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modal2: {
        backgroundColor: colors.main,
        width: '70%',
        padding: 20,
        borderBottomLeftRadius: 20,
    },
    modal3: {
        backgroundColor: colors.medium,
        width: '30%',
        padding: 20,
        borderBottomRightRadius: 20
    }
})