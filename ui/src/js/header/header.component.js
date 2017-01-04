;(function (angular) {
  "use strict";

  angular.module("header")
         .component("header", {
           "templateUrl": "/js/header/header.html",
           "controller" : ["$rootScope", "$state", "$filter", "$interval",

             function ($rootScope, $state, $filter, $interval) {

               var that = this;

               this.collapsed = true;

               this.toggleCollapse = function () {
               
                 this.collapsed = !this.collapsed;
               }
             }
           ],
           "bindings": {

             "tabsOrder": "<",
             "tabs"     : "<",
             "activeTab": "<"
           }
         });
}(window.angular));
