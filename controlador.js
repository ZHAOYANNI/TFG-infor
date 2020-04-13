
function getAlphaData() {

    const apiKey = 'B565DEWCW6JTF829';

    const symbol = inpSymbol.value;

    const func = inpFunction.value;

    const intel = inpInterval.value;

    const size = inpSize;

    const type = inpType;

    url = 'https://www.alphavantage.co/query?function='+ func 
    + '&symbol=' + symbol;
    if (func=='TIME_SERIES_INTRADAY') 
        url += '&interval=' + intel; 
    url += '&outputsize=' + size +'&datatype=' + type  + '&apikey=' + apiKey;

    requestFile( url, func );

}

function requestFile( url, func ) {

    const xhr = new XMLHttpRequest();
    xhr.open( 'GET', url, true );
    xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };

    if(func == 'TIME_SERIES_INTRADAY'){
        xhr.onload = callbackNor;
    }
    else if(func == 'TIME_SERIES_DAILY'){
        xhr.onload = callbackNor;
    }
    else if(func == 'TIME_SERIES_DAILY_ADJUSTED'){
        xhr.onload = callbackAdjD;
    }
    else if(func == 'TIME_SERIES_WEEKLY'){
        xhr.onload = callbackNor;
    }
    else if(func == 'TIME_SERIES_WEEKLY_ADJUSTED'){
        xhr.onload = callbackAdj;
    }
    else if(func == 'TIME_SERIES_MONTHLY'){
        xhr.onload = callbackNor;
    }
    else if(func == 'TIME_SERIES_MONTHLY_ADJUSTED'){
        xhr.onload = callbackAdj;
    }
    xhr.send( null );



    function callbackNor( xhr ) {

        let response;

        response = xhr.target.response;
        datos = JSON.parse( response );

        for (j in datos){
         variable  = j; 
        }
        variable = "" + variable + "";
        var txt = "<table border='1'> <tr><th> Date </th> <th> Open </th> <th> High </th>"+
        "<th> Low </th> <th> Close </th> <th> Volume </th></tr> "

        for(i in datos[variable]){
            hora = "" + i + "";
            txt += "<tr><td>" + hora + "</td>";
            for(j in datos[variable][hora]){
                txt += "<td>" + datos[variable][hora][j] + "</td>";
            }
            txt+="</tr>";
        }
        txt += "</table>" 
        document.getElementById("resultados").innerHTML = txt;
    }
    


    function callbackAdj( xhr ) {

        let response;

        response = xhr.target.response;
        datos = JSON.parse( response );

        for (j in datos){
         variable  = j; 
        }
        variable = ""+variable+"";
        var txt = "<table border='1'> <tr><th> Date </th> <th> Open </th> <th> High </th>"+
        "<th> Low </th> <th> Close </th> <th> Adjusted Close </th><th> Volume </th>"+
        "<th> Dividend amount </th></tr> "

        for(i in datos[variable]){
            hora = "" + i + "";
            txt += "<tr><td>" + hora + "</td>";
            for(j in datos[variable][hora]){
                txt += "<td>" + datos[variable][hora][j] + "</td>";
            }
            txt+="</tr>";
        }
        txt += "</table>" 
        document.getElementById("resultados").innerHTML = txt;
    }



    function callbackAdjD( xhr ) {

        let response;

        response = xhr.target.response;
        datos = JSON.parse( response );

        for (j in datos){
         variable  = j; 
        }
        variable = "" + variable + "";
        var txt = "<table border='1'> <tr><th> Date </th> <th> Open </th> <th> High </th>"+
        "<th> Low </th> <th> Close </th> <th> Adjusted Close </th><th> Volume </th>"+
        "<th> Dividend amount </th><th> Split coefficient </th></tr> "

        for(i in datos[variable]){
            hora = "" + i + "";
            txt += "<tr><td>" + hora + "</td>";
            for(j in datos[variable][hora]){
                txt += "<td>" + datos[variable][hora][j] + "</td>";
            }
            txt+="</tr>";
        }
        txt += "</table>" 
        document.getElementById("resultados").innerHTML = txt;
    }

}