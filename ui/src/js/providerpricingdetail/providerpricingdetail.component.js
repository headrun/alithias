;(function (angular) {
  "use strict";

  	angular.module("providerpricingdetail")
        .component("providerpricingdetail", {

           	"templateUrl": "/js/providerpricingdetail/providerpricingdetail.html",
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
                    that.providerNpi = param.procedureId ? param.providerNpi : '';

                    vm.authorized = true;
                    that.apiUrl = 'http://localhost:1122/api/procedure_pricing_breakdown_cpt/?ProviderID='+that.providerNpi;
                    vm.dtOptions = DTOptionsBuilder.newOptions()
                       .withOption('ajax', {
                              url: that.apiUrl,
                              type: 'GET'
                           })
                       .withOption('processing', true)
                       .withOption('serverSide', false)
                       .withPaginationType('full_numbers');

                      vm.dtColumns = [
                          DTColumnBuilder.newColumn('col_1').withTitle('Provider'),
                          DTColumnBuilder.newColumn('col_2').withTitle('City'),
                          DTColumnBuilder.newColumn('col_3').withTitle('Provider Type'),
                          DTColumnBuilder.newColumn('col_4').withTitle('Facility Type'),
                          DTColumnBuilder.newColumn('col_5').withTitle('sample name'),
                      ];
                  }
               }
            ]
        });
}(window.angular));
