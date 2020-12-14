const Validator = require('validator');
const isEmpty = require('./is-empty');



module.exports = function validatePostInput(data){
  let errors = {};

  data.text = !isEmpty(data.text)? data.text : '';


  if(!Validator.isLength(data.text, {min: 10, max: 500})){
    errors.text = "Post must be in between 10 and 500 chracters";
  }
  if(Validator.isEmpty(data.text)){
    errors.text = "text field is required";
  }
  
  return {
    errors,
    isValid : isEmpty(errors)
  }

}