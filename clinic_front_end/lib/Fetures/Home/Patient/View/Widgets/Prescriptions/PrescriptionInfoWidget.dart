import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/Controllers/PrescriptionsControllers/PrescriptionsController.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomRichText.dart';
import 'package:ori_dx_app/Models/Prescription.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

class PrescriptionInfoWidget extends StatelessWidget {
  PrescriptionInfoWidget({super.key, required this.prescription}) {
    Get.put(PrescriptionsController());
  }
  final Prescription prescription;
  @override
  Widget build(BuildContext context) {
    return GetBuilder<PrescriptionsController>(builder: (ctrl) {
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
                      'assets/images/prescription1.png',
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
                          title: 'Drug',
                          text: prescription.drug,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Doctor',
                          text: prescription.doctor,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Date',
                          text: prescription.date,
                          size: 14,
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        CustomRichText(
                          title: 'Status',
                          text: prescription.filled ? 'Filled' : 'Un Filled',
                          size: 14,
                        ),
                        // const SizedBox(
                        //   height: 15,
                        // ),
                        // CustomRichText(
                        //   title: 'Relation',
                        //   text: prescription.relation,
                        //   size: 14,
                        // ),
                      ],
                    ),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  CustomButton(
                    text: 'Done',
                    onTap: () {
                      ctrl.onTapDonePrescriptionInfo();
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
