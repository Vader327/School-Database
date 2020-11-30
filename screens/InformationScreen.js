import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, KeyboardAvoidingView, ScrollView, TextInput,
TouchableWithoutFeedback, Animated, Alert } from 'react-native';
import { ButtonGroup, Icon } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import DropDown from  '../components/DropDown';
import db from '../config';
import firebase from 'firebase';

export default class InformationScreen extends React.Component{
  constructor(){
    super();
    this.state={
      email: firebase.auth().currentUser.email,
      schoolName: '',
      isModalVisible: false,
      type: '',
      searchActive: 0,
      studentClass: 0,
      studentDiv: '',
      studentRollNo: 0,
      classes: [],
      divs: [],
      rollNos: [],
      teacherNames: [],
      teacherName: "",
      searchActivated: false,
      searchActivatedChecker: false,
      modalType: 'register',
      docId: '',

      teacherDetails:{
        name: '',
        email: '',
        address: '',
        mobile_no: 0,
        birthDate: 0,
        birthMonth: 0,
        birthYear: 0,
        joinDate: 0,
        joinMonth: 0,
        joinYear: 0,
      },
      studentDetails:{
        name: '',
        age: 0,
        class: 0,
        roll_no: 0,
        div: 'A',
        house: 'green',
        uid: 0,
        address: '',
        mother_name: '',
        mother_email: '',
        mother_no: 0,
        father_name: '',
        father_email: '',
        father_no: 0,
        blood_grp: '',
      }
    }
  }

  getData=()=>{
    var classes = [];
    var divs = [];
    var rollNos=[];
    db.collection(this.state.email).where('type', '==', 'student').get().then((snapshot)=>{
      snapshot.forEach(doc=>{
        classes.push(doc.data().class);
        divs.push(doc.data().div);
        rollNos.push(doc.data().roll_no);
      })
      divs = divs.filter((value, index) => divs.indexOf(value) === index);
      divs.sort();
      this.setState({
        classes: classes.sort((a,b)=>(a-b)),
        divs: divs,
        rollNos: rollNos.sort((a,b)=>(a-b)),
      });
    })

    var teacherNames = [];
    db.collection(this.state.email).where('type', '==', 'teacher').get().then((snapshot)=>{
      snapshot.forEach(doc=>{teacherNames.push(doc.data().name)})
      this.setState({teacherNames: teacherNames});
    })
  }

  searchStudent=()=>{
    var studentClass = this.state.studentClass;
    var studentDiv = this.state.studentDiv;
    var studentRollNo = this.state.studentRollNo;

    if(studentClass != 0 && studentDiv != "" && studentRollNo != 0){
      this.setState({searchActivatedChecker: true, searchActivated: false})

      db.collection(this.state.email).where('type', '==', 'student')
      .where('class', '==', studentClass)
      .where('div', '==', studentDiv)
      .where('roll_no', '==', studentRollNo)
      .get().then((snapshot)=>{
        snapshot.forEach(doc=>{
          var data = doc.data();
          this.setState({studentDetails: {...this.state.studentDetails,
            name: data.name,
            age: data.age,
            class: data.class,
            roll_no: data.roll_no,
            div: data.div,
            house: data.house,
            uid: data.uid,
            address: data.address,
            mother_name: data.mother_name,
            mother_email: data.mother_email,
            mother_no: data.mother_no,
            father_name: data.father_name,
            father_email: data.father_email,
            father_no: data.father_no,
            blood_grp: data.blood_grp,
          }, searchActivated: true, searchActivatedChecker: true, docId: doc.id})
        })
      })
    }
  }

  searchTeacher=()=>{
    var teacherName = this.state.teacherName;

    if(teacherName != ""){
      this.setState({searchActivatedChecker: true, searchActivated: false})

      db.collection(this.state.email).where('type', '==', 'teacher').where('name', '==', teacherName).get().then((snapshot)=>{
        snapshot.forEach(doc=>{
          var data = doc.data();
          this.setState({teacherDetails: {...this.state.teacherDetails,
            name: data.name,
            email: data.email,
            address: data.address,
            mobile_no: data.mobile_no,
            birthDate: data.birthDate,
            birthMonth: data.birthMonth,
            birthYear: data.birthYear,
            joinDate: data.joinDate,
            joinMonth: data.joinMonth,
            joinYear: data.joinYear,
          }, searchActivated: true, searchActivatedChecker: true, docId: doc.id})
        })
      })
    }
  }

  componentDidMount(){
    this.getData();
  }
  	
	validate=(email)=>{
		var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		return reg.test(email)
	}

  add=(type)=>{
    var studentDetails = this.state.studentDetails;
    var teacherDetails = this.state.teacherDetails;

    if(type=="teacher"){
      if(teacherDetails.name!="" && teacherDetails.address!="" && teacherDetails.email!=""
      && teacherDetails.birthDate!="" && teacherDetails.birthMonth!="" && teacherDetails.birthYear!=""
      && teacherDetails.joinDate!="" && teacherDetails.joinMonth!="" && teacherDetails.joinYear!=""){
        var age = teacherDetails.joinYear - teacherDetails.birthYear;
        if(teacherDetails.mobile_no!=0 && teacherDetails.birthDate>0 && teacherDetails.birthDate<=31
          && teacherDetails.birthMonth>0 && teacherDetails.birthMonth<=12 && teacherDetails.birthYear>1900
          && teacherDetails.birthYear<=1999 && teacherDetails.joinDate>0 && teacherDetails.joinDate<=31
          && teacherDetails.joinMonth>0 && teacherDetails.joinMonth<=12 && teacherDetails.joinYear>1921
          && teacherDetails.joinYear<=1999 && this.validate(teacherDetails.email) && age>=21){
          db.collection(this.state.email).add({
            name: teacherDetails.name,
            address: teacherDetails.address,
            email: teacherDetails.email,
            mobile_no: teacherDetails.mobile_no,
            birthDate: teacherDetails.birthDate,
            birthMonth: teacherDetails.birthMonth,
            birthYear: teacherDetails.birthYear,
            joinDate: teacherDetails.joinDate,
            joinMonth: teacherDetails.joinMonth,
            joinYear: teacherDetails.joinYear,
            type: 'teacher',
          })
          this.setState({isModalVisible: false}, this.getData)
        }
        else if(age < 21){
          Alert.alert("Invalid Age!")
        }
        else if(!this.validate(teacherDetails.email)){
          Alert.alert("Invalid Email!")
        }
        else if(teacherDetails.mobile_no==0 || teacherDetails.mobile_no==""){
          Alert.alert("Invalid Mobile Number!")
        }
        else if((teacherDetails.birthDate<0 || teacherDetails.birthDate>31)
          || (teacherDetails.birthMonth<0 || teacherDetails.birthMonth>12) || (teacherDetails.birthYear<1900
          || teacherDetails.birthYear>1999)){
          Alert.alert("Invalid Date of Birth!")
        }
        else if((teacherDetails.joinDate<0 || teacherDetails.joinDate>31)
          || (teacherDetails.joinMonth<0 || teacherDetails.joinMonth>12) || (teacherDetails.joinYear<1900
          || teacherDetails.joinYear>1999)){
          Alert.alert("Invalid Date of Joining!")
        }
      } else{
        Alert.alert("Fields cannot be empty!")
      }
    }
    else if(type=="student"){
      if(studentDetails.name.trim()!="" && studentDetails.address.trim()!=""
      && studentDetails.house.trim()!="" && studentDetails.div.trim()!="" && studentDetails.blood_grp.trim()!=""){
        var age = parseInt(studentDetails.age);

        if(((studentDetails.mother_name!="" && studentDetails.mother_email!="" && this.validate(studentDetails.mother_email) && studentDetails.mother_no!=0)
        ||(studentDetails.father_name!="" && studentDetails.father_email!="" && this.validate(studentDetails.father_email) && studentDetails.father_no!=0))
        && age>0 && age <= 25 && parseInt(studentDetails.roll_no.trim())>0 && parseInt(studentDetails.class.trim())>0
        && parseInt(studentDetails.uid.trim())>0){
          db.collection(this.state.email).add({
            name: studentDetails.name,
            address: studentDetails.address,
            age: studentDetails.age,
            house: studentDetails.house,
            class: studentDetails.class,
            div: studentDetails.div,
            roll_no: studentDetails.roll_no,
            uid: studentDetails.uid,
            mother_name: studentDetails.mother_name,
            mother_email: studentDetails.mother_email,
            mother_no: studentDetails.mother_no,
            father_name: studentDetails.father_name,
            father_email: studentDetails.father_email,
            father_no: studentDetails.father_no,
            blood_grp: studentDetails.blood_grp,
            type: 'student',
          })
          this.setState({isModalVisible: false}, this.getData)
        }

        else if(age<=0 || age >= 25){Alert.alert("Invalid Age!")}
        else if(studentDetails.roll_no<=0){
          Alert.alert("Invalid Roll Number!")
        }
        else if(studentDetails.class<=0){
          Alert.alert("Invalid Class!")
        }
        else if(studentDetails.uid<=0){
          Alert.alert("Invalid Student ID!")
        }
        else if(!this.validate(studentDetails.mother_email) || !this.validate(studentDetails.father_email)){
          Alert.alert("Invalid Guardian's Email!")
        }
        else if((studentDetails.mother_name=="" && studentDetails.mother_email=="" && studentDetails.mother_no==0)
        ||(studentDetails.father_name=="" && studentDetails.father_email=="" && studentDetails.father_no==0)){
          Alert.alert("Please enter any one Guardian's Information")
        }        
      } else{
        Alert.alert("Fields cannot be empty!")
      }
    }
  }

  update=(type)=>{
    var studentDetails = this.state.studentDetails;
    var teacherDetails = this.state.teacherDetails;

    if(type=="teacher"){
      if(teacherDetails.name!="" && teacherDetails.address!="" && teacherDetails.email!=""
      && teacherDetails.birthDate!="" && teacherDetails.birthMonth!="" && teacherDetails.birthYear!=""
      && teacherDetails.joinDate!="" && teacherDetails.joinMonth!="" && teacherDetails.joinYear!=""){
        var age = teacherDetails.joinYear - teacherDetails.birthYear;
        if(teacherDetails.mobile_no!=0 && teacherDetails.birthDate>0 && teacherDetails.birthDate<=31
          && teacherDetails.birthMonth>0 && teacherDetails.birthMonth<=12 && teacherDetails.birthYear>1900
          && teacherDetails.birthYear<=1999 && teacherDetails.joinDate>0 && teacherDetails.joinDate<=31
          && teacherDetails.joinMonth>0 && teacherDetails.joinMonth<=12 && teacherDetails.joinYear>1921
          && teacherDetails.joinYear<=1999 && this.validate(teacherDetails.email) && age>=21){
          db.collection(this.state.email).doc(this.state.docId).update({
            name: teacherDetails.name,
            address: teacherDetails.address,
            email: teacherDetails.email,
            mobile_no: teacherDetails.mobile_no,
            birthDate: teacherDetails.birthDate,
            birthMonth: teacherDetails.birthMonth,
            birthYear: teacherDetails.birthYear,
            joinDate: teacherDetails.joinDate,
            joinMonth: teacherDetails.joinMonth,
            joinYear: teacherDetails.joinYear,
            type: 'teacher',
          })
          this.setState({isModalVisible: false}, this.getData)
        }
        else if(age < 21){
          Alert.alert("Invalid Age!")
        }
        else if(!this.validate(teacherDetails.email)){
          Alert.alert("Invalid Email!")
        }
        else if(teacherDetails.mobile_no==0 || teacherDetails.mobile_no==""){
          Alert.alert("Invalid Mobile Number!")
        }
        else if((teacherDetails.birthDate<0 || teacherDetails.birthDate>31)
          || (teacherDetails.birthMonth<0 || teacherDetails.birthMonth>12) || (teacherDetails.birthYear<1900
          || teacherDetails.birthYear>1999)){
          Alert.alert("Invalid Date of Birth!")
        }
        else if((teacherDetails.joinDate<0 || teacherDetails.joinDate>31)
          || (teacherDetails.joinMonth<0 || teacherDetails.joinMonth>12) || (teacherDetails.joinYear<1900
          || teacherDetails.joinYear>1999)){
          Alert.alert("Invalid Date of Joining!")
        }
      } else{
        Alert.alert("Fields cannot be empty!")
      }
    }
    else if(type=="student"){
      if(studentDetails.name.trim()!="" && studentDetails.address.trim()!=""
      && studentDetails.house.trim()!="" && studentDetails.div.trim()!="" && studentDetails.blood_grp.trim()!=""){
        var age = parseInt(studentDetails.age);

        if(((studentDetails.mother_name!="" && studentDetails.mother_email!="" && this.validate(studentDetails.mother_email) && studentDetails.mother_no!=0)
        ||(studentDetails.father_name!="" && studentDetails.father_email!="" && this.validate(studentDetails.father_email) && studentDetails.father_no!=0))
        && age>0 && age <= 25 && parseInt(studentDetails.roll_no.trim())>0 && parseInt(studentDetails.class.trim())>0
        && parseInt(studentDetails.uid.trim())>0){
          db.collection(this.state.email).doc(this.state.docId).update({
            name: studentDetails.name,
            address: studentDetails.address,
            age: studentDetails.age,
            house: studentDetails.house,
            class: studentDetails.class,
            div: studentDetails.div,
            roll_no: studentDetails.roll_no,
            uid: studentDetails.uid,
            mother_name: studentDetails.mother_name,
            mother_email: studentDetails.mother_email,
            mother_no: studentDetails.mother_no,
            father_name: studentDetails.father_name,
            father_email: studentDetails.father_email,
            father_no: studentDetails.father_no,
            blood_grp: studentDetails.blood_grp,
            type: 'student',
          })
          this.setState({isModalVisible: false}, this.getData)
        }

        else if(age<=0 || age >= 25){Alert.alert("Invalid Age!")}
        else if(studentDetails.roll_no<=0){
          Alert.alert("Invalid Roll Number!")
        }
        else if(studentDetails.class<=0){
          Alert.alert("Invalid Class!")
        }
        else if(studentDetails.uid<=0){
          Alert.alert("Invalid Student ID!")
        }
        else if(!this.validate(studentDetails.mother_email) || !this.validate(studentDetails.father_email)){
          Alert.alert("Invalid Guardian's Email!")
        }
        else if((studentDetails.mother_name=="" && studentDetails.mother_email=="" && studentDetails.mother_no==0)
        ||(studentDetails.father_name=="" && studentDetails.father_email=="" && studentDetails.father_no==0)){
          Alert.alert("Please enter any one Guardian's Information")
        }        
      } else{
        Alert.alert("Fields cannot be empty!")
      }
    }
  }

  deleteStudent=()=>{
    db.collection(this.state.email).where('type', '==', 'student')
    .where('class', '==', this.state.studentClass)
    .where('div', '==', this.state.studentDiv)
    .where('roll_no', '==', this.state.studentRollNo)
    .get().then((snapshot)=>{snapshot.forEach((doc)=>{
      doc.ref.delete();
      this.setState({studentClass: 0, studentDiv: '', studentRollNo: 0, searchActivated: false,
      searchActivatedChecker: false}, this.getData)
    })});
  }

  deleteTeacher=()=>{
    db.collection(this.state.email).where('type', '==', 'teacher')
    .where('name', '==', this.state.teacherName)
    .get().then((snapshot)=>{snapshot.forEach((doc)=>{
      doc.ref.delete();
      this.setState({teacherName: '', searchActivated: false,
      searchActivatedChecker: false}, this.getData)
    })});
  }

  registerModal=()=>{
		return(
			<Modal animationType="slide" transparent={true} visible={this.state.isModalVisible}>
				<View style={styles.modalContainer}>
					<KeyboardAvoidingView behavior="padding" enabled>
            <View style={{width: '100%', backgroundColor: '#1c77ff', paddingTop: 25, paddingBottom: 10}}>
							<Text style={{fontWeight: '600', alignSelf: 'center', fontSize: 20, color:'white'}}>
                {this.state.modalType=="register"
                ? (this.state.type=="teacher" ? "Add Teacher" : "Add Student")
                : "Edit Details"}
              </Text>
            </View>
						<ScrollView contentContainerStyle={{paddingBottom: 60}}>              
              <TextInput style={styles.input} placeholder="Name"
              value={this.state.modalType=="update" ? (this.state.type == 'student' ? this.state.studentDetails.name : this.state.teacherDetails.name) : null}
							onChangeText={(text)=>{
                this.state.type == 'student'
                  ? this.setState({studentDetails: {...this.state.studentDetails, name: text}})
                  : this.setState({teacherDetails: {...this.state.teacherDetails, name: text}})
                }} />

              <TextInput style={styles.input} placeholder="Address" multiline={true}
              value={this.state.modalType=="update" ? (this.state.type == 'student' ? this.state.studentDetails.address : this.state.teacherDetails.address) : null}
							onChangeText={(text)=>{
                this.state.type == 'student'
                  ? this.setState({studentDetails: {...this.state.studentDetails, address: text}})
                  : this.setState({teacherDetails: {...this.state.teacherDetails, address: text}})
                }} />

              {this.state.type=="teacher"
							?(<View>
                  <TextInput style={styles.input} placeholder="Email ID" keyboardType="email-address"
                  value={this.state.modalType=="update" ? this.state.teacherDetails.email : null}
                  onChangeText={(text)=>{this.setState({teacherDetails: {...this.state.teacherDetails, email: text}})}} />

                  <TextInput style={styles.input} placeholder="Contact" keyboardType="number-pad" maxLength={10}
                  value={this.state.modalType=="update" ? this.state.teacherDetails.mobile_no : null}
                  onChangeText={(text)=>{this.setState({teacherDetails: {...this.state.teacherDetails, mobile_no: text}})}} />

                  <View style={{left: '10%', marginTop: 30, flexDirection: 'row'}}>
                    <Text style={{marginRight: 5}}>Date Of Birth: </Text>
                    
                    <TextInput style={styles.dateInput} keyboardType="number-pad" maxLength={2}
                    value={this.state.modalType=="update" ? this.state.teacherDetails.birthDate : null}
                    onChangeText={(text)=>{this.setState({teacherDetails: {...this.state.teacherDetails, birthDate: text}})}} />

                    <Text style={{marginHorizontal: 3}}>/</Text>

                    <TextInput style={styles.dateInput} keyboardType="number-pad" maxLength={2}
                    value={this.state.modalType=="update" ? this.state.teacherDetails.birthMonth : null}
                    onChangeText={(text)=>{this.setState({teacherDetails: {...this.state.teacherDetails, birthMonth: text}})}} />
                    
                    <Text style={{marginHorizontal: 3}}>/</Text>
                    
                    <TextInput style={[styles.dateInput, {width: 50}]} keyboardType="number-pad" maxLength={4}
                    value={this.state.modalType=="update" ? this.state.teacherDetails.birthYear : null}
                    onChangeText={(text)=>{this.setState({teacherDetails: {...this.state.teacherDetails, birthYear: text}})}} />
                  </View>

                  <View style={{left: '10%', marginTop: 30, flexDirection: 'row'}}>
                    <Text style={{marginRight: 5}}>Date Of Joining: </Text>

                    <TextInput style={styles.dateInput} keyboardType="number-pad" maxLength={2}
                    value={this.state.modalType=="update" ? this.state.teacherDetails.joinDate : null}
                    onChangeText={(text)=>{this.setState({teacherDetails: {...this.state.teacherDetails, joinDate: text}})}} />

                    <Text style={{marginHorizontal: 3}}>/</Text>

                    <TextInput style={styles.dateInput} keyboardType="number-pad" maxLength={2}
                    value={this.state.modalType=="update" ? this.state.teacherDetails.joinMonth : null}
                    onChangeText={(text)=>{this.setState({teacherDetails: {...this.state.teacherDetails, joinMonth: text}})}} />

                    <Text style={{marginHorizontal: 3}}>/</Text>

                    <TextInput style={[styles.dateInput, {width: 50}]} keyboardType="number-pad" maxLength={4}
                    value={this.state.modalType=="update" ? this.state.teacherDetails.joinYear : null}
                    onChangeText={(text)=>{this.setState({teacherDetails: {...this.state.teacherDetails, joinYear: text}})}} />
                  </View>
                </View>)
              : <View>
                  <TextInput style={styles.input} placeholder="Age" keyboardType="number-pad" maxLength={2}
                  value={this.state.modalType=="update" ? this.state.studentDetails.age : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, age: text}})}} />

                  <TextInput style={styles.input} placeholder="Mother's Name"
                  value={this.state.modalType=="update" ? this.state.studentDetails.mother_name : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, mother_name: text}})}} />

                  <TextInput style={styles.input} placeholder="Mother's Email" keyboardType="email-address"
                  value={this.state.modalType=="update" ? this.state.studentDetails.mother_email : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, mother_email: text}})}} />

                  <TextInput style={styles.input} placeholder="Mother's Number" keyboardType="number-pad" maxLength={10}
                  value={this.state.modalType=="update" ? this.state.studentDetails.mother_no : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, mother_no: text}})}} />

                  <TextInput style={styles.input} placeholder="Father's Name"
                  value={this.state.modalType=="update" ? this.state.studentDetails.father_name : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, father_name: text}})}} />

                  <TextInput style={styles.input} placeholder="Father's Email" keyboardType="email-address"
                  value={this.state.modalType=="update" ? this.state.studentDetails.father_email : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, father_email: text}})}} />

                  <TextInput style={styles.input} placeholder="Father's Number" keyboardType="number-pad" maxLength={10}
                  value={this.state.modalType=="update" ? this.state.studentDetails.father_no : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, father_no: text}})}} />

                  <TextInput style={styles.input} placeholder="Blood Group" maxLength={2}
                  value={this.state.modalType=="update" ? this.state.studentDetails.blood_grp : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, blood_grp: text}})}} />

                  <TextInput style={styles.input} placeholder="House"
                  value={this.state.modalType=="update" ? this.state.studentDetails.house : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, house: text}})}} />

                  <TextInput style={styles.input} placeholder="Class" keyboardType="number-pad" maxLength={2}
                  value={this.state.modalType=="update" ? this.state.studentDetails.class : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, class: text}})}} />

                  <TextInput style={styles.input} placeholder="Division" maxLength={1}
                  value={this.state.modalType=="update" ? this.state.studentDetails.div : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, div: text}})}} />

                  <TextInput style={styles.input} placeholder="Roll Number" keyboardType="number-pad" maxLength={3}
                  value={this.state.modalType=="update" ? this.state.studentDetails.roll_no : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, roll_no: text}})}} />

                  <TextInput style={styles.input} placeholder="Student ID" keyboardType="number-pad"
                  value={this.state.modalType=="update" ? this.state.studentDetails.uid : null}
                  onChangeText={(text)=>{this.setState({studentDetails: {...this.state.studentDetails, uid: text}})}} />                  
                </View>}

							<View style={styles.buttonContainer}>
								<TouchableOpacity style={[styles.login, {marginTop: 0}]}
                onPress={()=>{(this.state.modalType == 'register' ? this.add(this.state.type): this.update(this.state.type));}}>
									<Text style={styles.buttonText}>{this.state.modalType == 'register' ? "Add" : "Update"}</Text>
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

  studentDetailsView=()=>{
    var studentDetails = this.state.studentDetails;
    return(
      <View style={{width: '80%', alignSelf: 'center'}}>
        <View style={styles.field}>
          <Text style={styles.fieldName}>Name: </Text>
          <Text style={styles.fieldValue}>{studentDetails.name}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldName}>Age: </Text>
          <Text style={styles.fieldValue}>{studentDetails.age}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldName}>Class: </Text>
          <Text style={styles.fieldValue}>{studentDetails.class}</Text>
        </View>
        
        <View style={styles.field}>
          <Text style={styles.fieldName}>Roll Number: </Text>
          <Text style={styles.fieldValue}>{studentDetails.roll_no}</Text>
        </View>
        
        <View style={styles.field}>
          <Text style={styles.fieldName}>Division: </Text>
          <Text style={styles.fieldValue}>{studentDetails.div}</Text>
        </View>
        
        <View style={styles.field}>
          <Text style={styles.fieldName}>House: </Text>
          <Text style={styles.fieldValue}>{studentDetails.house}</Text>
        </View>
        
        <View style={styles.field}>
          <Text style={styles.fieldName}>GR Number: </Text>
          <Text style={styles.fieldValue}>{studentDetails.uid}</Text>
        </View>
        
        <View style={styles.field}>
          <Text style={styles.fieldName}>Address: </Text>
          <Text style={styles.fieldValue}>{studentDetails.address}</Text>
        </View>
        
        <View style={styles.field}>
          <Text style={styles.fieldName}>Mother's Name: </Text>
          <Text style={styles.fieldValue}>{studentDetails.mother_name}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldName}>Mother's Email: </Text>
          <Text style={styles.fieldValue}>{studentDetails.mother_email}</Text>
        </View>
        
        <View style={styles.field}>
          <Text style={styles.fieldName}>Mother's Number: </Text>
          <Text style={styles.fieldValue}>{studentDetails.mother_no}</Text>
        </View>
        
        <View style={styles.field}>
          <Text style={styles.fieldName}>Father's Name: </Text>
          <Text style={styles.fieldValue}>{studentDetails.father_name}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldName}>Father's Email: </Text>
          <Text style={styles.fieldValue}>{studentDetails.father_email}</Text>
        </View>
        
        <View style={styles.field}>
          <Text style={styles.fieldName}>Father's Number: </Text>
          <Text style={styles.fieldValue}>{studentDetails.father_no}</Text>
        </View>

        <TouchableOpacity style={[styles.notFound, {backgroundColor: '#1c77ff'}]}
        onPress={()=>{this.setState({isModalVisible: true, modalType: 'update', type: 'student'})}}>
          <Text style={styles.notFoundText}>Edit Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.notFound} onPress={this.deleteStudent}>
          <Text style={styles.notFoundText}>Delete Student</Text>
        </TouchableOpacity>
      </View>
    )
  }

  teacherDetailsView=()=>{
    var teacherDetails = this.state.teacherDetails;
    return(
      <View style={{width: '80%', alignSelf: 'center'}}>
        <View style={styles.field}>
          <Text style={styles.fieldName}>Name: </Text>
          <Text style={styles.fieldValue}>{teacherDetails.name}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldName}>Email: </Text>
          <Text style={styles.fieldValue}>{teacherDetails.email}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldName}>Address: </Text>
          <Text style={styles.fieldValue}>{teacherDetails.address}</Text>
        </View>
        
        <View style={styles.field}>
          <Text style={styles.fieldName}>Mobile Number: </Text>
          <Text style={styles.fieldValue}>{teacherDetails.mobile_no}</Text>
        </View>
        
        <View style={[styles.field, {marginTop: 30, flexDirection: 'row', height: 27}]}>
          <Text style={styles.fieldName}>Date Of Birth: </Text>
          <Text style={styles.fieldValue}>{teacherDetails.birthDate}/{teacherDetails.birthMonth}/{teacherDetails.birthYear}</Text>
        </View>

        <View style={[styles.field, {marginTop: 30, flexDirection: 'row', height: 27}]}>
          <Text style={styles.fieldName}>Date Of Joining: </Text>
          <Text style={styles.fieldValue}>{teacherDetails.joinDate}/{teacherDetails.joinMonth}/{teacherDetails.joinYear}</Text>
        </View>

        <TouchableOpacity style={[styles.notFound, {backgroundColor: '#1c77ff'}]}
        onPress={()=>{this.setState({isModalVisible: true, modalType: 'update', type: 'teacher'})}}>
          <Text style={styles.notFoundText}>Edit Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.notFound} onPress={this.deleteTeacher}>
          <Text style={styles.notFoundText}>Delete Teacher</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render(){
    return (
      <View style={{height: '100%', flex: 1}}>
        <MyHeader title="Information" navigation={this.props.navigation} />
        <View style={{alignContent: 'center', justifyContent: 'center'}}>
					{this.registerModal()}
				</View>
        <ScrollView contentContainerStyle={{paddingBottom: 60}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <TouchableOpacity style={styles.addButton} onPress={()=>{this.setState({type: 'student', isModalVisible: true, modalType: 'register'})}}>
              <Text style={styles.addButtonText}>Add Student</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={()=>{this.setState({type: 'teacher', isModalVisible: true, modalType: 'register'})}}>
              <Text style={styles.addButtonText}>Add Teacher</Text>
            </TouchableOpacity>
          </View>

          <ButtonGroup buttons={['Students', 'Teachers']} selectedIndex={this.state.searchActive} containerStyle={{height: 30, marginVertical: 20}}
          onPress={(index)=>{
          this.setState({searchActive: index, searchActivated: false, searchActivatedChecker: false,
          teacherName: '', studentClass: 0, studentDiv: '', studentRollNo: 0})}} /> 
          
          {this.state.searchActive==0
          ? <View>
              <DropDown data={this.state.classes} result={(res)=>{this.setState({studentClass: res})}}
              placeholder="Select Class" />
              <DropDown data={this.state.divs} result={(res)=>{this.setState({studentDiv: res})}}
              placeholder="Select Division" />
              <DropDown data={this.state.rollNos} result={(res)=>{this.setState({studentRollNo: res})}}
              placeholder="Select Roll Number" />

              <TouchableOpacity style={this.state.studentClass != 0 && this.state.studentDiv != "" && this.state.studentRollNo != 0
              ? [styles.addButton, {alignSelf: 'center', marginTop: 30}]
              : [styles.addButton, {alignSelf: 'center', backgroundColor: '#dddddd', marginTop: 30}]}
              onPress={this.searchStudent}>
                <Text style={styles.addButtonText}>Search</Text>
              </TouchableOpacity>

              {this.state.searchActivatedChecker
                ? this.state.searchActivated
                  ? this.studentDetailsView()
                  : <View style={styles.notFound}>
                      <Text style={styles.notFoundText}>Student not found!</Text>
                    </View>
                : null} 
            </View>

          : <View>
              <DropDown data={this.state.teacherNames} result={(res)=>{this.setState({teacherName: res})}}
              placeholder="Select Teacher" />

              <TouchableOpacity style={this.state.teacherName != ""
              ? [styles.addButton, {alignSelf: 'center', marginTop: 30}]
              : [styles.addButton, {alignSelf: 'center', backgroundColor: '#dddddd', marginTop: 30}]}
              onPress={this.searchTeacher}>
                <Text style={styles.addButtonText}>Search</Text>
              </TouchableOpacity>

              {this.state.searchActivatedChecker
                ? this.state.searchActivated
                  ? this.teacherDetailsView()
                  : <View style={styles.notFound}>
                      <Text style={styles.notFoundText}>Teacher not found!</Text>
                    </View>
                : null}  
            </View>}
       </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addButton:{
    backgroundColor: '#1c77ff',
    margin: 10,
    width: 120,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  addButtonText:{
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer:{
		width: '100%',
		height: '100%',
		alignSelf: 'center',
		backgroundColor: '#ffffff',
	},
	buttonContainer:{
		alignItems: 'center',
		justifyContent: 'center',
    marginTop: 100,
  },
  input:{
		borderBottomColor: 'lightgray',
		borderBottomWidth: 3,
		width: '90%',
		alignSelf: 'center',
		marginTop: 30,
  },
  login:{
		marginTop: 20,
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
		transform: [{scale: 1}]
	},
	buttonText:{
		color: '#ffffff',
		fontSize: 18,
		fontWeight: '600',
		alignSelf: 'center',
  },
  notFound:{
    width: '80%',
    backgroundColor: 'red',
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 30,
  },
  notFoundText:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  field:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: '#1c77ff',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  fieldName:{
    color: '#1c77ff',
    fontWeight: '600',
    fontSize: 17,
    width: 150,
  },
  fieldValue:{
    alignSelf: 'flex-end',
    flex: 1,
  },
  dateInput:{
    width: 30,
    backgroundColor: '#eaeaea',
    borderRadius: 10,
    textAlign: 'center'
  }
});
