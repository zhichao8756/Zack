/**
 * Created by bjwsl-001 on 2017/4/13.
 */

var app = angular.module('kaifanla', ['ionic']);

app.factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
  function ($rootScope, $browser, $q, $exceptionHandler) {
    var deferreds = {},
      methods = {},
      uuid = 0;

    function debounce(fn, delay, invokeApply) {
      var deferred = $q.defer(),
        promise = deferred.promise,
        skipApply = (angular.isDefined(invokeApply) && !invokeApply),
        timeoutId, cleanup,
        methodId, bouncing = false;

      // check we dont have this method already registered
      angular.forEach(methods, function (value, key) {
        if (angular.equals(methods[key].fn, fn)) {
          bouncing = true;
          methodId = key;
        }
      });

      // not bouncing, then register new instance
      if (!bouncing) {
        methodId = uuid++;
        methods[methodId] = {fn: fn};
      } else {
        // clear the old timeout
        deferreds[methods[methodId].timeoutId].reject('bounced');
        $browser.defer.cancel(methods[methodId].timeoutId);
      }

      var debounced = function () {
        // actually executing? clean method bank
        delete methods[methodId];

        try {
          deferred.resolve(fn());
        } catch (e) {
          deferred.reject(e);
          $exceptionHandler(e);
        }

        if (!skipApply) $rootScope.$apply();
      };

      timeoutId = $browser.defer(debounced, delay);

      // track id with method
      methods[methodId].timeoutId = timeoutId;

      cleanup = function (reason) {
        delete deferreds[promise.$$timeoutId];
      };

      promise.$$timeoutId = timeoutId;
      deferreds[timeoutId] = deferred;
      promise.then(cleanup, cleanup);

      return promise;
    }


    // similar to angular's $timeout cancel
    debounce.cancel = function (promise) {
      if (promise && promise.$$timeoutId in deferreds) {
        deferreds[promise.$$timeoutId].reject('canceled');
        return $browser.defer.cancel(promise.$$timeoutId);
      }
      return false;
    };

    return debounce;
  }
]);

//自定义服务
app.service('$customHttp', ['$http', '$ionicLoading',
  function ($http, $ionicLoading) {
    this.get = function (url, handleSucc) {

      $ionicLoading.show({
        template: 'loading...'
      })

      $http
        .get(url)
        .success(function (data) {
          $ionicLoading.hide();
          handleSucc(data);
        })
    }
  }])


//配置状态
app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('start', {
      url: '/kflStart',
      templateUrl: 'tpl/start.html'
    })
    .state('main', {
      url: '/kflMain',
      templateUrl: 'tpl/main.html',
      controller: 'mainCtrl'
    })
    .state('detail', {
      url: '/kflDetail/:id',
      templateUrl: 'tpl/detail.html',
      controller: 'detailCtrl'
    })
    .state('order', {
      url: '/kflOrder/:id',
      templateUrl: 'tpl/order.html',
      controller: 'orderCtrl'
    })
    .state('myOrder', {
      url: '/kflMyOrder',
      templateUrl: 'tpl/myOrder.html'
    })

  $urlRouterProvider.otherwise('/kflStart');
})


app.controller('parentCtrl', ['$scope', '$state',
  function ($scope, $state) {
    $scope.jump = function (desState, argument) {
      $state.go(desState, argument);
    }
  }])


app.controller('mainCtrl',
  ['$scope', '$customHttp', '$debounce',
    function ($scope, $customHttp, $debounce) {

      $scope.hasMore = true;
      $scope.inputTxt = {kw: ''};

      $customHttp.get(
        'data/dish_getbypage.php',
        function (data) {
          console.log(data);
          $scope.dishList = data;
        }
      )

      $scope.loadMore = function () {
        $customHttp.get(
          'data/dish_getbypage.php?start=' + $scope.dishList.length,
          function (data) {
            if (data.length < 5) {
              $scope.hasMore = false;
            }
            $scope.dishList = $scope.dishList.concat(data);
            $scope.$broadcast('scroll.infiniteScrollComplete')
          }
        )
      }

      $scope.$watch('inputTxt.kw', function () {

        $debounce(handleSearch, 300);

        //console.log($scope.inputTxt.kw);


      })
      handleSearch = function () {
        if ($scope.inputTxt.kw) {
          $customHttp.get(
            'data/dish_getbykw.php?kw=' + $scope.inputTxt.kw,
            function (data) {
              $scope.dishList = data;
            }
          )
        }
      }
    }

  ])

app.controller('detailCtrl',
  ['$scope', '$stateParams', '$customHttp',
    function ($scope, $stateParams, $customHttp) {
      //console.log($stateParams);
      $customHttp.get(
        'data/dish_getbyid.php?id=' + $stateParams.id,
        function (data) {
          //console.log(data)
          $scope.dish = data[0];
        }
      )
    }
  ])


app.controller('orderCtrl',
  ['$scope',
    '$stateParams',
    '$httpParamSerializerJQLike',
    '$customHttp',
    function ($scope,
              $stateParams,
              $httpParamSerializerJQLike,
              $customHttp) {
      $scope.order = {did: $stateParams.id};

      $scope.submitOrder = function () {

        var result = $httpParamSerializerJQLike($scope.order)
        $customHttp.get(
          'data/order_add.php?' + result,
          function (data) {
            console.log(data);
            if (data[0].msg = 'succ') {
              $scope.result = "下单成功，订单编号为"+data[0].oid;
            }
            else
            {
              $scope.result = "下单失败！";
            }
          }
        )
      }
    }
  ])







