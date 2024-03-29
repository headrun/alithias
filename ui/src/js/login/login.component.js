;(function (angular) {
  "use strict";

  angular.module("login")
         .component("login", {

           "templateUrl" : "/js/login/login.html",
           "controller"  : ["$rootScope", "Auth", "AUTH_EVENTS", "$state",

             function ($rootScope, Auth, AUTH_EVENTS, $state) {

              var that = this;

              this.credentials = {

                "username": "",
                "password": ""
              };

              this.errorMsg = "";
              this.loadingText = "Submit";

              this.onSubmit = function (credentials) {

                this.loadingText = "Verifying...";
                this.viewSubmit = "disabled";

                Auth.login(credentials).then(function () {
                  $state.go("dashboard");
                  $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                }, function () {

                  that.loadingText = "Submit";
                  that.errorMsg = "Invalid Credentials";
                  that.viewSubmit = "";
                });
              };
            }]
        });

}(window.angular));
