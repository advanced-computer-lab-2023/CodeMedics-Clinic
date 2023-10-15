import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Doctor/Controllers/AppointmentsControllers/DoctorAppointmentsController.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Controllers/Patients/PatientsController.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Views/Widgets/Patients/PatientsWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/DoctorsControllers/DoctorsController.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/FamilyMembersControllers/FamilyMembersController.dart';

import 'package:ori_dx_app/Models/Doctor.dart';

import 'package:ori_dx_app/shared/AppColors.dart';

class DoctorPageController extends getx.GetxController {
  Color patientsColor = Colors.white;
  Color patientsFontColor = AppColors.mainColor;

  Color doctorsColor = AppColors.mainColor;
  Color doctorsFontColor = Colors.white;

  Color prescriptionsColor = AppColors.mainColor;
  Color prescriptionsFontColor = Colors.white;

  Color appointmentsColor = AppColors.mainColor;
  Color appointmentsFontColor = Colors.white;

  bool patientsSelected = true;
  bool doctorsSelected = false;
  bool prescriptionsSelected = false;
  bool appointmentsSelected = false;

  bool familyMemberintialized = true;
  bool doctorsintialized = false;
  bool prescriptionsintialized = false;
  bool appointmentsintialized = false;

  List<Doctor> doctors = [];
  List<Doctor> filteredDoctors = [];

  void resetColors() {
    patientsColor = AppColors.mainColor;
    patientsFontColor = Colors.white;
    doctorsColor = AppColors.mainColor;
    doctorsFontColor = Colors.white;
    prescriptionsColor = AppColors.mainColor;
    prescriptionsFontColor = Colors.white;
    appointmentsColor = AppColors.mainColor;
    appointmentsFontColor = Colors.white;
  }

  void resetWidgets() {
    patientsSelected = false;
    doctorsSelected = false;
    prescriptionsSelected = false;
    appointmentsSelected = false;
  }

  void onTapPatient() {
    resetColors();
    patientsColor = Colors.white;
    patientsFontColor = AppColors.mainColor;
    update(['tapsBuilder']);
    if (patientsSelected) return;
    resetWidgets();
    patientsSelected = true;
    if (familyMemberintialized) {
      getx.Get.find<PatientsController>().loadPatients();
      getx.Get.find<PatientsController>().getAppointments();
    }
    update(['patientPageBuilder']);
  }

  void onTapDoctors() {
    resetColors();
    doctorsColor = Colors.white;
    doctorsFontColor = AppColors.mainColor;
    update(['tapsBuilder']);
    if (doctorsSelected) return;
    resetWidgets();
    doctorsSelected = true;
    if (doctorsintialized) {
      getx.Get.find<DoctorsController>().loadDoctors();
    }
    doctorsintialized = true;
    update(['patientPageBuilder']);
  }

  void onTapPrescriptions() {
    resetColors();
    prescriptionsColor = Colors.white;
    prescriptionsFontColor = AppColors.mainColor;
    update(['tapsBuilder']);
    if (prescriptionsSelected) return;
    resetWidgets();
    prescriptionsSelected = true;
    if (prescriptionsintialized) {
      getx.Get.find<DoctorsController>().loadDoctors();
    }
    prescriptionsintialized = true;
    update(['patientPageBuilder']);
  }

  void onTapAppointments() {
    resetColors();
    appointmentsColor = Colors.white;
    appointmentsFontColor = AppColors.mainColor;
    update(['tapsBuilder']);
    if (appointmentsSelected) return;
    resetWidgets();
    appointmentsSelected = true;
    if (appointmentsintialized) {
      getx.Get.find<DoctorAppointmentsController>().getAppointments();
    }
    appointmentsintialized = true;
    update(['patientPageBuilder']);
  }
}
