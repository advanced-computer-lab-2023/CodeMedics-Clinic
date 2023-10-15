import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Guest/View/Widgets/GusestBody.dart';
import 'package:ori_dx_app/GeneralWidgets/AppText.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/shared/AppColors.dart';
import 'package:ori_dx_app/shared/Fonts/FontModel.dart';

class Guest extends StatelessWidget {
  const Guest({super.key});

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        return _moveBack();
      },
      child: Scaffold(
        // appBar: AppBar(
        //   backgroundColor: AppColors.mainColor,
        //   foregroundColor: Colors.white,
        //   actions: [
        //     Stack(
        //       children: [
        //         Padding(
        //           padding:
        //               const EdgeInsets.only(right: 1120, top: 20, bottom: 10),
        //           child: Image.asset("assets/images/logo9.png", width: 400),
        //         ),
        //         CustomButton(
        //           onTap: () {},
        //           text: 'Login',
        //           backgroundColor: Colors.white,
        //           textColor: AppColors.mainColor,
        //           border: Border.all(color: AppColors.mainColor, width: 2),
        //         ),
        //       ],
        //     ),
        //   ],
        //   toolbarHeight: 80,
        // ),
        body: const SafeArea(
          child: GuestBody(),
        ),
      ),
    );
  }

  _moveBack() {
    Get.back();
    return true;
  }
}
