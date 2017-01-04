;(function (angular) {
  "use strict";

  // If User is not logged in, he will be redirected to LOGIN_STATE
  var LOGIN_STATE = "login",

      // Once the user is logged in using the form he will be redirected
      // to LOGIN_REDIRECT_STATE
      LOGIN_REDIRECT_STATE = "dashboard";

  var app = angular.module("bootstrap")
         app.config(["$locationProvider", "$stateProvider",
                  "$httpProvider", "$urlRouterProvider",

           function ($lp, $sp, $hp, $urp) {

             $lp.hashPrefix('!');

             /* ALL YOUR CONFIG GOES HERE */

             $sp.state("login", {

               "url"     : "/login",
               "template": "<login></login>"
             }).state("dashboard", {

               "url"     : "/",
               "template": "<dashboard></dashboard>",

               /*
                * If authRequired is true,
                * login check will be done before loadin the page
                * if not authenticated, he will be redirected to LOGIN_PAGE
               */
               "authRequired": true
             });

             $urp.otherwise("/");

             //$hp.defaults.xsrfCookieName = "csrftoken";
             //$hp.defaults.xsrfHeaderName = "X-CSRFToken";
           }
         ]).run(["$rootScope", "$state",
                 "Auth", "AUTH_EVENTS",

          function ($rootScope, $state, Auth, AUTH_EVENTS) {

            // DO NOT EDIT THIS FUNCTION

            var skipAsync = false;

            $rootScope.$on("$stateChangeStart", function (event, next, params) {

              if (skipAsync) {

                skipAsync = false;
                return;
              }

              if (next.authRequired) {

                event.preventDefault();

                ;(function (thisNext) {

                  Auth.status().then(function (resp) {

                    if (thisNext.name !== next.name) {

                      return;
                    }

                    if (!resp.userName) {

                      $rootScope.$broadcast(AUTH_EVENTS.unAuthorized);
                      return;
                    }

                    skipAsync = true;
                    $state.go(thisNext.name, params);
                  });
                }(next, params));
              }
            });

            $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {

              $state.go(LOGIN_REDIRECT_STATE, {"location": "replace"});
            });

            function goToLogin () {

              $state.go(LOGIN_STATE, {"location": "replace"});
            }

            $rootScope.$on(AUTH_EVENTS.unAuthorized, goToLogin);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, goToLogin);
          }
         ]);
   app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
  }])

  app.provider('myCSRF',[function(){
  var headerName = 'X-CSRFToken';
  var cookieName = 'csrftoken';
  var allowedMethods = ['GET', 'POST'];

  this.setHeaderName = function(n) {
    headerName = n;
  }
  this.setCookieName = function(n) {
    cookieName = n;
  }
  this.setAllowedMethods = function(n) {
    allowedMethods = n;
  }
  this.$get = ['$cookies', function($cookies){
    return {
      'request': function(config) {
        if(allowedMethods.indexOf(config.method) === -1) {
          // do something on success
          config.headers[headerName] = $cookies[cookieName];
        }
        return config;
      }
    }
  }];
}]).config(function($httpProvider) {
  $httpProvider.interceptors.push('myCSRF');
}); 
}(window.angular));
