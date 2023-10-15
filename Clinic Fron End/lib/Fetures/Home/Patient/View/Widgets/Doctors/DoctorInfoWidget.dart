import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/DoctorsControllers/DoctorsController.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/FamilyMembersControllers/FamilyMembersController.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomRichText.dart';
import 'package:ori_dx_app/Models/Doctor.dart';
import 'package:ori_dx_app/Models/FamilyMember.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

class DoctorInfoWidget extends StatelessWidget {
  DoctorInfoWidget({super.key, required this.doctor}) {
    Get.put(DoctorsController());
  }
  final Doctor doctor;
  @override
  Widget build(BuildContext context) {
    return GetBuilder<DoctorsController>(builder: (ctrl) {
      return Stack(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 135, left: 1200),
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
                      'assets/images/doctor6.png',
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
                          text: '${doctor.firstName} ${doctor.lastName}',
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Speciality',
                          text: doctor.speciality,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Degree',
                          text: doctor.degree,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Date Of Birth',
                          text: doctor.dateOfBirth,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Session Price',
                          text: doctor.price.toString(),
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Affiliation',
                          text: doctor.affiliation,
                          size: 14,
                        ),
                      ],
                    ),
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
