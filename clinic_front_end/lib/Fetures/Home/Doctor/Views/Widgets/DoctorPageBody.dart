import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Guest/View/Guest.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Controllers/DoctorPageController.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Views/Appointments/DoctorAppointmentsWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Views/Widgets/Patients/PatientsWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/View/Widgets/Appointments/PatientAppointmentsWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/View/Widgets/Doctors/DoctorsWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/View/Widgets/Prescriptions/PrescriptionsWidget.dart';
import 'package:ori_dx_app/GeneralWidgets/AppText.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/shared/AppColors.dart';
import 'package:ori_dx_app/shared/AppShared.dart';
import 'package:ori_dx_app/shared/Fonts/FontModel.dart';

class DoctorPageBody extends StatelessWidget {
  DoctorPageBody({super.key}) {
    Get.put(DoctorPageController());
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<DoctorPageController>(
        id: 'patientPageBuilder',
        builder: (ctr) {
          return SingleChildScrollView(
            child: Stack(
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 40, left: 10),
                  child: GetBuilder<DoctorPageController>(
                    id: 'tapsBuilder',
                    builder: (ctrl) {
                      return Container(
                        width: 210,
                        decoration: BoxDecoration(
                          color: AppColors.mainColor,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 13, vertical: 20),
                        child: Column(
                          children: [
                            const SizedBox(
                              height: 20,
                            ),
                            SizedBox(
                              height: 40,
                              child: Image.asset('assets/images/logo9.png'),
                            ),
                            const SizedBox(height: 20),
                            CustomButton(
                              text: 'Patients',
                              onTap: () {
                                ctrl.onTapPatient();
                              },
                              backgroundColor: ctrl.patientsColor,
                              textColor: ctrl.patientsFontColor,
                              prefixIcon: Image.asset(
                                'assets/images/patient.png',
                                width: 20,
                              ),
                              borderRadius: 10,
                              fontSize: 13,
                              mainAxisAlignment: MainAxisAlignment.start,
                            ),
                            const SizedBox(height: 10),
                            // CustomButton(
                            //   text: 'Appointments',
                            //   onTap: () {
                            //     ctrl.onTapAppointments();
                            //   },
                            //   backgroundColor: ctrl.doctorsColor,
                            //   textColor: ctrl.doctorsFontColor,
                            //   prefixIcon: Image.asset(
                            //     'assets/images/calendar.png',
                            //     width: 20,
                            //   ),
                            //   borderRadius: 10,
                            //   fontSize: 13,
                            //   mainAxisAlignment: MainAxisAlignment.start,
                            // ),
                            // const SizedBox(height: 10),
                            // CustomButton(
                            //   text: 'Prescriptions',
                            //   onTap: () {
                            //     ctrl.onTapPrescriptions();
                            //   },
                            //   backgroundColor: ctrl.prescriptionsColor,
                            //   textColor: ctrl.prescriptionsFontColor,
                            //   prefixIcon: Image.asset(
                            //     'assets/images/prescription.png',
                            //     width: 20,
                            //   ),
                            //   borderRadius: 10,
                            //   fontSize: 13,
                            //   mainAxisAlignment: MainAxisAlignment.start,
                            // ),
                            // const SizedBox(height: 10),
                            CustomButton(
                              text: 'Appointments',
                              onTap: () {
                                ctrl.onTapAppointments();
                              },
                              backgroundColor: ctrl.appointmentsColor,
                              textColor: ctrl.appointmentsFontColor,
                              prefixIcon: Image.asset(
                                'assets/images/calendar.png',
                                width: 20,
                              ),
                              borderRadius: 10,
                              fontSize: 13,
                              mainAxisAlignment: MainAxisAlignment.start,
                            ),
                            const SizedBox(height: 350),
                            Container(
                              height: 150,
                              decoration: BoxDecoration(
                                color: const Color.fromARGB(147, 121, 160, 244),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              padding: const EdgeInsets.symmetric(
                                  vertical: 20, horizontal: 19),
                              child: Column(
                                children: [
                                  AppText(
                                    'Have any Problems? Try to Contact Us',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontFamily: FontFamily.medium,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 30),
                                  CustomButton(
                                    text: 'Contact Us',
                                    onTap: () {},
                                    borderRadius: 10,
                                    verticalPadding: 10,
                                    // backgroundColor: Colors.white,
                                    // textColor: AppColors.mainColor,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                if (ctr.patientsSelected) PatientsWidget(),
                if (ctr.doctorsSelected) DoctorsWidget(),
                if (ctr.appointmentsSelected) DoctorAppointmentsWidget(),
                if (ctr.prescriptionsSelected) PrescriptionsWidget(),
                Padding(
                  padding: const EdgeInsets.only(left: 250, top: 50),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AppText(
                        'Welcome Back Dr,',
                        style: TextStyle(
                          color: Colors.black,
                          fontFamily: FontFamily.medium,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      AppText(
                        '${AppShared.doctor!.firstName} ${AppShared.doctor!.lastName}',
                        style: TextStyle(
                          color: AppColors.mainColor,
                          fontFamily: FontFamily.medium,
                          fontSize: 25,
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 5, left: 1390, right: 10),
                  child: CustomButton(
                    text: 'Logout',
                    onTap: () {
                      Get.offAll(() => const Guest());
                    },
                    borderRadius: 10,
                    suffixIcon: const Icon(
                      FontAwesomeIcons.rightFromBracket,
                      color: Colors.white,
                      size: 15,
                    ),
                  ),
                ),
              ],
            ),
          );
        });
  }
}
