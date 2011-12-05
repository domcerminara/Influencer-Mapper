var util = require("util");
var mongodb = require("mongodb");
var server = "localhost";
var port = 27017;  //MongoDB port

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

//Map route
exports.map = function(req, res){
  res.render('map', { title: req.query.handle })
}; 

// /:db/:collection/:operation
exports.mongo = function(req, res){
	switch (req.params.operation) {
		case 'insert':	insert(req, res);
									 	break;
		case 'find':		find(req, res);
									 	break;
		case 'update':	update(req, res);
									 	break;
		}
	}
	
//db/:collection/:operation/:document
var doError = function (e) {
	util.debug("ERROR: "+e);
	throw new Error(e);
	}

// INSERT
var insert = function(req, res) {
	var db = new mongodb.Db(req.params.db
													, new mongodb.Server(server, port, {})
													, {native_parser:false,auto_reconnect:true}
													);
	db.open(function(err, result) {
						if (err) doError(err);
						db.collection(req.params.collection, function(err, collection) {
							util.debug("req.query: "+JSON.stringify(req.query));
							collection.insert(req.query, function(err, document) {
								util.debug("document: "+JSON.stringify(document));
								res.render('mongo', {title: 'Mondo Demo', obj: JSON.stringify(document)});
								db.close();
								});
							});
						});
					}
					
// FIND
var find = function(req, res) {
	var db = new mongodb.Db(req.params.db
													, new mongodb.Server(server, port, {})
													, {native_parser:false,auto_reconnect:true}
													);
	db.open(function(err, result) {
						if (err) doError(err);
						db.collection(req.params.collection, function(err, collection) {
							util.debug("req.query: "+JSON.stringify(req.query));
							collection.find(req.query, function(err, cursor) {
								var toRender = [];
								cursor.each(
									function(err, document) {
										util.debug("find document: "+JSON.stringify(document));
										if (document != null) {
											toRender.push(document);
										} else {
											db.close();											
											res.render('mongo',{title: 'Mondo Demo', obj: JSON.stringify(toRender)});
										}
								});
							});
						});
					});
				}

//UPDATE
var update = function(req, res) {
	var db = new mongodb.Db(req.params.db
													, new mongodb.Server(server, port, {})
													, {native_parser:false,auto_reconnect:true}
													);
	db.open(function(err, result) {
						if (err) doError(err);
						db.collection(req.params.collection, function(err, collection) {
							var rqf = JSON.parse(req.query.find);		// req.query.find is a string, turn into object
							var rqu = JSON.parse(req.query.update);	// req.query.update is a string, turn into object
							collection.update(rqf, rqu, {safe:true}, function(err) {
								if (err) doError("ERROR in update: "+err);
								res.render('mongo', {title: 'Mondo Demo', obj: "Update succeeded"});
								db.close();
								});
							});
						});
					}