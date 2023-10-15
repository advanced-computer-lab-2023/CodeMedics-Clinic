import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:ori_dx_app/shared/Fonts/FontModel.dart';

class CustomRadioButton<T> extends StatelessWidget {
  const CustomRadioButton({
    super.key,
    required this.text,
    required this.value,
    required this.groupValue,
    required this.onChanged,
    this.activeColor = const Color.fromRGBO(125, 25, 53, 1),
    this.textColor = Colors.black,
  });

  final String text;
  final T value;
  final T groupValue;
  final Function(T) onChanged;
  final Color activeColor;
  final Color textColor;
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Radio<T>(
          activeColor: activeColor,
          value: value,
          groupValue: groupValue,
          // splashRadius: 20.w,
          onChanged: (type) {
            if (type != null) {
              onChanged(type);
            }
          },
        ),
        Text(
          text,
          style: TextStyle(
            color: textColor,
            fontSize: 16.sp,
            fontFamily: FontFamily.medium,
          ),
        ),
      ],
    );
  }
}
