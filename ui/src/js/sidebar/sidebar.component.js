;(function (angular) {
  "use strict";

  angular.module("sidebar")
        .component("sidebar", {

           	"templateUrl": "/js/sidebar/sidebar.html",
           	"controller" : ["$rootScope", "$state", "$filter", "$interval", "$scope", "$location",

           	function ($rootScope, $state, $filter, $interval, $scope, $location) {

               var that = this;

               this.collapsed = true;

               this.user_type = $rootScope.user.user_type;

               this.toggleCollapse = function () {
               
                 this.collapsed = !this.collapsed;
               }
               $scope.getActive = function (path) {
                    return location.href.indexOf(path) !== -1 ? 'active' : '';
                }
             }
          ]

        });
}(window.angular));
