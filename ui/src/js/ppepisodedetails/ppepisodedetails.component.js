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

                 $http({method: "GET", url: domainName+"api/proc_pricing_episode_dropdowns/"})
                    .then(function(response){
                        that.networks = response.data[0].table_Networks;
                        that.procedures = response.data[0].table_Procedures
                    });

                 if($rootScope.pp_epi_form_det != '' && typeof($rootScope.pp_epi_form_det) != 'undefined'){
                    console.log($rootScope.pp_epi_form_det);
                    $('#loadingDiv').show();

                    $scope.procedureId = $rootScope.pp_epi_form_det.ProcedureID;
                    $scope.facelitynpi = $rootScope.pp_epi_form_det.FacilityNPI;
                    $scope.networkId = $rootScope.pp_epi_form_det.NetworkID;
                    loadDatatable($rootScope.pp_epi_form_det.url);
                 }   

                 this.subLinkFun = function(FacilityNPI, PatientID, firstDateOfService){
                    var url = domainName+'api/epi_rev_code/?ProcedureID='+$scope.procedureId+'&FacilityNPI='+FacilityNPI+'&PatientID='+PatientID+'&firstDateOfService='+firstDateOfService;
                    $rootScope.epi_rev_form_det = { 'ProcedureID': $scope.procedureId,
                                                      'FacilityNPI': FacilityNPI,
                                                      'PatientID': PatientID,
                                                      'firstDateOfService': firstDateOfService,
                                                      'url': url
                                                    };
                    window.location.href = '/#!/episoderevenuecode';
                 }

                 this.linkToProvider = function(providerNPI, costCategory){
                    var url = domainName+'api/provider_pricing_breakdown_cpt/?ProviderNPI='+providerNPI+'&ProcedureID='+$scope.procedureId+'&NetworkID='+$scope.networkId+'&CostCategoryCode='+costCategory+'&FacilityProviderNPI='+$scope.facelitynpi;
                    $rootScope.pro_pric_det_form_det = { 'providerNpi': providerNPI, 'category': costCategory, 'procedureID': $scope.procedureId, 'networkID': $scope.networkId, 'url': url, 'facilityNPI': $scope.facelitynpi };
                    window.location.href = '/#!/providerpricingdetail';
                 }

                 $scope.submit = function(){
                    $('#loadingDiv').show();
                    that.networkId = $scope.networkId ? $scope.networkId : '';
                    that.procedureId = $scope.procedureId ? $scope.procedureId : '';
                    that.facelitynpi = $scope.facelitynpi ? $scope.facelitynpi : '';

                    that.apiUrl = domainName+'api/procedure_pricing_episode/?NetworkID='+that.networkId+'&ProcedureID='+that.procedureId+'&FacilityNPI='+that.facelitynpi;
                    loadDatatable(that.apiUrl);
                  }

                function loadDatatable(url){
                  $http({method: "GET", url: url})
                    .then(function(response){
                        console.log(response);
                        if (response.data.length > 0) {
                          vm.authorized = true;
                          that.NetworkData = response.data;
                          $('#loadingDiv').hide(); 
                          $('#notFound').hide(); 
                        }else{
                          $('#notFound').show();
                          $('#loadingDiv').hide(); 
                        }
                        
                    });
                }  

	            }	
           	]
        });
}(window.angular));
