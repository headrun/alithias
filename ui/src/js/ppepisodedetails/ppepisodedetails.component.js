;(function (angular) {
  "use strict";

  	angular.module("ppepisodedetails")
        .component("ppepisodedetails", {

           	"templateUrl": "/js/ppepisodedetails/ppepisodedetails.html",
           	"controller" : [ "$http", "$scope", "Session", "$state", "$rootScope", "DTOptionsBuilder", "DTColumnBuilder",
           	
           		function ($http, $scope, Session, $state, $rootScope, DTOptionsBuilder, DTColumnBuilder) {

	              var that = this;
                   var vm = this;

                   this.collapsed = true;
                   that.TableData = [];
                   vm.authorized = false;

                   this.toggleCollapse = function () {

                     this.collapsed = !this.collapsed;
                   }

                 $http({method: "GET", url: "http://localhost:1122/api/proc_pricing_episode_dropdowns/"})
                    .then(function(response){
                        that.networks = response.data[0].table_Networks;
                    });

                 $scope.submit = function(param){
                    $('#loadingDiv').show();
                    that.networkId = param.networkId ? param.networkId : '';

                    vm.authorized = true;
                    that.apiUrl = 'http://localhost:1122/api/procedure_pricing_episode/?CompanyID='+that.networkId;

                    $http({method: "GET", url: that.apiUrl})
                    .then(function(response){
                        //console.log(response);
                        that.companyData = response.data;
                        $('#loadingDiv').hide();
                    });
                  }
	            }	
           	]
        });
}(window.angular));
