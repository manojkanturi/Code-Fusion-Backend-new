module.exports = app => {
  const auth = require("../controllers/auth.controller.js");
  const questions = require("../controllers/questions.controller.js");
  const challenges = require("../controllers/challenges.controller");
  const compiler = require("../compiler/compiler.controller");
  const results = require("../controllers/results.controller");

  // Create a new User
  app.post("/auth/signup", auth.signup);

  // Authenticate User
  app.post("/auth/signin", auth.signin);

  app.post(
    "/auth/validate_username_security_question",
    auth.validateUsernameAndSecurityQues
  );

  app.post("/auth/update_new_password", auth.updateNewPassword);

  app.post("/questions/create", questions.createQuestion);

  app.post("/questions/get_questions", questions.getAllQuestions);

  app.post("/questions/delete_questions", questions.deleteQuestion);

  app.post("/questions/update_questions", questions.updateQuestion);

  app.post("/questions/search", questions.searchQuestions);

  app.post("/challenges/submit", challenges.submitChallenge);

  app.post(
    "/challenges/get_submitted_challenges",
    challenges.getSubmittedChallenge
  );

  app.post("/challenges/compile_program", compiler.compile);

  app.post("/results/generate_result", results.generateResults);

  app.post("/results/get_result", results.getResults);
};
