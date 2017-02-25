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
                        that.states = response.data[0].states;
                    });

                  that.getRelCities = function(){
                    that.state = $scope.state;
                    if (that.state !== '') {
                        $http({method: "GET", url: domainName+"api/proc_episode_get_city/?state="+that.state})
                          .then(function(response){
                              console.log(response.data[0]);
                              if (response.statusText == "OK") {
                                that.cities = response.data[0].cities;
                              }
                        });
                    }
                  }

                  that.getRelNpi = function(){
                    that.pName = $scope.providerName;
                    that.city = $scope.city;
                    that.state = $scope.state;
                    if (that.pName !== '') {
                        $http({method: "GET", url: domainName+"api/proc_episode_npi/?ProviderName="+that.pName+"&PracticeAddressCity="+that.city+"&state="+that.state})
                          .then(function(response){
                              console.log(response.data[0].table_Providers);
                              if (response.statusText == "OK") {
                                that.fNpi = response.data[0].provider_npi;
                              }
                        });
                    }
                  }

                  that.getRelProvNames = function(){
                    that.city = $scope.city;
                    that.state = $scope.state;
                    if (that.pName !== '') {
                        $http({method: "GET", url: domainName+"api/proce_episode_get_provider/?state="+that.state+"&PracticeAddressCity="+that.city})
                          .then(function(response){
                              if (response.statusText == "OK") {
                                that.providerName = response.data[0].provider_name;
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

                  that.excelDownload = function(){
                    var excelUrl = domainName+'api/procedure_pricing_episode/?NetworkID='+
                                  $scope.networkId+'&ProcedureID='+
                                  $scope.procedureId+'&FacilityNPI='+
                                  $scope.facelitynpi+"&file_type=excel&procName"+
                                  $('#procedureId :selected').text()+"&networkName="+
                                  $('#networkId :selected').text()+"&state="+
                                  $('#state :selected').text()+"&city="+
                                  $scope.city+"&providerName="+$scope.providerName;

                    window.location = excelUrl;
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
                          that.pdfUrl = domainName+'api/procedure_pricing_episode/?NetworkID='+
                                  $scope.networkId+'&ProcedureID='+
                                  $scope.procedureId+'&FacilityNPI='+
                                  $scope.facelitynpi+"&file_type=pdf&procName"+
                                  $('#procedureId :selected').text()+"&networkName="+
                                  $('#networkId :selected').text()+"&state="+
                                  $('#state :selected').text()+"&city="+
                                  $scope.city+"&providerName="+$scope.providerName;
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
