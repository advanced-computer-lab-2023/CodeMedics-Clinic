const Package = require("../../models/Package");

exports.validatePackage = async (packageName) => {
  const package = await this.getPackage(packageName);
  if (!package) {
    const error = new Error("Package not found");
    error.statusCode = 404;
    throw error;
  }
  return package;
};

exports.getPackage = async (packageName) => {
  const package = await Package.findOne({
    name: packageName,
  });
  return package;
};

exports.getPackages = async (query = {}) => {
  const packages = await Package.find(query);
  return packages;
};

