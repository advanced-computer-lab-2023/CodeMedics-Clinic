const asyncHandler = require('express-async-handler');


const viewRegisterAdmin = asyncHandler(async (req, res) => {
    res.render('AdminViews/RegisterAdmin');
});
const viewRemoveUser = asyncHandler(async (req, res) => {
    res.render('AdminViews/RemoveUser');
});
const viewDoctorRegister = asyncHandler(async (req, res) => {
    res.render('AdminViews/ViewInfoRegDoctor');
});
const viewAdminPanel = asyncHandler(async (req, res) => {
    res.render('AdminViews/AdminPanel');
});
const viewPackageManager = asyncHandler(async (req, res) => {
    res.render('AdminViews/PackageManager');
});

module.exports = {viewRegisterAdmin, viewRemoveUser, viewDoctorRegister, viewAdminPanel , viewPackageManager};