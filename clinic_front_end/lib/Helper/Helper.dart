import 'dart:async';
import 'package:cached_network_image/cached_network_image.dart';

import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:ori_dx_app/shared/AppColors.dart';

import '../GeneralWidgets/AppText.dart';
import '../GeneralWidgets/CustomButton.dart';
import '../GeneralWidgets/CustomTextBox.dart';
import '../shared/Fonts/FontModel.dart';
import 'Loading.dart';

class Helper {
  static ImageProvider loadImageProvider(String url, String assetsPath) {
    if (url.isNotEmpty) {
      bool validUrl = Uri.parse(url).isAbsolute;
      if (validUrl) {
        return CachedNetworkImageProvider(url);
      } else {
        return AssetImage('assets/images/$assetsPath');
      }
    } else {
      return AssetImage('assets/images/$assetsPath');
    }
  }

  static Widget loadNetworkImage(String url, String assetsErrorPath,
      [String? token, BoxFit fit = BoxFit.cover]) {
    if (url.isNotEmpty) {
      bool validUrl = Uri.parse(url).isAbsolute;
      print(token);
      if (validUrl) {
        return CachedNetworkImage(
          httpHeaders: {
            "Authorization": "Bearer $token",
          },
          imageUrl: url,
          fit: fit,
          placeholder: (ctx, str) => Helper.loadingWidget(),
          errorWidget: (ctx, str, obj) =>
              Image.asset("assets/images/$assetsErrorPath"),
        );
      } else {
        return Image.asset("assets/images/$assetsErrorPath");
      }
    } else {
      return Image.asset("assets/images/$assetsErrorPath");
    }
  }

  static FutureOr<T> showLoading<T>(
    String title,
    String content,
    Future<T> Function() future,
  ) async {
    showDialog(
      context: Get.context!,
      barrierDismissible: false,
      builder: (_) => WillPopScope(
        onWillPop: () async {
          return false;
        },
        child: AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30),
          ),
          content: Loading(
            title: title,
            content: content,
          ),
        ),
      ),
    );
    T res = await future();
    Get.back();
    return res;
  }

  static bool isValidEmail(String email) => RegExp(
          r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
      .hasMatch(email);

  static void showSnackBarMessage(
    BuildContext context,
    String content,
  ) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: AppText(content),
      showCloseIcon: true,
    ));
  }
  

  static Future<void> showMessage(
    String title,
    String message, {
    Widget? widget,
    Color? iconColor,
    CustomButton? button,
  }) async {
    await showDialog(
      context: Get.context!,
      builder: (ctx) => AlertDialog(
        // backgroundColor: const Color.fromRGBO(42, 51, 63, 1),
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30),
        ),
        content: Padding(
          padding: const EdgeInsets.only(
            top: 5,
            bottom: 5,
            left: 5,
            right: 5,
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (widget != null)
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      widget,
                      const SizedBox(height: 20),
                    ],
                  ),
                AppText(
                  title,
                  style: TextStyle(
                    fontFamily: FontFamily.bold,
                    fontSize: 23,
                  ),
                ),
                const SizedBox(height: 10),
                AppText(
                  message,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontFamily: FontFamily.medium,
                    fontSize: 18,
                  ),
                ),
                const SizedBox(height: 20),
                if (button != null) button,
                if (button != null)
                  const SizedBox(
                    height: 10,
                  ),
                CustomButton(
                  text: "OK",
                  backgroundColor: AppColors.mainColor,
                  onTap: () {
                    Get.back();
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  static Future<T?> showMessage1<T>(
    String? title,
    Widget message, {
    Widget? widget,
    Color? iconColor,
    CustomButton? button,
    bool? ok,
  }) async {
    T? res = await showDialog(
      context: Get.context!,
      builder: (ctx) => AlertDialog(
        // backgroundColor: const Color.fromRGBO(42, 51, 63, 1),
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30),
        ),
        content: Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (widget != null)
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      widget,
                      const SizedBox(height: 20),
                    ],
                  ),
                if (title != null)
                  AppText(
                    title,
                    style: TextStyle(
                      fontFamily: FontFamily.bold,
                      fontSize: 20,
                      color: const Color.fromRGBO(104, 5, 35, 1),
                    ),
                    overflow: null,
                  ),
                if (title != null) const SizedBox(height: 10),
                message,
                const SizedBox(height: 10),
                if (button != null) button,
                if (button != null && ok == null)
                  const SizedBox(
                    height: 10,
                  ),
                if (ok == null)
                  CustomButton(
                    text: "OK",
                    backgroundColor: const Color.fromRGBO(104, 5, 35, 1),
                    onTap: () {
                      Get.back(result: 'false');
                    },
                  ),
              ],
            ),
          ),
        ),
      ),
    );
    return res;
  }

  static Future<T?> showCustomMessage<T>(
    Widget content,
    String? title,
    Widget? button,
    double? height,
  ) async {
    T? res = await showDialog<T>(
      context: Get.context!,
      builder: (ctx) => AlertDialog(
        // backgroundColor: const Color.fromRGBO(42, 51, 63, 1),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30),
        ),
        backgroundColor: Colors.white,
        content: SizedBox(
          height: height ?? 350,
          child: Column(
            children: [
              if (title != null)
                AppText(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontFamily: FontFamily.bold,
                    color: const Color.fromRGBO(104, 5, 35, 1),
                  ),
                ),
              if (title != null)
                const SizedBox(
                  height: 10,
                ),
              Expanded(child: content),
              const SizedBox(
                height: 20,
              ),
              if (button != null) button,
            ],
          ),
        ),
      ),
    );
    return res;
  }

  static Future<void> showBottomSheetWidget(
    Widget child,
  ) async {
    await showModalBottomSheet(
      context: Get.context!,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(15),
        ),
      ),
      builder: (ctx) => Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.center,
        children: [
          Positioned(
            top: -60,
            child: IconButton(
              onPressed: () {
                Get.back();
              },
              style: IconButton.styleFrom(
                backgroundColor: Colors.white,
              ),
              icon: const Icon(
                Icons.close,
                color: Colors.black,
              ),
            ),
          ),
          DraggableScrollableSheet(
            expand: false,
            maxChildSize: 0.9,
            initialChildSize: 0.3,
            builder: (ctx, ctrl) => SizedBox(
              width: double.infinity,
              child: SingleChildScrollView(
                controller: ctrl,
                child: child,
              ),
            ),
          ),
        ],
      ),
    );
  }

  static Future<String?> getStringFromMessage(
    String title,
    String hintText, {
    IconData? icon,
    Color? iconColor,
    String? initialValue,
  }) async {
    String txt = initialValue ?? "";
    String? save = await showDialog<String>(
      context: Get.context!,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color.fromRGBO(42, 51, 63, 1),
        content: Padding(
          padding: const EdgeInsets.all(10),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(width: 1000),
              if (icon != null)
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      icon,
                      size: 90,
                      color: iconColor,
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              AppText(
                title,
                style: TextStyle(
                  fontFamily: FontFamily.bold,
                  fontSize: 25,
                ),
              ),
              const SizedBox(height: 10),
              CustomTextBox(
                hintText: hintText,
                initialValue: initialValue,
                onChanged: (e) => txt = e,
              ),
              const SizedBox(height: 30),
              CustomButton(
                text: "OK",
                onTap: () {
                  Get.back<String>(result: txt);
                },
              ),
            ],
          ),
        ),
      ),
    );
    return save;
  }

  static Future<bool> showYesNoMessage(
    String title,
    String message, {
    IconData? icon,
    Color? iconColor,
  }) async {
    bool? ok = await showDialog<bool>(
      context: Get.context!,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color.fromRGBO(42, 51, 63, 1),
        content: Padding(
          padding: const EdgeInsets.all(10),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null)
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      icon,
                      size: 90,
                      color: iconColor,
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              AppText(
                title,
                style: TextStyle(
                  fontFamily: FontFamily.bold,
                  fontSize: 25,
                ),
              ),
              const SizedBox(height: 10),
              AppText(
                message,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 30),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  CustomButton(
                    text: "Yes",
                    verticalPadding: 10,
                    onTap: () {
                      Get.back<bool>(result: true);
                    },
                  ),
                  CustomButton(
                    text: "No",
                    verticalPadding: 10,
                    onTap: () {
                      Get.back<bool>(result: false);
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
    return ok ?? false;
  }

  static Size size(BuildContext context) => MediaQuery.of(context).size;

  static Widget loadingWidget() => Center(
        child: Image.asset("assets/images/loadingtruck.gif"),
      );
}
