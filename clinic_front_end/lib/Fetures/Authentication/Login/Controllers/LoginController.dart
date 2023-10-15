// ignore_for_file: non_constant_identifier_names

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Admin/Views/AdminPage.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Views/DoctorPage.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/View/PatientPage.dart';
import 'package:ori_dx_app/Models/Admin.dart';
import 'package:ori_dx_app/Models/Doctor.dart';
import 'package:ori_dx_app/Models/Patient.dart';
import 'package:ori_dx_app/Services/RequestService.dart';
import 'package:ori_dx_app/Services/StorageServices.dart';

import '../../../../Helper/Helper.dart';
import '../../../../Services/DioClass.dart';
import '../../../../shared/AppShared.dart';

class LoginController extends getx.GetxController {
  String username = "";
  String password = "";
  String curOption = 'Dev';
  List<String> types = ['Dev', 'Staging', 'Testing'];
  bool isPassword = true;
  bool tenantSelected = false;
  String? usernameerror;
  String? passworderror;

  void OnchangeUsername(String text) {
    if (text.isNotEmpty) {
      if (usernameerror != null) {
        usernameerror = null;
        update(['LoginpageBuilder']);
      }
    }
    username = text.trim();
  }

  void Onchangepasswordname(String text) {
    if (text.isNotEmpty) {
      if (passworderror != null) {
        passworderror = null;
        update(['LoginpageBuilder']);
      }
    }
    password = text;
  }

  void validate() {
    if (username.isEmpty) {
      usernameerror = "Username is required";
    }
    if (password.isEmpty) {
      passworderror = "Password is required";
    }
    if (username.isNotEmpty && password.isNotEmpty) {
      login();
    } else {
      update(['LoginpageBuilder']);
    }
  }

  void login() async {
    Response? response = await Helper.showLoading(
        'Loading...',
        'Please wait',
        () => RequestService().makePostRequest("/login", {
              "Username": username,
              "Password": password,
            }));
    if (response == null) {
      Helper.showMessage(
        'Connection Error',
        'Please check your internet connection',
        widget: const Icon(FontAwesomeIcons.globe, size: 50),
      );
      return;
    }
    print(response);
    if (response.statusCode == 200) {
      String s = response.data['message'].split(' ')[0].toLowerCase();
      AppShared.username = username;
      if (s == 'patient') {
        AppShared.patient = Patient.fromJson(response.data['admin']);
        getx.Get.offAll(() => const PatientPage());
      }
      if (s == 'doctor') {
        AppShared.doctor = Doctor.fromJson(response.data['admin']);
        getx.Get.offAll(() => const DoctorPage());
      }
      if (s == 'admin') {
        AppShared.admin = Admin.fromJson(response.data['admin']);
        getx.Get.offAll(() => const AdminPage());
      }
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
  }

  void passwordShow() {
    isPassword = !isPassword;
    update(['LoginpageBuilder']);
  }

  void onRadioTap(String? x) {
    curOption = x.toString();
    update(['environmentBuilder']);
  }
}
