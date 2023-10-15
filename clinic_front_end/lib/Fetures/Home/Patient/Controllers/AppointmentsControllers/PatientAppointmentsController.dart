import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Models/Appointment.dart';
import 'package:ori_dx_app/Models/Doctor.dart';
import 'package:ori_dx_app/Services/RequestService.dart';
import 'package:ori_dx_app/shared/AppShared.dart';

class PatientAppointmentsController extends getx.GetxController {
  List<Appointment> appointments = [];
  List<Appointment> filteredAppointments = [];
  List<Appointment> filteredStatus = [];
  List<Appointment> resAppointments = [];

  bool appointmentSelected = false;
  Appointment? selectedAppointment;

  String filterImage = 'filter3';
  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      getAppointments();
    });
  }

  void getAppointments() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeGetRequest(
        '/patient/viewAppointments?Username=${AppShared.username}',
        {},
      ),
    );
    if (response == null) {
      Helper.showMessage(
          'Connection Error', 'Please check your internet connection',
          widget: const Icon(FontAwesomeIcons.globe, size: 50));
      return;
    }
    if (response.statusCode == 200) {
      appointments.clear();
      for (var item in response.data['data']) {
        appointments.add(Appointment.fromJson(item));
      }
      filteredAppointments = appointments;
      filteredStatus = appointments;
      resAppointments = appointments;
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
    update(['appointmentsBuilder']);
  }

  void onTapDoneMemberInfo() {
    appointmentSelected = false;
    update(['appointmentsBuilder']);
  }

  void onTapMember(familyMember) {
    selectedAppointment = familyMember;
    appointmentSelected = true;
    update(['appointmentsBuilder']);
  }

  void onDateSelected(DateTime date) {
    String dateStr = date.toString().split(' ')[0];
    if (dateStr.isEmpty) {
      filteredAppointments = appointments;
      onSearch();
      return;
    }
    filteredAppointments = appointments.where((element) {
      return element.date == dateStr;
    }).toList();
    onSearch();
  }

  onStatusChanged(val) {
    String s = val.toString();
    if (s.isEmpty) {
      filteredStatus = appointments;
      onSearch();
      return;
    }
    filteredStatus = appointments.where((element) {
      return element.status == val.name;
    }).toList();
    onSearch();
  }

  void onPressedFilter() {
    if (filterImage == "filter3") {
      filterImage = "filter";
    } else {
      filteredAppointments = appointments;
      filteredStatus = appointments;
      onSearch();
      filterImage = "filter3";
    }
    update(['appointmentsBuilder']);
  }

  void onSearch() {
    resAppointments = filteredAppointments.where((element) {
      return (filteredStatus.contains(element));
    }).toList();
    update(['appointmentsBuilder']);
  }
}
