import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { Avatar } from 'react-native-elements';
import { DrawerItems } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase';
import db from "../config";

export default class CustomSideBarMenu extends React.Component{
  constructor(){
    super();
    this.state={
      email: firebase.auth().currentUser.email,
      schoolName: '',
      address: '',
      contact: '',
      image: '#',
    }
  }

  getData=()=>{
    db.collection("users").where("email_id", "==", this.state.email).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var data = doc.data();
        this.setState({
          schoolName: data.school_name,
          address: data.address,
          contact: data.contact,
          docId: doc.id,
        })
      })
    })

    firebase.storage().ref().child('school_logos/' + this.state.email).getDownloadURL()
    .then((url)=>{this.setState({image: url})})
    .catch((err)=>{this.setState({image: '#'})})
  }

  componentDidMount(){
    this.getData();
  }

  render(){
    return(
      <View style={{flex: 1}}>
        <View style={{backgroundColor: '#1c77ff', paddingTop: 40, paddingBottom: 10, flexDirection: 'row', justifyContent: "space-evenly"}}>
          <Ionicons name="ios-close" size={40} color="white" style={{alignSelf: 'flex-start', bottom: 10}}
          onPress={()=>{this.props.navigation.toggleDrawer()}} />

          <Avatar rounded source={{uri: this.state.image}} size="large"
          icon={{name: "school", type: "font-awesome-5"}} containerStyle={{alignSelf: 'center', marginBottom: 10}} />

          <View style={{justifyContent: 'center'}}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{this.state.schoolName}</Text>
            <Text style={{color: 'white'}}>{this.state.email}</Text>
          </View>
        </View>

        <View style={{flex: 1}}>
          <DrawerItems {...this.props} />
        </View>

        <View style={{width: '80%', height: 2, backgroundColor: '#eeeeee', alignSelf: 'center'}} />

        <View style={styles.logOutContainer}>
          <TouchableHighlight underlayColor="#eeeeee" onPress={()=>{
            firebase.auth().signOut().then(()=>{
              this.props.navigation.navigate("LoginScreen")
            }).catch(err=>{console.log(err)})
          }}>
            <View style={styles.logOutButton}>
              <Ionicons name="ios-log-out" size={20} color="#696969" />
              <Text style={{fontWeight: '700', marginLeft: 38}}>Log Out</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  logOutContainer:{
    flex: 0.2,
    justifyContent: 'center'
  },
  logOutText:{
    fontWeight: 'bold',
    color: "#000000",
    fontSize: 15,
  },
  logOutButton:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
})