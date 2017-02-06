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

                 $http({method: "GET", url: domainName+"api/proc_pricing_episode_dropdowns/"})
                    .then(function(response){
                        that.networks = response.data[0].table_Networks;
                        that.procedures = response.data[0].table_Procedures
                    });

                 this.subLinkFun = function(providerNpi, category){
                    //var url = 'http://localhost:2222/api/provider_pricing_breakdown_cpt/';
                    var url = domainName+'api/provider_pricing_breakdown_cpt/?ProviderNPI='+providerNpi+'&ProcedureID='+$scope.procedureId+'&NetworkID='+$scope.networkId+'&CostCategoryCode='+category+'&FacilityProviderNPI='+$scope.facilityNpi;
                    $rootScope.pro_pric_det_form_det = { 'providerNpi': providerNpi, 'category': category, 'procedureID': $scope.procedureId, 'networkID': $scope.networkId, 'url': url, 'facilityNPI': $scope.facilityNpi };
                    window.location.href = '/#!/providerpricingdetail';
                 }

                 if (typeof $state.params.data !== 'undefined' && $state.params.data !== '') {
                    var paramData = JSON.parse($state.params.data);
                    $scope.procedureId = JSON.stringify(paramData.ProcedureID);
                    $scope.networkId   = JSON.stringify(paramData.NetworkID);
                    $scope.facilityNpi   = paramData.FacilityNPI;
                    var url = domainName+'api/procedure_pricing_breakdown/?ProcedureID='+paramData.ProcedureID+'&NetworkID='+paramData.NetworkID+'&FacilityNPI='+paramData.FacilityNPI;
                    loadDatatable(url);
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
                        if (response.data.length > 0) {
                          vm.authorized = true;
                          that.resp = response.data;
                          $('#loadingDiv').hide();
                          $('#notFound').hide();
                        }else{
                          $('#loadingDiv').hide();
                          $('#notFound').show();
                        }
                    });
                  }
               }
            ]
        });
}(window.angular));
