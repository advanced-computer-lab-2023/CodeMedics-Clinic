import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/FamilyMembersControllers/FamilyMembersController.dart';
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Services/RequestService.dart';
import 'package:ori_dx_app/shared/AppShared.dart';

class AddFamilyMemberController extends getx.GetxController {
  String name = '';
  String nationalID = "";
  String gender = "";
  String relation = "";
  String dateOfBirth = "";

  String? nameError;
  String? nationalIDError;
  String? genderError;
  String? relationError;
  String? dateOfBirthError;

  void onTapAddMember() {
    if (name.isEmpty) {
      nameError = 'Required';
    }
    if (nationalID.isEmpty) {
      nationalIDError = 'Required';
    }
    if (gender.isEmpty) {
      genderError = 'Required';
    }
    if (relation.isEmpty) {
      relationError = 'Required';
    }
    if (dateOfBirth.isEmpty) {
      dateOfBirthError = 'Required';
    }
    if (name.isNotEmpty &&
        nationalID.isNotEmpty &&
        gender.isNotEmpty &&
        relation.isNotEmpty &&
        dateOfBirth.isNotEmpty) {
      addMember();
    }
    update();
  }

  void addMember() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makePostRequest(
        "/patient/familyMembers",
        {
          "Username": AppShared.username,
          "Name": name,
          "NationalID": nationalID,
          "Gender": gender,
          "DateOfBirth": dateOfBirth,
          "Relationship": relation,
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
    if (response.statusCode == 200) {
      getx.Get.back();
      await Helper.showMessage(
        'Success',
        'Added Successfully',
        widget: Image.asset(
          'assets/images/checklist.png',
          height: 90,
        ),
      );
      getx.Get.find<FamilyMembersController>().loadFamilyMembers();
    } else {
      Helper.showMessage('Error', response.data["message"]);
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

  onChangeNationalID(String text) {
    if (text.isNotEmpty) {
      if (nationalIDError != null) {
        nationalIDError = null;
        update();
      }
    }
    nationalID = text;
  }

  onChangedGender(val) {
    String s = val.toString();
    if (s.isEmpty) {
      gender = "";
      return;
    }
    gender = val.name.toString();
    if (genderError != null) {
      genderError = null;
      update();
    }
  }

  onChagedDateOfBirth(DateTime text) {
    if (dateOfBirthError != null) {
      dateOfBirthError = null;
      update();
    }
    dateOfBirth = text.toString().split(' ')[0];
    print(dateOfBirth);
  }

  onChangedRelationship(val) {
    String s = val.toString();
    if (s.isEmpty) {
      relation = "";
      return;
    }
    relation = val.name.toString();
    if (relationError != null) {
      relationError = null;
      update();
    }
  }
}
