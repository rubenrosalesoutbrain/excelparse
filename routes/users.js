var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});
router.post('/getScript', function(req, res) {
	var script = loadExcel();
	res.json({
		'script': script
	});
});

function loadExcel() {
	var file = 'test.xlsx';
	if (typeof require !== 'undefined') XLSX = require('xlsx');
	var workbook = XLSX.readFile(file);
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
				prev_campaign_id = campaign_id;
				campaign_id = JSON.stringify(worksheet[z].v);
				if (pixels.length > 0 && prev_campaign_id != 0 && prev_campaign_id !== campaign_id) {
					if (store[prev_campaign_id]) {
						store[prev_campaign_id] = store[prev_campaign_id].concat(addPixels(pixels, prev_campaign_id))
					} else {
						store[prev_campaign_id] = addPixels(pixels, prev_campaign_id)
					}
					pixels = [];
				}
			} else {
				if (campaign_id !== 0) {
					pixels.push(worksheet[z].v);
				}
			}
		}
		if (pixels.length > 0) {
			//console.log(prev_campaign_id)
			if (store[campaign_id]) {
				store[campaign_id] = store[campaign_id].concat(addPixels(pixels, campaign_id))
			} else {
				store[campaign_id] = addPixels(pixels, campaign_id)
			}
		}
		//console.log(store,pixels)
	});
	//printResponse(store);

	return store;
}

function printResponse(store) {
	for (idx in store) {
		console.log(idx, store[idx])
	}
}

function addPixels(pixels, campaign_id) {
	var sanitizedPixels = [];
	//  console.log(pixels)
	for (idx in pixels) {
		var $ = cheerio.load('');
		var js1 = cheerio.load(pixels[idx].trim())
		var src = getSRC(pixels[idx])
		if (src) {
			sanitizedPixels.push(src);
		}
	}
	return sanitizedPixels;
}

function getSRC(tag) {
	if (isUrl(tag)) {
		return tag;
	} else {
		console.log("false;" + tag.toString())
	}
	try {
		var tags = multipleTags(tag);
		if (tags) {
			return tags;
		} else {
			console.log("err " + tag)
		}
	} catch (err) {
		console.log("tag errors")
	}
	try {} catch (err) {
		console.log(err)
	}
	return '';
}

function multipleTags(tags) {
	try {
		var AllSRC = '';
		var tempSrc;
		var $ = cheerio.load('')
			//console.log(tags);
		$(tags).each(function(i, elem) {
			tempSrc = $(this).html().trim();
			AllSRC += $(this).attr('src') || $(tempSrc).attr('src');
		});
	} catch (err) {
		console.log("for each fail")
		return '';
	} finally {
		return AllSRC;
	}
}

function isUrl(tag) {
	try {
		if (isValidURL(tag)) {
			return true;
		}
		return false;
	} catch (err) {
		return false;
	}
}

function isValidURL(s) {
	var regexp = new RegExp('^(?:[a-z]+:)?//', 'i');
	return regexp.test(s);
}

function printScript(pixels, campaign_id) {
	var phpScript = "php update_campaign_settings.php impressionPixels ";
	var limiter = 1;
	var temp = "'";
	for (idx in pixels) {
		var $ = cheerio.load('');
		var js1 = cheerio.load(pixels[idx].trim())
		var src = getSRC(pixels[idx])
		console.log("-------------------")
		console.log(src + " " + campaign_id)
		console.log("---------1111111----------")
		if (src == '') {
			console.log("null")
		}
		temp += src;
		if (limiter < pixels.length) {
			temp += " ";
		}
		limiter += 1;
	}
	temp += "' ";
	return phpScript + temp + campaign_id;
}

function printScriptHelper(script) {
	return script;
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
module.exports = router;