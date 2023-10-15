import 'package:get/get.dart';
import 'package:ori_dx_app/Models/Admin.dart';
import 'package:ori_dx_app/Models/Doctor.dart';
import 'package:ori_dx_app/Models/Patient.dart';

class AppShared extends GetxController {
  static String username = "mmoo";
  static Doctor? doctor;
  static Patient  ? patient;
  static Admin? admin;

  static Map<int, String> specialities = {
    0: "Family medicine",
    1: "Internal Medicine",
    2: "Pediatrician",
    3: "Gynecologist",
    4: "Cardiologist",
    5: "Oncologist",
    6: "Gastroenterologist",
    7: "Pulmonologist",
    8: "Infectious disease",
    9: "Nephrologist",
    10: "Endocrinologist",
    11: "Ophthalmologist",
    12: "Otolaryngologist",
    13: "Dermatologist",
    14: "Psychiatrist",
    15: "Neurologist",
    16: "Radiologist",
    17: "Anesthesiologist",
    18: "Surgeon",
    19: "Physician executive",
    20: "Anesthesiology",
    21: "Allergy and immunology",
    22: "Dermatology",
    23: "Emergency medicine",
    24: "Medical genetics",
  };
}
