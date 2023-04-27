import React, {Component} from "react";
import { StyleSheet, View, Modal,Text } from "react-native";

class IndicatorText extends Component{

    constructor(props) {
        super(props);
        this.text=this.props.text;
    }

    render(){
        return (
            <Modal animationType='fade' transparent={true} visible={true}>
                <View style={styles2.container}>
                    <View style={styles2.box}>
                        <Text style={styles2.text}>{this.text}</Text>
                    </View>
                </View>
            </Modal>
        );
    }
} 

const styles = StyleSheet.create({
    container :{
        flex : 1,
        alignItems:"center",
        justifyContent :"flex-end",
    },

    box: {
        width:'70%',
        height:'5%',
        marginBottom:"20%",
        backgroundColor:"lightgrey",
        borderRadius:15,
        justifyContent:'center',
    },

    text:{
        fontSize:15,
        color:'black',
        textAlign:'center',
    }
    
})

const styles2 = StyleSheet.create({
    container :{
        flex : 1,
        alignItems:"center",
        justifyContent :"center",
    },

    box: {
        backgroundColor:"#eeeeee",
        borderWidth:1,
        borderRadius:15,
        borderColor:'black',
        justifyContent:'center',
        paddingVertical:'5%',
        paddingHorizontal:'10%',
    },

    text:{
        fontSize:15,
        color:'black',
        textAlign:'center',
    }
    
})

export default IndicatorText;