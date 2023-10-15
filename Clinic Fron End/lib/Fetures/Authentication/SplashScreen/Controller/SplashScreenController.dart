import 'package:flutter/material.dart';
import 'package:get/get.dart' as getX;
import 'package:ori_dx_app/Services/DioClass.dart';
import 'package:ori_dx_app/Services/StorageServices.dart';
import 'package:ori_dx_app/shared/AppShared.dart';
import '../../Login/View/LoginPage.dart';

class SplashScreenController extends getX.GetxController {
  @override
  void onInit() {
    super.onInit();
    // checkLogin();
  }

  // void checkLogin() async {
  //   // String? token = StorageServices.getInstance().getUserData();
  //   // String? tenantId = StorageServices.getInstance().getTenantId();
  //   await Future.delayed(const Duration(seconds: 4));
  //   WidgetsBinding.instance.addPostFrameCallback(
  //     (_) async {
  //       if (token != null) {
  //         // DioClass.refreshAccessToken(token);
  //         // DioClass.initPaths();
  //         // getX.Get.offAll(() => HomeScreen());
  //         // Response? response =
  //         //     await RequestService().makeGetRequest('getTenants', {});
  //         // if (response != null) {
  //         //   if (response.statusCode == 200) {
  //         //     for(var tenant in response.data['data']){
  //         //       if(tenant['id'] == tenantId){
  //         //         getX.Get.find<AppShared>().owner.curTenant = Tenant.fromJson(tenant);
  //         //         getX.Get.offAll(() => const Products());
  //         //         return;
  //         //       }
  //         //     }
  //         //   }
  //         // } else {
  //         //   await Helper.showMessage(
  //         //     'Connection Error',
  //         //     'Please check your internet connection',
  //         //     widget: const Icon(
  //         //       FontAwesomeIcons.globe,
  //         //       size: 35,
  //         //     ),
  //         //   );
  //         //    exit(0);
  //         // }
  //       } else {
  //         getX.Get.offAll(() => const LoginPage());
  //       }
  //     },
  //   );
  // }
}
