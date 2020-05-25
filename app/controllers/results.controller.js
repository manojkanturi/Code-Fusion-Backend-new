const Questions = require("../models/questions.model");
const internal_compiler = require("../compiler/internal_compiler.controller");
const Challenges = require("../models/challenge.model");
const Results = require("../models/results.model");

// Generate a result based on Question/Challenge ID
exports.generateResults = async (req, res) => {
  try {
    if (!req.body._id) {
      return res.send({
        status: 0,
        message: "Invalid Request"
      });
    }

    let all_submitted_code = []; // To Store User's Submitted Code
    let question_info = {};

    await Challenges.find({ "challenge.program_id": req.body._id })
      .then(resp => {
        if (resp) {
          // console.log("resp1111111111 :", resp);
          all_submitted_code = resp;
          // console.log("resp :", resp);
          // res.send({
          //   result: all_submitted_code
          // });
        }
      })
      .catch(err => {
        console.log(err);
        res.send({
          status: 0,
          message: "Failed to Retreive Data"
        });
      });

    // console.log('all_submitted_code.length :', all_submitted_code.length);

    // Get the Info like private and public test inputs of the Question/ Challenge
    await Questions.find({ _id: req.body._id })
      .then(resp => {
        // console.log('resp :', resp);
        question_info = resp[0];
        // console.log("question_info :", question_info);
      })
      .catch(err => {
        console.log("err :", err);
        res.send({
          status: 0,
          message: "Failed to Retreive Data"
        });
      });

    let allWinnerList = [];
    question_info["private_input"] =  JSON.parse(question_info.private_input)
    question_info["private_output"] =  JSON.parse(question_info.private_output)

    for (let i = 0; i < all_submitted_code.length; i++) {
      let noOfTestCasesPassed = 0;
      let private_output = "";
      let totalCupUsage = 0;
      for (let j = 0; j < question_info.private_input.length; j++) {
        let private_input_string = "";
        private_output = question_info.private_output[j][0];
        for (let k = 0; k < question_info.private_input[j].length; k++) {
          private_input_string += question_info.private_input[j][k] + "\n";
        }
        let req = {
          chosen_language: all_submitted_code[i].challenge.language_chosen,
          inputs: private_input_string,
          code: all_submitted_code[i].challenge.code
        };
        console.log("req  [ User's Submitted Code along with private inputs is passed to compiler to execute ] :", req);
        let compiled_response = {};
        try {
          compiled_response = await internal_compiler.compile(req);
          console.log("compiled_response [TRY BLOCK] :", compiled_response);
        } catch (error) {
          console.log("compiled_response [CATCH BLOCK] [ERROR] :", error);
          compiled_response = error;
        }
        if (
          compiled_response.hasOwnProperty("stdout") &&
          compiled_response.stdout !== ""
        ) {
          console.log("private_output :", private_output);
          if (
            private_output.toString() === compiled_response.stdout.toString()
          ) {
            noOfTestCasesPassed++;
            totalCupUsage = totalCupUsage + Number(compiled_response.cpuUsage);
          }
        }

        console.log(
          ` [${req.chosen_language}] ${noOfTestCasesPassed}/${question_info.private_input.length} Private Test Cases Passed`
        );
      }

      if (noOfTestCasesPassed === question_info.private_input.length) {
        let winnerProfile = {
          program_id: all_submitted_code[i].challenge.program_id,
          language_chosen: all_submitted_code[i].challenge.language_chosen,
          username: all_submitted_code[i].challenge.username,
          executionTime: totalCupUsage / question_info.private_input.length
        };
        allWinnerList.push(winnerProfile);
      }
    }

    // Sorting winners in Ascending Order
    allWinnerList.sort(function(a, b) {
      return a.executionTime - b.executionTime;
    });

    // Store results in database

    let results = {
      program_id: req.body._id,
      results: allWinnerList
    };
    let query = { program_id: req.body._id };
    await Results.updateOne(
      { program_id: req.body._id },
      { $set: results },
      { upsert: true }
    )
      .then(data => {
        res.send({
          status: 1,
          message: "Results generated Successfully",
          results: allWinnerList,
          data
        });
      })
      .catch(err => {
        res.send({
          status: 0,
          message: "Internal Server Error: Failed to Generate Results"
        });
      });

    // res.send({
    //   status: 1,
    //   message: "Result generated successfully",
    //   result: allWinnerList
    // });
    console.log("allWinnerList :", allWinnerList);
  } catch (error) {
    console.log("error :", error);
    res.send({
      status: 0,
      message: "Something went wrong Invalid Request"
    });
  }
};

exports.getResults = async (req, res) => {
  try {
    console.log('req.body.program_id :', req.body.program_id);
    if (!req.body.program_id) {
      return res.send({
        status: 0,
        message: "Invalid Request"
      });
    }
    await Results.find({ program_id: req.body.program_id })
      .then(results => {
        // console.log('results :', results);
        if (!results) {
          return res.send({
            status: 0,
            message: "Failed to Fetch Results"
          });
        }
        res.send({
          status: 1,
          message: "Results Fetched Successfully",
          result: results[0]["results"]
        });
      })
      .catch(err => {
        res.send({
          status: 0,
          message: "Failed to Retreive Data"
        });
      });
  } catch (error) {
    console.log("error :", error);
    res.send({
      status: 0,
      message: "Something went wrong Invalid Request"
    });
  }
};
