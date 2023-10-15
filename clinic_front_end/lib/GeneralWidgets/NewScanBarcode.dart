import 'package:flutter/material.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomScanner.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

import '../shared/Fonts/FontModel.dart';
import 'AppText.dart';

class NewScanBarCode extends StatelessWidget {
  const NewScanBarCode({super.key, required this.title, required this.onQRViewCreated});
  final String title;
  final Function(QRViewController) onQRViewCreated;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(
          height: 15,
        ),
        if (title.isNotEmpty)
          AppText(title,
              style:
                  TextStyle(color: const Color.fromRGBO(104, 5, 35, 1), fontSize: 25, fontFamily: FontFamily.medium)),
        const SizedBox(
          height: 10,
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(
              width: 300,
              height: 100,
              child: CustomScanner(
                onQRViewCreated: onQRViewCreated,
                overlay: QrScannerOverlayShape(
                  borderColor: Colors.grey,
                  borderRadius: 10,
                  borderLength: 30,
                  borderWidth: 10,
                  cutOutWidth: 300,
                  cutOutHeight: 100,
                ),
              ),
            ),
            const SizedBox(
              height: 10,
            ),
            AppText(
              textAlign: TextAlign.center,
              'Scan the barcode',
              style: TextStyle(
                fontSize: 20,
                fontFamily: FontFamily.medium,
                color: Colors.black,
              ),
            )
          ],
        )
      ],
    );
  }
}
