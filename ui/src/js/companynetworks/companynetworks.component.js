;(function (angular) {
  "use strict";

  	angular.module("companynetworks")
        .component("companynetworks", {

           	"templateUrl": "/js/companynetworks/companynetworks.html",
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
