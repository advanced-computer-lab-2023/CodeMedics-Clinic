class FamilyMember {
  String name = "";
  String nationalId = "";
  String gender = "";
  String dateOfBirth = "";
  String relation = "Son";

  FamilyMember(
      {required this.name,
      required this.nationalId,
      required this.gender,
      required this.dateOfBirth});

  FamilyMember.fromJson(Map<String, dynamic> json) {
    name = json['Name'];
    nationalId = json['NationalID'];
    gender = json['Gender'];
    dateOfBirth = json['DateOfBirth'];
    relation = json['Relationship'] ?? "Son";
  }
}
