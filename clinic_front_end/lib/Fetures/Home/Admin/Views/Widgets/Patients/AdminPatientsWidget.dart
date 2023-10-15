import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Admins/AdminsController.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Patients/AdminPatientsController.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Views/Widgets/Admins/AdminInfoWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Views/Widgets/Patients/AdminPatientInfoWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Views/Widgets/Patients/AdminPatientWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Controllers/Patients/PatientsController.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

class AdminPatientsWidget extends StatelessWidget {
  AdminPatientsWidget({super.key}) {
    Get.put(AdminPatientsController());
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<AdminPatientsController>(
        id: 'adminsBuilder',
        builder: (ctrl) {
          return Stack(
            children: [
              Padding(
                padding: const EdgeInsets.only(left: 250, top: 105),
                child: Container(
                  width: 900,
                  height: 585,
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
                  child: Padding(
                    padding: const EdgeInsets.all(30),
                    child: CustomScrollView(
                      slivers: [
                        SliverPadding(
                          padding: const EdgeInsets.all(10),
                          sliver: SliverGrid.count(
                            crossAxisSpacing: 30,
                            mainAxisSpacing: 30,
                            crossAxisCount: 4,
                            childAspectRatio: 0.8,
                            children: <Widget>[
                              for (int i = 0; i < ctrl.patients.length; i++)
                                AdminPatientWidget(
                                  patient: ctrl.patients[i],
                                  onTap: () {
                                    ctrl.onTapMember(ctrl.patients[i]);
                                  },
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              if (ctrl.patientSelected)
                AdminPatientInfoWidget(patient: ctrl.selectedPatient!),
            ],
          );
        });
  }
}
