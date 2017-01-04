;(function (angular) {
  "use strict";

  angular.module("sidebar")
        .component("sidebar", {

           	"templateUrl": "/js/sidebar/sidebar.html",
           	"controller" : ["$rootScope", "$state", "$filter", "$interval",

           	function ($rootScope, $state, $filter, $interval) {

               var that = this;

               this.collapsed = true;

               this.toggleCollapse = function () {
               
                 this.collapsed = !this.collapsed;
               }
             }
          ]

        });
}(window.angular));
