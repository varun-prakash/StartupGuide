const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
user: {
  type: Schema.Types.ObjectId,
  ref : 'users'
},
handle : {
  type: String,
  required : true,
  max: 40
},
company : {
  type : String
},
website : {
  type: String
},
location : {
  type: String
},
status: {
  type: String,
  required : true
},
skills: {
  type: [String],
  required: true
},
bio : {
  type: String
},
experience : [
  {
    title: {
      type: String,
      required: true,
    },
    
    company: {
      type: String,
      required: true,
    },
    
    location: {
      type: String
    },

    from : {
      type: String,
      required: true
    },
    
    to: {
      type: String
    },
    
    current: {
      type: Boolean,
      default: false
    },
    
    description: {
      type: String
    }


  }
],

education : [
  {
    school: {
      type: String,
      required: true,
    },
    
    degree: {
      type: String,
      
    },
    
    fieldofstudy: {
      type: String
    },

    from : {
      type: String,
      required: true
    },
    
    to: {
      type: String
    },
    
    current: {
      type: Boolean,
      default: false
    },
    
    description: {
      type: String
    }


  }
],

social: {
  youtube: {
    type: String
  },
  
  twitter: {
    type: String
  },
  
  facebook: {
    type: String
  },
  
  linkedin: {
    type: String
  },
  
  instagram: {
    type: String
  }
},
date: {
  type: Date,
  default: Date.now
}

});


module.exports = Profile = mongoose.model('profile', ProfileSchema);