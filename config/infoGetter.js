const jwt = require('jsonwebtoken');

const getUsername = async (req, res) => {
    const token = req.cookies.jwt || req.cookies.token;
    // console.log("IN INFOGETTER");
    // console.log(req.cookies.jwt);
    // console.log(req.cookies.token);
    // console.log(req.cookies);

    let username = "";
  if(token){
    jwt.verify(token, 'supersecret', (err, decodedToken) => {
      if (err) {
        // console.log('You are not logged in.');
        // res send status 401 you are not logged in
        console.log("Failed auth verification");
        // res.redirect('/login');
      } else {
        console.log(decodedToken, decodedToken.username);
        username = decodedToken.username;
      }
    });
  }else{
    console.log("Token not found");
  }
    return username;
};

module.exports = {getUsername};

