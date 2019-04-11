var http = require('http');
var fs = require ('fs');
var url = require('url');
var qs = require("querystring");

function checkForLogin(qobj)
{
	accData = fs.readFileSync("accounts.txt");
	accData = accData.toString().split(";");
	
	if (!qobj.login)
	{
		console.log("Login not found");
		return;
	}
	
	for (var i = 0; i < accData.length; i++)
	{
		var dataObj = JSON.parse(accData[i]);
		
		if (dataObj.uname == qobj.uname && dataObj.pword == qobj.pword)
		{
			qobj.firstname = dataObj.firstname;
			qobj.lastname = dataObj.lastname;
			fs.writeFile("current.txt", '{"uname":"' + qobj.uname + '" ,"pword":"' + qobj.pword + '", "firstname":"' + dataObj.firstname + '", "lastname":"' + dataObj.lastname + '" ,"icon":"' + dataObj.icon + '"}', function (err) {
					if (err) {
						return console.log("Error writing file: " + err);
				}});
			return;
		}
	}
}

function register(qobj)
{
	var userExists = false;
	var enoughInfo = true;
	
	if (!qobj.register)
	{
		console.log("Registration not found");
		return;
	}
	
	for (var i = 0; i < accData.length; i++)
	{
		var dataObj = JSON.parse(accData[i]);
		
		if (dataObj.uname == qobj.uname)
		{
			console.log("Username already exists.");
			userExists = true;
			return;
		}
	}
	
	if (qobj.uname == "" || qobj.pword == "" || qobj.first == "" || qobj.last == "")
	{
		console.log("Not enough information given.");
		enoughInfo = false;
	}
	
	if (!userExists && enoughInfo)
	{
		fs.appendFile("accounts.txt", ';{"uname":"' + qobj.uname + '" ,"pword":"' + qobj.pword + '", "firstname":"' + qobj.first + '", "lastname":"' + qobj.last + '" ,"icon":"images/default.png"' + '}', function (err)
		{
			if (err)
			{
				console.log(err);
			}
		});
		
		changeAction = true;
	}
}

function stuff(qobj)
{
	if (!qobj.account)
	{
		console.log("Account stuff not found");
		return;
	}
	
	accData = fs.readFileSync("accounts.txt");
	accData = accData.toString().split(";");
	
	for (var i = 0; i < accData.length; i++)
	{
		var dataObj = JSON.parse(accData[i]);
		if (dataObj.uname == qobj.uname && dataObj.pword == qobj.pword)
		{
			temp = i;
			break;
		}
	}
	
	if (temp != 0)
	{
		fs.writeFile("accounts.txt", accData[0], function (err) {
		if (err) {
			return console.log("Error writing file: " + err);
		}});
		
		for (var x = 1; x < accData.length; x++)
		{
			if (x == temp)
			{
			}
			else
			{
				fs.appendFile("accounts.txt", ";" + accData[x], function (err)
				{
					if (err)
					{
						console.log(err);
					}
				});
			}
		}
		
		fs.appendFile("accounts.txt", ';{"uname":"' + qobj.uname + '" ,"pword":"' + qobj.pword + '", "firstname":"' + qobj.first + '", "lastname":"' + qobj.last + '" ,"icon":"' + qobj.icon + '"}', function (err)
		{
			if (err)
			{
				console.log(err);
			}
		});
	}
	else
	{
		fs.writeFile("accounts.txt", accData[1], function (err) {
		if (err) {
			return console.log("Error writing file: " + err);
		}});
		
		for (var i = 2; i < accData.length; i++)
		{
			fs.appendFile("accounts.txt", ";" + accData[i], function (err)
			{
				if (err)
				{
					console.log(err);
				}
			});
		}
		
		fs.appendFile("accounts.txt", ';{"uname":"' + qobj.uname + '" ,"pword":"' + qobj.pword + '", "firstname":"' + qobj.first + '", "lastname":"' + qobj.last + '" ,"icon":"' + qobj.icon + '"}', function (err)
		{
			if (err)
			{
				console.log(err);
			}
		});
	}
	
	fs.writeFile("current.txt", '{"uname":"' + qobj.uname + '" ,"pword":"' + qobj.pword + '", "firstname":"' + qobj.first + '", "lastname":"' + qobj.last + '" ,"icon":"' + qobj.icon + '"}', function (err) {
		if (err) {
			return console.log("Error writing file: " + err);
	}});
		
}

http.createServer(function(request, response)
{
	response.setHeader("Access-Control-Allow-Origin", "*");

	var name = url.parse(request.url).pathname.substring(1);
	console.log("Request for " + name + " received.");
	
	if (name == "music")
	{
		musicData = fs.readFileSync("music.txt");
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write(musicData.toString());
		response.end();
	}
	else
	{
		if (name == "sounds")
		{
			soundData = fs.readFileSync("sounds.txt");
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.write(soundData.toString());
			response.end();
		}
		else
		{
			if (name == "account")
			{
				currentAccData = fs.readFileSync("current.txt");
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write(currentAccData.toString());
				response.end();
			}
			else
			{
				if (name == "logout")
				{
					fs.writeFile("current.txt", '{"uname":"default" ,"pword":"default", "firstname":"default", "lastname":"default" ,"icon":"images/default.png"}', function (err) {
						if (err) {
							return console.log("Error writing file: " + err);
					}});
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.end();
				}
				else
				{
					fs.readFile(name, function(err, data)
					{
						contentType = name.substring(name.indexOf(".")+1);
						if (contentType == "png" || contentType == "jpg")
						{
							contentType = "image/" + contentType;
						}
						else
						{
							if (contentType=="mp3")
							{
								if (err)
								{
									console.log(err);
									response.writeHead(404, {"Content-Type": "audio/mpeg3"});
								}
								else
								{
									response.writeHead(200, {"Content-Type": "audio/mpeg3"});
									response.write(data, "binary");
								}
							}
							else
							{
								contentType = "text/" + contentType;
							}
						}
						
						console.log("File type is " + contentType);
						
						if (err)
						{
							console.log(err);
							response.writeHead(404, {"Content-Type": "text/html"});
						}
						else
						{
							if (contentType.indexOf("image") >= 0)
							{
								response.write(data, "binary");
								response.end();
							}
							else
							{
								if (request.method == "POST")
								{
									request.on("data", function(qstr)
									{
										var qobj = qs.parse(qstr.toString());
										
										checkForLogin(qobj);
										changeAction = false;
										register(qobj);
										stuff(qobj);
										response.write(data.toString());
										response.write("<script>data = " + JSON.stringify(qobj) + ";</script>\n");
										response.write("<script>changeAction = " + changeAction + ";</script>\n");
										response.end();
									});
								}
								else
								{
									response.write(data.toString());
									response.end();
								}
							}
						}
					})
				}
				
			}
			
		}
	}
}).listen(8081);

console.log("Server running at http://127.0.0.1:8081");