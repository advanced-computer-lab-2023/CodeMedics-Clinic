import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Admins/AddAdminController.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';

import 'package:ori_dx_app/GeneralWidgets/CustomTextField.dart';


class AddAdmin extends StatelessWidget {
  AddAdmin({super.key}) {
    Get.put(AddAdminController());
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<AddAdminController>(builder: (ctrl) {
      return SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(
              height: 20,
            ),
            Image.asset(
              'assets/images/member1.png',
              height: 120,
            ),
            const SizedBox(
              height: 20,
            ),
            const Text(
              'Add Admin',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            CustomTextField(
              borderRadius: 10,
              text: 'Full Name',
              onChanged: (name) => ctrl.onChangeName(name),
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.nameError,
            ),
            const SizedBox(
              height: 10,
            ),
            CustomTextField(
              borderRadius: 10,
              text: 'Username',
              onChanged: (name) => ctrl.onChangeUsername(name),
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.usernameError,
            ),
            const SizedBox(
              height: 10,
            ),
            CustomTextField(
              borderRadius: 10,
              text: 'Password',
              onChanged: ctrl.onChagedPassword,
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.passwordError,
              isPassword: true,
            ),
            const SizedBox(
              height: 10,
            ),
            CustomTextField(
              borderRadius: 10,
              text: 'Email',
              onChanged: ctrl.onChagedEmail,
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.emailError,
            ),
            const SizedBox(
              height: 10,
            ),
            CustomButton(
              text: 'Add Member',
              onTap: () {
                ctrl.onTapAddMember();
              },
              borderRadius: 10,
            ),
          ],
        ),
      );
    });
  }
}
