var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
/* GET users listing. */
var cmd = require('node-cmd');
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/getScript', function(req, res) {
  var script = loadExcel();
  //runScript(script);
  res.json({
    'script': script
  });
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
        prev_campaign_id = campaign_id;
        campaign_id = JSON.stringify(worksheet[z].v);
        if (pixels.length > 0 && prev_campaign_id != 0 && prev_campaign_id !== campaign_id) {
          // console.log(campaign_id)
          // console.log(prev_campaign_id)
          // console.log(pixels)
          console.log("id: " + prev_campaign_id)
          store[prev_campaign_id] = printScript(pixels, prev_campaign_id);
          //  = pixels;
          pixels = [];
        }
      } else {
        if (campaign_id !== 0) {
          pixels.push(worksheet[z].v);
        }
      }
    }
    if (prev_campaign_id != campaign_id) {
      store[campaign_id] = printScript(pixels, campaign_id)
    }
  });
  return store;
}

function getSRC(tag) {
  try {
    if(isUrl(tag)){
      console.log("true")
      return tag;
    }
    else{
      console.log("false;" + tag.toString())
    }
  }
  catch(err){console.log(err)}

  try {
    var tags = multipleTags(tag);
    if(tags){
      console.log("Succ")
      return tags;
    }
     else{console.log("err " + tag)}
   }

   catch(err){console.log("tag errors")}
  

 
 return 0;


}

function multipleTags(tags){
  try {
    var AllSRC = '';
    var tempSrc;
    var $ = cheerio.load('')
    console.log(tags);
    $(tags).each(function(i, elem) {
    console.log("in")
    console.log($(this).attr('src'))
      tempSrc = $(this).html().trim();
      AllSRC += $(this).attr('src') || $(tempSrc).attr('src');

    });
    console.log("success: "  + AllSRC)
    
  } catch (err) {
    console.log("for each fail")
    return '';
  } finally {
    return AllSRC;
  }
}

function isUrl(tag){
  try{
    if(validURL(tag)){
      return true;
    }
    else return false;
  }
  catch(err){
    return false;
  }
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\/\/)?' + // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|' + // domain name
    '((\d{1,3}\.){3}\d{1,3}))' + // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*' + // port and path
    '(\?[;&a-z\d%_.~+=-]*)?' + // query string
    '(\#[-a-z\d_]*)?$', 'i'); // fragment locater
  if (!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
}

function printScript(pixels, campaign_id) {
  var phpScript = "php update_campaign_settings.php impressionPixels ";
  var limiter = 1;
  var temp = "'";
  for (idx in pixels) {
    //dummy load will remove
    var $ = cheerio.load('');
    var js1 = cheerio.load(pixels[idx].trim())
    var src = getSRC(pixels[idx])
    console.log("-------------------")
    console.log(src + " " + campaign_id)
    console.log("---------1111111----------")
    if (src) {
      temp += src;
    } else {
      temp += pixels[idx];
    }
    if (limiter < pixels.length) {
      temp += " ";
    }
    limiter += 1;
  }
  temp += "' ";
  return phpScript + temp + campaign_id;
}

function printScriptHelper(script) {
//  console.log(script);
  return script;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
module.exports = router;