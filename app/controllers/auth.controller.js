const Auth = require("../models/auth.model");
const helpers = require("../services/common");

// Create and Save a new User
exports.signup = (req, res) => {
  try {
    //Validate request
    let missingParamsORValues = helpers.validateParams(req.body, [
      "full_name",
      "username",
      "password",
      "security_question",
      "security_question_answer"
    ]);
    console.log("missingParamsORValues :", missingParamsORValues);
    if (missingParamsORValues["missingParams"].length > 0) {
      return res.send({
        status: 0,
        message: "Invalid Req. Missing Params",
        missing_params: missingParamsORValues["missingParams"]
      });
    }

    if (missingParamsORValues["emptyParams"].length > 0) {
      return res.send({
        status: 0,
        message: "Invalid Req. Following Param(s) value(s) cannot be empty",
        missing_params: missingParamsORValues["emptyParams"]
      });
    }

    const user = new Auth({
      full_name: req.body.full_name,
      username: req.body.username,
      password: req.body.password,
      security_question: req.body.security_question,
      security_question_answer: req.body.security_question_answer
    });

    user
      .save()
      .then(data => {
        res.send({
          status: 1,
          message: "User Created Successfully....!"
        });
      })
      .catch(err => {
        err.errmsg.indexOf("E11000 duplicate key error collection") >= 0
          ? res.send({ status: 0, message: "Username is already taken" })
          : res.status(500).send({
              status: 0,
              message: "Internal Server Error: Failed to signup"
            });
      });
  } catch (error) {
    console.log("error :", error);
    res.send({
      status: 0,
      message: "Something went wrong \n Invalid Request"
    });
  }
};

exports.signin = (req, res) => {
  try {
    //Validate request
    let missingParamsORValues = helpers.validateParams(req.body, [
      "username",
      "password"
    ]);
    console.log("missingParamsORValues :", missingParamsORValues);
    if (missingParamsORValues["missingParams"].length > 0) {
      return res.send({
        status: 0,
        message: "Invalid Req. Missing Params",
        missing_params: missingParamsORValues["missingParams"]
      });
    }

    if (missingParamsORValues["emptyParams"].length > 0) {
      return res.send({
        status: 0,
        message: "Invalid Req. Following Param(s) value(s) cannot be empty",
        missing_params: missingParamsORValues["emptyParams"]
      });
    }

    Auth.findOne({ username: req.body.username, password: req.body.password })
      .then(user => {
        if (!user) {
          return res.send({
            status: 0,
            message: "Invalid Username / Password"
          });
        }

        console.log('user12 :', user);

        let user_info = {};
        user_info.username = user.username;
        user_info.full_name = user.full_name;
        
        console.log('user["isAdmin"] :', user.isAdmin);
        if(user.isAdmin && user.isAdmin!==""){
          user_info.isAdmin = user.isAdmin
        }


        res.send({
          status: 1,
          message: "Login Success",
          result: user_info
        });
      })
      .catch(err => {
        return res.send({
          status: 0,
          message: "Failed to Login"
        });
      });
  } catch (error) {
    console.log("error :", error);
    res.send({
      status: 0,
      message: "Something went wrong \nInvalid Request"
    });
  }
};

exports.validateUsernameAndSecurityQues = (req, res) => {
  try {
    //Validate request
    let missingParamsORValues = helpers.validateParams(req.body, [
      "username",
      "security_question",
      "security_question_answer"
    ]);
    console.log("missingParamsORValues :", missingParamsORValues);
    if (missingParamsORValues["missingParams"].length > 0) {
      return res.send({
        status: 0,
        message: "Invalid Req. Missing Params",
        missing_params: missingParamsORValues["missingParams"]
      });
    }

    if (missingParamsORValues["emptyParams"].length > 0) {
      return res.send({
        status: 0,
        message: "Invalid Req. Following Param(s) value(s) cannot be empty",
        missing_params: missingParamsORValues["emptyParams"]
      });
    }

    // Validate Username and Security Question and Security Password

    Auth.findOne({
      username: req.body.username,
      security_question: req.body.security_question,
      security_question_answer: req.body.security_question_answer
    })
      .then(user => {
        console.log('user :', user);
        if (!user) {
          return res.send({
            status: 0,
            message: "Invalid Username / Security Question or Answer"
          });
        }

        res.send({
          status: 1,
          message: "Valid Username and Security Question and Answer",
          username: req.body.username,
          _id:user._id
        });
      })
      .catch(err => {
        return res.send({
          status: 0,
          message: "Failed to validate Username / Security Question or Answer"
        });
      });
  } catch (error) {
    console.log("error :", error);
    res.send({
      status: 0,
      message: "Something went wrong \nInvalid Request"
    });
  }
};

exports.updateNewPassword = (req, res) => {
  try {
    //Validate request
    let missingParamsORValues = helpers.validateParams(req.body, [
      "username",
      "password",
      "_id"
    ]);
    console.log("missingParamsORValues :", missingParamsORValues);
    if (missingParamsORValues["missingParams"].length > 0) {
      return res.send({
        status: 0,
        message: "Invalid Req. Missing Params",
        missing_params: missingParamsORValues["missingParams"]
      });
    }

    if (missingParamsORValues["emptyParams"].length > 0) {
      return res.send({
        status: 0,
        message: "Invalid Req. Following Param(s) value(s) cannot be empty",
        missing_params: missingParamsORValues["emptyParams"]
      });
    }

    // Update Username and Password

    Auth.updateOne({ _id: req.body._id }, { $set: req.body })
      .then(resp => {
        if (!resp) {
          res.send({
            status: 0,
            message: "Failed to Reset Password"
          });
        }
        res.send({
          status: 1,
          message: "Password Updated Successfully"
        });
      })
      .catch(err => {
        console.log("err :", err);
        res.send({
          status: 0,
          message: "Failed to Reset Question",
          error: err.message
        });
      });
  } catch (error) {
    console.log("error :", error);
    res.send({
      status: 0,
      message: "Something went wrong \nInvalid Request"
    });
  }
};
