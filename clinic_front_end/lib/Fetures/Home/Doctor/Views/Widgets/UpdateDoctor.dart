import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Packages/UpadtePackageController.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Controllers/UpdateDoctorController.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';

import 'package:ori_dx_app/GeneralWidgets/CustomTextField.dart';
import 'package:ori_dx_app/Models/Doctor.dart';
import 'package:ori_dx_app/Models/Package.dart';
import 'package:ori_dx_app/shared/AppShared.dart';

class UpdateDoctor extends StatelessWidget {
  UpdateDoctor({super.key, required this.package}) {
    Get.put(UpdateDoctorController());
  }
  final Doctor package;
  @override
  Widget build(BuildContext context) {
    return GetBuilder<UpdateDoctorController>(builder: (ctrl) {
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
              'Update Doctor',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(
              height: 10,
            ),
            CustomTextField(
              borderRadius: 10,
              text: 'Email',
              intialValue: AppShared.doctor!.email,
              onChanged: (name) => ctrl.onChangeEmail(name),
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.emailError,
            ),
            const SizedBox(
              height: 10,
            ),
            CustomTextField(
              borderRadius: 10,
              text: 'Hourly Rate',
              intialValue: AppShared.doctor!.hourlyRate.toString(),
              onChanged: ctrl.onChagedHourlyRate,
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.hourlyRateError,
            ),
            const SizedBox(
              height: 10,
            ),
            CustomTextField(
              borderRadius: 10,
              text: 'Affiliation',
              intialValue: AppShared.doctor!.affiliation,
              onChanged: ctrl.onChagedAffiliation,
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.affiliationError,
            ),
            const SizedBox(
              height: 10,
            ),
            CustomButton(
              text: 'Update',
              onTap: () {
                ctrl.onTapAddMember(package);
              },
              borderRadius: 10,
            ),
          ],
        ),
      );
    });
  }
}
