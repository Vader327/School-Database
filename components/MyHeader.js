import React from 'react';
import { View } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';

export default class MyHeader extends React.Component{
  render(){
    return(
      <Header backgroundColor="#1c77ff"
      containerStyle={{borderBottomWidth: 0}}
      leftComponent={<Icon name='menu' type='feather' color='#ffffff' onPress={()=>this.props.navigation.toggleDrawer()}/>}
      centerComponent={{text: this.props.title, 
        style:{color: "#ffffff", fontSize: RFValue(23), fontWeight: 'bold'}}} />
    )
  }
}