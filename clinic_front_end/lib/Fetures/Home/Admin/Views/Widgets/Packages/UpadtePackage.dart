import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Packages/UpadtePackageController.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';

import 'package:ori_dx_app/GeneralWidgets/CustomTextField.dart';
import 'package:ori_dx_app/Models/Package.dart';

class UpdatePackage extends StatelessWidget {
  UpdatePackage({super.key, required this.package}) {
    Get.put(UpdatePackageController());
  }
  final Package package;
  @override
  Widget build(BuildContext context) {
    return GetBuilder<UpdatePackageController>(builder: (ctrl) {
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
              'Update Package',
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
              text: 'Name',
              onChanged: (name) => ctrl.onChangeName(name),
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.nameError,
              intialValue: package.name,
              enabled: false,
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
