;(function (angular) {
  "use strict";

  	angular.module("proceduremaintenance")
        .component("proceduremaintenance", {

           	"templateUrl": "/js/proceduremaintenance/proceduremaintenance.html",
           	"controller" : ["$http", "$scope", "Session", "$state", "$rootScope", "DTOptionsBuilder", "DTColumnBuilder",

              function ($http, $scope, Session, $state, $rootScope, DTOptionsBuilder, 
                        DTColumnBuilder) {
                 var that = this;

                 this.collapsed = true;

                 this.toggleCollapse = function () {
                 
                   this.collapsed = !this.collapsed;
                 }

                //Initializing the Procedure Details 
                $http({method: "GET", url: domainName+"api/Procedure_Maintenance/?db_action_type=all"})
                    .then(function(response){
                      console.log(response);
                      if (response.statusText == "OK") {
                        that.pMaintenanceData = response.data;

                        $(document).ready(function() {
                           setTimeout(function(){ 
                              $('#example').DataTable();
                           }, 300);
                        });
                      }
                });
                
                //trigger Procedure Edit Model
                that.procedureEditModal = function(type, maintenance){
                  if (type == "update") {
                    $scope.editProcedureId = maintenance.col_1;
                    $scope.editProcedureName = maintenance.col_2;
                    $scope.editProcedureOutPatient = maintenance.col_4;
                    $scope.editProcedureEnabled = maintenance.col_10;
                    $scope.editProcedureReqFacility = maintenance.col_12;
                    $scope.editProcedureReqPhysician = maintenance.col_13;
                    $scope.editProcedureReqAnethsia = maintenance.col_14;
                    $scope.editProcedureReqLab = maintenance.col_15;
                    $scope.editProcedureReqRdlgy = maintenance.col_16;
                  }else{
                    $scope.editProcedureId = $scope.editProcedureName = $scope.editProcedureOutPatient = $scope.editProcedureEnabled = $scope.editProcedureReqFacility = $scope.editProcedureReqPhysician = $scope.editProcedureReqAnethsia = $scope.editProcedureReqLab = $scope.editProcedureReqRdlgy = "";
                  }
                  $scope.type = type;

                  $('#procedureEdit').modal('show');
                }

                //Insert / Update Procedure in to database
                that.insertPocedureData = function(){
                  var url = domainName+"api/Procedure_Maintenance/?db_action_type="+$scope.type+"&ProcedureID="+$scope.editProcedureId+"&ProcedureName="+$scope.editProcedureName+"&IsOutpatient="+$scope.editProcedureOutPatient+"&Enabled="+$scope.editProcedureEnabled+"&RequireFacility="+$scope.editProcedureReqFacility+"&RequirePhysician="+$scope.editProcedureReqPhysician+"&RequireAnesthesia="+$scope.editProcedureReqAnethsia+"&RequireLab="+$scope.editProcedureReqLab+"&RequireRadiology="+$scope.editProcedureReqRdlgy;

                  $http({method: "GET", url: url})
                      .then(function(response){
                      console.log(response);
                      if (response.statusText == "OK") {
                        $('#editMsgDiv').html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a> Procedure Updated Successfully. Please Wait Until Page Refresh.</div>');
                        setTimeout(function(){ 
                              window.location.reload(1);
                           }, 2000);
                      }else{
                        $('#editMsgDiv').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a> Something went wrongwhile  Updating Procedure</div>');
                      }
                  });
                }

                //Trigger Delete Model
                that.deleteProcedureModal = function(maintenance, type){
                   $scope.delProcedureId = maintenance.col_1;
                   $scope.type = type;
                   $('#delete').modal('show');
                }

                //Delete Procedure Data
                that.DelPocedureData = function(){
                  var url = domainName+"api/Procedure_Maintenance/?db_action_type="+$scope.type+"&ProcedureID="+$scope.delProcedureId;

                  $http({method: "GET", url: url})
                      .then(function(response){
                      console.log(response);
                      if (response.statusText == "OK") {
                        $('#delMsgDiv').html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>Procedure Deleted Successfullywait until page refresh. Please </div>');
                          setTimeout(function(){ 
                              window.location.reload(1);
                           }, 2000);
                      }else{
                        $('#delMsgDiv').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a> Something went wrongwhile  Deleting Procedure</div>');
                      }
                  });  
                }

              }
            ]
        });
}(window.angular));
