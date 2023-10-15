import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Admins/AddAdminController.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Packages/AddPackageController.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';

import 'package:ori_dx_app/GeneralWidgets/CustomTextField.dart';

class AddPackage extends StatelessWidget {
  AddPackage({super.key}) {
    Get.put(AddPackageController());
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<AddPackageController>(builder: (ctrl) {
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
              'Add Package',
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
              text: 'Price',
              onChanged: (name) => ctrl.onChangePrice(name),
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.priceError,
            ),
            const SizedBox(
              height: 10,
            ),
            CustomTextField(
              borderRadius: 10,
              text: 'Session Discount',
              onChanged: ctrl.onChagedSessionDiscount,
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.sessionDiscountError,
            ),
            const SizedBox(
              height: 10,
            ),
            CustomTextField(
              borderRadius: 10,
              text: 'MedicineDiscount',
              onChanged: ctrl.onChagedMedicineDiscount,
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.medicineDiscountError,
            ),
            const SizedBox(
              height: 10,
            ),
            CustomTextField(
              borderRadius: 10,
              text: 'Family Discount',
              onChanged: ctrl.onChagedFamilyDiscount,
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.familyDiscountError,
            ),
            const SizedBox(
              height: 10,
            ),
            CustomButton(
              text: 'Add Package',
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
