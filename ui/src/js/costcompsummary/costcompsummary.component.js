;(function (angular) {
  "use strict";

  	angular.module("costcompsummary")
        .component("costcompsummary", {

           	"templateUrl": "/js/costcompsummary/costcompsummary.html",
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

                 $scope.submit = function(param){
                    $('#loadingDiv').show();
                    that.companyId = param.companyId ? param.companyId : '';
                    that.sourceZip = param.sourceZip ? param.sourceZip : '';
                    that.milesRadius = param.milesRadius ? param.milesRadius : '';
                    that.year = param.year ? param.year : '';

                    that.apiUrl = domainName+'api/cost_comparison_summary/?CompanyID='+that.companyId+'&SourceZIP='+that.sourceZip+'&MilesRadius='+that.milesRadius+'&Year='+that.year;

                    $http({method: "GET", url: that.apiUrl})
                    .then(function(response){
                        vm.authorized = true;
                        //console.log(response.data[0]);
                        that.costData = response.data[0];
                        console.log(that.costData);
                        $('#loadingDiv').hide();
                    });
                  }
	            }	
           	]
        });
}(window.angular));
