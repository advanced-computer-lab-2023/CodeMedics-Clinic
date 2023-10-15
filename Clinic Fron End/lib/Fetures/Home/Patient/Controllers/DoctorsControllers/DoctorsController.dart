import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart' as getx;
import 'package:ori_dx_app/Helper/Helper.dart';
import 'package:ori_dx_app/Models/Appointment.dart';
import 'package:ori_dx_app/Models/Doctor.dart';
import 'package:ori_dx_app/Services/RequestService.dart';
import 'package:ori_dx_app/shared/AppShared.dart';

class DoctorsController extends getx.GetxController {
  List<Doctor> doctors = [];
  List<Doctor> resDoctors = [];
  List<Doctor> searchedSpeciality = [];
  List<Doctor> searchedDoctors = [];
  List<Doctor> filteredSpeciality = [];
  List<Doctor> fillteredDate = [];

  List<Appointment> appointments = [];

  String specialityFilter = '';

  bool doctorSelected = false;
  Doctor? selectedDoctor;

  String filterImage = "filter3";

  Map<int, String> specialities = AppShared.specialities;
  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      loadDoctors();
      getALlAPointments();
    });
  }

  void loadDoctors() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeGetRequest(
        '/doctor/getDoctorsAndSpecialties?Username=${AppShared.username}',
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
      doctors.clear();
      for (var item in response.data['data']) {
        Doctor doctor = Doctor.fromJson(item['doctor']);
        doctor.price = item['price'];
        // if (doctor.status == 'Approved') {
        doctors.add(doctor);
        // }
      }
      searchedDoctors = doctors;
      searchedSpeciality = doctors;
      resDoctors = doctors;
      fillteredDate = doctors;
      filteredSpeciality = doctors;
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
    update(['doctorsBuilder']);
  }

  void onTapDoctor(Doctor doctor) {
    selectedDoctor = doctor;
    doctorSelected = true;
    update(['doctorsBuilder']);
  }

  void onTapDoneMemberInfo() {
    doctorSelected = false;
    update(['doctorsBuilder']);
  }

  onSearch() {
    resDoctors = searchedDoctors.where((element) {
      return (searchedSpeciality.contains(element) &&
          filteredSpeciality.contains(element) &&
          fillteredDate.contains(element));
    }).toList();
    update(['doctorsBuilder']);
  }

  onDoctorSearch(String search) {
    if (search.isEmpty) {
      searchedDoctors = doctors;
      onSearch();
      return;
    }
    searchedDoctors = doctors.where((element) {
      return '${element.firstName.toLowerCase()} ${element.lastName.toLowerCase()}'
          .contains(search.toLowerCase());
    }).toList();
    onSearch();
  }

  onSpecialitySearch(String search) {
    if (search.isEmpty) {
      searchedSpeciality = doctors;
      onSearch();
      return;
    }
    searchedSpeciality = doctors.where((element) {
      return element.speciality.toLowerCase().contains(search.toLowerCase());
    }).toList();
    onSearch();
  }

  void onPressedFilter() {
    if (filterImage == "filter3") {
      filterImage = "filter";
    } else {
      filteredSpeciality = doctors;

      onSearch();
      filterImage = "filter3";
    }
    update(['doctorsBuilder']);
  }

  onFilterSpecialityChanged(val) {
    String s = val.toString();
    if (s.isEmpty) {
      specialityFilter = "";
      filteredSpeciality = doctors;
      onSearch();
      return;
    }
    specialityFilter = val.name.toString();
    filteredSpeciality = doctors.where((element) {
      return element.speciality
          .toLowerCase()
          .contains(specialityFilter.toLowerCase());
    }).toList();
    onSearch();
  }

  void onDateSelected(DateTime date) {
    String dateStr = date.toString().split(' ')[0];
    if (dateStr.isEmpty) {
      fillteredDate = doctors;
      onSearch();
      return;
    }
    double hour = date.hour.toDouble();
    fillteredDate = [];
    for (var item in doctors) {
      bool f = true;
      for (var appointment in item.appointments) {
        for (var a in appointments) {
          if (a.id == appointment) {
            if (a.date == dateStr && a.startHour <= hour && a.endHour >= hour) {
              f = false;
              break;
            }
            if (!f) break;
          }
        }
        if (f) {
          fillteredDate.add(item);
        }
      }
    }
    onSearch();
  }

  void getALlAPointments() async {
    Response? response = await Helper.showLoading(
      'Loading...',
      'Please wait',
      () => RequestService().makeGetRequest(
        '/doctor/getAllAppointments',
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
    } else {
      Helper.showMessage('Error', response.data["message"]);
    }
    update(['doctorsBuilder']);
  }
}
