app1.controller("fundamental", function ($scope, $timeout){ 

    $scope.getData = function(){

        var symbol = $scope.inpSymbol;
        if(symbol == null){
            alert("Sorry, you have to enter a symbol.");
        }
        var data = $scope.inpData;
        if(data == null){
            alert("Sorry, you have to choose a function.");
        }

        var url = 'https://www.alphavantage.co/query?function=';
        if(data == "Company Overview"){
            url = url + 'OVERVIEW';
        }
        else if (data == "Income Statement"){
            url = url + 'INCOME_STATEMENT';
        }
        else if (data == "Balance Sheet" ){
            url = url + 'BALANCE_SHEET';
        }
        else if (data == 'Cash flow'){
            url = url + 'CASH_FLOW';
        }
        url += '&symbol=' + symbol + '&apikey=' + apiKey;
        const xhr = new XMLHttpRequest();
        xhr.open( 'GET', url, true );
        xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
        xhr.onload = callbackNor;
        xhr.send();
        $timeout(initTable, 3000);
    }

    function callbackNor( xhr ) {

        var response;

        response = xhr.target.response;
        datos = JSON.parse( response );
    }

    function initTable(){

        if ($scope.inpData == "Company Overview"){
            document.getElementById("resultadoBasico").innerText = datos["Description"];
            datos["Description"]=null;
            var header=[];
            for(x in datos){
                if(x != "Description")
                    header.push(x);
            }
            $scope.headers = header;
            $scope.fundamentales = datos;
            $scope.showBasicTable = true;
        }
        else{
            var cont = 0;
            var key1, key2, key;
            for(x in datos){
                if(cont == 1){
                    key1 = x
                }
                else if(cont == 2){
                    key2 = x;
                }
                cont++;
            }

            if($scope.report == "Annual Report"){
                key = key1;
            }else{
                key = key2;
            }

            if($scope.year == null){
                console.log("estas en null");
                var header = [];
                for(x in datos[key][0]){
                    header.push(x);
                }
                console.log(datos[key]);
                console.log(header);
                for(x in datos[key]){
                    console.log(x);
                    for(j in datos[key][x]){
                        console.log(j);
                    }
                }
                $scope.headers = header;
                $scope.fundamentales = datos[key];
                $scope.showIncomeTableYear = true;
            }
            else{
                var i = 0;
                var result = [];
                while(i < datos[key].length){
                    var date = new Date(datos[key][i]["fiscalDateEnding"]);
                    var anio = date.getFullYear();
                    if(anio == $scope.year){
                         result.unshift(datos[key].splice(i,1));
                    }
                    else{
                        i++;
                    }
                }
                var header = [];
                if(result.length == 0){
                    $scope.withoutResult = true;
                }
                else{
                    for(k in result[0][0]){
                        header.push(k);
                    }
                    $scope.fundamentales = result;
                    $scope.headers = header;
                    $scope.showIncomeTable = true;
                }
            }
        }
    }

    $scope.setOption = function(){
        if ($scope.inpData == "Company Overview"){
            $scope.optionReport = false;
        }
        else{
            $scope.optionReport = true;
        }
    }
});
