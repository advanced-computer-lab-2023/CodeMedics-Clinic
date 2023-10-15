// ignore_for_file: unnecessary_null_comparison

import 'package:dio/dio.dart';

class DioClass {
  static String? baseUrl = "http://localhost:3000";
  static late Dio _instance;
  static String accessToken = "";

  static final Map<String, String> _paths = {};

  static Dio getInstance() {
    return _instance;
  }

  static void initPaths() {}

  static String getPath(String key) {
    return _paths[key]!;
  }

  static void initDio() {
    BaseOptions options = BaseOptions(
      baseUrl: baseUrl!,
      receiveTimeout: const Duration(seconds: 5),
      connectTimeout: const Duration(seconds: 5),
    );
    _instance = Dio(options);
    _instance.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handeler) async {
          options.headers['Authorization'] = 'Bearer $accessToken';
          return handeler.next(options);
        },
      ),
    );
  }

  static void refreshAccessToken(String token) {
    accessToken = token;
    _instance.interceptors.last = InterceptorsWrapper(
      onRequest: (options, handeler) async {
        options.headers['Authorization'] = 'Bearer $accessToken';
        // options.headers['Tenantid'] = currentOwner.curTenant.tenantId;
        return handeler.next(options);
      },
    );
  }
}
