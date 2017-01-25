;(function (angular) {
  "use strict";

  	angular.module("proceduremaintenance")
        .component("proceduremaintenance", {

           	"templateUrl": "/js/proceduremaintenance/proceduremaintenance.html",
           	"controller" : ["$http", "$scope", "Session", "$state", "$rootScope", "DTOptionsBuilder", "DTColumnBuilder",

              function ($http, $scope, Session, $state, $rootScope, DTOptionsBuilder, DTColumnBuilder) {
                 var that = this;

                 this.collapsed = true;

                 this.toggleCollapse = function () {
                 
                   this.collapsed = !this.collapsed;
                 }

                 $http({method: "GET", url: domainName+"api/Procedure_Maintenance/?db_action_type=all"})
                    .then(function(response){
                      console.log(response);
                        that.pMaintenanceData = response.data;
                    });
               }
            ]
        });
}(window.angular));
