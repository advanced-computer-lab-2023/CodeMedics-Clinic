import 'package:flutter/material.dart';

import '../GeneralWidgets/AppText.dart';
import '../shared/Fonts/FontModel.dart';

class Loading extends StatelessWidget {
  const Loading({
    super.key,
    required this.title,
    required this.content,
  });
  final String title;
  final String content;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 10, bottom: 10, left: 10, right: 10),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AppText(
            title,
            style: TextStyle(
              fontFamily: FontFamily.bold,
              fontSize: 20,
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              const CircularProgressIndicator(),
              // Image.asset(
              //   'assets/images/loadingfinal.gif',
              //   height: 50,
              // ),
              const SizedBox(width: 20),
              AppText(
                content,
                style: TextStyle(
                  fontSize: 17,
                  fontFamily: FontFamily.medium,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
