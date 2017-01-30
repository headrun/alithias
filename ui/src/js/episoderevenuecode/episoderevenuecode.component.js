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

                 if($rootScope.epi_rev_form_det != '' && typeof($rootScope.epi_rev_form_det) != 'undefined'){
                    console.log($rootScope.epi_rev_form_det);

                    $scope.procedureId = $rootScope.epi_rev_form_det.ProcedureID;
                    $scope.facilityNpi = $rootScope.epi_rev_form_det.FacilityNPI;
                    $scope.patientID = $rootScope.epi_rev_form_det.PatientID;
                    $scope.firstDateOfService = $rootScope.epi_rev_form_det.firstDateOfService;
                    loadDatatable($rootScope.epi_rev_form_det.url);
                 }

                 $scope.submit = function(){
                    $('#loadingDiv').show();
                    that.ProcedureID = $scope.procedureId ? $scope.procedureId : '';
                    that.FacilityNPI = $scope.facilityNpi ? $scope.facilityNpi : '';
                    that.PatientID = $scope.patientID ? $scope.patientID : '';
                    that.firstDateOfService = $scope.firstDateOfService ? $scope.firstDateOfService : '';

                    that.apiUrl = 'http://localhost:2222/api/epi_rev_code/?ProcedureID='+that.ProcedureID+'&FacilityNPI='+that.FacilityNPI+'&PatientID='+that.PatientID+'&firstDateOfService='+that.firstDateOfService;
                    //that.apiUrl = domainName+'api/epi_rev_code/?ProcedureID='+that.ProcedureID+'&FacilityNPI='+that.FacilityNPI+'&PatientID='+that.PatientID;
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
                        }else{
                          $('#loadingDiv').hide();
                          $('#notFound').show();
                        }
                    });
                  }

                  that.printDiv = function(divName) {
                      var w=window.open();
                      w.document.write($('#'+divName).html());
                      w.print();
                      w.close();
                  }
	            }	
           	]
        });
}(window.angular));
