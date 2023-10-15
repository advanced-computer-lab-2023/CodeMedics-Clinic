import 'package:flutter/material.dart';
import 'Widgets/LoginBody.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(),
      body: SafeArea(
        child: LoginBody(),
      ),
    );
  }
}
