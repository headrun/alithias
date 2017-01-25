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

                 this.subLinkFun = function(providerNpi, category){
                    //var url = 'http://localhost:2222/api/provider_pricing_breakdown_cpt/';
                    var url = domainName+'api/provider_pricing_breakdown_cpt/?ProviderNPI='+providerNpi+'&ProcedureID='+$scope.procedureId+'&NetworkID='+$scope.networkId+'&CostCategoryCode='+category+'&FacilityProviderNPI='+$scope.facilityNpi;
                    $rootScope.pro_pric_det_form_det = { 'providerNpi': providerNpi, 'category': category, 'procedureID': $scope.procedureId, 'networkID': $scope.networkId, 'url': url, 'facilityNPI': $scope.facilityNpi };
                    window.location.href = '/#!/providerpricingdetail';
                 }

                 if($rootScope.pro_pric_det_form_det != '' && typeof($rootScope.pro_pric_det_form_det) != 'undefined'){
                    console.log($rootScope.pro_pric_det_form_det);
                    $scope.procedureId = $rootScope.pro_pric_det_form_det.ProcedureID;
                    $scope.networkId   = $rootScope.pro_pric_det_form_det.NetworkID;
                    $scope.facilityNpi   = $rootScope.pro_pric_det_form_det.FacilityNPI;
                    loadDatatable($rootScope.pro_pric_det_form_det.url);
                 }

                 $scope.submit = function(){
                    $('#loadingDiv').show();
                    that.ProcedureID = $scope.procedureId ? $scope.procedureId : '';
                    that.NetworkID = $scope.networkId ? $scope.networkId : '';
                    that.FacilityNPI = $scope.facilityNpi ? $scope.facilityNpi : '';
                    that.ProcedureCodeFilter = $scope.procedureCodeFilt ? $scope.procedureCodeFilt : '';

                    that.apiUrl = domainName+'api/procedure_pricing_breakdown/?ProcedureID='+that.ProcedureID+'&NetworkID='+that.NetworkID+'&FacilityNPI='+that.FacilityNPI+'&ProcedureCodeFilter='+that.ProcedureCodeFilter;
                    loadDatatable(that.apiUrl);
                    /*vm.dtOptions = DTOptionsBuilder.newOptions()
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
                      ];*/
                  }

                  function loadDatatable(url){
                    $http({method: "GET", url: url})
                    .then(function(response){
                        vm.authorized = true;
                        console.log(response);
                        that.resp = response.data;
                        $('#loadingDiv').hide();
                    });
                  }
               }
            ]
        });
}(window.angular));
