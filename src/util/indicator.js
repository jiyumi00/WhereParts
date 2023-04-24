import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, View, Modal } from "react-native";

class Indicator extends Component {
    render() {
        return (
            <Modal animationType='fade' transparent={true} visible={true}>
                <View style={inStyle.container}>
                    <ActivityIndicator size="large" color="#0066FF" />
                </View>
            </Modal>
        )
    }
}

const inStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    }
})

export default Indicator;