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

                    vm.authorized = true;
                    that.apiUrl = domainName+'api/procedure_pricing_episode/?networkId='+that.networkId+'&ProcedureID='+that.procedureId+'&FacilityNPI='+that.facelitynpi;

                    $http({method: "GET", url: that.apiUrl})
                    .then(function(response){
                        console.log(response);
                        that.NetworkData = response.data;
                        $('#loadingDiv').hide();
                    });
                  }
	            }	
           	]
        });
}(window.angular));
