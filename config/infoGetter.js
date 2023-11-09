const jwt = require('jsonwebtoken');

const getUsername = async (req, res) => {
    const token = req.cookies.jwt;
    let username = "";
  if(token){
    jwt.verify(token, 'supersecret', (err, decodedToken) => {
      if (err) {
        // console.log('You are not logged in.');
        // res send status 401 you are not logged in
        res.status(401).json({message:"You are not logged in."})
        // res.redirect('/login');
      } else {
        console.log(decodedToken, decodedToken.username);
        username = decodedToken.username;
      }
    });
  }else{
    res.status(401).json({message:"You are not logged in."})
  }
    return username;
};

module.exports = {getUsername};

