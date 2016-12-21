var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
/* GET users listing. */
router.get('/', function(req, res, next) {

  res.send('respond with a resource');
});

router.post('/getScript', function (req, res){
	   var script = loadExcel();
	   res.json({'script': script});
});


function loadExcel() {
  if (typeof require !== 'undefined') XLSX = require('xlsx');
  var workbook = XLSX.readFile('test.xlsx');
  var sheet_name_list = workbook.SheetNames;
  var store = {};
  sheet_name_list.forEach(function(y) { /* iterate through sheets */
    var worksheet = workbook.Sheets[y];
    var campaign_id = 0,
      prev_campaign_id = 0;
    var pixels = [];
    for (z in worksheet) {
      /* all keys that do not begin with "!" correspond to cell addresses */
      if (z[0] === '!') continue;
      if (isNumeric(JSON.stringify(worksheet[z].v))) {
        //console.log((JSON.stringify(worksheet[z].v)))
        if (pixels.length > 0) {
         store[campaign_id] = printScript(pixels,campaign_id);
         //  = pixels;

          pixels = [];
        }
        prev_campaign_id = campaign_id;
        campaign_id = JSON.stringify(worksheet[z].v);
      } else {
        if (campaign_id !== 0) {
         
          pixels.push(worksheet[z].v);
        }
      }
    }
    if (prev_campaign_id != campaign_id) {
	 store[campaign_id] = printScript(pixels, campaign_id)
    }
    //console.log(store);
  });
 // var finalScript = printScript(store);

  return store;
}

function printScript(pixels, campaign_id) {
	var phpScript = "php update_campaign_settings.php impressionPixels ";

	 var limiter = 1;
	 var temp = "'";
   var phrase = "src";
   var regex = /SRC=(.*)/;

	for(idx in pixels){
    //dummy load will remove
    var $ = cheerio.load('');//(pixels[idx].replace(/^"(.+(?="$))"$/, '$1'));

		
    if($(pixels[idx]).attr('src')){
      temp += $(pixels[idx]).attr('src');
    }
    else{
      temp+= pixels[idx];
    }
    
		if (limiter < pixels.length) {
        	temp += " ";
      }
      limiter+=1;
	}
	temp+= "' ";

	console.log(phpScript + temp + campaign_id)
	return phpScript + temp + campaign_id;


  // var finalScript = "";
  // for (key in store) {
  //   var script = "php update_campaign_settings.php impressionPixels ";
  //   var urls = "'";
  //   var i = 1;

  //   for (value in store[key]) {
  //     urls += store[key][value].replace(/['"]+/g, '');
  //     if (i < store[key].length) {
  //       urls += " "
  //     }
  //     i += 1;
  //   }
  //   urls += "'";
  //   script += urls + " " + key;
  //   finalScript += script + '\n';
  // }
  // return printScriptHelper(finalScript)
}

function printScriptHelper(script) {
  console.log(script);
  return script;
}
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
module.exports = router;
