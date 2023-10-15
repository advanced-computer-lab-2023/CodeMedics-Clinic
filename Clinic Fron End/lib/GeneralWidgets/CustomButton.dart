import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:ori_dx_app/shared/Fonts/FontModel.dart';

import '../shared/AppColors.dart';
import 'AppText.dart';

class CustomButton extends StatelessWidget {
  const CustomButton({
    super.key,
    required this.text,
    this.backgroundColor = AppColors.mainColor,
    this.textColor = Colors.white,
    this.horizontalPadding,
    this.verticalPadding,
    required this.onTap,
    this.fontSize,
    this.borderWidth,
    this.suffixIcon,
    this.border,
    this.prefixIcon,
    this.borderRadius,
    this.mainAxisAlignment = MainAxisAlignment.center,
  });

  final Widget? suffixIcon;
  final Widget? prefixIcon;
  final String text;
  final Color backgroundColor;
  final Color textColor;
  final double? horizontalPadding;
  final double? verticalPadding;
  final VoidCallback onTap;
  final double? fontSize;
  final double? borderWidth;
  final double? borderRadius;
  final BoxBorder? border;
  final MainAxisAlignment mainAxisAlignment;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        // height: 40.h,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(borderRadius ?? 40),
          color: backgroundColor,
          border: border,
        ),
        padding: EdgeInsets.symmetric(
          horizontal: horizontalPadding ?? 20,
          vertical: verticalPadding ?? 15,
        ),
        child: Center(
          child: Row(
            mainAxisAlignment: mainAxisAlignment,
            children: [
              if (prefixIcon != null)
                Row(
                  children: [
                    const SizedBox(width: 5),
                    prefixIcon!,
                  ],
                ),
              SizedBox(
                width: prefixIcon == null ? 0 : 8,
              ),
              AppText(
                text,
                style: TextStyle(
                  color: textColor,
                  fontSize: fontSize ?? 15,
                  fontFamily: FontFamily.medium,
                ),
              ),
              if (suffixIcon != null)
                Row(
                  children: [
                    const SizedBox(width: 8),
                    suffixIcon!,
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}
