const Admin = require("../../models/Administrator");
const removeAdmin = async (req, res) => {
  const { adminUsername } = req.params;
  console.log("removing", req.params);
  const admin = await Admin.findOne({ username: adminUsername });
  if(!admin){
    return res.status(400).json({ message: "Admin not Found" });
  }
  if (admin.isCreator) {
    return res.status(400).json({ message: "Cannot remove creator." });
  }

  await Admin.deleteOne({ username: adminUsername });
  return res.status(201).json({ message: "Admin removed successfully" });
};

module.exports = removeAdmin;
