import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/FamilyMembersControllers/AddFamilyMemberController.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomDateField.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomTextField.dart';
import 'package:ori_dx_app/GeneralWidgets/SingleList.dart';

class AddPackage extends StatelessWidget {
  AddPackage({super.key}) {
    Get.put(AddFamilyMemberController());
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<AddFamilyMemberController>(builder: (ctrl) {
      return SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(
              height: 20,
            ),
            Image.asset(
              'assets/images/family.png',
              height: 120,
            ),
            const SizedBox(
              height: 20,
            ),
            const Text(
              'Add Family Member',
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
              text: 'National ID',
              onChanged: (name) => ctrl.onChangeNationalID(name),
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.nationalIDError,
            ),
            const SizedBox(
              height: 10,
            ),
            SingleList(
              onChanged: ctrl.onChangedGender,
              errorMessage: ctrl.genderError,
              items: const {1: "Male", 2: "Female"},
              title: 'Gender',
              searchEnabled: false,
            ),
            const SizedBox(
              height: 10,
            ),
            CustomDateField(
              borderRadius: 10,
              text: 'Date Of Birth',
              onDateSelected: ctrl.onChagedDateOfBirth,
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.dateOfBirthError,
            ),
            const SizedBox(
              height: 10,
            ),
            SingleList(
              onChanged: ctrl.onChangedRelationship,
              // prefixIcon: const Icon(Icons.person),
              errorMessage: ctrl.relationError,
              items: const {1: "Husband", 2: "Wife", 3: "Son", 4: "Daughter"},
              title: 'Relationship',
              searchEnabled: false,
            ),
            const SizedBox(
              height: 15,
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
