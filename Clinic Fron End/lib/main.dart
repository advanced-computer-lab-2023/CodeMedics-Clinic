import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Authentication/Login/View/LoginPage.dart';
import 'package:ori_dx_app/Fetures/Authentication/RegisterAsDoctor/RegisterAsPatient/View/RegisterAsDoctor.dart';
import 'package:ori_dx_app/Fetures/Authentication/RegisterAsPatient/View/RegisterAsPatient.dart';
import 'package:ori_dx_app/Fetures/Guest/View/Guest.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Views/DoctorPage.dart';

import 'package:ori_dx_app/Fetures/Home/Patient/View/PatientPage.dart';
import 'package:ori_dx_app/Services/DioClass.dart';
import 'package:ori_dx_app/Services/StorageServices.dart';
import 'package:ori_dx_app/shared/AppShared.dart';
import 'GeneralWidgets/AppText.dart';
import 'shared/AppColors.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  AppText.defaultLanguage = TextLanguage.english;
  DioClass.initDio();
  // for the network
  // DependencyInjection.init();
  await StorageServices.getInstance().initPrefs();
  Get.put(AppShared());
  runApp(const El7a2nyClinic());
}

class El7a2nyClinic extends StatelessWidget {
  const El7a2nyClinic({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      home: const Guest(),
      title: "El7a2ny Virtual Clinic",
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        // scaffoldBackgroundColor: const Color.fromRGBO(235, 238, 245, 1),
        scaffoldBackgroundColor: AppColors.backgroundColor,
        appBarTheme: const AppBarTheme(
          // backgroundColor: Color.fromRGBO(235, 238, 245, 1),
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 0,
          centerTitle: true,
        ),
      ),
    );
  }
}
