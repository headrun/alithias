;(function (angular) {
  "use strict";

  	angular.module("procedurepricingdetail")
        .component("procedurepricingdetail", {

           	"templateUrl": "/js/procedurepricingdetail/procedurepricingdetail.html",
           	"controller" : ["$http", "$scope", "Session", "$state", "$rootScope", "DTOptionsBuilder", "DTColumnBuilder",

              function ($http, $scope, Session, $state, $rootScope, DTOptionsBuilder, DTColumnBuilder) {
                 var that = this;
                 var vm = this;

                 this.collapsed = true;
                 vm.authorized = false;

                 this.toggleCollapse = function () {
                 
                   this.collapsed = !this.collapsed;
                 }

                 $scope.submit = function(param){
                    that.ProcedureID = param.procedureId ? param.procedureId : '';
                    that.NetworkID = param.networkId ? param.networkId : '';
                    that.FacilityNPI = param.facilityNpi ? param.facilityNpi : '';
                    that.ProcedureCodeFilter = param.procedureCodeFilt ? param.procedureCodeFilt : '';

                    vm.authorized = true;
                    that.apiUrl = 'http://localhost:1122/api/procedure_pricing_breakdown/?ProcedureID='+that.ProcedureID+'&NetworkID='+that.NetworkID+'&FacilityNPI='+that.FacilityNPI+'&ProcedureCodeFilter='+that.ProcedureCodeFilter;
                    vm.dtOptions = DTOptionsBuilder.newOptions()
                       .withOption('ajax', {
                              url: that.apiUrl,
                              type: 'GET'
                           })
                       .withOption('processing', true)
                       .withOption('serverSide', false)
                       .withPaginationType('full_numbers');

                      vm.dtColumns = [
                          DTColumnBuilder.newColumn('col_6').withTitle('NPI'),
                          DTColumnBuilder.newColumn('col_1').withTitle('Provider'),
                          DTColumnBuilder.newColumn('col_2').withTitle('City'),
                          DTColumnBuilder.newColumn('col_3').withTitle('Provider Type'),
                          DTColumnBuilder.newColumn('col_7').withTitle('Episode Cost'),
                          DTColumnBuilder.newColumn('col_4').withTitle('sample Ids').notVisible(),
                          DTColumnBuilder.newColumn('col_5').withTitle('sample ids').notVisible(),
                          DTColumnBuilder.newColumn('col_8').withTitle('sample ids').notVisible(),
                          DTColumnBuilder.newColumn('col_9').withTitle('sample ids').notVisible(),
                          DTColumnBuilder.newColumn('col_10').withTitle('sample ids').notVisible(),
                          DTColumnBuilder.newColumn('col_11').withTitle('sample ids').notVisible(),
                      ];
                  }
               }
            ]
        });
}(window.angular));
