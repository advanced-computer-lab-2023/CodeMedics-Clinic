import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Admins/AdminsController.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Packages/PackagesController.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/FamilyMembersControllers/FamilyMembersController.dart';
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Services/RequestService.dart';
import 'package:ori_dx_app/shared/AppShared.dart';

class AddPackageController extends getx.GetxController {
  String name = '';
  String price = "";
  String gender = "";
  String relation = "";
  String sessionDiscount = "";
  String familyDiscount = "";

  String? nameError;
  String? priceError;
  String? genderError;
  String? relationError;
  String? sessionDiscountError;

  String? medicineDiscountError;

  String medicineDiscount = "";

  String? familyDiscountError;

  void onTapAddMember() {
    if (name.isEmpty) {
      nameError = 'Required';
    }
    if (sessionDiscount.isEmpty) {
      sessionDiscountError = 'Required';
    }
    if (medicineDiscount.isEmpty) {
      medicineDiscountError = 'Required';
    }
    if (name.isNotEmpty &&
        price.isNotEmpty &&
        sessionDiscount.isNotEmpty &&
        medicineDiscount.isNotEmpty &&
        familyDiscount.isNotEmpty) {
      addPackage();
    }
    update();
  }

  void addPackage() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makePostRequest(
        "/admin/addPackage",
        {
          "Price": price,
          "Name": name,
          "SessionDiscount": sessionDiscount,
          "MedicineDiscount": medicineDiscount,
          "FamilyDiscount": familyDiscount,
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

      getx.Get.find<PackagesController>().loadPackages();
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

  onChangePrice(String text) {
    if (text.isNotEmpty) {
      if (priceError != null) {
        priceError = null;
        update();
      }
    }
    price = text;
  }

  onChagedSessionDiscount(String text) {
    if (text.isNotEmpty) {
      if (sessionDiscountError != null) {
        sessionDiscountError = null;
        update();
      }
    }
    sessionDiscount = text;
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

  onChagedFamilyDiscount(String text) {
    if (text.isNotEmpty) {
      if (familyDiscountError != null) {
        familyDiscountError = null;
        update();
      }
    }
    familyDiscount = text;
  }
}
