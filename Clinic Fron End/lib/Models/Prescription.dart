class Prescription {
  String drug = "";
  String doctor = "";
  String patient = "";
  String date = "";
  bool filled = true;

  Prescription.fromJson(Map<String, dynamic> json) {
    drug = json['Drug'];
    doctor = json['Doctor'];
    patient = json['Patient'];
    date = json['Date'];
    filled = json['filled'];
  }
}
