import React, { Component,BackHandler,Alert } from 'react';
import { WebView } from 'react-native-webview';

class SearchWebView extends Component {
    constructor(props) {
        super(props);
        this.url=this.props.route.params.url;
    }
    componentDidMount() {
       
        BackHandler.addEventListener("hardwareBackPress", this.backPressed); //뒤로가기 이벤트
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }
    //뒤로가기 했을 때 앱 종료
    backPressed = () => {
        console.log('back')
        this.props.navigation.pop();
        return true;
    }
    render() {
        return (
           <WebView source={{ uri: this.url }} />
        )
    }
}

export default SearchWebView;