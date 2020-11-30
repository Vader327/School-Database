import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, Alert, 
TextInput, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Avatar, BottomSheet } from 'react-native-elements';
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import firebase from 'firebase';
import db from "../config";
import MyHeader from '../components/MyHeader';

export default class SettingsScreen extends React.Component{
  constructor(){
    super();
    this.state={
      email: firebase.auth().currentUser.email,
      schoolName: '',
      address: '',
      contact: '',
      image: '#',
      docId: '',
      isModalVisible: false,
      hasCameraPermisson: false,
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

  updateUserDetails=()=>{
    if(this.state.schoolName != "" && this.state.contact != "" && this.state.address != ""){
      db.collection('users').doc(this.state.docId).update({
        "school_name": this.state.schoolName,
        "contact": this.state.contact,
        "address": this.state.address,
      })
      Alert.alert("Profile Updated Successfully!")
    }
    else{
      Alert.alert("Fields cannot be Empty!")
    }
  }

  getCameraPermission=async()=>{
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermisson: status === "granted"})
  }

  selectPicture=async(type)=>{
    if(type=="gallery"){
      const {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      if(!cancelled){this.uploadImage(uri, this.state.email)}
      this.setState({isModalVisible: false})
    }
    else if(type=="camera"){
      await this.getCameraPermission()
      const {cancelled, uri} = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      if(!cancelled){this.uploadImage(uri, this.state.email)}
      this.setState({isModalVisible: false})
    }
  }

  uploadImage=async(uri, imageName)=>{
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase.storage().ref().child('school_logos/' + imageName)

    return ref.put(blob).then(()=>{
      this.fetchImage(imageName);
      Alert.alert("Profile Picture Updated Successfully! Changes may take time to be displayed.")
    })
  }

  fetchImage=(imageName)=>{
    firebase.storage().ref().child('school_logos/' + imageName).getDownloadURL()
    .then((url)=>{this.setState({image: url})})
    .catch((err)=>{this.setState({image: '#'})})
  }

  componentDidMount(){
    this.fetchImage(this.state.email);
    this.getData();
  }

  render(){
    return (
      <View style={{height: '100%'}}>
        <MyHeader title="Settings" navigation={this.props.navigation} />
        <KeyboardAvoidingView enabled behavior="padding" style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingVertical: 20}}>
            <View style={styles.container}>
              <Text style={styles.title}>Profile</Text>
              <Avatar rounded source={{uri: this.state.image}} size="xlarge"
              icon={{name: "school", type: "font-awesome-5"}} containerStyle={{alignSelf: 'center', marginBottom: 10}}
              onPress={()=>{this.setState({isModalVisible: true})}}>
                <Avatar.Accessory size={40} style={{marginRight: 10}} />
              </Avatar>

              <View style={styles.field}>
                <Text style={{fontWeight: 'bold', width: 70}}>Name: </Text>
                <TextInput style={styles.input} placeholder="School Name"
                onChangeText={(text)=>{this.setState({schoolName: text})}} value={this.state.schoolName} />
              </View>

              <View style={styles.field}>
                <Text style={{fontWeight: 'bold', width: 70}}>Address: </Text>
                <TextInput style={[styles.input, {bottom: 5}]} placeholder="Address" multiline
                onChangeText={(text)=>{this.setState({address: text})}} value={this.state.address} />
              </View>

              <View style={styles.field}>
                <Text style={{fontWeight: 'bold', width: 70}}>Contact: </Text>
                <TextInput style={styles.input} placeholder="Contact" keyboardType="number-pad" maxLength={10}
                onChangeText={(text)=>{this.setState({contact: text})}} value={this.state.contact} />
              </View>
              
              <View style={styles.field}>
                <Text style={{fontWeight: 'bold', color: 'lightgray', width: 70}}>Email: </Text>
                <TextInput style={[styles.input, {borderBottomColor: 'lightgray', color: 'lightgray'}]}
                editable={false} value={this.state.email} />
              </View>

              <TouchableOpacity onPress={this.updateUserDetails} style={styles.updateButton}>
                  <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>

            <BottomSheet isVisible={this.state.isModalVisible}>
              <View style={{alignItems: 'center', height: '100%'}}>

                <View style={styles.menuButton}>
                  <TouchableHighlight style={[styles.optionButton, {borderTopRightRadius: 10, borderTopLeftRadius: 10}]}
                  onPress={()=>{this.selectPicture("camera")}} underlayColor="#dfdfdf">
                    <Text style={styles.menuText}>Camera</Text>
                  </TouchableHighlight>

                  <View style={{width: '100%', height: 2, backgroundColor: '#fafafa'}} />

                  <TouchableHighlight style={[styles.optionButton, {borderBottomRightRadius: 10, borderBottomLeftRadius: 10}]}
                  onPress={()=>{this.selectPicture("gallery")}} underlayColor="#dfdfdf">
                    <Text style={styles.menuText}>Gallery</Text>
                  </TouchableHighlight>
                </View>

                <TouchableHighlight style={styles.menuButton} onPress={()=>{this.setState({isModalVisible: false})}}
                underlayColor="#dfdfdf">
                  <Text style={[styles.menuText, {fontWeight: '600', margin: 15}]}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </BottomSheet>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  field:{
    flexDirection: 'row',
    margin: 10,
  },
  input:{
		borderBottomColor: "#1c77ff",
    borderBottomWidth: 3,
    flex: 1,
  },
  title:{
    fontWeight: 'bold',
    fontSize: 23,
    alignSelf: 'center',
    marginBottom: 20,
  },
  container:{
    width: '90%',
    borderRadius: 20,
    shadowColor: "#afafaf",
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 16,
    backgroundColor: 'white',
    alignSelf: 'center',
    paddingVertical: 20,
  },
  updateButton:{
    marginTop: 50,
    marginBottom: 20,
		alignSelf: 'center',
		backgroundColor: '#1c77ff',
		width: '60%',
		height: 40,
		borderRadius: 7,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: "#1c77ff",
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
		shadowRadius: 15,
    elevation: 16,
		transform: [{scale: 1}],
	},
	buttonText:{
		color: '#ffffff',
		fontSize: 17,
    fontWeight: 'bold',
		alignSelf: 'center',
  },
  menuButton:{
    backgroundColor: 'white',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    borderRadius: 10,
  },
  menuText:{
    color: '#0a84ff',
    fontSize: 18,
  },
  optionButton:{
    width: '100%',
    alignItems: 'center',
    padding: 15,
  },
});
