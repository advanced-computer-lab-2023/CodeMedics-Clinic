import 'package:dropdown_textfield/dropdown_textfield.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:ori_dx_app/GeneralWidgets/AppText.dart';

import '../shared/Fonts/FontModel.dart';

class MultiSelectList extends StatelessWidget {
  const MultiSelectList({
    super.key,
    required this.items,
    required this.title,
    this.errorMessage,
    required this.onChanged,
    this.textColor,
  });

  final String title;
  final String? errorMessage;
  final Map<String, String> items;
  final Function(dynamic) onChanged;
  final Color? textColor;
  @override
  Widget build(BuildContext context) {
    return DropDownTextField.multiSelection(
      dropDownItemCount: 5,
      textStyle: TextStyle(
        fontFamily: FontFamily.medium,
        fontSize: 15.sp,
        color: const Color.fromRGBO(119, 120, 122, 1),
      ),
      textFieldDecoration: InputDecoration(
        label: AppText(title),
        hintStyle: TextStyle(
          color: textColor ?? const Color.fromRGBO(119, 120, 122, 1),
          fontFamily: FontFamily.medium,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10.w),
          borderSide: BorderSide.none,
        ),
        fillColor: const Color.fromRGBO(240, 241, 245, 1),
        filled: true,
        errorText: errorMessage,
        errorStyle: TextStyle(
          color: Colors.red,
          fontFamily: FontFamily.medium,
          fontSize: 9.sp,
        ),
      ),
      // initialValue: const [],
      dropDownList: [
        for (var item in items.entries)
          DropDownValueModel(
              name: "${item.value} (${item.key})", value: item.key),
      ],
      submitButtonText: 'Done',
      submitButtonColor: const Color.fromRGBO(125, 25, 53, 1),
      submitButtonTextStyle: TextStyle(
        color: Colors.white,
        fontSize: 16.sp,
      ),
      onChanged: onChanged,
      listTextStyle: TextStyle(
        color: Colors.black,
        fontSize: 16.sp,
      ),
    );
  }
}
