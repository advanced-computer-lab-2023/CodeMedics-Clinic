import 'package:flutter/material.dart';
import 'package:ori_dx_app/Fetures/Authentication/RegisterAsDoctor/RegisterAsPatient/View/Widgets/RegisterAsDoctorBody.dart';
import 'package:ori_dx_app/Fetures/Authentication/RegisterAsPatient/View/Widgets/RegisterAsPatientBody.dart';

class RegisterAsDoctor extends StatelessWidget {
  const RegisterAsDoctor({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(),
      body: SafeArea(
        child: RegisterAsDoctorBody(),
      ),
    );
  }
}
