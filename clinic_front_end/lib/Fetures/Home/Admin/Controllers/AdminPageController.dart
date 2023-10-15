import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Doctors/AdminDoctorController.dart';
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

  Color packagesColor = AppColors.mainColor;
  Color packagesFontColor = Colors.white;

  Color adminColor = Colors.white;
  Color adminFontColor = AppColors.mainColor;

  bool patientsSelected = false;
  bool doctorsSelected = false;
  bool packagesSelected = false;
  bool adminSelected = true;

  bool familyMemberintialized = false;
  bool doctorsintialized = false;
  bool packagesintialized = false;
  bool adminintialized = true;

  List<Doctor> doctors = [];
  List<Doctor> filteredDoctors = [];

  void resetColors() {
    patientsColor = AppColors.mainColor;
    patientsFontColor = Colors.white;
    doctorsColor = AppColors.mainColor;
    doctorsFontColor = Colors.white;
    packagesColor = AppColors.mainColor;
    packagesFontColor = Colors.white;
    adminColor = AppColors.mainColor;
    adminFontColor = Colors.white;
  }

  void resetWidgets() {
    patientsSelected = false;
    doctorsSelected = false;
    packagesSelected = false;
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
      getx.Get.find<AdminDoctorController>().loadDoctors();
    }
    doctorsintialized = true;
    update(['adminPageBuilder']);
  }

  void onTapPackages() {
    resetColors();
    packagesColor = Colors.white;
    packagesFontColor = AppColors.mainColor;
    update(['tapsBuilder']);
    if (packagesSelected) return;
    resetWidgets();
    packagesSelected = true;
    if (packagesintialized) {
      getx.Get.find<DoctorsController>().loadDoctors();
    }
    packagesintialized = true;
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
