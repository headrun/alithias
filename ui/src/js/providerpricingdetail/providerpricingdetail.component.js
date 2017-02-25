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

                 if (typeof $state.params.data !== 'undefined' && $state.params.data !== '') {
                    var paramData = JSON.parse($state.params.data);
                    $('#loadingDiv').show();
                    $scope.procedureId = JSON.stringify(paramData.ProcedureID);
                    $scope.networkId   = JSON.stringify(paramData.NetworkID);
                    $scope.providerNpi   = paramData.ProviderNPI;
                    $scope.facelityprovidernpi   = paramData.FacilityProviderNPI;
                    $scope.costcategorycode   = paramData.CostCategoryCode;
                    var url = domainName+'api/provider_pricing_breakdown_cpt/?ProviderNPI='+$scope.providerNpi+'&ProcedureID='+$scope.procedureId+'&NetworkID='+$scope.networkId+'&CostCategoryCode='+$scope.costcategorycode+'&FacilityProviderNPI='+$scope.facelityprovidernpi;
                    loadDatatable(url);
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

                  that.excelDownload = function(){
                    var excelUrl = domainName+'api/provider_pricing_breakdown_cpt/?ProviderNPI='+
                                  $scope.providerNpi+'&ProcedureID='+
                                  $scope.procedureId+'&NetworkID='+
                                  $scope.networkId+'&CostCategoryCode='+
                                  $scope.costcategorycode+'&FacilityProviderNPI='+
                                  $scope.facelityprovidernpi+"&file_type=excel&procName"+
                                  $('#procedureId :selected').text()+"&networkName="+
                                  $('#networkId :selected').text();

                    window.location = excelUrl;
                  }

                  function loadDatatable(url){

                    $http({method: "GET", url: url})
                    .then(function(response){
                        console.log(response);
                        if (response.data.data.length > 0) {
                          vm.authorized = true;
                          that.resp = response.data;
                          that.pdfUrl = domainName+'api/provider_pricing_breakdown_cpt/?ProviderNPI='+
                                  $scope.providerNpi+'&ProcedureID='+
                                  $scope.procedureId+'&NetworkID='+
                                  $scope.networkId+'&CostCategoryCode='+
                                  $scope.costcategorycode+'&FacilityProviderNPI='+
                                  $scope.facelityprovidernpi+"&file_type=pdf&procName"+
                                  $('#procedureId :selected').text()+"&networkName="+
                                  $('#networkId :selected').text();
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
