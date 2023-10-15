import 'package:flutter/material.dart';
import 'package:get/get_connect/http/src/utils/utils.dart';
import 'package:ori_dx_app/GeneralWidgets/AppText.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

import '../shared/Fonts/FontModel.dart';

class CustomRichText2 extends StatelessWidget {
  const CustomRichText2({
    super.key,
    required this.title,
    required this.text,
    this.size = 16,
  });

  final String title;
  final String text;
  final double size;
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        AppText(
          '$title: ',
          style: TextStyle(
            color: AppColors.mainColor,
            fontFamily: FontFamily.bold,
            fontSize: size,
          ),
        ),
        const SizedBox(
          width: 3,
        ),
        Expanded(
          child: AppText(
            text,
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
            style: TextStyle(
              color: AppColors.mainColor,
              fontFamily: FontFamily.medium,
              fontSize: size,
            ),
          ),
        ),
      ],
    );
  }
}
