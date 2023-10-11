const asyncHandler = require('express-async-handler');


const viewRegisterAdmin = asyncHandler(async (req, res) => {
    res.render('RegisterAdmin');
});
const viewRemoveUser = asyncHandler(async (req, res) => {
    res.render('RemoveUser');
});
const viewDoctorRegister = asyncHandler(async (req, res) => {
    res.render('ViewInfoRegDoctor');
});
const viewAdminPanel = asyncHandler(async (req, res) => {
    res.render('AdminPanel'); // Assuming 'admin_panel.ejs' is in your 'views' directory
});

module.exports = {viewRegisterAdmin, viewRemoveUser, viewDoctorRegister, viewAdminPanel};