/**
 * Created by bjwsl-001 on 2017/4/6.
 */

var app = angular.module('kfl', ['ng', 'ngRoute']);


//配置路由词典
app.config(function ($routeProvider) {

  $routeProvider
    .when('/kflStart', {
      templateUrl: 'tpl/start.html'
    })
    .when('/kflMain', {
      templateUrl: 'tpl/main.html',
      controller: 'mainCtrl'
    })
    .when('/kflDetail/:id', {
      templateUrl: 'tpl/detail.html',
      controller: 'detailCtrl'
    })
    .when('/kflOrder/:did', {
      templateUrl: 'tpl/order.html',
      controller: 'orderCtrl'
    })
    .when('/kflMyOrder', {
      templateUrl: 'tpl/myOrder.html'
    })
    .otherwise({redirectTo: '/kflStart'})

});

app.controller('parentCtrl', ['$scope', '$location',
  function ($scope, $location) {
    $scope.jump = function (desPath) {
      $location.path(desPath);
    }
  }
]);


app.controller('mainCtrl', ['$scope', '$http',
  function ($scope, $http) {
    //console.log('it is a test');
    $scope.hasMore = true;
    $http
      .get('data/dish_getbypage.php')
      .success(function (data) {
        console.log(data);
        $scope.dishList = data;

      })

    $scope.loadMore = function () {
      $http
        .get('data/dish_getbypage.php?start='
        + $scope.dishList.length)
        .success(function (data) {
          if (data.length < 5) {
            $scope.hasMore = false;
          }
          $scope.dishList = $scope.dishList.concat(data);
        })
    }

    $scope.$watch('kw', function () {
      //console.log($scope.kw);
      if ($scope.kw) {
        $http
          .get('data/dish_getbykw.php?kw=' + $scope.kw)
          .success(function (data) {
            //console.log(data);
            $scope.dishList = data;
          })
      }

    });
  }
]);


app.controller('detailCtrl',
  ['$scope', '$routeParams', '$http',
    function ($scope, $routeParams, $http) {
      //console.log($routeParams);
      $http
        .get('data/dish_getbyid.php?id=' + $routeParams.id)
        .success(function (data) {
          //console.log(data);
          $scope.dish = data[0];
        })
    }
  ]);

app.controller('orderCtrl',
  ['$scope', '$http', '$routeParams','$httpParamSerializerJQLike',
    function ($scope, $http, $routeParams,$httpParamSerializerJQLike) {
      //console.log($routeParams);

      $scope.order = {did:$routeParams.did};

      $scope.submitOrder = function () {
        var result = $httpParamSerializerJQLike($scope.order)
        $http
          .get('data/order_add.php?'+result)
          .success(function (data) {
            console.log(data);
            if(data.length > 0)
            {
              if(data[0].msg == 'succ')
              {
                $scope.succMsg = "下单成功，订单编号为:"+data[0].oid;
                sessionStorage.setItem('phone',$scope.order.phone);
              }
              else
              {
                $scope.errMsg = "下单失败";
              }
            }

          })
      }
    }])

