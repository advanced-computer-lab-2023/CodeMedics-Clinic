import 'package:date_field/date_field.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:ori_dx_app/GeneralWidgets/AppText.dart';
import 'package:ori_dx_app/shared/Fonts/FontModel.dart';

class CustomDateField extends StatelessWidget {
  const CustomDateField({
    super.key,
    this.isPassword = false,
    required this.text,
    this.error = false,
    this.errorMessage,
    this.intialValue,
    this.prefixIcon,
    this.suffixIcon,
    this.fillColor,
    required this.borderRadius,
    this.textColor,
    this.height,
    this.contentPadding,
    this.label,
    this.enabled = true,
    this.hintText,
    this.controller,
    this.keyboardType,
    this.fontSize = 14,
    required this.onDateSelected,
    this.time = false,
  });

  final bool isPassword;
  final bool error;
  final String text;
  final String? hintText;
  final String? errorMessage;
  final String? intialValue;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final Color? fillColor;
  final Color? textColor;
  final double borderRadius;
  final double? height;
  final Widget? label;
  final EdgeInsetsGeometry? contentPadding;
  final bool enabled;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final double? fontSize;
  final bool time;

  final void Function(DateTime date) onDateSelected;
  @override
  Widget build(BuildContext context) {
    return DateTimeFormField(
      onDateSelected: onDateSelected,
      dateTextStyle: TextStyle(
        color: textColor ?? const Color.fromRGBO(119, 120, 122, 1),
        fontFamily: FontFamily.medium,
        fontSize: fontSize,
        // fontFamily: FontFamily.medium,
      ),
      decoration: InputDecoration(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          borderSide: BorderSide.none,
        ),
        fillColor: fillColor ?? const Color.fromRGBO(240, 241, 245, 1),
        filled: true,
        contentPadding: contentPadding ??
            const EdgeInsets.symmetric(
              horizontal: 10,
              vertical: 0,
            ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          // borderSide: const BorderSide(
          //   color: Color.fromRGBO(0, 97, 137, 1),
          //   width: 2,
          // ),
          borderSide: BorderSide.none,
        ),
        prefixIcon: const Icon(FontAwesomeIcons.calendarDays),
        suffixIcon: suffixIcon,
        enabled: enabled,

        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          // borderSide: const BorderSide(
          //   color: Color.fromRGBO(184, 185, 188, 1),
          //   width: 0,
          // ),
          borderSide: BorderSide.none,
        ),
        // hintText: text,
        hintText: hintText,
        label: (hintText == null) ? AppText(text) : null,
        labelStyle: TextStyle(
          color: textColor ?? const Color.fromRGBO(119, 120, 122, 1),
          // fontFamily: FontFamily.medium,
        ),
        hintStyle: TextStyle(
          color: textColor ?? const Color.fromRGBO(119, 120, 122, 1),
          fontFamily: FontFamily.medium,
          fontSize: fontSize,
        ),
        errorText: errorMessage,
        errorStyle: TextStyle(
          color: Colors.red,
          fontFamily: FontFamily.medium,
          fontSize: 12,
        ),
      ),
      mode: time
          ? DateTimeFieldPickerMode.dateAndTime
          : DateTimeFieldPickerMode.date,
      // use24hFormat: true,
    );
  }
}
