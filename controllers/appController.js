const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

let mysqlConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'abhi@123',
	database: 'mentor_mate_db'

});



mysqlConnection.connect(function(err){
	if (!err) console.log('Database connected ...');
	else console.log(err);
});

let urlencodedParser = bodyParser.urlencoded({extended : false});
let message = '';
module.exports = function(app){
	app.use(session({secret: 'mentor_mate'}));
	

	

	app.get('/api/logout' , function(req , res){
		req.session.destroy(function(err){
			if(!err)
			{
				res.redirect('/api/login');
				console.log(`Logged out...`);
			} 
			else console.log(err);
		});
	});

	app.get('/api/home/user' , function(req , res){
		if (req.session.username){
			let query = 'SELECT * FROM user_info';
			mysqlConnection.query(query , function(err , rows , field){
				for (let i = 0 ; i < rows.length ; i++){
					if (rows[i].username == req.session.username){
						console.log(rows[i].username);
						let data = {
							name: rows[i].full_name,
							address: rows[i].address,
							enrollment_no: rows[i].enrollment_no,
							contact: rows[i].contact,
							dob: rows[i].dob,
							username: req.session.username
						}
						res.render('user_profile' , {data: data});
					}
				}
				
			});
			//.log(data);
			//res.render('user_profile' , {data: data});
			
		}
		else{
			res.redirect('/api/login');
		}
	});

	app.get('/api/home/edit' , function(req , res){
		if (req.session.username){
			res.render('edit_profile' , {username: req.session.username});
		}
		else{
			res.redirect('/api/login');
		}
		
	});

	app.post('/api/home/edit' ,urlencodedParser , function(req , res){
		console.log(req.body);
		let query = 'INSERT INTO user_info(full_name , address , enrollment_no , contact , dob , username) VALUES(? ,? , ? , ? , ? , ?)';
		mysqlConnection.query(query , [req.body.name , req.body.address , req.body.enrollment_no , req.body.contact , req.body.dob , req.session.username] , function(err , rows , fields){
			if(!err){
				res.redirect('/api/home/req.session.name');
			}
			else{
				console.log(err);
			}
		});
	});


	//home...
	app.get('/api/home' , function(req , res){
		if(req.session.username){

			res.render('home' , {username: req.session.username});
		}
		else{
			res.redirect('/api/login');
		}
		
		
	});


	//sign up...
	app.get('/api/signup' , function(req , res){
		res.render('signup' , {message: message});
		message = '';

	});

	app.post('/api/signup' , urlencodedParser, function(req , res){
		console.log(req.body);
		if (req.body.password === req.body.confirm_password){
			let query = 'INSERT INTO user(username , password) VALUES(? , ?)';
			mysqlConnection.query(query , [req.body.username , req.body.password] , function(err , rows , fields){
				console.log(`signed up as ${req.body.username}...`);
				req.session.username = req.body.username;
				res.redirect('/api/home');
			});
		}
		else {
			message = 'passwords don\'t match..';
			res.redirect('/api/signup');
		}
	});

	//login...
	app.get('/api/login' , function(req , res){

		if (!req.session.username){
			res.render('login' , {message: message});
			message = '';
		}
		else{
			res.redirect('/api/home');
		}
	});

	app.post('/api/login' , urlencodedParser , function(req , res){
		if (!req.session.username){
			console.log(req.body);
			let query = 'SELECT * FROM user';
			mysqlConnection.query(query, function(err , rows , fields){
				if (!err){
					let found = false;
					for (let i = 0 ; i < rows.length ; i++){
						if (rows[i].username == req.body.username && rows[i].password == req.body.password){
							console.log(`logged in as ${req.body.username}...`);
							req.session.username = req.body.username;
							//console.log(req.session.username);
							res.redirect('/api/home');
							found = true;
							break;
						}
					
					
					}
					if(!found){
						message = 'Invalid user...';
						res.render('login' , {message: message});
						console.log('Invalid user..');
						message = '';
					}


				}
				else{
					console.log(err);
				}
			});
		}
	});

	//test...
	app.get('/api/signup/show' , function(req , res){
		let query = 'SELECT * FROM user';
		mysqlConnection.query(query , function(err , rows , fields){
			res.send(rows);
		});
	});
};