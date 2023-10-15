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

class AdminPageController extends getx.GetxController {
  Color patientsColor = AppColors.mainColor;
  Color patientsFontColor = Colors.white;

  Color doctorsColor = AppColors.mainColor;
  Color doctorsFontColor = Colors.white;

  Color prescriptionsColor = AppColors.mainColor;
  Color prescriptionsFontColor = Colors.white;

  Color adminColor = Colors.white;
  Color adminFontColor = AppColors.mainColor;

  bool patientsSelected = false;
  bool doctorsSelected = false;
  bool prescriptionsSelected = false;
  bool adminSelected = true;

  bool familyMemberintialized = false;
  bool doctorsintialized = false;
  bool prescriptionsintialized = false;
  bool adminintialized = true;

  List<Doctor> doctors = [];
  List<Doctor> filteredDoctors = [];

  void resetColors() {
    patientsColor = AppColors.mainColor;
    patientsFontColor = Colors.white;
    doctorsColor = AppColors.mainColor;
    doctorsFontColor = Colors.white;
    prescriptionsColor = AppColors.mainColor;
    prescriptionsFontColor = Colors.white;
    adminColor = AppColors.mainColor;
    adminFontColor = Colors.white;
  }

  void resetWidgets() {
    patientsSelected = false;
    doctorsSelected = false;
    prescriptionsSelected = false;
    adminSelected = false;
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
    update(['adminPageBuilder']);
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
    update(['adminPageBuilder']);
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
    update(['adminPageBuilder']);
  }

  void onTapAppointments() {
    resetColors();
    adminColor = Colors.white;
    adminFontColor = AppColors.mainColor;
    update(['tapsBuilder']);
    if (adminSelected) return;
    resetWidgets();
    adminSelected = true;
    if (adminintialized) {
      getx.Get.find<DoctorAppointmentsController>().getAppointments();
    }
    adminintialized = true;
    update(['adminPageBuilder']);
  }

  void onTapAdmin() {
    resetColors();
    adminColor = Colors.white;
    adminFontColor = AppColors.mainColor;
    update(['tapsBuilder']);
    if (adminSelected) return;
    resetWidgets();
    adminSelected = true;
    if (adminintialized) {
      // getx.Get.find<>().getAppointments();
    }
    adminintialized = true;
    update(['adminPageBuilder']);
  }
}
