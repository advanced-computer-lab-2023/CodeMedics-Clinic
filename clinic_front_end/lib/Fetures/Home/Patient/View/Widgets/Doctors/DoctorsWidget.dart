import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/DoctorsControllers/DoctorsController.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/View/Widgets/Doctors/DoctorInfoWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/View/Widgets/Doctors/DoctorWidget.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomDateField.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomTextField.dart';
import 'package:ori_dx_app/GeneralWidgets/SingleList.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

class DoctorsWidget extends StatelessWidget {
  DoctorsWidget({super.key}) {
    Get.put(DoctorsController());
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<DoctorsController>(
        id: 'doctorsBuilder',
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
                            childAspectRatio: 0.73,
                            children: <Widget>[
                              for (int i = 0; i < ctrl.resDoctors.length; i++)
                                DoctorWidget(
                                  doctor: ctrl.resDoctors[i],
                                  onTap: () {
                                    ctrl.onTapDoctor(ctrl.resDoctors[i]);
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
              if (ctrl.doctorSelected)
                DoctorInfoWidget(doctor: ctrl.selectedDoctor!),
              Padding(
                padding: const EdgeInsets.only(top: 60, left: 650, right: 653),
                child: SizedBox(
                  height: 40,
                  child: CustomTextField(
                      text: 'Doctor Name',
                      borderRadius: 10,
                      fontSize: 14,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.only(left: 20),
                      onChanged: ctrl.onDoctorSearch,
                      prefixIcon: const Icon(
                        Icons.search,
                        // color: AppColor,
                      )),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 60, left: 900, right: 403),
                child: SizedBox(
                  height: 40,
                  child: CustomTextField(
                      text: 'Speciality',
                      borderRadius: 10,
                      fontSize: 14,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.only(left: 20),
                      onChanged: ctrl.onSpecialitySearch,
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
                    child: SingleList(
                      items: ctrl.specialities,
                      onChanged: ctrl.onFilterSpecialityChanged,
                      title: 'Speciality',
                    ),
                  ),
                ),
              if (ctrl.filterImage == 'filter')
                Padding(
                  padding:
                      const EdgeInsets.only(left: 550, top: 112, right: 750),
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
