import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Modal, KeyboardAvoidingView, ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { StatusBar } from 'expo-status-bar';
import firebase from 'firebase';
import db from '../config';

export default class LoginScreen extends React.Component{
  constructor(){
    super();
    this.state={
      email: '',
      password: '',
      schoolName: '',
      address: '',
      contact: '',
      confirmPassword: '',
      isModalVisible: false,
    }
	}

  userSignup=(email, password, confirmPassword)=>{
		if(password !== confirmPassword){
			return Alert.alert("Passwords do not match!")
		}
		else if(this.state.contact!=0){
			firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(()=>{
				db.collection("users").add({
					school_name: this.state.schoolName,
					address: this.state.address,
					contact: this.state.contact,
					email_id: this.state.email,
        })
				return Alert.alert("School added successfully!", '', [{
					text: 'Ok',
					onPress: ()=>{this.setState({isModalVisible: false})}}])
			})
			.catch((error)=>Alert.alert(error.message))
		}
		else if(this.state.contact==0){Alert.alert("Invalid Contact!")}
	}

	userLogin=(username, password)=>{
		firebase.auth().signInWithEmailAndPassword(username, password)
		.then(()=>{
			return this.props.navigation.navigate("Dashboard")
		})
		.catch((error)=>Alert.alert(error.message))
  }
  
  showModal=()=>{
		return(
			<Modal animationType="slide" transparent={true} visible={this.state.isModalVisible}>
				<View style={styles.modalContainer}>
					<KeyboardAvoidingView behavior="padding" enabled style={{paddingTop: 20}}>
						<ScrollView>
							<Text style={{fontWeight: '600', alignSelf: 'center', fontSize: 25, color:'#1c77ff'}}>Sign Up</Text>
							<TextInput style={styles.input} placeholder="School Name"
							onChangeText={(text)=>{this.setState({schoolName: text})}} />

							<TextInput style={styles.input} placeholder="Email ID" keyboardType="email-address"
							onChangeText={(text)=>{this.setState({email: text})}} />

							<TextInput style={styles.input} placeholder="Contact" keyboardType="number-pad" maxLength={10}
							onChangeText={(text)=>{this.setState({contact: text})}} />

							<TextInput style={styles.input} placeholder="Address" multiline={true}
							onChangeText={(text)=>{this.setState({address: text})}} />

							<TextInput style={styles.input} placeholder="Password" secureTextEntry={true}
							onChangeText={(text)=>{this.setState({password: text})}} />

							<TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry={true}
							onChangeText={(text)=>{this.setState({confirmPassword: text})}} />

							<View style={styles.buttonContainer}>
								<TouchableOpacity style={[styles.button, {position: 'relative', bottom: 0}]}
								onPress={()=>{this.userSignup(this.state.email, this.state.password, this.state.confirmPassword)}}>
									<Text style={styles.buttonText}>Register</Text>
								</TouchableOpacity>

								<TouchableOpacity onPress={()=>{this.setState({isModalVisible: false})}}>
									<Text style={[styles.buttonText, {color: '#1c77ff', marginTop: 31, marginBottom: 30}]}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
				</View>
			</Modal>
		)
	}

  render(){
    return (
      <View style={{height: '100%'}}>
        <View style={{alignContent: 'center', justifyContent: 'center'}}>
					{this.showModal()}
				</View>
        <StatusBar style="dark" />
        <Text style={{color: '#1c77ff', fontSize: RFValue(40), alignSelf: 'center', marginTop: 50, fontWeight: 'bold'}}>
          School Databank
        </Text>
        <Text style={{fontWeight: 'bold', alignSelf: 'center', textAlign: 'center', marginTop: 20, lineHeight: 20, paddingHorizontal: 5}}>
          For schools to store student and teacher information with ease
        </Text>
        <View style={{marginTop: 20, alignItems: 'center', width: '100%', flex: 1}}>
          <TextInput placeholder="Email" keyboardType="email-address" style={styles.input}
          onChangeText={(text)=>{this.setState({email: text})}} />

          <TextInput placeholder="Password" secureTextEntry={true} style={styles.input}
          onChangeText={(text)=>{this.setState({password: text})}} />
        </View>

        <TouchableOpacity style={styles.button}
        onPress={()=>{this.userLogin(this.state.email, this.state.password)}}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <Text style={[styles.register, {color: 'black', bottom: 100}]}>OR</Text>
        
        <TouchableOpacity onPress={()=>{this.setState({isModalVisible: true})}}
        style={{height: 50, justifyContent: 'center', alignItems: 'center', bottom: 40}} >
          <Text style={styles.register}>Register your School</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button:{
    position: 'absolute',
    bottom: 150,
    borderRadius: 17,
    width: '50%',
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c77ff',
  },
  buttonText:{
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  input:{
		borderBottomColor: 'lightgray',
		borderBottomWidth: 3,
		width: '90%',
		alignSelf: 'center',
		marginTop: 30,
  },
  register:{
    fontWeight: 'bold',
    fontSize: 17,
    color: '#1c77ff',
    alignSelf: 'center',
    position: 'absolute',
  },
  modalContainer:{
		top: '5%',
		width: '90%',
		height: '90%',
		alignSelf: 'center',
		borderRadius: 10,
		backgroundColor: '#ffffff',
		shadowColor: "#000",
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 16,
    paddingBottom: 20
	},
	buttonContainer:{
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 30
	},
});
