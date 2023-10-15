class Appointment {
  String id = "";
  String doctor = "";
  String patient = "";
  String date = "";
  double startHour = 0;
  double endHour = 0;
  String status = "";

  Appointment.fromJson(Map<String, dynamic> json) {
    id = json['_id'];
    doctor = json['doctor'];
    patient = json['patient'];
    date = json['date'];
    startHour = json['startHour'];
    endHour = json['endHour'];
    status = json['status'];
  }
}
