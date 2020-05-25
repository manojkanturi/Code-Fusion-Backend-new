const Questions = require("../models/questions.model");
const helpers = require("../services/common");

// Create and Save a new Question
exports.createQuestion = (req, res) => {
  try {
    //Validate request
    let missingParamsORValues = helpers.validateParams(req.body, [
      "title",
      "description",
      "input",
      "output",
      "constraints",
      "sample_input",
      "sample_output",
      "private_input",
      "private_output",
      "time_limit"
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

    const question = new Questions({
      title: req.body.title,
      description: req.body.description,
      input: req.body.input,
      output: req.body.output,
      constraints: req.body.constraints,
      sample_input: req.body.sample_input,
      sample_output: req.body.sample_output,
      private_input: JSON.parse(req.body.private_input),
      private_output: JSON.parse(req.body.private_output),
      time_limit: req.body.time_limit
    });

    console.log('req.body.private_input :', req.body.private_input);
    console.log('req.body.private_output :', req.body.private_output);

    question
      .save()
      .then(data => {
        if (!data) {
          return res.send({
            status: 0,
            message: "Failed to Create Question"
          });
        }
        res.send({
          status: 1,
          message: "Question Created Successfully....!"
        });
      })
      .catch(err => {
        err.errmsg.indexOf("E11000 duplicate key error collection") >= 0
          ? res.send({ status: 0, message: "Question is already Exists" })
          : res.send({
              status: 0,
              message: "Internal Server Error: Failed to create Question"
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

exports.getAllQuestions = async (req, res) => {
  try {
    // let no_of_questions = req.body.no_of_questions || 10;
    let page_number = Number(req.body.page_number) || 0;
    let per_page = Number(req.body.per_page) || 3;

    page_number = page_number -1

    if(page_number < 0){
      page_number = 0
    }

    let total_count = await Questions.find({}).countDocuments()

    await Questions.find({},{title:1}).sort({_id:-1}).skip(page_number*per_page).limit(per_page)
      // .projection({title:1}).sort({_id:-1}).limit(per_page).skip(page_number*per_page)
      .then(questions => {
        console.log('questions :', questions);
        if (!questions) {
          return res.send({
            status: 0,
            message: "Failed to Fetch Questions"
          });
        }
        res.send({
          status: 1,
          message: "Questions Fetched Successfully",
          result: questions,
          per_page,
          page_number: page_number + 1,
          total_records: total_count
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

exports.deleteQuestion = (req, res) => {
  try {
    let id = req.body.question_id;
    Questions.remove({ _id: id }).then(questions => {
      if (!questions) {
        return res.status(404).send({
          status: 0,
          message: "Failed to Delete Question"
        });
      }
      res.send({
        status: 1,
        message: "Question Deleted Successfully",
        result: questions
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

exports.updateQuestion = (req, res) => {
  try {
    let id = req.body.question_id;

    //Validate request
    let missingParamsORValues = helpers.validateParams(req.body, [
      "title",
      "description",
      "input",
      "output",
      "constraints",
      "sample_input",
      "sample_output",
      "private_input",
      "private_output",
      "time_limit"
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

    Questions.updateOne({ _id: id }, { $set: req.body }).then(questions => {
      if (!questions) {
        res.send({
          status: 0,
          message: "Failed to Update Question"
        });
      }
      res.send({
        status: 1,
        message: "Question Updated Successfully",
        result: questions
      });
    })
    .catch((err)=>{
      console.log('err :', err);
      res.send({
        status: 0,
        message: "Failed to Update Question",
        error: err.message
      });
    })
  } catch (error) {
    console.log("error :", error);
    res.send({
      status: 0,
      message: "Something went wrong Invalid Request"
    });
  }
};

// Search a question based on Question TItle
exports.searchQuestions = (req, res) => {
  try {
    if (!req.body.search_text && !req.body._id) {
      return res.send({
        status: 0,
        message: "Invalid Search Query"
      });
    }

    let searchText = req.body.search_text || req.body._id;

    let query = {};

    if (req.body.hasOwnProperty("search_text")) {
      // query = {$text: { $search: searchText }}
      query.$text = {
        $search: searchText
      };
    }

    if (req.body.hasOwnProperty("_id")) {
      // query = {_id: req.body._id}
      query._id = req.body._id;
    }

    console.log(query);

    if (searchText != "") {
      Questions.find(query)
        .then(resp => {
          if (resp) {
            res.send({
              status: 1,
              message: "Data Retreived Success",
              result: resp
            });
          }
        })
        .catch(err => {
          console.log(err);
          res.send({
            status: 0,
            message: "Failed to Retreive Data"
          });
        });
    } else {
      res.send({
        status: 0,
        message: "Search Text can not be empty"
      });
    }
  } catch (error) {
    console.log("error :", error);
    res.send({
      status: 0,
      message: "Something went wrong Invalid Request"
    });
  }
};
