import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Patient/View/Widgets/FamilyMember/AddFamilyMemberWidget.dart';
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Models/FamilyMember.dart';
import 'package:ori_dx_app/Services/RequestService.dart';
import 'package:ori_dx_app/shared/AppShared.dart';

class FamilyMembersController extends getx.GetxController {
  List<FamilyMember> familyMembers = [];
  bool memberSelected = false;
  FamilyMember? selectedMember;

  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      loadFamilyMembers();
    });
  }

  void loadFamilyMembers() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeGetRequest(
        '/patient/familyMembers?Username=${AppShared.username}',
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
      familyMembers.clear();
      for (var item in response.data['data']) {
        familyMembers.add(FamilyMember.fromJson(item));
      }
      update(['FamilyMembersBuilder']);
    } else {  
      Helper.showMessage('Error', response.data["message"]);
    }
  }

  void onTapMember(FamilyMember familyMember) {
    selectedMember = familyMember;
    memberSelected = true;
    update(['FamilyMembersBuilder']);
  }

  void onTapAddMember() async {
    await Helper.showMessage1(
      null,
      AddFamilyMemberWidget(),
      ok: false,
    );
  }

  void onTapDoneMemberInfo() {
    memberSelected = false;
    update(['FamilyMembersBuilder']);
  }
}
