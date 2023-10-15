class Doctor {
  String id = "";
  String firstName = "";
  String lastName = "";
  String username = "";
  String password = "";
  String email = "";
  String dateOfBirth = "";
  int hourlyRate = 0;
  String affiliation = "";
  String speciality = "";
  String degree = "";
  String status = "";
  List<String> patients = [];
  List<String> appointments = [];
  double price = 0;

  Doctor.fromJson(Map<String, dynamic> json) {
    id = json['_id'];
    firstName = json['FirstName'];
    lastName = json['LastName'];
    username = json['Username'];
    password = json['Password'];
    email = json['Email'];
    dateOfBirth = json['DateOfBirth'];
    hourlyRate = json['HourlyRate'];
    affiliation = json['affiliation'];
    speciality = json['Specialty'] ?? "";
    degree = json['Degree'];
    status = json['Status'];
    for (var item in json['Patients']) {
      patients.add(item.toString());
    }
    for (var item in json['Appointments']) {
      appointments.add(item.toString());
    }
  }
}
