import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Controllers/Patients/PatientsController.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Views/Widgets/Patients/PatientInfoWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Views/Widgets/Patients/PatientWidget.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomDateField.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomTextField.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

class PatientsWidget extends StatelessWidget {
  PatientsWidget({super.key}) {
    Get.put(PatientsController());
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<PatientsController>(
        id: 'patientsBuilder',
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
                    padding:
                        const EdgeInsets.only(top: 50, left: 40, right: 40),
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
                              for (int i = 0; i < ctrl.resPatients.length; i++)
                                PatientWidget(
                                  patient: ctrl.resPatients[i],
                                  onTap: () {
                                    ctrl.onTapMember(ctrl.resPatients[i]);
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
                PatientInfoWidget(patient: ctrl.selectedPatient!),
              Padding(
                padding: const EdgeInsets.only(top: 60, left: 900, right: 403),
                child: SizedBox(
                  height: 40,
                  child: CustomTextField(
                      text: 'Patient Name',
                      borderRadius: 10,
                      fontSize: 14,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.only(left: 20),
                      onChanged: ctrl.onPatientSearch,
                      prefixIcon: const Icon(
                        Icons.search,
                        // color: AppColor,
                      )),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 257, top: 112),
                child: IconButton(
                  icon: Image.asset('assets/images/${ctrl.filterImage}.png'),
                  onPressed: () {
                    ctrl.onPressedFilter();
                  },
                ),
              ),
              if (ctrl.filterImage == 'filter')
                Padding(
                  padding:
                      const EdgeInsets.only(left: 300, top: 112, right: 1000),
                  child: SizedBox(
                    height: 40,
                    child: CustomDateField(
                      borderRadius: 10,
                      onDateSelected: ctrl.onDateSelected,
                      text: 'Available Date',
                      time: true,
                    ),
                  ),
                ),
            ],
          );
        });
  }
}
