import 'package:flutter/material.dart';

import '../shared/Fonts/FontModel.dart';
import 'AppText.dart';

class ItemWidget extends StatelessWidget {
  const ItemWidget({
    super.key,
    required this.image,
    this.imageSize,
    this.icon,
    required this.title,
    this.titleSize,
    this.titleColor = Colors.black,
    required this.subTitle,
    this.subTitleSize,
    this.subTitleColor = Colors.black,
    this.backgroundColor = const Color(0xfff3f4f8),
    this.borderRadius,
    this.onTap,
    this.iconSize,
    this.verticalPadding,
    this.horizontalPadding,
    this.onPressed,
    this.boxShaow,
  });

  final String image;
  final double? imageSize;
  final IconData? icon;
  final double? iconSize;
  final String title;
  final double? titleSize;
  final Color titleColor;
  final String subTitle;
  final double? subTitleSize;
  final Color subTitleColor;
  final Color backgroundColor;
  final double? borderRadius;
  final Function()? onTap;
  final double? verticalPadding;
  final double? horizontalPadding;
  final Function()? onPressed;
  final List<BoxShadow>? boxShaow;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(borderRadius ?? 20),
          color: backgroundColor,
          boxShadow: boxShaow,
        ),
        child: ListTile(
          leading: SizedBox(
            height: imageSize ?? 45,
            child: Image.asset(
              'assets/images/$image.png',
            ),
          ),
          contentPadding: EdgeInsets.symmetric(
              vertical: verticalPadding ?? 10,
              horizontal: horizontalPadding ?? 15),
          title: AppText(
            title,
            style: TextStyle(
              fontSize: titleSize ?? 13,
              fontFamily: FontFamily.bold,
              color: titleColor,
            ),
            overflow: TextOverflow.ellipsis,
          ),
          subtitle: subTitle.isNotEmpty
              ? AppText(
                  subTitle,
                  style: TextStyle(
                    fontSize: subTitleSize ?? 12,
                    fontFamily: FontFamily.medium,
                    color: subTitleColor,
                  ),
                )
              : null,
          onTap: onTap,
        ),
      ),
    );
  }
}
