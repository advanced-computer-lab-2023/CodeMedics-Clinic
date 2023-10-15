// ignore_for_file: non_constant_identifier_names

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Authentication/Login/View/LoginPage.dart';
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Services/DioClass.dart';
import 'package:ori_dx_app/Services/RequestService.dart';
import 'package:ori_dx_app/Services/StorageServices.dart';
import 'package:ori_dx_app/shared/AppShared.dart';

class RegisterAsPatientController extends getx.GetxController {
  String firstName = "";
  String lastName = "";
  String username = "";
  String password = "";
  String phoneNumber = "";
  String email = "";
  String gender = "";
  String dateOfBirth = "";
  String emergencyContactName = "";
  String emergencyContactNumber = "";

  bool isPassword = true;
  String? usernameError;
  String? passwordError;
  String? firstNameError;
  String? lastNameError;
  String? phoneNumberError;
  String? emailError;
  String? genderError;
  String? dateOfBirthError;
  String? emergencyContactNameError;
  String? emergencyContactNumberError;

  void validate() {
    if (username.isEmpty) {
      usernameError = "Required";
    }
    if (password.isEmpty) {
      passwordError = "Required";
    }
    if (firstName.isEmpty) {
      firstNameError = "Required";
    }
    if (lastName.isEmpty) {
      lastNameError = "Required";
    }
    if (phoneNumber.isEmpty) {
      phoneNumberError = "Required";
    }
    if (gender.isEmpty) {
      genderError = "Required";
    }
    if (dateOfBirth.isEmpty) {
      dateOfBirthError = "Required";
    }
    if (emergencyContactName.isEmpty) {
      emergencyContactNameError = "Required";
    }
    if (emergencyContactNumber.isEmpty) {
      emergencyContactNumberError = "Required";
    }
    if (email.isEmpty) {
      emailError = "Required";
    }
    if (username.isNotEmpty &&
        password.isNotEmpty &&
        firstName.isNotEmpty &&
        email.isNotEmpty &&
        gender.isNotEmpty &&
        dateOfBirth.isNotEmpty &&
        phoneNumber.isNotEmpty &&
        emergencyContactName.isNotEmpty &&
        emergencyContactNumber.isNotEmpty) {
      register();
    } else {
      update(['LoginpageBuilder']);
    }
  }

  void register() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makePostRequest(
        "/patient/register",
        {
          "FirstName": firstName,
          "LastName": lastName,
          "Username": username,
          "Password": password,
          "Email": email,
          "DateOfBirth": dateOfBirth,
          "Gender": gender,
          "MobileNumber": phoneNumber,
          "EmergencyContactName": emergencyContactName,
          "EmergencyContactNumber": emergencyContactNumber,
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
      await Helper.showMessage(
        'Success',
        'Registered Successfully',
        widget: Image.asset(
          'assets/images/checklist.png',
          height: 90,
        ),
      );
      getx.Get.off(() => const LoginPage());
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
  }

  void passwordShow() {
    isPassword = !isPassword;
    update(['LoginpageBuilder']);
  }

  void Onchangepasswordname(String text) {
    if (text.isNotEmpty) {
      if (passwordError != null) {
        passwordError = null;
        update(['LoginpageBuilder']);
      }
    }
    password = text;
  }

  void OnchangeUsername(String text) {
    if (text.isNotEmpty) {
      if (usernameError != null) {
        usernameError = null;
        update(['LoginpageBuilder']);
      }
    }
    username = text.trim();
  }

  void onChangeFirstName(String text) {
    if (text.isNotEmpty) {
      if (firstNameError != null) {
        firstNameError = null;
        update(['LoginpageBuilder']);
      }
    }
    firstName = text;
  }

  void onChangeLastName(String text) {
    if (text.isNotEmpty) {
      if (lastNameError != null) {
        lastNameError = null;
        update(['LoginpageBuilder']);
      }
    }
    lastName = text;
  }

  onChangeEmail(String text) {
    if (text.isNotEmpty) {
      if (emailError != null) {
        emailError = null;
        update(['LoginpageBuilder']);
      }
    }
    email = text;
  }

  onChangeDate(DateTime text) {
    if (dateOfBirthError != null) {
      dateOfBirthError = null;
      update(['LoginpageBuilder']);
    }
    dateOfBirth = text.toString().split(" ")[0];
  }

  onChangeGender(String text) {
    if (text.isNotEmpty) {
      if (genderError != null) {
        genderError = null;
        update(['LoginpageBuilder']);
      }
    }
    gender = text;
  }

  onChangePhoneNumber(String text) {
    if (text.isNotEmpty) {
      if (phoneNumberError != null) {
        phoneNumberError = null;
        update(['LoginpageBuilder']);
      }
    }
    phoneNumber = text;
  }

  onChangeEmergenctName(String text) {
    if (text.isNotEmpty) {
      if (emergencyContactNameError != null) {
        emergencyContactNameError = null;
        update(['LoginpageBuilder']);
      }
    }
    emergencyContactName = text;
  }

  onChangeEmergenctNumber(String text) {
    if (text.isNotEmpty) {
      if (emergencyContactNumberError != null) {
        emergencyContactNumberError = null;
        update(['LoginpageBuilder']);
      }
    }
    emergencyContactNumber = text;
  }
}
