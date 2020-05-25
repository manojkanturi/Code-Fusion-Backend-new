const path = require("path");
var fs = require("fs");
const { c, cpp, node, python, java } = require("compile-run");

exports.compile = (req, res) => {
  try {
    let selected_language = req.body.chosen_language;
    let inputParameters = req.body.inputs;
    let code = req.body.code;
    console.log("Language: " + selected_language + "\n" + code);

    if (selected_language === "Java") {
      let javaCode = code;

      fs.writeFile(`${__dirname}/source_code/Main.java`, javaCode, function(
        err
      ) {
        if (err) throw err;
        console.log("Saved!");
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
            res.send({
              status: 0,
              message: "Bad Code / Request"
            });
          }
          res.send({
            status: 1,
            stderr: result["stderr"],
            stdout:
              result["stdout"] == "" && result["stderr"] == ""
                ? "Your Program ran successfully, but either you did'nt provided a proper inputs or you did'nt printed out."
                : result["stdout"],
            memoryUsage: result["memoryUsage"],
            cpuUsage: result["cpuUsage"]
          });
          return console.log(err ? err : result);
        }
      );
    } else if (selected_language === "Python") {
      let pythonCode = code;
      fs.writeFile(`${__dirname}/source_code/Main.py`, pythonCode, function(
        err
      ) {
        if (err) throw err;
        console.log("Saved!");
        console.log("Inputs Passed:\n" + inputParameters);
      });

      python.runFile(
        `${__dirname}/source_code/Main.py`,
        { stdin: inputParameters },
        (err, result) => {
          if (err) {
            res.send({
              status: 0,
              message: "Bad Code / Request"
            });
          } else {
            res.send({
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
        if (err) throw err;
        console.log("Saved!");
        console.log("Inputs Passed:\n" + inputParameters);
      });

      c.runFile(
        `${__dirname}/source_code/Main.C`,
        { stdin: inputParameters },
        (err, result) => {
          if (err) {
            console.log(err);
            res.send({
              status: 0,
              message: "Bad Code / Request"
            });
          } else {
            res.send({
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
        if (err) throw err;
        console.log("Saved!");
        console.log("Inputs Passed:\n" + inputParameters);
      });

      cpp.runFile(
        `${__dirname}/source_code/Main.CPP`,
        { stdin: inputParameters },
        (err, result) => {
          if (err) {
            console.log(err);
            res.send({
              status: 0,
              message: "Bad Code / Request"
            });
          } else {
            res.send({
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
    } else if (selected_language === "JavaScript") {
      const javaScriptCode = code;
      let resultPromise = node.runSource(javaScriptCode);
      resultPromise
        .then(result => {
          ans = result;
          console.log(result);
          // if (result['stdout'] === "") {
          //   res.send('<center><h1 style="color:yellow;">Output:-</h1><h1 style="color:white;font-size:50px;">' + result['stderr']);
          // }
          // else {
          //   res.send('<center><h1 style="color:yellow;">Output:-</h1><h1 style="color:white;font-size:50px;">' + result['stdout']+"<br>Memory Usage (Bytes): "+result['memoryUsage']+"<br>CPU Usage(Micro Sec): "+result['cpuUsage']+backButton);
          // }
          res.send({
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
        })
        .catch(err => {
          console.log(err);
          res.send({
            status: 0,
            message: "Bad Code / Request"
          });
        });
    } else {
      res.send({
        status: 0,
        message:
          "Something Went Wrong / Wrong Language Chosen for your written code."
      });
    }
  } catch (error) {
    console.log("error :", error);
    res.send({
      status: 0,
      message: "Something went wrong \nInvalid Request"
    });
  }
};
