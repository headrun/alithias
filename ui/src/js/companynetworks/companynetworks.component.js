;(function (angular) {
  "use strict";

  	angular.module("companynetworks")
        .component("companynetworks", {

           	"templateUrl": "/js/companynetworks/companynetworks.html",
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

                 $http({method: "GET", url: "http://localhost:1122/api/cmp_network_by_state_dropdowns/"})
                    .then(function(response){
                        that.companies = response.data[0].table_Companies;
                    });

                 $scope.submit = function(param){
                    $('#loadingDiv').show();
                    that.companyId = param.companyId ? param.companyId : '';

                    vm.authorized = true;
                    that.apiUrl = 'http://localhost:1122/api/company_network_by_state_new/?CompanyID='+that.companyId;

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
