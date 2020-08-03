var app1 = angular.module("prueba", ["chart.js"]);
var datos="";

const apiKey = 'B565DEWCW6JTF829';

app1.controller("controlador", function ($scope, $timeout){ 
  
    $scope.inpSymbol = "IBM";

    $scope.getAlphaData = function(){

        var startDt = document.getElementById("startDate").value;
        var endDt = document.getElementById("endDate").value;

        if( (new Date(startDt).getTime() > new Date(endDt).getTime())){
            alert("Error, elige otra fecha final.");
        }

        else{
            $scope.showText = true;

            var symbol = $scope.inpSymbol;

            var func = $scope.inpFunction;

            var intel = $scope.inpInterval;

            var size = $scope.inpSize;

            var type = $scope.inpType;

            var url = 'https://www.alphavantage.co/query?function='+ func 
                    + '&symbol=' + symbol;
            if (func=='TIME_SERIES_INTRADAY') 
                 url += '&interval=' + intel; 
            url += '&apikey=' + apiKey;

            const xhr = new XMLHttpRequest();
            xhr.open( 'GET', url, true );
            xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
            xhr.onload = callbackNor;
            xhr.send();
            $timeout(initChart, 6000);
        }
    }

    function callbackNor( xhr ) {

        var response;

        response = xhr.target.response;
        datos = JSON.parse( response );
        
    }


    $scope.setTable = function() {
        if($scope.inpFunction == 'TIME_SERIES_INTRADAY'){
            $scope.showInterval = true;
            $scope.showFecha = false;
        }
        else{
            $scope.showInterval = false;
            $scope.showFecha = true;
        }
    }

    function initChart(){
        var open1=[], high=[], low=[], close1=[], volume=[], adjClose=[], divVol=[], split=[];
        var labels = [];
        var count = 0, key1, key2;
        for(x in datos){
            count++;
            if(count === 1)
                key1 = x;
            else if(count === 2)
                key2 = x;
        }
        $scope.options = { legend: { display: true } };
        var i;
        if($scope.inpFunction == 'TIME_SERIES_INTRADAY'){
            for(i in datos[key2]){
                labels.unshift(i);
                open1.unshift(parseFloat(datos[key2][i]["1. open"]));
                high.unshift(parseFloat(datos[key2][i]["2. high"]));
                low.unshift(parseFloat(datos[key2][i]["3. low"]));
                close1.unshift(parseFloat(datos[key2][i]["4. close"]));
                volume.unshift(parseFloat(datos[key2][i]["5. volume"]));
            }
            $scope.series=['open', 'high', 'low', 'close', 'volume'];
            $scope.labels = labels;
            $scope.data=[open1, high, low, close1, volume];
           
        }
        
        else{
            var startDt = document.getElementById("startDate").value;
            var endDt = document.getElementById("endDate").value;
            startDt = new Date(startDt).getTime();
            endDt = new Date(endDt).getTime();
            for(i in datos[key2]){
                var j = "" + i + "";
                var fecha = new Date(j);
                if(startDt <= fecha.getTime() && fecha.getTime() <= endDt){
                    labels.unshift(i);
                    open1.unshift(parseFloat(datos[key2][i]["1. open"]));
                    high.unshift(parseFloat(datos[key2][i]["2. high"]));
                    low.unshift(parseFloat(datos[key2][i]["3. low"]));
                    close1.unshift(parseFloat(datos[key2][i]["4. close"]));
                    if($scope.inpFunction == 'TIME_SERIES_DAILY' || $scope.inpFunction == 'TIME_SERIES_WEEKLY'
                        || $scope.inpFunction == 'TIME_SERIES_MONTHLY'){
                            console.log("estamos en if");
                        volume.unshift(parseFloat(datos[key2][i]["5. volume"]));
                    }
                    else if($scope.inpFunction == 'TIME_SERIES_DAILY_ADJUSTED'){
                        adjClose.unshift(parseFloat(datos[key2][i]["5. adjusted close"]));
                        volume.unshift(parseFloat(datos[key2][i]["6. volume"]));
                        divVol.unshift(parseFloat(datos[key2][i]["7. dividend amount"]));
                        split.unshift(parseFloat(datos[key2][i]["8. split coefficient"]));
                    }
                    else if($scope.inpFunction == 'TIME_SERIES_WEEKLY_ADJUSTED' 
                        || $scope.inpFunction == 'TIME_SERIES_MONTHLY_ADJUSTED' ){
                        adjClose.unshift(parseFloat(datos[key2][i]["5. adjusted close"]));
                        volume.unshift(parseFloat(datos[key2][i]["6. volume"]));
                        divVol.unshift(parseFloat(datos[key2][i]["7. dividend amount"]));
                    }
                }

            }
            if($scope.inpFunction == 'TIME_SERIES_DAILY' || $scope.inpFunction == 'TIME_SERIES_WEEKLY'
                || $scope.inpFunction == 'TIME_SERIES_MONTHLY'){ 
                $scope.series=['open', 'high', 'low', 'close', 'volume'];
                $scope.data=[open1, high, low, close1, volume];
            }
            else if($scope.inpFunction == 'TIME_SERIES_DAILY_ADJUSTED'){
                $scope.series=['open', 'high', 'low', 'close', 'adjusted close','volume', 'dividend amount', 'split coefficient'];
                $scope.data=[open1, high, low, close1, adjClose, volume, divVol, split];
            }
            else if($scope.inpFunction == 'TIME_SERIES_WEEKLY_ADJUSTED' 
            || $scope.inpFunction == 'TIME_SERIES_MONTHLY_ADJUSTED' ){
                $scope.series=['open', 'high', 'low', 'close', 'adjusted close','volume', 'dividend amount'];
                $scope.data=[open1, high, low, close1, adjClose, volume, divVol];
            }
            $scope.labels = labels;

        }
    }
});
