function include(filename, onload) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    script.onload = script.onreadystatechange = function() {
        if (script.readyState) {
            if (script.readyState === 'complete' || script.readyState === 'loaded') {
                script.onreadystatechange = null;                                                  
                onload();
            }
        } 
        else {
            onload();          
        }
    };
    head.appendChild(script);
}

include('http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js', function() {
    $(document).ready(main);
});


var main = function() {
  getScript();
    function getScript(){
      $.post("users/getScript",function(response){
           // JSON.stringify(response);
           //console.log(response.script["5556"])
              printScript(response);
             
 
            
          });
    }
    function printScript(script){
      // for each (var item in script) {
      //   //console.log(item)
      // }


script=script.script;
var returnString = "<ul>";
console.log(script)              
 for(var key in script){
  var phpScript = "php update_campaign_settings.php impressionPixels '";
  var temp='';
  //console.log(script[key])
      for(var url in key){          
        if(script[key][url])
          temp += script[key][url] + " ";
      }     
      phpScript += temp.trim() + "' " + key;                      
           // console.log(phpScript)

        returnString+= "<li>" + phpScript  +"</li>"
    }   
      returnString += "</ul>"
       $("#script").append(returnString)
    }
};