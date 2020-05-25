const Challenges = require("../models/challenge.model");

// Create and Save a new Question
exports.submitChallenge = async (req, res) => {
  try {
    //Validate request
    if (!req.body.challenge) {
      return res.send({
        status: 0,
        message: "Invalid Request Object"
      });
    }

    if (!req.body.challenge.username) {
      return res.send({
        status: 0,
        message: "Invalid Request Object"
      });
    }

    if (!req.body.challenge.language_chosen) {
      return res.send({
        status: 0,
        message: "Invalid Request Object"
      });
    }

    if (!req.body.challenge.program_id) {
      return res.send({
        status: 0,
        message: "Invalid Request Object"
      });
    }

    if (!req.body.challenge.title) {
      return res.send({
        status: 0,
        message: "Invalid Request Object"
      });
    }

    if (!req.body.challenge.code) {
      return res.send({
        status: 0,
        message: "Invalid Request Object"
      });
    }

    const challenge = new Challenges({
      challenge: {
        program_id: req.body.challenge.program_id,
        title: req.body.challenge.title,
        code: req.body.challenge.code,
        username: req.body.challenge.username,
        language_chosen: req.body.challenge.language_chosen
      }
    });

    let isChallengeAlreadySubmittedByUser = await searchChallenges(
      req.body.challenge.username,
      req.body.challenge.program_id
    );

    console.log(
      "isChallengeAlreadySubmittedByUser :",
      isChallengeAlreadySubmittedByUser
    );

    // isChallengeAlreadySubmittedByUser.then((resp)=>{
    //     console.log("[PROMISE]", resp)
    // }).catch((err)=>{
    //     console.log('err[PROMISE] :', err);
    // })

    if (isChallengeAlreadySubmittedByUser.status == 1) {
      res.send({
        status: 0,
        message: "You already submitted this challenge"
      });
    } else {
      challenge
        .save()
        .then(data => {
          if (!data) {
            return res.status(404).send({
              status: 0,
              message: "Failed to Submit Challenge"
            });
          }
          res.send({
            status: 1,
            message: "Challenge Submitted Successfully....!"
          });
        })
        .catch(err => {
          console.log("ER: ", err);
          err.errmsg.indexOf("E11000 duplicate key error collection") >= 0
            ? res.send({ status: 0, message: "Challenge is already Submitted" })
            : res.status(500).send({
                status: 0,
                message: "Internal Server Error: Failed to submit Challenge"
              });
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

// Checking if user is already submitted a same challenge [Trying to re-submit same challenge]
async function searchChallenges(username, program_id) {
  try {
    let isAlreadExists = false;
    if (!username && !program_id) {
      return {
        status: 0,
        message: "Invalid Search Query"
      };
    }

    // db.challenges.find(
    //     {$and:[
    //         {"challenge.program_id":"5e647afef4763c16f25f014e"},
    //         {"challenge.username":"rakesh@gmail.com"}
    //     ]}
    // )

    await Challenges.find({
      $and: [
        { "challenge.program_id": program_id },
        { "challenge.username": username }
      ]
    })
      .then(resp => {
        if (resp.length > 0) {
          console.log("IF STATEMENT");
          console.log('resp :', resp);
          isAlreadExists = true;
        }else{
          isAlreadExists = false
        }
      })
      .catch(err => {
        console.log("err=============== :", err);
        console.log(err);
        isAlreadExists = true;
      });
    if (isAlreadExists) {
      return {
        status: 1,
        message: "Failed to Retreive Data"
      };
    } else {
      return {
        status: 0,
        message: "You already submitted this challenge"
      };
    }
  } catch (error) {
    console.log("error +++++++++++++++:", error);
    return {
      status: 0,
      message: "Failed to Retreive Data"
    };
  }
}


exports.getSubmittedChallenge = async (req, res)=>{
  try {
    // let no_of_challenges = req.body.no_of_challenges || 10;
    // let page_number = Number(req.body.page_number) || 0;
    // let per_page = Number(req.body.per_page) || 3;

    // page_number = page_number -1

    // if(page_number < 0){
    //   page_number = 0
    // }

    // let total_count = await Challenges.find({}).countDocuments()

    // await Challenges.find({}).sort({_id:-1}).skip(page_number*per_page).limit(per_page)
    await Challenges.find({})
      .then(challenges => {
        console.log('challenges :', challenges);
        if (!challenges) {
          return res.send({
            status: 0,
            message: "Failed to Fetch Challenges"
          });
        }
        res.send({
          status: 1,
          message: "Challenges Fetched Successfully",
          result: challenges,
          // per_page,
          // page_number: page_number + 1,
          // total_records: total_count
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
}