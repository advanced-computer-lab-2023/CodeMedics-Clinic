import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Fetures/Home/Doctor/Views/Widgets/Patients/HealthRecordsWidget.dart';
import 'package:ori_dx_app/Fetures/Home/Patient/View/Widgets/FamilyMember/AddFamilyMemberWidget.dart';
import 'package:ori_dx_app/GeneralWidgets/CustomButton.dart';
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Models/Appointment.dart';
import 'package:ori_dx_app/Models/Patient.dart';
import 'package:ori_dx_app/Services/RequestService.dart';
import 'package:ori_dx_app/shared/AppShared.dart';

class PatientsController extends getx.GetxController {
  List<Patient> patients = [];
  List<Patient> searchedPatients = [];
  List<Patient> resPatients = [];
  List<Patient> filteredPatients = [];
  List<Appointment> appointments = [];

  bool patientSelected = false;
  Patient? selectedPatient;

  String filterImage = 'filter3';

  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      loadPatients();
      getAppointments();
    });
  }

  void loadPatients() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeGetRequest(
        '/doctor/filterPatients?Username=${AppShared.username}',
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
      patients.clear();
      for (var item in response.data['data']) {
        patients.add(Patient.fromJson(item));
      }
      searchedPatients = patients;
      resPatients = patients;
      filteredPatients = patients;
      update(['patientsBuilder']);
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
  }

  void getAppointments() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeGetRequest(
        '/doctor/viewAppointments?Username=${AppShared.username}',
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
      for (var item in response.data['appointments']) {
        appointments.add(Appointment.fromJson(item));
      }
      // showHealthRecords();
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
  }

  void onTapMember(Patient familyMember) {
    selectedPatient = familyMember;
    patientSelected = true;
    update(['patientsBuilder']);
  }

  void onTapAddMember() async {
    await Helper.showMessage1(
      null,
      AddFamilyMemberWidget(),
      ok: false,
    );
  }

  void onTapDoneMemberInfo() {
    patientSelected = false;
    update(['patientsBuilder']);
  }

  void onTapHealthRecords() {
    List<Appointment> patientAppointments = [];
    for (var appointment in appointments) {
      if (selectedPatient!.appointments.contains(appointment.id)) {
        patientAppointments.add(appointment);
      }
    }
    showHealthRecords(patientAppointments);
  }

  void showHealthRecords(val) async {
    await Helper.showCustomMessage(
      HealthRecordsWidget(
        appointments: val,
      ),
      'Health Records',
      CustomButton(
        text: 'Done',
        onTap: () {
          getx.Get.back();
        },
        borderRadius: 10,
      ),
      null,
    );
  }

  onPatientSearch(String search) {
    if (search.isEmpty) {
      searchedPatients = patients;
      onSearch();
      return;
    }
    searchedPatients = patients.where((element) {
      return '${element.firstName.toLowerCase()} ${element.lastName.toLowerCase()}'
          .contains(search.toLowerCase());
    }).toList();
    onSearch();
  }

  void onSearch() {
    resPatients = searchedPatients.where((element) {
      return (filteredPatients.contains(element));
    }).toList();
    update(['patientsBuilder']);
  }

  void onDateSelected(DateTime date) {
    String s = date.toString().split(' ')[0];
    int hour = int.parse(date.toString().split(' ')[1].split(':')[0]);
    List<Appointment> filterAppointments = appointments.where((element) {
      return element.status == 'Upcoming' &&
          element.startHour <= hour &&
          element.endHour > hour &&
          element.date == s;
    }).toList();
    filteredPatients = [];
    for (var p in patients) {
      bool f = false;
      for (var appointment in filterAppointments) {
        if (p.appointments.contains(appointment.id)) {
          f = true;
          break;
        }
      }
      if (f) {
        filteredPatients.add(p);
      }
    }
    onSearch();
  }

  void onPressedFilter() {
    if (filterImage == "filter3") {
      filterImage = "filter";
    } else {
      filteredPatients = patients;
      onSearch();
      filterImage = "filter3";
    }
    update(['patientsBuilder']);
  }
}
