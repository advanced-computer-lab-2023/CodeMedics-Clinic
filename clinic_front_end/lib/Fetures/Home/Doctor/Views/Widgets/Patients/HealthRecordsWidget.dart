import 'package:flutter/material.dart';
import 'package:ori_dx_app/GeneralWidgets/ItemWidget.dart';
import 'package:ori_dx_app/Models/Appointment.dart';

class HealthRecordsWidget extends StatelessWidget {
  const HealthRecordsWidget({super.key, required this.appointments});

  final List<Appointment> appointments;
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          for (int i = 0; i < appointments.length; i++)
            ItemWidget(
              image: 'record',
              title: appointments[i].status,
              subTitle:
                  'Date: ${appointments[i].date}\nStart Hour: ${appointments[i].startHour}\nEnd Hour: ${appointments[i].endHour}\n',
              icon: Icons.navigate_next,
              // verticalPadding: 15.h,
              onTap: () {
                // ctrl.onTapProduct(ctrl.searchedProducts[i]);
              },
            ),
        ],
      ),
    );
  }
}
