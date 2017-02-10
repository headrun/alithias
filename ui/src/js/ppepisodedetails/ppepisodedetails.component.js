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
                        that.procedures = response.data[0].table_Procedures;
                        that.providerName = response.data[0].table_Providers;
                    });

                  that.getRelCities = function(){
                    that.pName = $scope.providerName;
                    console.log(that.pName);
                    if (that.pName !== '') {
                        $http({method: "GET", url: domainName+"api/proc_episode_city/?ProviderName="+that.pName})
                          .then(function(response){
                              console.log(response.data[0].table_Providers);
                              if (response.statusText == "OK") {
                                that.cities = response.data[0].table_Providers;
                              }
                        });
                    }
                  }

                  that.getRelNpi = function(){
                    that.pName = $scope.providerName;
                    that.city = $scope.city;
                    if (that.pName !== '') {
                        $http({method: "GET", url: domainName+"api/proc_episode_npi/?ProviderName="+that.pName+"&PracticeAddressCity="+that.city})
                          .then(function(response){
                              console.log(response.data[0].table_Providers);
                              if (response.statusText == "OK") {
                                that.fNpi = response.data[0].table_Providers;
                              }
                        });
                    }
                  }

                 if (typeof $state.params.data !== 'undefined' && $state.params.data !== '') {
                    var paramData = JSON.parse($state.params.data);
                    $('#loadingDiv').show();
                    $scope.procedureId = JSON.stringify(paramData.ProcedureID);
                    $scope.networkId   = JSON.stringify(paramData.NetworkID);
                    $scope.facelitynpi   = paramData.FacilityNPI;
                    var url = domainName+'api/procedure_pricing_episode/?ProcedureID='+paramData.ProcedureID+'&NetworkID='+paramData.NetworkID+'&FacilityNPI='+paramData.FacilityNPI;
                    loadDatatable(url);
                 }   

                 $scope.submit = function(){
                    $('#loadingDiv').show();
                    that.networkId = $scope.networkId ? $scope.networkId : '';
                    that.procedureId = $scope.procedureId ? $scope.procedureId : '';
                    that.facelitynpi = $scope.facelitynpi ? $scope.facelitynpi : '';

                    that.apiUrl = domainName+'api/procedure_pricing_episode/?NetworkID='+that.networkId+'&ProcedureID='+that.procedureId+'&FacilityNPI='+that.facelitynpi;
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
