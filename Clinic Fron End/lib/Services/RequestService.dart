import 'package:dio/dio.dart';
import 'package:ori_dx_app/Services/DioClass.dart';

class RequestService {
  final Dio dio = DioClass.getInstance();

  Future<Response?> makePostRequest(String url, Object? data) async {
    try {
      Response response = await dio.post(
        url,
        data: data,
      );
      return response;
    } on DioException catch (error) {
      return error.response;
    }
  }

  Future<Response?> makeDeleteRequest(String url, Object? data) async {
    try {
      Response response = await dio.delete(
        url,
        data: data,
      );
      return response;
    } on DioException catch (error) {
      return error.response;
    }
  }

  Future<Response?> makeGetRequest(
      String url, Map<String, dynamic> data) async {
    try {
      Response response = await dio.get(
        url,
      );
      return response;
    } on DioException catch (error) {
      // print(error);
      return error.response;
    }
  }

  Future<Response?> makePatchRequest(
      String url, Map<String, dynamic> data) async {
    try {
      Response response = await dio.patch(
        url,
        data: data,
      );
      return response;
    } on DioException catch (error) {
      return error.response;
    }
  }
}
