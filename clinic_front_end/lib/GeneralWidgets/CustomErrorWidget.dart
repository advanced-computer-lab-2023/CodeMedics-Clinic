import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CustomErrorWidget extends StatelessWidget {
  const CustomErrorWidget(
      {super.key,
      required this.icon,
      required this.text,
      required this.padding});
  final Widget icon;
  final Widget text;
  final EdgeInsetsGeometry padding;
  @override
  Widget build(BuildContext context) {
    return Container(
      width: ScreenUtil().screenWidth,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(30),
          topRight: Radius.circular(30),
        ),
      ),
      padding: const EdgeInsets.only(
        top: 30,
      ),
      child: Center(
        child: Padding(
          padding: padding,
          child: Column(
            children: [
              icon,
              const SizedBox(
                height: 20,
              ),
              text
            ],
          ),
        ),
      ),
    );
  }
}
