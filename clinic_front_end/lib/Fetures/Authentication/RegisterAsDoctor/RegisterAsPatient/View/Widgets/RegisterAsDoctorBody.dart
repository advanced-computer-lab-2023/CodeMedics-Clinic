import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/GeneralWidgets/AppText.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomDateField.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomRadioButton.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomTextField.dart';
import 'package:ori_dx_app/GeneralWidgets/SingleList.dart';
import 'package:ori_dx_app/shared/AppColors.dart';
import 'package:ori_dx_app/shared/Fonts/FontModel.dart';

import '../../Controllers/RegisterAsDoctorController.dart';

class RegisterAsDoctorBody extends GetView<RegisterAsDoctorController> {
  RegisterAsDoctorBody({super.key}) {
    Get.put(RegisterAsDoctorController());
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<RegisterAsDoctorController>(
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
                            'Register as Doctor',
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
                                onDateSelected: ctrl.onChangeDate,
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
                                text: 'Hourly Rate',
                                onChanged: (name) =>
                                    ctrl.onChangeHourlyRate(name),
                                // prefixIcon: const Icon(Icons.person),
                                errorMessage: ctrl.hourlyRateError,
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
                          text: 'Affiliation',
                          onChanged: (name) => ctrl.onChangedAffiliation(name),
                          // prefixIcon: const Icon(Icons.person),
                          errorMessage: ctrl.degreeError,
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        Row(
                          children: [
                            SizedBox(
                              width: 205,
                              child: SingleList(
                                items: ctrl.specialities,
                                onChanged: ctrl.onSpecialityChanged,
                                title: 'Speciality',
                                errorMessage: ctrl.specialityError,
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
                                text: 'Degree',
                                onChanged: (name) => ctrl.onChangeDegree(name),
                                // prefixIcon: const Icon(Icons.person),
                                errorMessage: ctrl.degreeError,
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
