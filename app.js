var nodeHint = require('./node-hint').hint;
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');
var defaultReporter = require('./node-hint/lib/report').report;

MongoClient.connect('mongodb://admin:ase123@127.0.0.1:27017/zerionProd?authSource=admin', function(err, db) {
	var collection = db.collection("page");
	
  	collection.find({"PAGE.PROFILE": 145087}).toArray(function(err, results) {
        
        var str = "";
	
		for(var i = 0; i < results.length; i++) {
			
			var doc = results[i];

			if(doc.PAGE.PAGE_JAVASCRIPT && typeof doc.PAGE.PAGE_JAVASCRIPT === "string") {
				console.log(doc.PAGE.ID);
				var options = {
					source : doc.PAGE.PAGE_JAVASCRIPT,
					sourceName : "Page Id " + doc.PAGE.ID,
					report: { reporter: defaultReporter, options: { oneErrorPerLine: false } }
				}
		   
				nodeHint(options, function(err, result){

					str += "PAGE JAVASCRIPT PROBLEMS FOR " + doc.PAGE.NAME + "\n"
					str += result + "\n";
					str += "/----------------------------------------------------------------------------------------------------------/\n\n";
					console.log(result);
					console.log ();
				});
			}
			
			for(var j = 0; j < doc.ELEMENTS.length; j++) {
				
				var element = doc.ELEMENTS[j];
				
				if(element.DYNAMIC_VALUE && typeof element.DYNAMIC_VALUE === "string") {
					var options = {
						source : element.DYNAMIC_VALUE,
						sourceName : "Page Id " + doc.PAGE.ID + " " + element.NAME + " Dynamic Value",
						report: { reporter: defaultReporter, options: { oneErrorPerLine: false } }
					}
		   			
					nodeHint(options, function(err, result){
						str += "ELEMENT DYNAMIC_VALUE PROBLEMS FOR " + element.NAME + " IN PAGE " + doc.PAGE.NAME + "\n";
						str += "JavaScript: " + element.DYNAMIC_VALUE + "\n";
						str += result + "\n";
						str += "/----------------------------------------------------------------------------------------------------------/\n\n";
						console.log(result);
						console.log ();
					});
				}
				
				if(element.CONDITION_VALUE && typeof element.CONDITION_VALUE === "string"){
					var options = {
						source : element.CONDITION_VALUE,
						sourceName : "Page Id " + doc.PAGE.ID + " "  + element.NAME + " Condition Value",
						report: { reporter: defaultReporter, options: { oneErrorPerLine: false } }
					}
		   			
					nodeHint(options, function(err, result){
						str += "ELEMENT CONDITION_VALUE PROBLEMS FOR " + element.NAME + " IN PAGE " + doc.PAGE.NAME + "\n";
						str += "JavaScript: " + element.CONDITION_VALUE + "\n";
						str += result + "\n";
						str += "/----------------------------------------------------------------------------------------------------------/\n\n";
						console.log(result);
						console.log ();
					});
				}

				if(element.DYNAMIC_LABEL && typeof element.DYNAMIC_LABEL === "string") { 
					var options = {
						source : element.DYNAMIC_LABEL,
						sourceName : "Page Id " + doc.PAGE.ID + " " + element.NAME + " Dynamic Label",
						report: { reporter: defaultReporter, options: { oneErrorPerLine: false } }
					}
		   			
					nodeHint(options, function(err, result){
						str += "ELEMENT DYNAMIC_LABEL PROBLEMS FOR " + element.NAME + " IN PAGE " + doc.PAGE.NAME + "\n";
						str += "JavaScript: " + element.DYNAMIC_LABEL + "\n";
						str += result + "\n";
						str += "/----------------------------------------------------------------------------------------------------------/\n\n";
						console.log(result);
						console.log ();
					});
				}
			}
		}

		fs.appendFile('CapeFearProd.txt', str, function (err) {});
	});
});
