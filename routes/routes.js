var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );

exports.loginPageHandler = function (req, res){
	req.session.destroy(); //Destroy existing session if any
	res.render('login.handlebars', {});
};//loginPageHandler

exports.landingPageHandler = function (req, res){
	var nmReq = req.body.nm;
	var pwdReq = req.body.pwd;
	var loginOutcome;

	mongoose.model('User').findOne({username:nmReq}, function(err, userObj){
	    if(userObj === null){
	     	loginOutcome = "Login Failed: User name does not exist in db";
	    } else if (pwdReq === userObj.password){
					loginOutcome = "Login successful";
		} else{
					loginOutcome = "Login Failed: Password did not match";
		}
		console.log( "Login Name %s, Password %s. Login outcome [%s]", nmReq, pwdReq, loginOutcome);
		res.render('landingpage.handlebars', {welcomeMessage:loginOutcome});
	});//findOne
}; //landingPageHandler


exports.registerFormHandler = function(req, res){
   res.render("register.handlebars", {});
}; //registerFormHandler

exports.registerUserHandler = function(req, res){
   var usernameReq = req.body.username;
   var emailReq = req.body.email;
   var passwordReq = req.body.password;

   var newuser = new User();
   newuser.username = usernameReq;
   newuser.email = emailReq;
   newuser.password = passwordReq;

   //save to db through model
   newuser.save(function(err, savedUser){
       if(err){
         var message = "A user already exists with that username or email";
         console.log(message);
         res.render("register", {errorMessage:message});
         return;
       }else{
         req.session.newuser = savedUser.username;
         res.render('landingpage.handlebars', {welcomeMessage:"Registration succesful"});
       }
   });
};//registerUserHandler

exports.showTechnologyHandler = function(req, res){
  mongoose.model('TechModel').find({}, function(err, techsObj){
    var status;
      if(err){
        status = "No data available.";
        console.log(status);
      }else{
        res.render('showContent.handlebars', {techRecords:techsObj});
      }
  });//find
};//showTechnologyHandler

exports.editTechHandler = function(req, res){
  var techName = req.query.tech;

  mongoose.model('TechModel').findOne({name:techName}, function(err, techObj){
    var status;
      if(err){
        status = "No data available.";
        console.log(status);
      }else{
        res.render('editRecord.handlebars', {techRecord:techObj});
      }
  });//findOne
};//editTechHandler

exports.updateRecordHandler = function(req, res){
  var techName = req.body.tech;
  var description = req.body.desc;
  var currentRecord = {name:techName,description:description};

  mongoose.model('TechModel').update({name:techName}, {$set:{name:techName,description:description}}, {multi:false},function(err, techObj){
    var status;
      if(err){
        status = "Unable to save data";
        console.log(status);
      }else{
        status = "Data saved successfully!!!";
        //res.render('landingpage.handlebars', {welcomeMessage:status});
        res.render('editRecord.handlebars', {techRecord:currentRecord, errorMsg:status});
      }
  });//findOne
};//updateRecordHandler