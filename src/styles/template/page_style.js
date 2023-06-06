import { StyleSheet, Dimensions } from 'react-native';
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

export const colors = {
    main: '#185FE0', 
    sub: '#00A1FF',
    //회색
    light: '#F6F6F6', 
    medium: '#BCBCBC',
    dark: '#7A7A7A',
    red: '#FF7E70',
    white: '#FFFFFF',
    black: '#000000',
    line: '#E6E6E6',

}

export const template = StyleSheet.create({
    baseContainer: { //전체 컨테이너
        flex: 1,
        backgroundColor: colors.white,
    },
    container: { //선 없는 페이지 컨테이너
        flex: 1,
        paddingHorizontal: '4%',
    },
    //TextInput(2)
    textInput: {
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.medium,
        paddingHorizontal: '3%',
        height: 45,
        marginBottom: '3%',
    },
    textInput2:{

    },

    //Line
    line: {
        borderWidth: 0.5,
        width: '100%',
        borderColor: colors.line
    },
    //Box
    lineBox: {
        paddingHorizontal: '5%',
        paddingVertical: '3%',
        borderBottomWidth: 1,
        borderColor: colors.line,
    },
    roundedBox: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.medium,
        paddingHorizontal: '2%',
        paddingVertical: '2%',
        marginBottom: '2%',
    },
    layoutBox: {
        paddingHorizontal: '2%',
        paddingVertical: '2%',
    },
    layoutBoxTest: {
        paddingHorizontal: '2%',
        paddingVertical: '2%',
        borderWidth: 1,
    },
  
   

    //Text
    titleText: {
        fontSize: 25,
        color: colors.black,
        fontWeight: 'bold'
    },
    largeText: {
        fontWeight:'500',
        fontSize: 16,
        color: colors.black,
    },
    smallText: {
        fontSize: 15,
        color: colors.black,
    },
    contentText: {
        fontSize: 14,
        color: colors.black,
    },
 
    itemNumberText: {
        fontSize: 12,
        color: colors.sub,
    },
    itemDistanceText: {
        fontSize: 10,
        color: colors.red
    },
    buttonText: {
        fontSize: 21,
        color: colors.white,
        fontWeight: 'bold'
    },
    inputText: {
        fontSize: 14,
        padding: 0,
        color: '#7A7A7A'
    },

    //Button
    activeButton: {
        height: 50,
        backgroundColor: colors.main,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inActiveButton: {
        height: 50,
        backgroundColor: colors.light,
        alignItems: 'center',
        justifyContent: 'center'
    },
    smallButton: {
        width: 40,
        height: 40,
        backgroundColor: colors.dark,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    roundedButton:{
        width: ScreenWidth / 5,
        height: ScreenWidth / 5,
        backgroundColor: colors.light,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    //Image
    imageView: {
        borderRadius: 10,
        width: ScreenWidth / 6.5,
        height: ScreenWidth / 6.5,
    },
});
