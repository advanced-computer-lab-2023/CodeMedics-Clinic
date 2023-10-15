import 'package:flutter/material.dart';
import 'package:dropdown_textfield/dropdown_textfield.dart';
import 'package:ori_dx_app/GeneralWidgets/AppText.dart';

import '../shared/Fonts/FontModel.dart';

class SingleList extends StatelessWidget {
  const SingleList({
    super.key,
    required this.items,
    required this.title,
    required this.onChanged,
    this.errorMessage,
    this.initialValue,
    this.label,
    this.isenabled = true,
    this.searchEnabled = true,
  });

  final Map<dynamic, dynamic> items;
  final String title;
  final String? label;
  final String? errorMessage;
  final String? initialValue;
  final Function(dynamic) onChanged;
  final bool isenabled;
  final bool searchEnabled;
  @override
  Widget build(BuildContext context) {
    return DropDownTextField(
      initialValue: initialValue,
      textStyle: TextStyle(
        fontFamily: FontFamily.medium,
        fontSize: 14,
        color: const Color.fromRGBO(119, 120, 122, 1),
      ),
      textFieldDecoration: InputDecoration(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
        label: AppText(title),
        // hintText: title,
        hintStyle: TextStyle(
          color: const Color.fromRGBO(119, 120, 122, 1),
          fontFamily: FontFamily.medium,
          fontSize: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
        fillColor: const Color.fromRGBO(240, 241, 245, 1),
        filled: true,
        errorText: errorMessage,
        errorStyle: TextStyle(
          color: Colors.red,
          fontFamily: FontFamily.medium,
          fontSize: 9,
        ),
      ),
      isEnabled: isenabled,
      // listSpace: 20,
      // listPadding: ListPadding(top: 30),
      enableSearch: searchEnabled,
      searchDecoration: InputDecoration(
        // contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
        hintText: 'Search',
        hintStyle: TextStyle(
          color: const Color.fromRGBO(119, 120, 122, 1),
          fontFamily: FontFamily.medium,
          fontSize: 10,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
        fillColor: const Color.fromRGBO(240, 241, 245, 1),
        filled: true,
      ),
      dropDownList: [
        for (var item in items.entries)
          DropDownValueModel(
            name: item.value,
            value: item.key,
          ),
      ],
      listTextStyle: TextStyle(
        fontSize: 10,
        fontFamily: FontFamily.medium,
        color: const Color.fromRGBO(119, 120, 122, 1),
      ),
      dropDownItemCount: 5,
      onChanged: onChanged,
    );
  }
}
