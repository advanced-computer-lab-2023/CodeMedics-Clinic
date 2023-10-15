class Package {
  String name = "";
  double price = 0;
  double sessionDiscount = 0;
  double medicalDiscount = 0;
  double familyDiscount = 0;

  Package.fromJson(Map<String, dynamic> json) {
    name = json['Name'];
    price = json['Price'];
    sessionDiscount = json['SessionDiscount'];
    medicalDiscount = json['MedicineDiscount'];
    familyDiscount = json['FamilyDiscount'];
  }
}
