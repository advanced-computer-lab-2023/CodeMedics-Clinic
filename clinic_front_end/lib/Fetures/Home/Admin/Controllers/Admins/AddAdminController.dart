import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Admins/AdminsController.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/FamilyMembersControllers/FamilyMembersController.dart';
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Services/RequestService.dart';
import 'package:ori_dx_app/shared/AppShared.dart';

class AddAdminController extends getx.GetxController {
  String name = '';
  String username = "";
  String gender = "";
  String relation = "";
  String password = "";

  String? nameError;
  String? usernameError;
  String? genderError;
  String? relationError;
  String? passwordError;

  String? emailError;

  String email = "";

  void onTapAddMember() {
    if (name.isEmpty) {
      nameError = 'Required';
    }
    if (username.isEmpty) {
      usernameError = 'Required';
    }
    if (password.isEmpty) {
      passwordError = 'Required';
    }
    if (email.isEmpty) {
      emailError = 'Required';
    }
    if (name.isNotEmpty &&
        username.isNotEmpty &&
        password.isNotEmpty &&
        email.isNotEmpty) {
      addAdmin();
    }
    update();
  }

  void addAdmin() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makePostRequest(
        "/admin/createAdmin",
        {
          "Username": username,
          "Name": name,
          "Password": password,
          "Email": email,
        },
      ),
    );
    if (response == null) {
      Helper.showMessage(
        'Connection Error',
        'Please check your internet connection',
        widget: const Icon(FontAwesomeIcons.globe, size: 50),
      );
      return;
    }
    if (response.statusCode == 201) {
      getx.Get.back();
      await Helper.showMessage(
        'Success',
        'Added Successfully',
        widget: Image.asset(
          'assets/images/checklist.png',
          height: 90,
        ),
      );

      getx.Get.find<AdminsController>().loadAdmins();
    } else {
      Helper.showMessage('Error', response.data);
    }
  }

  onChangeName(String text) {
    if (text.isNotEmpty) {
      if (nameError != null) {
        nameError = null;
        update();
      }
    }
    name = text;
  }

  onChangeUsername(String text) {
    if (text.isNotEmpty) {
      if (usernameError != null) {
        usernameError = null;
        update();
      }
    }
    username = text;
  }

  onChagedPassword(String text) {
    if (text.isNotEmpty) {
      if (passwordError != null) {
        passwordError = null;
        update();
      }
    }
    password = text;
  }

  void onChagedEmail(String text) {
    if (text.isNotEmpty) {
      if (emailError != null) {
        emailError = null;
        update();
      }
    }
    email = text;
  }
}
