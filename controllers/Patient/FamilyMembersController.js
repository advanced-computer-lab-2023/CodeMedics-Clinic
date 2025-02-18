const Patient = require("../../models/Patient");
const FamilyMember = require("../../models/FamilyMember");
const { validatePatient } = require("../../utils/validator");

exports.addFamilyMember = async (req, res) => {
  const { patientUsername } = req.params;
  const { email, relation } = req.body;
  console.log("add family member", req.body);
  try {
    const patient = await validatePatient(patientUsername, res);
    const exists = await Patient.findOne({ email: email });
    if (exists == null) {
      return res.status(400).json({ message: "Family member does not exist" });
    }
    if (exists._id.toString() == patient._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a family member" });
    }
    if (exists.linked != undefined) {
      return res
        .status(400)
        .json({ message: "Family member already linked to another account" });
    }
    if (
      patient.familyMembers.some(
        (el) => el.id.toString() == exists._id.toString()
      )
    ) {
      return res.status(400).json({ message: "Family member already added" });
    }
    patient.familyMembers.push({ username: exists.username });
    exists.linked = patient._id;
    await patient.save();
    await exists.save();
    res.status(204).json({ message: "Family member added successfully" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.addFamilyMemberNoAccount = async (req, res) => {
  const { patientUsername } = req.params;
  const { name, nationalId, gender, dateOfBirth, relationship } = req.body;

  try {
    const familyMember = new FamilyMember({
      name,
      nationalId,
      gender,
      dateOfBirth,
      relationship,
    });
    const savedFamilyMember = await familyMember.save();
    const me = await validatePatient(patientUsername, res);
    me.familyMembersNoAccount.push(savedFamilyMember._id);
    await me.save();
    return res
      .status(204)
      .json({ message: "Family member added successfully" });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.removeFamilyMemberNoAccount = async (req, res) => {
  const { patientUsername, familyMemberId } = req.params;
  try {
    const patient = await validatePatient(patientUsername, res);
    console.log(patient.familyMembersNoAccount, familyMemberId, req.body)
    patient.familyMembersNoAccount = patient.familyMembersNoAccount.filter(
      (member) => member.toString() != familyMemberId
    );
    await patient.save();
    return res
      .status(204)
      .json({ message: "Family member removed successfully" });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.viewFamilyMembers = async (req, res) => {
  const { patientUsername } = req.params;
  const patient = await validatePatient(patientUsername, res);
  try {
    const familyMembers = [];
    console.log(patient.familyMembers);
    for (let i = 0; i < patient.familyMembers.length; i++) {
      const familyMember = await Patient.findOne({
        username: patient.familyMembers[i].username,
      });
      familyMembers.push(familyMember);
    }
    const familyMembersNoAccount = [];
    for (let i = 0; i < patient.familyMembersNoAccount.length; i++) {
      const familyMemberNoAccount = await FamilyMember.findOne({
        _id: patient.familyMembersNoAccount[i],
      });
      familyMembersNoAccount.push(familyMemberNoAccount);
    }

    res.status(200).json({ data: { familyMembers, familyMembersNoAccount } });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.removeFamilyMember = async (req, res) => {
  const { patientUsername, familyMemberUsername } = req.params;
  const patient = await validatePatient(patientUsername, res);
  console.log(patient);
  try {
    if (
      !patient.familyMembers.some(
        (el) => el.username.toString() == familyMemberUsername
      )
    ) {
      return res.status(404).json({ message: "Family member does not exist" });
    }
    const familyMember = await validatePatient(familyMemberUsername);
    patient.familyMembers = patient.familyMembers.filter(
      (member) => member.username.toString() != familyMemberUsername
    );
    familyMember.linked = undefined;
    await familyMember.save();
    await patient.save();
    res.status(200).json({ message: "Family members fetched successfully" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
