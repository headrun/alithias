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

                 $scope.total = '';
                 this.toggleCollapse = function () {
                 
                   this.collapsed = !this.collapsed;
                 }

                 $http({method: "GET", url: domainName+"api/proc_pricing_episode_dropdowns/"})
                    .then(function(response){
                        that.networks = response.data[0].table_Networks;
                        that.procedures = response.data[0].table_Procedures
                    });

                 if($rootScope.pro_pric_det_form_det != '' && typeof($rootScope.pro_pric_det_form_det) != 'undefined'){
                    console.log($rootScope.pro_pric_det_form_det);
                    $('#loadingDiv').show();
                    $scope.providerNpi = $rootScope.pro_pric_det_form_det.providerNpi;
                    $scope.procedureId = $rootScope.pro_pric_det_form_det.procedureID;
                    $scope.networkId   = $rootScope.pro_pric_det_form_det.networkID;
                    $scope.costcategorycode = $rootScope.pro_pric_det_form_det.category;
                    $scope.facelityprovidernpi = $rootScope.pro_pric_det_form_det.facilityNPI;
                    loadDatatable($rootScope.pro_pric_det_form_det.url);
                 }

                 $scope.submit = function(){
                    $('#loadingDiv').show();
                    that.providerNpi = $scope.providerNpi ? $scope.providerNpi : '';
                    that.ProcedureID = $scope.procedureId ? $scope.procedureId : '';
                    that.NetworkID = $scope.networkId ? $scope.networkId : '';
                    that.CostCategoryCode = $scope.costcategorycode ? $scope.costcategorycode : '';
                    that.FacilityProviderNPI = $scope.facelityprovidernpi ? $scope.facelityprovidernpi : '';

                    that.apiUrl = domainName+'api/provider_pricing_breakdown_cpt/?ProviderNPI='+that.providerNpi+'&ProcedureID='+that.ProcedureID+'&NetworkID='+that.NetworkID+'&CostCategoryCode='+that.CostCategoryCode+'&FacilityProviderNPI='+that.FacilityProviderNPI;
                    loadDatatable(that.apiUrl);
                  }

                  that.printDiv = function(divName) {
                      var w=window.open();
                      w.document.write($('#'+divName).html());
                      w.print();
                      w.close();
                  }

                  function loadDatatable(url){

                    $http({method: "GET", url: url})
                    .then(function(response){
                        console.log(response);
                        if (response.data.data.length > 0) {
                          vm.authorized = true;
                          that.resp = response.data;
                          $('#loadingDiv').hide();
                          $('#notFound').hide();
                        }else{
                          $('#loadingDiv').hide();
                          $('#notFound').show();
                        }
                    });
                    /*vm.dtOptions = DTOptionsBuilder.newOptions()
                       .withOption('ajax', {
                              url: url,
                              type: 'GET'
                           })
                       .withDataProp('data')
                       .withOption('processing', true)
                       .withOption('serverSide', true)
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
                          DTColumnBuilder.newColumn('col_24').withTitle('Factored Cost'),
                          DTColumnBuilder.newColumn('total').withTitle('Total').renderWith(function(data, type, full, meta) {
                                vm.total = full.total;
                                return vm.total;
                            }).notVisible(),
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
                          //DTColumnBuilder.newColumn('col_25').withTitle('test_15').notVisible(),
                      ];
                      return;*/


                  }
               }
            ]
        });
}(window.angular));
