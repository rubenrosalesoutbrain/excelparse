var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	loadExcel();
  res.render('index', { title: 'Express' });
});


function loadExcel(){

if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbook = XLSX.readFile('test.xlsx');
var sheet_name_list = workbook.SheetNames;



sheet_name_list.forEach(function(y) { /* iterate through sheets */
  var worksheet = workbook.Sheets[y];
  var campaign_id =0,prev_campaign_id = 0;
  var pixels = [];
  var store = {};
  for (z in worksheet) {
  
    /* all keys that do not begin with "!" correspond to cell addresses */
    if(z[0] === '!') continue;

    	if(isNumeric(JSON.stringify(worksheet[z].v))){
    		console.log((JSON.stringify(worksheet[z].v)))
    		if (pixels.length > 0) {
 
   				store[campaign_id] = pixels;
   				pixels = [];

			}
			else{
				    		console.log("F"+(JSON.stringify(worksheet[z].v)))

			}
			prev_campaign_id = campaign_id;
  			campaign_id = JSON.stringify(worksheet[z].v);
  			
  		}
  		else{
  			if(campaign_id !== 0){
  				pixels.push(JSON.stringify(worksheet[z].v));
  			}
  		}
  }
  if(prev_campaign_id != campaign_id){
  	store[campaign_id] = pixels;
  }
  console.log(store);
});
	
	
}




function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = router;
