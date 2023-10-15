import 'dart:developer';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

class CustomScanner extends StatefulWidget {
  CustomScanner({Key? key, required this.onQRViewCreated, this.scanController, required this.overlay})
      : super(key: key);

  final Function(QRViewController) onQRViewCreated;
  final QrScannerOverlayShape overlay;

  QRViewController? scanController;

  @override
  State<StatefulWidget> createState() => _CustomScannerState();
}

class _CustomScannerState extends State<CustomScanner> {
  Barcode? result;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'Barcode Scanner');

  @override
  Widget build(BuildContext context) {
    return QRView(
      key: qrKey,
      onQRViewCreated: widget.onQRViewCreated,
      overlay: widget.overlay,
      onPermissionSet: (ctrl, p) => _onPermissionSet(context, ctrl, p),
    );
  }

  void _onPermissionSet(BuildContext context, QRViewController ctrl, bool p) {
    log('${DateTime.now().toIso8601String()}_onPermissionSet $p');
    if (!p) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('no Permission')),
      );
    }
  }

  @override
  void dispose() {
    widget.scanController?.dispose();
    super.dispose();
  }

  @override
  void reassemble() {
    super.reassemble();
    if (Platform.isAndroid) {
      widget.scanController?.pauseCamera();
    }
    widget.scanController?.resumeCamera();
  }
}
