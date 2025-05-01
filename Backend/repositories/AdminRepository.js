const bcrypt = require("bcryptjs");
const Admin = require("../../models/Administrator");

exports.validateAdmin = async (username) => {
  const admin = await Admin.findOne({ username });
  if (!admin) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }
  return admin;
};

exports.getAdmins = async () => {
  const admins = await Admin.find({});
  return admins;
};

exports.getAdmin = async (adminUsername) => {
  const admin = await Admin.findOne({ username: adminUsername });
  return admin;
};

exports.getAdminByEmail = async (adminEmail) => {
  const admin = await Admin.findOne({ email: adminEmail });
  return admin;
};

exports.createAdmin = async (adminData) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminData.password, salt);
  adminData.password = hashedPassword;
  const admin = new Admin(adminData);
  await admin.save();
  return admin;
};

exports.updateAdmin = async (adminUsername, adminData) => {
  const updatedAdmin = await Admin.findOneAndUpdate(
    { username: adminUsername },
    { $set: adminData },
    { new: true }
  );
  return updatedAdmin;
};

exports.updateAdminPassword = async (adminUsername, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const updatedAdmin = await Admin.findOneAndUpdate(
    { username: adminUsername },
    { $set: { password: hashedPassword } },
    { new: true }
  );
  return updatedAdmin;
};

exports.deleteAdmin = async (adminUsername) => {
  const deletedAdmin = await Admin.findOneAndDelete({
    username: adminUsername,
  });
  return deletedAdmin;
};
