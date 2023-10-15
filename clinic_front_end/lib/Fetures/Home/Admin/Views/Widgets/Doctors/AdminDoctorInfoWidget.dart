import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Admins/AdminsController.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Doctors/AdminDoctorController.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Patients/AdminPatientsController.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/FamilyMembersControllers/FamilyMembersController.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomRichText.dart';

import 'package:ori_dx_app/Models/Doctor.dart';

import 'package:ori_dx_app/shared/AppColors.dart';

class AdminDoctorInfoWidget extends StatelessWidget {
  AdminDoctorInfoWidget({super.key, required this.doctor}) {
    Get.put(AdminDoctorController());
  }
  final Doctor doctor;
  @override
  Widget build(BuildContext context) {
    return GetBuilder<AdminDoctorController>(builder: (ctrl) {
      return Stack(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 65, left: 1200),
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
                      height: 120,
                    ),
                  ),
                  const SizedBox(
                    height: 10,
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
                          title: 'Username',
                          text: doctor.username,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Email',
                          text: doctor.email,
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
                          title: 'Specialty',
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
                          title: 'Affiliation',
                          text: doctor.affiliation,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Status',
                          text: doctor.status,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Hourly Rate',
                          text: doctor.hourlyRate.toString(),
                          size: 14,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  CustomButton(
                    text: 'Remove',
                    onTap: () {
                      ctrl.onTapRemovePatient(doctor);
                    },
                    backgroundColor: Colors.red,
                    borderRadius: 10,
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  CustomButton(
                    text: 'Accept',
                    onTap: () {
                      // ctrl.onTapRemovePatient(doctor);
                    },
                    backgroundColor: Colors.green,
                    borderRadius: 10,
                  ),
                  const SizedBox(
                    height: 10,
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
