import 'package:ori_dx_app/Models/Prescription.dart';

class Patient {
  String firstName = "";
  String lastName = "";
  String email = "";
  String username = "";
  String password = "";
  String dateOfBirth = "";
  String gender = "";
  String phoneNumber = "";
  List<Prescription> prescriptions = [];
  String package = "";
  List<String> familyMembers = [];
  List<String> appointments = [];

  Patient.fromJson(Map<String, dynamic> json) {
    firstName = json['FirstName'];
    lastName = json['LastName'];
    email = json['Email'];
    username = json['Username'];
    password = json['Password'];
    dateOfBirth = json['DateOfBirth'];
    gender = json['Gender'];
    phoneNumber = json['Number'];
    for (var item in json['Prescriptions']) {
      prescriptions.add(Prescription.fromJson(item));
    }
    package = json['Package'];
    for (var item in json['FamilyMembers']) {
      familyMembers.add(item);
    }
    for (var item in json['Appointments']) {
      appointments.add(item);
    }
  }
}
