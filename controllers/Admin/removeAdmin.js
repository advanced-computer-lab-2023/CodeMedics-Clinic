const Admin = require('../../models/Administrator'); 
const { getUsername } = require('../../config/infoGetter');
const removeAdmin = async (req, res) => {
    const { username } = req.body;
    const admin = await Admin.findOne({Username: username });
    const curUsername = await getUsername(req, res);
    if(admin.Username === curUsername){
        return res.status(400).json({message: 'Cannot remove yourself.'});
    }
    if(admin.isCreator){
        return res.status(400).json({message: 'Cannot remove creator.'});
    }
    
    await Admin.deleteOne({Username: Username });
    return res.status(200).json({message: 'Admin removed.'});
};

module.exports = removeAdmin;