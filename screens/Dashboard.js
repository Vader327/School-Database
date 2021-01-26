import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class Dashboard extends React.Component{
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
          contact: "Contact: " + data.contact,
        })
      })
    })

    firebase.storage().ref().child('school_logos/' + this.state.email).getDownloadURL()
    .then((url)=>{this.setState({image: url})})
    .catch((err)=>{this.setState({image: '#'})})
  }

  componentDidMount(){
    this.getData();
    this.props.navigation.addListener('didFocus', this.getData);
  }

  render(){
    return (
      <View style={{height: '100%', flex: 1}} key={new Date().getTime()}>
        <MyHeader title="Dashboard" navigation={this.props.navigation} />

        <StatusBar style="light" backgroundColor="#185dc4" />
        
        <View style={{backgroundColor: '#1c77ff', paddingBottom: 50}}>
          <Text style={{fontWeight: 'bold', fontSize: 40, color: 'white', alignSelf: 'center', marginTop: 20, textAlign: 'center'}}>
            {this.state.schoolName}
          </Text>
          <Text style={styles.description}>{this.state.address}</Text>
          <Text style={styles.description}>{this.state.contact}</Text>
        </View>
        
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Avatar source={{uri: this.state.image}} size="xlarge" containerStyle={{alignSelf: 'center'}}
          avatarStyle={{borderRadius: 20}}
          icon={{name: "school", type: "font-awesome-5"}}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  description:{
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
  }
});
