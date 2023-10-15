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

class RegisterAsDoctorController extends getx.GetxController {
  String firstName = "";
  String lastName = "";
  String username = "";
  String password = "";
  String degree = "";
  String email = "";
  String hourlyRate = "";
  String dateOfBirth = "";
  String speciality = "";
  String affiliation = "";

  bool isPassword = true;
  String? usernameError;
  String? passwordError;
  String? firstNameError;
  String? lastNameError;
  String? degreeError;
  String? emailError;
  String? hourlyRateError;
  String? dateOfBirthError;

  String? specialityError;

  final Map<int, String> specialities = AppShared.specialities;

  String? afiliationError;

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
    if (degree.isEmpty) {
      degreeError = "Required";
    }
    if (hourlyRate.isEmpty) {
      hourlyRateError = "Required";
    }
    if (dateOfBirth.isEmpty) {
      dateOfBirthError = "Required";
    }
    if (email.isEmpty) {
      emailError = "Required";
    }
    if (speciality.isEmpty) {
      specialityError = "Required";
    }
    if (username.isNotEmpty &&
        password.isNotEmpty &&
        firstName.isNotEmpty &&
        lastName.isNotEmpty &&
        email.isNotEmpty &&
        hourlyRate.isNotEmpty &&
        dateOfBirth.isNotEmpty &&
        degree.isNotEmpty &&
        specialities.isNotEmpty) {
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
        "/doctor/register",
        {
          "FirstName": firstName,
          "LastName": lastName,
          "Username": username,
          "Password": password,
          "Email": email,
          "DateOfBirth": dateOfBirth,
          "HourlyRate": hourlyRate,
          "Degree": degree,
          "Specialty": speciality,
          "affiliation": affiliation
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

  onChangeFirstName(String text) {
    if (text.isNotEmpty) {
      if (firstNameError != null) {
        firstNameError = null;
        update(['LoginpageBuilder']);
      }
    }
    firstName = text;
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

  onChangeDate(DateTime val) {
    if (dateOfBirthError != null) {
      dateOfBirthError = null;
      update(['LoginpageBuilder']);
    }
    dateOfBirth = val.toString().split(" ")[0];
  }

  onChangeHourlyRate(String text) {
    if (text.isNotEmpty) {
      if (hourlyRateError != null) {
        hourlyRateError = null;
        update(['LoginpageBuilder']);
      }
    }
    hourlyRate = text;
  }

  onChangeDegree(String text) {
    if (text.isNotEmpty) {
      if (degreeError != null) {
        degreeError = null;
        update(['LoginpageBuilder']);
      }
    }
    degree = text;
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

  onSpecialityChanged(val) {
    String s = val.toString();
    if (s.isEmpty) {
      speciality = "";
      return;
    }
    speciality = val.name.toString();
    if (specialityError != null) {
      specialityError = null;
      update(['LoginpageBuilder']);
    }
  }

  onChangedAffiliation(String text) {
    if (text.isNotEmpty) {
      if (afiliationError != null) {
        afiliationError = null;
        update(['LoginpageBuilder']);
      }
    }
    affiliation = text;
  }
}
