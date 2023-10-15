class Admin {
  String name = "";
  String username = "";
  String password = "";
  String email = "";

  Admin.fromJson(Map<String,dynamic> json) {
    name = json['Name'];
    username = json['Username'];
    password = json['Password'];
    email = json['Email'];
  }
}
