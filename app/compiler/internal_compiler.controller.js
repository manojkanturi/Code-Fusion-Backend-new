const path = require("path");
var fs = require("fs");
const { c, cpp, node, python, java } = require("compile-run");

exports.compile = req => {
  try {
    let selected_language = req.chosen_language;
    let inputParameters = req.inputs;
    let code = req.code;
    console.log("Language: " + selected_language + "\n" + code);

    return new Promise((resolve, reject) => {
      if (selected_language === "Java") {
        let javaCode = code;

        fs.writeFile(`${__dirname}/source_code/Main.java`, javaCode, function(
          err
        ) {
          if (err) reject(err);
          console.log("Saved! [JAVA]");
          console.log("Inputs Passed:\n" + inputParameters);
        });

        java.runFile(
          `${__dirname}/source_code/Main.java`,
          {
            compilationPath: "javac",
            executionPath: "java",
            stdin: inputParameters
          },
          (err, result) => {
            if (err) {
              reject({
                status: 0,
                message: "Bad Code / Request"
              });
            }
            //   console.log(err ? err : result);
            resolve({
              status: 1,
              stderr: result["stderr"],
              stdout:
                result["stdout"] == "" && result["stderr"] == ""
                  ? "Your Program ran successfully, but either you did'nt provided a proper inputs or you did'nt printed out."
                  : result["stdout"],
              memoryUsage: result["memoryUsage"],
              cpuUsage: result["cpuUsage"]
            });
          }
        );
      } else if (selected_language === "Python") {
        let pythonCode = code;
        fs.writeFile(`${__dirname}/source_code/Main.py`, pythonCode, function(
          err
        ) {
          if (err) reject(err);
          console.log("Saved!");
          console.log("Inputs Passed:\n" + inputParameters);
        });

        python.runFile(
          `${__dirname}/source_code/Main.py`,
          { stdin: inputParameters },
          (err, result) => {
            if (err) {
              reject({
                status: 0,
                message: "Bad Code / Request"
              });
            } else {
              resolve({
                status: 1,
                stderr: result["stderr"],
                stdout:
                  result["stdout"] == "" && result["stderr"] == ""
                    ? "Your Program ran successfully, but either you did'nt provided a proper inputs or you did'nt printed out."
                    : result["stdout"],
                memoryUsage: result["memoryUsage"],
                cpuUsage: result["cpuUsage"]
              });
              console.log(result);
            }
          }
        );
      } else if (selected_language === "C") {
        const cCode = code;

        fs.writeFile(`${__dirname}/source_code/Main.C`, cCode, function(err) {
          if (err) reject(err);
          console.log("Saved!");
          console.log("Inputs Passed:\n" + inputParameters);
        });

        c.runFile(
          `${__dirname}/source_code/Main.C`,
          { stdin: inputParameters },
          (err, result) => {
            if (err) {
              console.log(err);
              reject({
                status: 0,
                message: "Bad Code / Request"
              });
            } else {
              resolve({
                status: 1,
                stderr: result["stderr"],
                stdout:
                  result["stdout"] == "" && result["stderr"] == ""
                    ? "Your Program ran successfully, but either you did'nt provided a proper inputs or you did'nt printed out."
                    : result["stdout"],
                memoryUsage: result["memoryUsage"],
                cpuUsage: result["cpuUsage"]
              });
              console.log(result);
            }
          }
        );
      } else if (selected_language === "CPP") {
        const CPP = code;

        fs.writeFile(`${__dirname}/source_code/Main.CPP`, CPP, function(err) {
          if (err) reject(err);
          console.log("Saved! [CPP]");
          console.log("Inputs Passed:\n" + inputParameters);
        });

        cpp.runFile(
          `${__dirname}/source_code/Main.CPP`,
          { stdin: inputParameters },
          (err, result) => {
            if (err) {
              console.log(err);
              reject({
                status: 0,
                message: "Bad Code / Request"
              });
            } else {
              resolve({
                status: 1,
                stderr: result["stderr"],
                stdout:
                  result["stdout"] == "" && result["stderr"] == ""
                    ? "Your Program ran successfully, but either you did'nt provided a proper inputs or you did'nt printed out."
                    : result["stdout"],
                memoryUsage: result["memoryUsage"],
                cpuUsage: result["cpuUsage"]
              });
              //   console.log(result);
            }
          }
        );
      } else if (selected_language === "JavaScript") {
        const javaScriptCode = code;
        let resultPromise = node.runSource(javaScriptCode);
        resultPromise
          .then(result => {
            ans = result;
            //   console.log(result);
            resolve({
              status: 1,
              stderr: result["stderr"],
              stdout:
                result["stdout"] == "" && result["stderr"] == ""
                  ? "Your Program ran successfully, but either you did'nt provided a proper inputs or you did'nt printed out."
                  : result["stdout"],
              memoryUsage: result["memoryUsage"],
              cpuUsage: result["cpuUsage"]
            });
            // console.log(result);
          })
          .catch(err => {
            console.log(err);
            reject({
              status: 0,
              message: "Bad Code / Request"
            });
          });
      } else {
        reject({
          status: 0,
          message:
            "Something Went Wrong / Wrong Language Chosen for your written code."
        });
      }
    });
  } catch (error) {
    console.log("error :", error);
    return {
      status: 0,
      message: "Something went wrong \nInvalid Request"
    };
  }
};
