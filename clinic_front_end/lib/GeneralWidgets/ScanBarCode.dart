import 'package:flutter/material.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomScanner.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../shared/Fonts/FontModel.dart';
import 'AppText.dart';

class ScanBarCode extends StatelessWidget {
  ScanBarCode({super.key, required this.title, required this.onQRViewCreated});
  final String title;
  final Function(QRViewController) onQRViewCreated;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 20.w),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: 15.h,
          ),
          if (title.isNotEmpty)
            AppText(
              title,
              style: TextStyle(
                color: const Color.fromRGBO(104, 5, 35, 1),
                fontSize: 25.sp,
                fontFamily: FontFamily.medium,
              ),
            ),
          SizedBox(
            height: 10.h,
          ),
          Container(
            width: ScreenUtil().screenWidth,
            decoration: BoxDecoration(
              color: const Color.fromRGBO(255, 234, 221, 1),
              borderRadius: BorderRadius.circular(40).w,
            ),
            padding: EdgeInsets.only(
              left: 20.w,
              right: 20.w,
              top: 20.h,
              bottom: 10.h,
            ),
            child: Column(
              children: [
                SizedBox(
                  width: 300.w,
                  height: 100.h,
                  child: CustomScanner(
                    onQRViewCreated: onQRViewCreated,
                    overlay: QrScannerOverlayShape(
                      borderColor: Colors.red,
                      borderRadius: 10.w,
                      borderLength: 20.w,
                      borderWidth: 5.w,
                      cutOutWidth: 250.w,
                      cutOutHeight: 90.h,
                    ),
                  ),
                ),
                SizedBox(
                  height: 10.h,
                ),
                AppText(
                  'Scan the barcode',
                  style: TextStyle(
                    fontSize: 20.sp,
                    fontFamily: FontFamily.medium,
                    color: Colors.black,
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
