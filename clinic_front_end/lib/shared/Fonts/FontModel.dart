import 'package:ori_dx_app/shared/Fonts/Montserrat.dart';

import '../../GeneralWidgets/AppText.dart';
import 'CairoFont.dart';
import 'Gilroy.dart';
import 'PoppinsFont.dart';

class FontFamily {
  static String get black => AppText.defaultLanguage == TextLanguage.arabic ? CairoFont.black : PoppinsFont.black;
  static String get bold => AppText.defaultLanguage == TextLanguage.arabic ? CairoFont.bold : Montserrat.bold;
  static String get extraLight =>
      AppText.defaultLanguage == TextLanguage.arabic ? CairoFont.extraLight : PoppinsFont.extraLight;
  static String get extraBold =>
      AppText.defaultLanguage == TextLanguage.arabic ? CairoFont.extraBold : Gilroy.extraBold;
  static String get light => AppText.defaultLanguage == TextLanguage.arabic ? CairoFont.light : Montserrat.light;
  static String get medium => AppText.defaultLanguage == TextLanguage.arabic ? CairoFont.medium : Montserrat.medium;
  static String get regular => AppText.defaultLanguage == TextLanguage.arabic ? CairoFont.regular : PoppinsFont.regular;
}
