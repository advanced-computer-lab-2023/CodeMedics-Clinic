import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomRadioButton.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomTextField.dart';
import 'package:ori_dx_app/shared/AppColors.dart';
import 'package:ori_dx_app/shared/Fonts/FontModel.dart';

import '../../../../../GeneralWidgets/AppText.dart';
import '../../../../../GeneralWidgets/CustomButton.dart';
import '../../../../../GeneralWidgets/CustomTextBox.dart';
import '../../Controllers/LoginController.dart';

class LoginBody extends GetView<LoginController> {
  LoginBody({super.key}) {
    Get.put(LoginController());
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<LoginController>(
        id: "LoginpageBuilder",
        builder: (ctrl) {
          return Stack(
            children: [
              const Padding(
                padding: EdgeInsets.only(left: 600),
                child: Image(image: AssetImage("assets/images/doctor8.png")),
              ),
              Padding(
                padding: const EdgeInsets.only(right: 1000, top: 90, left: 150),
                child: SingleChildScrollView(
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.shadowColor,
                          blurRadius: 10,
                          offset: Offset(0, 0),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        const SizedBox(
                          height: 10,
                        ),
                        const Center(
                          child: SizedBox(
                            width: 500,
                            child: Image(
                              image: AssetImage("assets/images/logo5.png"),
                            ),
                          ),
                        ),
                        const SizedBox(
                          height: 40,
                        ),
                        AppText(
                          'Sign in',
                          style: TextStyle(
                            fontFamily: FontFamily.medium,
                            fontSize: 35,
                          ),
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        CustomTextField(
                          borderRadius: 10,
                          height: 40,
                          text: 'Username',
                          onChanged: (name) => ctrl.OnchangeUsername(name),
                          prefixIcon: const Icon(Icons.person),
                          errorMessage: ctrl.usernameerror,
                        ),
                        const SizedBox(
                          height: 30,
                        ),
                        CustomTextField(
                          borderRadius: 10,
                          height: 40,
                          text: 'Password',
                          onChanged: (pass) => ctrl.Onchangepasswordname(pass),
                          isPassword: ctrl.isPassword,
                          prefixIcon: const Icon(Icons.lock),
                          errorMessage: ctrl.passworderror,
                        ),
                        const SizedBox(
                          height: 50,
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 50),
                          child: CustomButton(
                            onTap: () {
                              ctrl.validate();
                            },
                            text: 'Login',
                            
                          ),
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          );
        });
  }
}
