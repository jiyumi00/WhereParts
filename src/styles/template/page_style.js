import {StyleSheet} from 'react-native';

export const colors = {
    light: '#C9CCD1',
    medium: '#888888',
    dark: '#000000',
    red:'#FD9C91',
    white:'#FFFFFF',
    main:'#0066FF',
}

export const template= StyleSheet.create({
    total_container:{
     flex:1,
     backgroundColor:'white',
    },
    container:{
        flex:1,
        paddingHorizontal:'4%',
    },


    //TextInput
    textInputText:{
        fontSize:15,
        height:30,
        padding:0
    },
     textInput:{
        backgroundColor:'#F1F1F3',
        marginBottom: 15,
        paddingHorizontal: 10,
        height: 55,
        borderRadius: 10,
        borderColor:'#F1F1F3',
        borderWidth: 1,
     },
     smallBox: {
        borderWidth: 1, 
        borderRadius: 10, 
        borderColor:colors.light,
        paddingHorizontal: '2%', 
        paddingVertical:'2%',
        marginTop: '2%',
      },
     //Box
     largeBox:{
        borderWidth: 1, 
        borderRadius: 10, 
        borderColor:colors.medium,
        paddingHorizontal: '2%', 
        paddingVertical:'2%',
        marginTop: '2%',
     },


     //Text
    largeText: {
        fontSize: 17,
        color: colors.dark,
    },
    samllText: {
        fontSize: 15,
        color: colors.medium,
    },
    contentText: {
        fontSize: 14,
        color: colors.medium,
    },
    btnText:{
        fontSize:17,
        color:colors.white,
    },
    //Button

    activeButton:{
        height: 50,
        backgroundColor: colors.main,
        alignItems: 'center',
        justifyContent: 'center'
    },
  


  });
  