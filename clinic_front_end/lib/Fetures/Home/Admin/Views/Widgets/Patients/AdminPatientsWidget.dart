import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Controllers/Admins/AdminsController.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Views/Widgets/Admins/AdminInfoWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Admin/Views/Widgets/Patients/AdminPatientInfoWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Controllers/Patients/PatientsController.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

import 'adminWidget.dart';

class AdminPatientsWidget extends StatelessWidget {
  AdminPatientsWidget({super.key}) {
    Get.put(PatientsController());
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<AdminsController>(
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
                              for (int i = 0; i < ctrl.admins.length; i++)
                                AdminPatientInfoWidget(
                                  patient: ctrl.admins[i],
                                  onTap: () {
                                    ctrl.onTapMember(ctrl.admins[i]);
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
              Padding(
                padding: const EdgeInsets.only(top: 50, left: 880, right: 403),
                child: CustomButton(
                  onTap: () {
                    ctrl.onTapAddMember();
                  },
                  text: 'Add Admin',
                  borderRadius: 10,
                  suffixIcon: const Icon(
                    FontAwesomeIcons.plus,
                    color: Colors.white,
                    size: 15,
                  ),
                ),
              ),
              if (ctrl.adminSelected)
                AdminInfoWidget(admin: ctrl.selectedAdmin!),
            ],
          );
        });
  }
}
