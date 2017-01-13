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
                    that.ProcedureID = param.procedureId ? param.procedureId : '';
                    that.NetworkID = param.networkId ? param.networkId : '';
                    that.CostCategoryCode = param.costcategorycode ? param.costcategorycode : '';
                    that.FacilityProviderNPI = param.facelityprovidernpi ? param.facelityprovidernpi : '';

                    vm.authorized = true;
                    that.apiUrl = 'http://localhost:1122/api/provider_pricing_breakdown_cpt/?ProviderID='+that.providerNpi+'&ProcedureID='+that.ProcedureID+'&NetworkID='+that.NetworkID+'&CostCategoryCode='+that.CostCategoryCode+'&FacilityProviderNPI='+that.FacilityProviderNPI;
                    vm.dtOptions = DTOptionsBuilder.newOptions()
                       .withOption('ajax', {
                              url: that.apiUrl,
                              type: 'GET'
                           })
                       .withOption('processing', true)
                       .withOption('serverSide', false)
                       .withPaginationType('full_numbers');

                      vm.dtColumns = [
                          DTColumnBuilder.newColumn('col_9').withTitle('Code'),
                          DTColumnBuilder.newColumn('col_11').withTitle('Code Description'),
                          DTColumnBuilder.newColumn('col_7').withTitle('Episode Count'),
                          DTColumnBuilder.newColumn('col_12').withTitle('Retail Price'),
                          DTColumnBuilder.newColumn('col_13').withTitle('Price Date'),
                          DTColumnBuilder.newColumn('col_15').withTitle('Price Source'),
                          DTColumnBuilder.newColumn('col_17').withTitle('Discount Percentage'),
                          DTColumnBuilder.newColumn('col_18').withTitle('Discounted Amount'),
                          DTColumnBuilder.newColumn('col_20').withTitle('Discount Source'),
                          DTColumnBuilder.newColumn('col_22').withTitle('Code Cost Factor'),
                          DTColumnBuilder.newColumn('col_18').withTitle('Factored Cost'),
                          DTColumnBuilder.newColumn('col_1').withTitle('test_1').notVisible(),
                          DTColumnBuilder.newColumn('col_2').withTitle('test_2').notVisible(),
                          DTColumnBuilder.newColumn('col_3').withTitle('test_3').notVisible(),
                          DTColumnBuilder.newColumn('col_4').withTitle('test_4').notVisible(),
                          DTColumnBuilder.newColumn('col_5').withTitle('test_5').notVisible(),
                          DTColumnBuilder.newColumn('col_6').withTitle('test_6').notVisible(),
                          DTColumnBuilder.newColumn('col_8').withTitle('test_7').notVisible(),
                          DTColumnBuilder.newColumn('col_10').withTitle('test_8').notVisible(),
                          DTColumnBuilder.newColumn('col_14').withTitle('test_9').notVisible(),
                          DTColumnBuilder.newColumn('col_16').withTitle('test_10').notVisible(),
                          DTColumnBuilder.newColumn('col_19').withTitle('test_11').notVisible(),
                          DTColumnBuilder.newColumn('col_21').withTitle('test_12').notVisible(),
                          DTColumnBuilder.newColumn('col_23').withTitle('test_13').notVisible(),
                          DTColumnBuilder.newColumn('col_24').withTitle('test_14').notVisible(),
                          DTColumnBuilder.newColumn('col_25').withTitle('test_15').notVisible(),
                      ];
                  }
               }
            ]
        });
}(window.angular));
