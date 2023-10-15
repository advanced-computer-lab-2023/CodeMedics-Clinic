import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Admins/AdminsController.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Packages/PackagesController.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/FamilyMembersControllers/FamilyMembersController.dart';
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Models/Doctor.dart';
import 'package:ori_dx_app/Models/Package.dart';
import 'package:ori_dx_app/Services/RequestService.dart';
import 'package:ori_dx_app/shared/AppShared.dart';

class UpdateDoctorController extends getx.GetxController {
  String name = '';
  String email = AppShared.doctor!.email;
  String hourlyRate = AppShared.doctor!.hourlyRate.toString();
  String affiliation = AppShared.doctor!.affiliation;

  String? nameError;
  String? emailError;
  String? genderError;
  String? relationError;
  String? hourlyRateError;

  String? medicineDiscountError;

  String medicineDiscount = "";

  String? affiliationError;

  void onTapAddMember(Doctor package) {
    updateDoctor(package);
    update();
  }

  void updateDoctor(Doctor package) async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makePatchRequest(
        "/doctor/",
        {
          "Username": AppShared.username,
          "Email": email,
          "HourlyRate": hourlyRate,
          "Affiliation": affiliation,
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
    print(response);
    if (response.statusCode == 200) {
      getx.Get.back();
      await Helper.showMessage(
        'Success',
        'Updated Successfully',
        widget: Image.asset(
          'assets/images/checklist.png',
          height: 90,
        ),
      );
      // getx.Get.find<PackagesController>().loadPackages();
    } else {
      Helper.showMessage('Error', response.data['message']);
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

  onChangeEmail(String text) {
    if (text.isNotEmpty) {
      if (emailError != null) {
        emailError = null;
        update();
      }
    }
    email = text;
  }

  onChagedHourlyRate(String text) {
    if (text.isNotEmpty) {
      if (hourlyRateError != null) {
        hourlyRateError = null;
        update();
      }
    }
    hourlyRate = text;
  }

  void onChagedMedicineDiscount(String text) {
    if (text.isNotEmpty) {
      if (medicineDiscountError != null) {
        medicineDiscountError = null;
        update();
      }
    }
    medicineDiscount = text;
  }

  onChagedAffiliation(String text) {
    if (text.isNotEmpty) {
      if (affiliationError != null) {
        affiliationError = null;
        update();
      }
    }
    affiliation = text;
  }
}
