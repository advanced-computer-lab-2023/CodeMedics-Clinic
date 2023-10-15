import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Authentication/Login/View/LoginPage.dart';
import 'package:ori_dx_app/Fetures/Authentication/RegisterAsDoctor/RegisterAsPatient/View/RegisterAsDoctor.dart';
import 'package:ori_dx_app/Fetures/Authentication/RegisterAsPatient/View/RegisterAsPatient.dart';
import 'package:ori_dx_app/GeneralWidgets/AppText.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/shared/AppColors.dart';
import 'package:ori_dx_app/shared/Fonts/FontModel.dart';

class GuestBody extends StatelessWidget {
  const GuestBody({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Stack(
        children: [
          Container(
            width: double.infinity,
            height: 80,
            color: AppColors.mainColor,
            child: Stack(
              children: [
                Image.asset('assets/images/logo9.png'),
                Padding(
                  padding:
                      const EdgeInsets.only(top: 15, left: 1390, right: 10),
                  child: SizedBox(
                    height: 50,
                    child: CustomButton(
                      text: 'Login',
                      onTap: () {
                        Get.to(() => const LoginPage());
                      },
                      backgroundColor: Colors.white,
                      textColor: AppColors.mainColor,
                      borderRadius: 10,
                    ),
                  ),
                )
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 150, top: 80),
            child: SizedBox(
              height: 500,
              child: Image.asset(
                "assets/images/doctor10.png",
                // fit: BoxFit.cover,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 800, top: 150),
            child: Container(
              width: 600,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              decoration: BoxDecoration(
                color: AppColors.containerColor,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                children: [
                  Image.asset(
                    "assets/images/logo1.png",
                    width: 400,
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  AppText(
                    'Welcome to El7a2ny virtual clinic, where compassionate care and expert medical expertise come together to provide a sanctuary for your well-being. At Healing Haven Clinic, we understand that your health is your most valuable asset, and we are dedicated to ensuring your journey to optimal health and wellness is a seamless and empowering experience.',
                    style: TextStyle(
                      fontSize: 20,
                      fontFamily: FontFamily.medium,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 860, top: 500, right: 440),
            child: CustomButton(
              onTap: () {
                Get.to(() => const RegisterAsPatient());
              },
              text: 'Continue as Patient',
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 1120, top: 500, right: 180),
            child: CustomButton(
              onTap: () {
                Get.to(() => const RegisterAsDoctor());
              },
              text: 'Continue as Doctor',
            ),
          ),
        ],
      ),
    );
  }
}
