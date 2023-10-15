import 'package:flutter/material.dart';
import 'package:ori_dx_app/Fetures/Authentication/RegisterAsPatient/View/Widgets/RegisterAsPatientBody.dart';

class RegisterAsPatient extends StatelessWidget {
  const RegisterAsPatient({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(),
      body: SafeArea(
        child: RegisterAsPatientBody(),
      ),
    );
  }
}
