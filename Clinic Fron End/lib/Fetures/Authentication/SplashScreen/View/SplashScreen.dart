import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';

import '../Controller/SplashScreenController.dart';

class SplashScreen extends StatelessWidget {
  SplashScreen({super.key}) {
    Get.put(SplashScreenController());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Color.fromRGBO(227, 2, 88, 1),
                Color.fromRGBO(129, 0, 49, 1),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  width: 300.w,
                  child: Image.asset('assets/images/logo1.png'),
                ),
                SizedBox(height: 15.h),
                const CircularProgressIndicator(
                  color: Colors.white,
                ),
              ],
            ),
          )),
    );
  }
}
