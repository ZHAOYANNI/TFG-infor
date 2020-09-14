app.controller("userCtrl", function($scope,$http, $timeout){
   var totalProfit = 0;
   var company_name;
       $http({ 
        url: './endpoint/acction.php',
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            username:username
        },
      }).then(function success(response){
      $scope.user_acction = response.data;
      var cont = 0;
      var price=[];
     for(i in $scope.user_acction){
         var url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + $scope.user_acction[i].company + "&apikey=" + 'B565DEWCW6JTF829';
         $http.get(url).then(function(response) {
            cont++;
            price.push(response.data["Global Quote"]["05. price"]);
            if(cont == $scope.user_acction.length){
               var j = 0;
               while(j < cont){
                  $scope.user_acction[j].current = price[j];
                  $scope.user_acction[j].profit = price[j] * $scope.user_acction[j].number_acction - $scope.user_acction[j].base; 
                  totalProfit += $scope.user_acction[j].profit;
                  j++;
               }
               $scope.totalProfit = totalProfit;
            }
              
         });
       }
      //numero total de paginas
      $scope.pageSize = 5;
      $scope.pages = Math.ceil($scope.user_acction.length / $scope.pageSize); //numero de paginas
      $scope.newPages = $scope.pages > 5 ? 5 : $scope.pages;
      $scope.pageList = [];
      $scope.selPage = 1;
      //buscar los datos a mostrar
      $scope.setData = function () {
         $scope.items = $scope.user_acction.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));//通过当前页数筛选出表格当前显示数据
      }
      $scope.items = $scope.user_acction.slice(0, $scope.pageSize);
      for (var i = 0; i < $scope.newPages; i++) {
         $scope.pageList.push(i + 1);
      }
      $scope.selectPage = function (page) {
         if (page < 1 || page > $scope.pages) return;
         if (page > 2) {
            var newpageList = [];
            for (var i = (page - 3) ; i < ((page + 2) > $scope.pages ? $scope.pages : (page + 2)) ; i++) {
                  newpageList.push(i + 1);
            }
            $scope.pageList = newpageList;
         }
         $scope.selPage = page;
         $scope.setData();
         $scope.isActivePage(page);
      };
      $scope.isActivePage = function (page) {
         return $scope.selPage == page;
      };
      $scope.Previous = function () {
         $scope.selectPage($scope.selPage - 1);
      }
      $scope.Next = function () {
         $scope.selectPage($scope.selPage + 1);
      };
          
      }, function error(response){
         console.log("error");
      });

      $scope.add = function(company){
         $scope.showAddAction = true;
         company_name = company;
      }

      $scope.addAction = function(){
         var i = 0;
         var encontrado = false;
         
         if($scope.num_action < 0 || $scope.num_action == null){
            alert("The number must be positive");
         }
         else{
         while(i < $scope.user_acction.length && !encontrado){
            if($scope.user_acction[i].company == company_name){
               encontrado = true;
               $scope.user_acction[i].number_acction +=$scope.user_acction[i].number_acction;
               $scope.user_acction[i].base += $scope.num_action*$scope.user_acction[i].current;

               $http({ 
                  url: './endpoint/updateAction.php',
                  method: 'POST',
                  headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                      username: username,
                      company: company_name,
                      acction: $scope.user_acction[i].number_acction,
                      base: $scope.user_acction[i].base
                  },
                }).then(function(response){
                })
            }
            i++;

         }
      }  
      }

      $scope.delete = function(company){
         $scope.showSubAction = true;
         company_name = company;
      }
      $scope.subAction=function(){
         var i = 0;
         var encontrado = false;
         if($scope.num_acction_sub < 0 || $scope.num_acction_sub == null){
            alert("The number must be positive");
         }
         else{
         while(i < $scope.user_acction.length && !encontrado){
            if($scope.user_acction[i].company == company_name){
               encontrado = true;
               if($scope.user_acction[i].number_acction >= $scope.num_acction_sub){
                  $scope.user_acction[i].number_acction -= $scope.num_acction_sub;
                  $scope.user_acction[i].base -= $scope.num_acction_sub*$scope.user_acction[i].current;
                  $scope.user_acction[i].profit -= $scope.num_acction_sub*$scope.user_acction[i].current;
                  TotalProfit -= $scope.num_acction_sub*$scope.user_acction[i].current; 
                  $http({ 
                     url: './endpoint/updateAction.php',
                     method: 'POST',
                     headers: {
                     'Content-Type': 'application/x-www-form-urlencoded'
                     },
                     data: {
                        username: username,
                        company: company,
                        acction: $scope.user_acction[i].number_acction,
                        base: $scope.user_acction[i].base
                     },
                  })
               }
               else{
                  alert("You can't subtract more actions than you have.");
               }
            }
            i++;
         }
      }
      }

      
      $timeout(initConsult, 3000);
      function initConsult(){
         var resultados=[];
         var cont = 0;
         var series=['open', 'high', 'low', 'close'];
         var labels=[];
         var datos=[];
         var contador=[];
         for(i in $scope.user_acction){
            var url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + $scope.user_acction[i].company 
            url += "&interval=30min"+ "&apikey=" + 'B565DEWCW6JTF829';
            $http.get(url).then(function(response) {
               cont++;
               resultados.push(response.data);
               if(cont == $scope.user_acction.length){
                  var j = 0;
                  
                  while(j < cont){
                     contador.push(j);
                     var open=[];
                     var close=[];
                     var high=[];
                     var low=[];
                     var label=[];
                     var z = 0;
                     var dia; 
                     for(k in resultados[j]["Time Series (30min)"]){
                        var fecha = new Date(k);
                        if(z == 0){
                          dia = fecha.getDate();
                          z++;
                        }
                        if(fecha.getDate() == dia){
                           label.unshift(k);
                           open.unshift(parseFloat(resultados[j]["Time Series (30min)"][k]["1. open"]));
                           high.unshift(parseFloat(resultados[j]["Time Series (30min)"][k]["2. high"]));
                           low.unshift(parseFloat(resultados[j]["Time Series (30min)"][k]["3. low"]));
                           close.unshift(parseFloat(resultados[j]["Time Series (30min)"][k]["4. close"]));
                        }
                     }
                     labels[j] = label;
                     datos[j]=[open, high, low, close];
                     j++;
                  }
                  $scope.series = series;
                  $scope.labels = labels;
                  $scope.data = datos;
                  $scope.options = { legend: { display: true } };
                  $scope.contador= contador;
               }
            });
         }
      }
});
