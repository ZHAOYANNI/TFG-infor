app1.controller("global", function ($scope, $timeout){
    $scope.getGlobalData = function(){
        if(symbol == null){
            alert("Sorry, you have to enter the name of company o his symbol.");
        }
        url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="
        url += symbol + "&apikey=" + apiKey;
        const xhr = new XMLHttpRequest();
        xhr.open( 'GET', url, true );
        xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
        xhr.onload = callbackNor;
        xhr.send();
        $timeout(initResultTable, 3000);
        $scope.showGlobalDownload = true;
    }
    
    function callbackNor( xhr ) {

        var response;

        response = xhr.target.response;
        datos = JSON.parse( response );
        
    }

    function initResultTable(){
        $scope.global = datos["Global Quote"];
    }

    $scope.getGlobalDataDownload = function(){
        var fileName = symbol.toUpperCase() + 'GlobalData';
        var type = $scope.inpGlobalType;
        if(type == "json"){
            fileName += '.json';
            var blob = new Blob([JSON.stringify(datos)], { type:"application/json;charset=utf-8;" });			
            var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href',window.URL.createObjectURL(blob));
                    downloadLink.attr('download', fileName);
            downloadLink[0].click();
        }
        else{
            url += '&datatype=csv';
            window.location.assign(url);
        }
        
    }
})