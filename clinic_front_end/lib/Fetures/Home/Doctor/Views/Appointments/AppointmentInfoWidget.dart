import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Controllers/AppointmentsControllers/DoctorAppointmentsController.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/FamilyMembersControllers/FamilyMembersController.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomRichText.dart';
import 'package:ori_dx_app/Models/Appointment.dart';
import 'package:ori_dx_app/Models/FamilyMember.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

class AppointmentInfoWidget extends StatelessWidget {
  AppointmentInfoWidget({super.key, required this.appointment}) {
    Get.put(DoctorAppointmentsController());
  }
  final Appointment appointment;
  @override
  Widget build(BuildContext context) {
    return GetBuilder<DoctorAppointmentsController>(builder: (ctrl) {
      return Stack(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 150, left: 1200),
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
                      'assets/images/calendar.png',
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
                          title: 'Doctor',
                          text: appointment.doctor,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Patient',
                          text: appointment.patient,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Date',
                          text: appointment.date,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'From',
                          text: appointment.startHour.toString(),
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'To',
                          text: appointment.endHour.toString(),
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Status',
                          text: appointment.status,
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
