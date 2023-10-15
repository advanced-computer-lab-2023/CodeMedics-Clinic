import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Admin/Views/Widgets/Admins/AddAdmin.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/View/Widgets/FamilyMember/AddFamilyMemberWidget.dart';
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Models/Admin.dart';
import 'package:ori_dx_app/Models/FamilyMember.dart';
import 'package:ori_dx_app/Services/RequestService.dart';

class AdminsController extends getx.GetxController {
  List<Admin> admins = [];
  bool adminSelected = false;
  Admin? selectedAdmin;

  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      loadAdmins();
    });
  }

  void loadAdmins() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeGetRequest(
        '/admin/getAllAdmins',
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
      admins.clear();
      for (var item in response.data) {
        admins.add(Admin.fromJson(item));
      }
      update(['adminsBuilder']);
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
  }

  void onTapMember(Admin admin) {
    selectedAdmin = admin;
    adminSelected = true;
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
    adminSelected = false;
    update(['adminsBuilder']);
  }

  void onTapRemoveAdmin(Admin admin) async {
    if (admin.username == 'admin') {
      Helper.showMessage('Error', 'You can\'t remove the main admin');
      return;
    }
    removeAdmin(admin);
  }

  void removeAdmin(Admin admin) async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeDeleteRequest(
        '/admin/removeUser',
        {"Username": admin.username},
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
      loadAdmins();
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
  }
}
