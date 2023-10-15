import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Admins/AdminsController.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Packages/PackagesController.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/FamilyMembersControllers/FamilyMembersController.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomRichText.dart';
import 'package:ori_dx_app/Models/Admin.dart';
import 'package:ori_dx_app/Models/FamilyMember.dart';
import 'package:ori_dx_app/Models/Package.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

class PackageInfoWidget extends StatelessWidget {
  PackageInfoWidget({super.key, required this.package}) {
    Get.put(PackagesController());
  }
  final Package package;
  @override
  Widget build(BuildContext context) {
    return GetBuilder<PackagesController>(builder: (ctrl) {
      return Stack(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 100, left: 1200),
            child: Container(
              // height: 420,
              width: 300,
              padding: const EdgeInsets.symmetric(horizontal: 30),
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
                    height: 30,
                  ),
                  Center(
                    child: Image.asset(
                      'assets/images/member1.png',
                      height: 150,
                    ),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 20),
                    decoration: BoxDecoration(
                      color: AppColors.backgroundColor,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CustomRichText(
                          title: 'Name',
                          text: package.name,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Price',
                          text: package.price.toString(),
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Session Discount',
                          text: package.sessionDiscount.toString(),
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Medicine Discount',
                          text: package.medicalDiscount.toString(),
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Family Discount',
                          text: package.familyDiscount.toString(),
                          size: 14,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  CustomButton(
                    text: 'Remove',
                    onTap: () {
                      ctrl.onTapRemovePackage(package);
                    },
                    backgroundColor: Colors.red,
                    borderRadius: 10,
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  CustomButton(
                    text: 'Update',
                    onTap: () {
                      ctrl.onTapUpdate(package);
                    },
                    backgroundColor: const Color.fromRGBO(240, 185, 56, 1),
                    borderRadius: 10,
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  CustomButton(
                    text: 'Done',
                    onTap: () {
                      ctrl.onTapDoneMemberInfo();
                    },
                    borderRadius: 10,
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    });
  }
}
