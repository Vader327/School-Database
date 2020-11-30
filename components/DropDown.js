import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Animated } from 'react-native';
import { Icon } from 'react-native-elements';

export default class DropDown extends React.Component{
  constructor(){
    super();
    this.state={
      active: false,
      selectedIndex: 0,
      activated: false,
    }
    this.animatedArrow = new Animated.Value(0);
    this.dropDownColor = new Animated.Value(0);
    this.dropDownHeight = new Animated.Value(0);
  }

  toggleDropDown=()=>{
    Animated.parallel([
      Animated.timing(this.animatedArrow, {
        toValue: (this.state.active==false ? 1 : 0),
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.dropDownColor, {
        toValue: (this.state.active==false ? 100 : 0),
        duration: 300,
        useNativeDriver: false,
      })
    ]).start(()=>{this.setState({active: !this.state.active}, ()=>{
        Animated.timing(this.dropDownHeight, {
          toValue: (this.state.active==true ? 200 : 0),
          duration: 500,
          useNativeDriver: false,
        }).start()
      })
    })
  }

  sendValue=(index)=>{
    this.state.activated
    ? null
    : this.setState({activated: true})

    this.setState({selectedIndex: index})
    this.props.result(this.props.data[index]);
  }

  render(){
    const spin = this.animatedArrow.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    })
    const colorAnim = this.dropDownColor.interpolate({
      inputRange: [0, 100],
      outputRange: ['#dfdfdf', '#1c77ff']
    })
    return(
      <View>
        <TouchableWithoutFeedback onPress={this.toggleDropDown}>
          <Animated.View style={[styles.dropDownHeader, {borderColor: colorAnim}]}>
            <Text style={!this.state.activated ? {color: '#aaaaaa'} : null}>{this.state.activated ? this.props.data[this.state.selectedIndex] : this.props.placeholder}</Text>
            <Animated.View style={{transform: [{rotate: spin}]}}>
              <Icon name="chevron-small-down" type="entypo" />
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
        
        {this.dropDownHeight!=0
        ? <Animated.View style={[styles.dropDownBox, {height: this.dropDownHeight, opacity: this.dropDownHeight}]}>
          <ScrollView>
            {this.props.data.map((item, index)=>(
              <TouchableOpacity key={index} onPress={()=>{this.toggleDropDown(); this.sendValue(index)}} style={{padding: 7}}>
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          </Animated.View>
        : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dropDownHeader:{
    width: '60%',
    padding: 7,
    marginTop: 20,
    paddingVertical: 2,
    borderRadius: 10,
    borderColor: '#dfdfdf',
    borderWidth: 2,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',  
  },
  dropDownBox:{
    borderWidth: 2,
    borderColor: '#1c77ff',
    borderRadius: 10,
    width: '60%',
    alignSelf: 'center',
    marginTop: 5,
  }
})