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
                    });

                 this.subLinkFun = function(ProcedureID, FacilityNPI, PatientID, firstDateOfService){
                    var url = domainName+'api/epi_rev_code/?ProcedureID='+ProcedureID+'&FacilityNPI='+FacilityNPI+'&PatientID='+PatientID+'&firstDateOfService='+firstDateOfService;
                    $rootScope.epi_rev_form_det = { 'ProcedureID': ProcedureID,
                                                      'FacilityNPI': FacilityNPI,
                                                      'PatientID': PatientID,
                                                      'firstDateOfService': firstDateOfService,
                                                      'url': url
                                                    };
                    window.location.href = '/#!/episoderevenuecode';
                 }

                 $scope.submit = function(param){
                    $('#loadingDiv').show();
                    that.networkId = param.networkId ? param.networkId : '';

                    vm.authorized = true;
                    that.apiUrl = domainName+'api/procedure_pricing_episode/?networkId='+that.networkId;

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
