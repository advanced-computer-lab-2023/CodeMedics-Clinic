import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart';

import 'CustomTextField.dart';

class CustomSearchBar extends StatelessWidget {
  const CustomSearchBar({
    super.key,
    this.onChanged,
  });
  final Function(String)? onChanged;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 30.w,
        right: 30.w,
        top: 0.h,
      ),
      child: CustomTextField(
        borderRadius: 30.w, height: 50.h,
        text: 'Search',
        hintText: 'Search',
        textColor: Colors.black,
        contentPadding: EdgeInsets.only(
          left: 20.w,
          top: 10.h,
          bottom: 10.h,
        ),
        // prefixIcon: Icon(
        //   FontAwesomeIcons.mag,
        //   color: Colors.black,
        //   size: 20.sp,
        // ),
        onChanged: onChanged,
        // fillColor: Color.fromRGBO(184, 213, 225, 1),
      ),
    );
  }
}
