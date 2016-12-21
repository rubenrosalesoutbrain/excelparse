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
              printScript(response);
             
              //console.log(response);
            
          });
    }
    function printScript(script){
      console.log(JSON.stringify(script))
      // for each (var item in script) {
      //   //console.log(item)
      // }

       $("#script").append(JSON.stringify(script.script))
    }
};