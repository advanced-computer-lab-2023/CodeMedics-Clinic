import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Admin/Views/Widgets/Admins/AddAdmin.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/View/Widgets/FamilyMember/AddFamilyMemberWidget.dart';
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Models/Admin.dart';
import 'package:ori_dx_app/Models/FamilyMember.dart';
import 'package:ori_dx_app/Models/Patient.dart';
import 'package:ori_dx_app/Services/RequestService.dart';

class AdminPatientsController extends getx.GetxController {
  List<Patient> patients = [];
  bool patientSelected = false;
  Patient? selectedPatient;

  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      loadPatients();
    });
  }

  void loadPatients() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeGetRequest(
        '/patient/getPatients',
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
      patients.clear();
      for (var item in response.data) {
        patients.add(Patient.fromJson(item));
      }
      update(['adminsBuilder']);
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
  }

  void onTapMember(Patient patient) {
    selectedPatient = patient;
    patientSelected = true;
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
    patientSelected = false;
    update(['adminsBuilder']);
  }

  void removePatient(Patient patient) async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeDeleteRequest(
        '/admin/removeUser',
        {"Username": patient.username},
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
      loadPatients();
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
  }

  void onTapRemovePatient(Patient patient) {
    removePatient(patient);
  }
}
