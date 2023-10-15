import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Views/Appointments/AppointmentInfoWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Doctor/Views/Appointments/appointmentWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/AppointmentsControllers/PatientAppointmentsController.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/View/Widgets/Appointments/PatientAppointmentInfoWidget.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomDateField.dart';
import 'package:ori_dx_app/GeneralWidgets/SingleList.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

class PatientAppointmentsWidget extends StatelessWidget {
  PatientAppointmentsWidget({super.key}) {
    Get.put(PatientAppointmentsController());
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<PatientAppointmentsController>(
        id: 'appointmentsBuilder',
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
                              for (int i = 0;
                                  i < ctrl.resAppointments.length;
                                  i++)
                                AppointmentWidget(
                                  appointment: ctrl.resAppointments[i],
                                  onTap: () {
                                    ctrl.onTapMember(ctrl.resAppointments[i]);
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
              if (ctrl.appointmentSelected)
                PatientAppointmentInfoWidget(
                    appointment: ctrl.selectedAppointment!),
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
                      text: 'Date',
                    ),
                  ),
                ),
              if (ctrl.filterImage == 'filter')
                Padding(
                  padding:
                      const EdgeInsets.only(left: 550, top: 112, right: 750),
                  child: SizedBox(
                    height: 40,
                    child: SingleList(
                      items: const {
                        1: "Upcoming",
                        2: "Completed ",
                        3: "Cancelled",
                        4: "Rescheduled"
                      },
                      onChanged: ctrl.onStatusChanged,
                      title: 'Status',
                      searchEnabled: false,
                    ),
                  ),
                ),
            ],
          );
        });
  }
}
