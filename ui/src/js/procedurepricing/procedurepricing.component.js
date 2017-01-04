;(function (angular) {
  "use strict";

  	angular.module("procedurepricing")
        .component("procedurepricing", {

           	"templateUrl": "/js/procedurepricing/procedurepricing.html",
           	"controller" : ["Session", "$state", "$rootScope",

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
