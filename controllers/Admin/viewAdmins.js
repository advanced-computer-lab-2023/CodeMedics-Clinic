const Admin = require("../../models/Administrator");
const viewAdmins = async (req, res) => {
  const admins = await Admin.find();
  console.log("I am here in admin", admins);
  return res.status(200).json({ data: admins });
};

module.exports = viewAdmins;
