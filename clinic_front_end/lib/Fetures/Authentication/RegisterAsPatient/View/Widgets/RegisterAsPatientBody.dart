import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomDateField.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomRadioButton.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomTextField.dart';
import 'package:ori_dx_app/shared/AppColors.dart';
import 'package:ori_dx_app/shared/Fonts/FontModel.dart';

import '../../../../../GeneralWidgets/AppText.dart';
import '../../../../../GeneralWidgets/CustomButton.dart';
import '../../Controllers/RegisterAsPatientController.dart';

class RegisterAsPatientBody extends GetView<RegisterAsPatientController> {
  RegisterAsPatientBody({super.key}) {
    Get.put(RegisterAsPatientController());
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<RegisterAsPatientController>(
        id: "LoginpageBuilder",
        builder: (ctrl) {
          return Stack(
            children: [
              const Padding(
                padding: EdgeInsets.only(left: 700),
                child: Image(image: AssetImage("assets/images/doctor8.png")),
              ),
              Padding(
                padding: const EdgeInsets.only(
                    right: 900, top: 10, left: 150, bottom: 10),
                child: Container(
                  // width: double.infinity,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
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
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(
                          height: 0,
                        ),
                        const Center(
                          child: SizedBox(
                            width: 350,
                            child: Image(
                              image: AssetImage("assets/images/logo5.png"),
                            ),
                          ),
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        Center(
                          child: AppText(
                            'Register as Patient',
                            style: TextStyle(
                              fontFamily: FontFamily.medium,
                              fontSize: 25,
                            ),
                          ),
                        ),
                        const SizedBox(
                          height: 10,
                        ),
                        Row(
                          children: [
                            SizedBox(
                              width: 205,
                              child: CustomTextField(
                                borderRadius: 10,
                                height: 40,
                                text: 'First Name',
                                onChanged: (name) =>
                                    ctrl.onChangeFirstName(name),
                                // prefixIcon: const Icon(Icons.person),
                                errorMessage: ctrl.firstNameError,
                              ),
                            ),
                            const SizedBox(
                              width: 35,
                            ),
                            SizedBox(
                              width: 205,
                              child: CustomTextField(
                                borderRadius: 10,
                                height: 40,
                                text: 'Last Name',
                                onChanged: (pass) =>
                                    ctrl.onChangeLastName(pass),
                                // prefixIcon: const Icon(Icons.lock),
                                errorMessage: ctrl.lastNameError,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        Row(
                          children: [
                            SizedBox(
                              width: 205,
                              child: CustomTextField(
                                borderRadius: 10,
                                height: 40,
                                text: 'Username',
                                onChanged: (name) =>
                                    ctrl.OnchangeUsername(name),
                                // prefixIcon: const Icon(Icons.person),
                                errorMessage: ctrl.usernameError,
                              ),
                            ),
                            const SizedBox(
                              width: 35,
                            ),
                            SizedBox(
                              width: 205,
                              child: CustomTextField(
                                borderRadius: 10,
                                height: 40,
                                text: 'Password',
                                onChanged: (pass) =>
                                    ctrl.Onchangepasswordname(pass),
                                isPassword: ctrl.isPassword,
                                // prefixIcon: const Icon(Icons.lock),
                                errorMessage: ctrl.passwordError,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        CustomTextField(
                          borderRadius: 10,
                          height: 40,
                          text: 'Email',
                          onChanged: (name) => ctrl.onChangeEmail(name),
                          // prefixIcon: const Icon(Icons.person),
                          errorMessage: ctrl.emailError,
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        Row(
                          children: [
                            SizedBox(
                              width: 205,
                              child: CustomDateField(
                                borderRadius: 10,
                                height: 40,
                                text: 'Date of Birth',
                                onDateSelected:ctrl.onChangeDate,
                                // prefixIcon: const Icon(Icons.person),
                                errorMessage: ctrl.dateOfBirthError,
                              ),
                            ),
                            const SizedBox(
                              width: 35,
                            ),
                            SizedBox(
                              width: 205,
                              child: CustomTextField(
                                borderRadius: 10,
                                height: 40,
                                text: 'Gender',
                                onChanged: (name) => ctrl.onChangeGender(name),
                                // prefixIcon: const Icon(Icons.person),
                                errorMessage: ctrl.genderError,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        CustomTextField(
                          borderRadius: 10,
                          height: 40,
                          text: 'Phone Number',
                          onChanged: (name) => ctrl.onChangePhoneNumber(name),
                          // prefixIcon: const Icon(Icons.person),
                          errorMessage: ctrl.phoneNumberError,
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        AppText(
                          'Emergency Contact',
                          style: TextStyle(
                            fontFamily: FontFamily.medium,
                            fontSize: 15,
                          ),
                        ),
                        const SizedBox(
                          height: 10,
                        ),
                        Row(
                          children: [
                            SizedBox(
                              width: 205,
                              child: CustomTextField(
                                borderRadius: 10,
                                height: 40,
                                text: 'Full Name',
                                onChanged: (name) =>
                                    ctrl.onChangeEmergenctName(name),
                                // prefixIcon: const Icon(Icons.person),
                                errorMessage: ctrl.emergencyContactNameError,
                              ),
                            ),
                            const SizedBox(
                              width: 35,
                            ),
                            SizedBox(
                              width: 205,
                              child: CustomTextField(
                                borderRadius: 10,
                                height: 40,
                                text: 'Phone Number',
                                onChanged: (name) =>
                                    ctrl.onChangeEmergenctNumber(name),
                                // prefixIcon: const Icon(Icons.person),
                                errorMessage: ctrl.emergencyContactNumberError,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 50),
                          child: CustomButton(
                            onTap: () {
                              ctrl.validate();
                            },
                            text: 'Register',
                            backgroundColor: AppColors.mainColor,
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
