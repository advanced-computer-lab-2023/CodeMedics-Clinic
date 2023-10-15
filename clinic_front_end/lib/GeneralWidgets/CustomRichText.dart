import 'package:flutter/material.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

import '../shared/Fonts/FontModel.dart';

class CustomRichText extends StatelessWidget {
  const CustomRichText({
    super.key,
    required this.title,
    required this.text,
    this.size,
    this.image,
  });

  final String title;
  final String text;
  final double? size;
  final Image? image;
  @override
  Widget build(BuildContext context) {
    return RichText(
      text: TextSpan(
        style: TextStyle(
          overflow: TextOverflow.clip,
          fontSize: size ?? 16,
          color: AppColors.mainColor,
          fontFamily: FontFamily.medium,
        ),
        children: [
          TextSpan(
            text: '$title: ',
            style: TextStyle(
              fontFamily: FontFamily.bold,
            ),
          ),
          TextSpan(
            text: text,
            style: TextStyle(
              // color: Color.fromARGB(255, 39, 101, 235),
              fontFamily: FontFamily.medium,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
