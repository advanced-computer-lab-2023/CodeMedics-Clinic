import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Admin/Views/Widgets/Admins/AddAdmin.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/View/Widgets/FamilyMember/AddFamilyMemberWidget.dart';
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Models/Admin.dart';
import 'package:ori_dx_app/Models/Doctor.dart';
import 'package:ori_dx_app/Models/FamilyMember.dart';
import 'package:ori_dx_app/Models/Patient.dart';
import 'package:ori_dx_app/Services/RequestService.dart';

class AdminDoctorController extends getx.GetxController {
  List<Doctor> doctors = [];
  bool doctorsSelected = false;
  Doctor? selectedDoctor;

  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      loadDoctors();
    });
  }

  void loadDoctors() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeGetRequest(
        '/doctor/getAllDoctors',
        {},
      ),
    );

    if (response == null) {
      Helper.showMessage(
          'Connection Error', 'Please check your internet connection',
          widget: const Icon(FontAwesomeIcons.globe, size: 50));
      return;
    }
    if (response.statusCode == 200) {
      doctors.clear();
      for (var item in response.data) {
        doctors.add(Doctor.fromJson(item));
      }
      update(['adminsBuilder']);
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
  }

  void onTapMember(Doctor patient) {
    selectedDoctor = patient;
    doctorsSelected = true;
    update(['adminsBuilder']);
  }

  void onTapAddMember() async {
    await Helper.showMessage1(
      null,
      AddAdmin(),
      ok: false,
    );
  }

  void onTapDoneMemberInfo() {
    doctorsSelected = false;
    update(['adminsBuilder']);
  }

  void removePatient(Doctor doctor) async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeDeleteRequest(
        '/admin/removeUser',
        {"Username": doctor.username},
      ),
    );

    if (response == null) {
      Helper.showMessage(
          'Connection Error', 'Please check your internet connection',
          widget: const Icon(FontAwesomeIcons.globe, size: 50));
      return;
    }
    if (response.statusCode == 201) {
      await Helper.showMessage(
        'Success',
        'Removed Successfully',
        widget: Image.asset(
          'assets/images/checklist.png',
          height: 90,
        ),
      );
      loadDoctors();
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
  }

  void onTapRemovePatient(Doctor doctor) {
    removePatient(doctor);
  }
}
