validateParams = (reqParams, requiredParams) =>{
  let missingParams = []
  let emptyParams = []
  requiredParams.forEach(param => {
     if(!reqParams.hasOwnProperty(param)){
       missingParams.push(param)
     } 
     else if(reqParams[param]===""){
       emptyParams.push(param)
     }

  });
  console.log('missingParams 1:', missingParams);
  console.log('emptyParams 2:', emptyParams);
  return {missingParams, emptyParams}
}

module.exports = {
  validateParams
}