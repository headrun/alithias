;(function (angular) {
  "use strict";

  	angular.module("episoderevenuecode")
        .component("episoderevenuecode", {

           	"templateUrl": "/js/episoderevenuecode/episoderevenuecode.html",
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

                 if (typeof $state.params.data !== 'undefined' && $state.params.data !== '') {
                    var paramData = JSON.parse($state.params.data);
                    $('#loadingDiv').show();
                    $scope.procedureId = paramData.ProcedureID;
                    $scope.facilityNpi = paramData.FacilityNPI;
                    $scope.patientID = paramData.PatientID;
                    $scope.firstDateOfService = paramData.firstDateOfService;
                    var url = domainName+'api/epi_rev_code/?ProcedureID='+$scope.procedureId+'&FacilityNPI='+$scope.facilityNpi+'&PatientID='+$scope.patientID+'&firstDateOfService='+$scope.firstDateOfService;
                    loadDatatable(url);
                  }

                 $scope.submit = function(){
                    $('#loadingDiv').show();
                    that.ProcedureID = $scope.procedureId ? $scope.procedureId : '';
                    that.FacilityNPI = $scope.facilityNpi ? $scope.facilityNpi : '';
                    that.PatientID = $scope.patientID ? $scope.patientID : '';
                    that.firstDateOfService = $scope.firstDateOfService ? $scope.firstDateOfService : '';

                    that.apiUrl = domainName+'api/epi_rev_code/?ProcedureID='+that.ProcedureID+'&FacilityNPI='+that.FacilityNPI+'&PatientID='+that.PatientID+'&firstDateOfService='+that.firstDateOfService;
                    loadDatatable(that.apiUrl)
                  }

                  function loadDatatable(url){
                    $http({method: "GET", url: url})
                    .then(function(response){
                        console.log(response.data);
                        if (response.data.length > 0) {
                          vm.authorized = true;
                          that.revData = response.data[0];
                          $('#loadingDiv').hide();
                          $('#notFound').hide();

                          setTimeout(function(){ 
                            this.tableOffset = $("#revTable").offset().top;
                          }, 200);

                        }else{
                          $('#loadingDiv').hide();
                          $('#notFound').show();
                        }
                    });
                  }

                  that.excelDownload = function(){
                    var excelUrl = domainName+'api/epi_rev_code/?ProcedureID='+
                                  $scope.procedureId+'&FacilityNPI='+
                                  $scope.facilityNpi+'&PatientID='+
                                  $scope.patientID+'&firstDateOfService='+
                                  $scope.firstDateOfService+"&file_type=excel";

                    window.location = excelUrl;
                  }

                  that.printDiv = function(divName) {
                      var w=window.open();
                      w.document.write($('#'+divName).html());
                      w.print();
                      w.close();
                  }

                  $('.dashboard-content-wrapper').bind("scroll", function() {
                      var offset = $(this).scrollTop();
                      
                      if (offset >= 400) {
                        $("#header-fixed").show();
                      }
                      else {
                        $("#header-fixed").hide();
                      }
                  });
	            }	
           	]
        });
}(window.angular));
