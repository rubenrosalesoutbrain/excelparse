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
var store = {};


sheet_name_list.forEach(function(y) { /* iterate through sheets */
  var worksheet = workbook.Sheets[y];
  var campaign_id =0,prev_campaign_id = 0;
  var pixels = [];
  
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
	
	printScript(store);
}


function printScript(store){

  for (key in store){
    var script = "php update_campaign_settings.php impressionPixels ";
    var urls = "'";
    var i = 0;
      for(value in store[key]){
        if(i == 1){
          urls += " "
        }
        urls += store[key][value].replace(/['"]+/g, '');
        i+=1;

      }
      urls+="'";
      script += urls + " " + key;
    console.log(script);
  }
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = router;
