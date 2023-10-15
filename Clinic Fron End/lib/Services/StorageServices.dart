import 'package:shared_preferences/shared_preferences.dart';

class StorageServices {
  static final StorageServices _instance = StorageServices();

  late SharedPreferences prefs;

  static StorageServices getInstance() {
    return _instance;
  }

  Future<void> saveUserDate(String token, String tenantId) async {
    await prefs.setString("token", token);
    await prefs.setString("tenantId", tenantId);
  }

  String? getUserData() {
    return prefs.getString("token");
  }

  Future<void> initPrefs() async {
    prefs = await SharedPreferences.getInstance();
  }

  String? getTenantId() {
    return prefs.getString("tenantId");
  }
}
