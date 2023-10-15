import 'dart:ui';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/DoctorsControllers/DoctorsController.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/FamilyMembersControllers/FamilyMembersController.dart';
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Models/Doctor.dart';
import 'package:ori_dx_app/Models/FamilyMember.dart';
import 'package:ori_dx_app/Services/RequestService.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

class PatientPageController extends getx.GetxController {
  Color familyMemberColor = Colors.white;
  Color familyMemberFontColor = AppColors.mainColor;

  Color doctorsColor = AppColors.mainColor;
  Color doctorsFontColor = Colors.white;

  Color prescriptionsColor = AppColors.mainColor;
  Color prescriptionsFontColor = Colors.white;

  Color appointmentsColor = AppColors.mainColor;
  Color appointmentsFontColor = Colors.white;

  bool familyMemberSelected = true;
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
    familyMemberColor = AppColors.mainColor;
    familyMemberFontColor = Colors.white;
    doctorsColor = AppColors.mainColor;
    doctorsFontColor = Colors.white;
    prescriptionsColor = AppColors.mainColor;
    prescriptionsFontColor = Colors.white;
    appointmentsColor = AppColors.mainColor;
    appointmentsFontColor = Colors.white;
  }

  void resetWidgets() {
    familyMemberSelected = false;
    doctorsSelected = false;
    prescriptionsSelected = false;
    appointmentsSelected = false;
  }

  void onTapFamilyMember() {
    resetColors();
    familyMemberColor = Colors.white;
    familyMemberFontColor = AppColors.mainColor;
    update(['tapsBuilder']);
    if (familyMemberSelected) return;
    resetWidgets();
    familyMemberSelected = true;
    if (familyMemberintialized) {
      getx.Get.find<FamilyMembersController>().loadFamilyMembers();
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
      getx.Get.find<DoctorsController>().loadDoctors();
    }
    appointmentsintialized = true;
    update(['patientPageBuilder']);
  }
}
