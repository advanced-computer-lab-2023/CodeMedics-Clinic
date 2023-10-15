import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Models/Prescription.dart';
import 'package:ori_dx_app/Services/RequestService.dart';

class PrescriptionsController extends getx.GetxController {
  List<Prescription> prescriptions = [];
  List<Prescription> resPrescriptions = [];

  List<Prescription> searchedPrescriptions = [];
  List<Prescription> filteredPrescriptions = [];
  List<Prescription> filledPrescriptions = [];

  Prescription? selectedPrescription;
  bool prescriptionSelected = false;

  String filterImage = "filter3";

  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      loadPrescriptions();
    });
  }

  void loadPrescriptions() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeGetRequest(
        '/patient/prescriptions?Username=bobsmith',
        {},
      ),
    );
    if (response == null) {
      Helper.showMessage(
          'Connection Error', 'Please check your internet connection',
          widget: const Icon(FontAwesomeIcons.globe, size: 50));
      // getx.Get.to(() => const LoginPage());
      return;
    }
    if (response.statusCode == 200) {
      // print(response.data);
      prescriptions.clear();
      for (var item in response.data) {
        prescriptions.add(Prescription.fromJson(item));
      }
      resPrescriptions = prescriptions;
      searchedPrescriptions = prescriptions;
      filteredPrescriptions = prescriptions;
      filledPrescriptions = prescriptions;
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
    update(['PrescriptionsBuilder']);
  }

  void onTapDonePrescriptionInfo() {
    prescriptionSelected = false;
    update(['PrescriptionsBuilder']);
  }

  void onTapPrescription(Prescription resPrescription) {
    selectedPrescription = resPrescription;
    prescriptionSelected = true;
    update(['PrescriptionsBuilder']);
  }

  void onSearch() {
    resPrescriptions = searchedPrescriptions.where((element) {
      return (filteredPrescriptions.contains(element) &&
          filledPrescriptions.contains(element));
    }).toList();
    update(['PrescriptionsBuilder']);
  }

  onDoctorSearch(String search) {
    if (search.isEmpty) {
      searchedPrescriptions = prescriptions;
      onSearch();
      return;
    }
    searchedPrescriptions = prescriptions.where((element) {
      return element.doctor.toLowerCase().contains(search.toLowerCase());
    }).toList();
    onSearch();
  }

  void onDateSelected(DateTime date) {
    String dateStr = date.toString().split(' ')[0];
    if (dateStr.isEmpty) {
      filteredPrescriptions = prescriptions;
      onSearch();
      return;
    }
    filteredPrescriptions = prescriptions.where((element) {
      return element.date == dateStr;
    }).toList();
    onSearch();
  }

  void onPressedFilter() {
    if (filterImage == "filter3") {
      filterImage = "filter";
    } else {
      filteredPrescriptions = prescriptions;
      filledPrescriptions = prescriptions;
      onSearch();
      filterImage = "filter3";
    }
    update(['PrescriptionsBuilder']);
  }

  onFilledChanged(val) {
    String s = val.toString();
    if (s.isEmpty) {
      filledPrescriptions = prescriptions;
      onSearch();
      return;
    }
    bool filled = val.name.toString() == 'Filled';
    filledPrescriptions = prescriptions.where((element) {
      return element.filled == filled;
    }).toList();
    onSearch();
  }
}
