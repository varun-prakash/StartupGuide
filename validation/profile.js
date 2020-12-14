const Validator = require('validator');
const isEmpty = require('./is-empty');



module.exports = function validateProfileInput(data){
  let errors = {};

  data.handle = !isEmpty(data.handle)? data.handle : '';
  data.status = !isEmpty(data.status)? data.status : '';
  data.skills = !isEmpty(data.skills)? data.skills : '';
  
if(!Validator.isLength(data.handle, {min:2, max: 40})){
  errors.handle = "Handle must be in between 2 to 40 chracters";
}

if(Validator.isEmpty(data.handle)){
  errors.handle = "Handle is required";
}

if(Validator.isEmpty(data.status)){
  errors.status = "status is required";
}

if(Validator.isEmpty(data.skills)){
  errors.skills = "skills is required";
}

if(!isEmpty(data.website)){// checking for empty website field
  if(!Validator.isURL(data.website)){// checking for url erreor
    errors.website = "not valid url";
  }
  
}
if(!isEmpty(data.youtube)){
  if(!Validator.isURL(data.youtube)){
    errors.youtube = "not valid url";
  }
  
}
if(!isEmpty(data.twitter)){
  if(!Validator.isURL(data.twitter)){
    errors.twitter = "not valid url";
  }
  
}
if(!isEmpty(data.linkedin)){
  if(!Validator.isURL(data.linkedin)){
    errors.linkedin = "not valid url";
  }
  
}
if(!isEmpty(data.facebook)){
  if(!Validator.isURL(data.facebook)){
    errors.facebook = "not valid url";
  }
  
}
if(!isEmpty(data.instagram)){
  if(!Validator.isURL(data.instagram)){
    errors.instagram = "not valid url";
  }
  
}
  
  
  return {
    errors,
    isValid : isEmpty(errors)
  }

}