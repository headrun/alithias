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
                    //loadDatatable($rootScope.epi_rev_form_det.url);
                    loadDatatable(domainName+'api/epi_rev_code/');
                    //param['procedureId'] = $rootScope.Prov_pric_form_det.procedureID;
                    /*$(document).ready(function(){
                        $('#procedureId').val($rootScope.Prov_pric_form_det.procedureID);
                        $('#providerNpi').val($rootScope.Prov_pric_form_det.providerNpi);
                        $('#networkId').val($rootScope.Prov_pric_form_det.networkID);
                        $('#costcategorycode').val($rootScope.Prov_pric_form_det.category);
                        $('#facelityprovidernpi').val($rootScope.Prov_pric_form_det.facilityNPI);
                    });*/
                 }

                 $scope.submit = function(param){
                    $('#loadingDiv').show();
                    that.ProcedureID = param.procedureId ? param.procedureId : '';
                    that.FacilityNPI = param.facilityNpi ? param.facilityNpi : '';
                    that.PatientID = param.patientID ? param.patientID : '';
                    that.firstDateOfService = param.firstDateOfService ? param.firstDateOfService : '';

                    //that.apiUrl = 'http://localhost:2222/api/epi_rev_code/?ProcedureID='+that.ProcedureID+'&FacilityNPI='+that.FacilityNPI+'&PatientID='+that.PatientID+'&firstDateOfService='+that.firstDateOfService;
                    that.apiUrl = domainName+'api/epi_rev_code/?ProcedureID='+that.ProcedureID+'&FacilityNPI='+that.FacilityNPI+'&PatientID='+that.PatientID;
                    loadDatatable(that.apiUrl)
                  }

                  function loadDatatable(url){
                    $http({method: "GET", url: url})
                    .then(function(response){
                        vm.authorized = true;
                        console.log(response.data);
                        that.revData = response.data[0];
                        $('#loadingDiv').hide();
                    });
                  }
	            }	
           	]
        });
}(window.angular));
