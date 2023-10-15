import 'package:flutter/material.dart';
import 'package:ori_dx_app/shared/Fonts/FontModel.dart';

import '../shared/AppColors.dart';
import 'AppText.dart';

class CustomCheckBox extends StatelessWidget {
  const CustomCheckBox({
    Key? key,
    required this.value,
    required this.text,
    required this.onChange,
  }) : super(key: key);
  final bool value;
  final String text;
  final Function(bool) onChange;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onChange(!value),
      child: Row(
        children: [
          Container(
            width: 20,
            height: 20,
            decoration: BoxDecoration(
              color: const Color.fromRGBO(240, 241, 245, 1),
              borderRadius: BorderRadius.circular(6),
            ),
            child: value
                ? const Icon(
                    Icons.check,
                    size: 15,
                  )
                : null,
          ),
          const SizedBox(width: 10),
          AppText(
            text,
            style: TextStyle(
              color: AppColors.mainColor,
              fontSize: 18,
              fontFamily: FontFamily.medium,
            ),
          ),
        ],
      ),
    );
  }
}
