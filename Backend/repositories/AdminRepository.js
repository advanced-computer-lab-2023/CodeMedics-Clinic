const Admin = require("../../models/Administrator");

exports.getAdmins = async () => {
  const admins = await Admin.find({});
  return admins;
};

exports.getAdmin = async (adminUsername) => {
  const admin = await Admin.findOne({ username: adminUsername });
  return admin;
};
