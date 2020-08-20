var app1 = angular.module("prueba", ["chart.js"]);
var datos="";
var url="";
var symbol = "";

const apiKey = 'B565DEWCW6JTF829';

app1.controller("principal", function ($scope, $http){
    $http.get("https://api.iextrading.com/1.0/ref-data/symbols").then(function(response) {
        $scope.results = response.data;
        $scope.showSearchResult = true;
    });
    $scope.inpSymbol="";
    $scope.sensitiveSearch = function(sym){
        if($scope.inpSymbol.toUpperCase()){
            return sym.symbol.indexOf($scope.inpSymbol.toUpperCase()) == 0 ||
            sym.name.indexOf($scope.inpSymbol.toUpperCase()) == 0;
        }
        return false;
    };
    
    $scope.selectSymbol = function (sym) {
        $scope.inpSymbol = sym.symbol;
        $scope.showSearchResult = false;
        symbol = $scope.inpSymbol;
    };

    $scope.search=function(){
        if($scope.showSearchResult == false){
            $scope.showSearchResult=true;
        }
    }

    symbol = $scope.inpSymbol.toUpperCase();
})