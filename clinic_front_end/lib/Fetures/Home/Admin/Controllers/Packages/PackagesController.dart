import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Admin/Views/Widgets/Admins/AddAdmin.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Views/Widgets/Packages/AddPackage.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Views/Widgets/Packages/UpadtePackage.dart';
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Models/Admin.dart';

import 'package:ori_dx_app/Models/Package.dart';
import 'package:ori_dx_app/Services/RequestService.dart';
import 'package:ori_dx_app/shared/AppShared.dart';

class PackagesController extends getx.GetxController {
  List<Package> packages = [];
  bool packageSelected = false;
  Package? selectedPackage;

  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      loadPackages();
    });
  }

  void loadPackages() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeGetRequest(
        '/admin/getPackages',
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
      packages.clear();
      for (var item in response.data) {
        packages.add(Package.fromJson(item));
      }
      update(['adminsBuilder']);
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
  }

  void onTapMember(Package package) {
    selectedPackage = package;
    packageSelected = true;
    update(['adminsBuilder']);
  }

  void onTapAddMember() async {
    await Helper.showMessage1(
      null,
      AddPackage(),
      ok: false,
    );
  }

  void onTapDoneMemberInfo() {
    packageSelected = false;
    update(['adminsBuilder']);
  }

  void onTapRemovePackage(Package package) async {
    removePackage(package);
  }

  void removePackage(Package package) async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeDeleteRequest(
        '/admin/removePackage',
        {"Name": package.name},
      ),
    );

    if (response == null) {
      Helper.showMessage(
          'Connection Error', 'Please check your internet connection',
          widget: const Icon(FontAwesomeIcons.globe, size: 50));
      return;
    }

    if (response.statusCode == 200) {
      await Helper.showMessage(
        'Success',
        'Removed Successfully',
        widget: Image.asset(
          'assets/images/checklist.png',
          height: 90,
        ),
      );
      loadPackages();
    } else {
      Helper.showMessage('Error', response.data);
    }
  }

  void onTapUpdate(Package package) async {
    await Helper.showMessage1(
      null,
      UpdatePackage(
        package: package,
      ),
      ok: false,
    );
  }
}
