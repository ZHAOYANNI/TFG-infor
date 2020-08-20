app1.controller("indicator", function ($scope, $timeout){ 

    $scope.getIndicator = function(){
        if(symbol == null){
            alert("Sorry, you have to enter a symbol.");
        }
        var ind = $scope.indica;
        if(ind == null){ind
            alert("Sorry, you have to choose an indicator.");
        }
        var interval = $scope.indInterval;
        if(interval == null){
            alert("Sorry, you have to choose a interval.");
        }
        var url = 'https://www.alphavantage.co/query?function='+ ind 
        + '&symbol=' + symbol + '&interval=' + interval;
        if(ind == "SMA" || ind == "EMA" || ind == "RSI" || ind == "BBANDS"){
            if($scope.inpTimePeriod <= 0){
                alert("Sorry, the period of time must be a positive number.");
            }
            else{
                url = url + '&time_period=' + $scope.inpTimePeriod;
            }
            if($scope.inpSerieType == null){
                alert("Sorry, you have to choose a serie type.");
            }
            else{
            url = url + '&series_type=' + $scope.inpSerieType + '&apikey=' + apiKey;
            }
        }
        else if(ind == "MACD"){
            if($scope.inpSerieType == null){
                alert("Sorry, you have to choose a serie type.");
            }
            else{
                url = url + '&series_type=' + $scope.inpSerieType + '&apikey=' + apiKey;
            }
        }
        else if(ind == "AROON" || ind == "ADX"  || ind == "CCI"){
            if($scope.inpTimePeriod <= 0){
                alert("Sorry, the period of time must be a positive number.");
            }
            else{
                url = url + '&time_period=' + $scope.inpTimePeriod + '&apikey=' + apiKey;
            }
        }
        else{
            url = url + '&apikey=' + apiKey;
        }

        $scope.showIndDownload = true;
        const xhr = new XMLHttpRequest();
        xhr.open( 'GET', url, true );
        xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
        xhr.onload = callbackNor;
        xhr.send();
        $timeout(initChart, 6000);
    }

    function callbackNor( xhr ) {

        var response;

        response = xhr.target.response;
        datos = JSON.parse( response );
        
    }

    $scope.indGraphDownload = function(){
        var canvas = document.getElementById("lineChart");
        var a = document.createElement("a");
        if($scope.inpImageType == "jpeg")
            a.href = canvas.toDataURL("image/jpeg");
        else
            a.href = canvas.toDataURL("image/png");
        a.download = "graph"+symbol+$scope.indica;
        a.click();
    }

    $scope.selectIndicator = function(){
        if($scope.indica == "SMA" || $scope.indica == "EMA"
        || $scope.indica == "RSI" || $scope.indica == "BBANDS"){
            $scope.showTimePeriod = true;
            $scope.showSerieType = true;
            $scope.optVWAP = true;
        }
        else if($scope.indica == "MACD" ){
            $scope.showSerieType = true;
            $scope.showTimePeriod = false;
            $scope.optVWAP = true;
        }
        else if($scope.indica == "AROON" ||  $scope.indica == "ADX" || $scope.indica == "CCI"){
            $scope.showTimePeriod = true;
            $scope.showSerieType = false;
            $scope.optVWAP = true;
        }
        else{
            if($scope.indica == "VWAP"){
                $scope.optVWAP = false;
            }
            else{
                $scope.optVWAP = true;
            }
            $scope.showTimePeriod = false;
            $scope.showSerieType = false;
        }
    }

    function initChart(){
        $scope.showIndGraphDownload = true;
       var serie1=[],serie2=[],serie3=[];
       var labels=[];
       var count=0;
       for(x in datos){
        count++;
        if(count === 1)
            key1 = x;
        else if(count === 2)
            key2 = x;
       }
       $scope.indOptions = { legend: { display: true } };

       if($scope.indica == "MACD"){
           for(i in datos[key2]){
               labels.unshift(i);
               serie1.unshift(parseFloat(datos[key2][i]["MACD_Signal"]));
               serie2.unshift(parseFloat(datos[key2][i]["MACD"]));
               serie3.unshift(parseFloat(datos[key2][i]["MACD_Hist"]));
            }
            $scope.indSeries=['MACD_Signal', 'MACD', 'MACD_Hist'];
            $scope.indLabels = labels;
            $scope.indData=[serie1, serie2, serie3];
       }
       else if($scope.indica == "BBANDS"){
            for(i in datos[key2]){
                labels.unshift(i);
                serie1.unshift(parseFloat(datos[key2][i]["Real Upper Band"]));
                serie2.unshift(parseFloat(datos[key2][i]["Real Lower Band"]));
                serie3.unshift(parseFloat(datos[key2][i]["Real Middle Band"]));
            }
            $scope.indSeries=['Real Upper Band', 'Real Lower Band', 'Real Middle Band'];
            $scope.indLabels = labels;
            $scope.indData=[serie1, serie2, serie3];

       }
       else if($scope.indica == "AROON"){
            for(i in datos[key2]){
                labels.unshift(i);
                serie1.unshift(parseFloat(datos[key2][i]["Aroon Up"]));
                serie2.unshift(parseFloat(datos[key2][i]["Aroon Down"]));
            }
            $scope.indSeries=['Aroon Up', 'Aroon Down'];
            $scope.indLabels = labels;
            $scope.indData=[serie1, serie2];
       }
       else if($scope.indica == "STOCH"){
            for(i in datos[key2]){
                labels.unshift(i);
                serie1.unshift(parseFloat(datos[key2][i]["SlowD"]));
                serie2.unshift(parseFloat(datos[key2][i]["Slowk"]));
            }
            $scope.indSeries=['SlowD', 'Slowk'];
            $scope.indLabels = labels;
            $scope.indData=[serie1, serie2];
       }
       else{
           var key;
           if($scope.indica == "AD"){
               key = "Chaikin A/D"
           }
           else{
               key = $scope.indica;
           }
           for(i in datos[key2]){
                labels.unshift(i);
                serie1.unshift(parseFloat(datos[key2][i][key]));
            }
            $scope.indSeries=[$scope.indica];
            $scope.indLabels = labels;
            $scope.indData=[serie1];
        }
    }

    $scope.indicatorDownload=function(){
        var fileName = symbol + $scope.indica + '.json';
        var blob = new Blob([JSON.stringify(datos)], { type:"application/json;charset=utf-8;" });			
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href',window.URL.createObjectURL(blob));
        downloadLink.attr('download', fileName);
        downloadLink[0].click();
    }
})