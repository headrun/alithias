;(function (angular) {
  "use strict";

  	angular.module("proceduremaintenance")
        .component("proceduremaintenance", {

           	"templateUrl": "/js/proceduremaintenance/proceduremaintenance.html",
           	"controller" : ["$http", "$scope", "Session", "$state", "$rootScope", "DTOptionsBuilder", "DTColumnBuilder", "$compile",

              function ($http, $scope, Session, $state, $rootScope, DTOptionsBuilder, 
                        DTColumnBuilder, $compile) {
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
                        $('#editMsgDiv').html('<div class="alert alert-success"><span class="close" data-dismiss="alert" aria-label="close">×</span> Procedure Updated Successfully. Please Wait Until Page Refresh.</div>');
                        setTimeout(function(){ 
                              window.location.reload(1);
                           }, 2000);
                      }else{
                        $('#editMsgDiv').html('<div class="alert alert-danger"><span class="close" data-dismiss="alert" aria-label="close">×</span> Something went wrongwhile  Updating Procedure</div>');
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
                        $('#delMsgDiv').html('<div class="alert alert-success"><span class="close" data-dismiss="alert" aria-label="close">×</span>Procedure Deleted Successfully, Please wait until page refresh.</div>');
                          setTimeout(function(){ 
                              window.location.reload(1);
                           }, 2000);
                      }else{
                        $('#delMsgDiv').html('<div class="alert alert-danger"><span class="close" data-dismiss="alert" aria-label="close">×</span> Something went wrong while  Deleting Procedure</div>');
                      }
                  });  
                }

                //Get procedure mapping maintenance data
                that.getProcMapData = function(maintenance){
                   var url = domainName+"api/Procedure_Mapping_Maintenance/?db_action_type=all&ProcedureID="+maintenance.col_1;
                   $scope.ProcIDForSubMap = maintenance.col_1;
                   $http({method: "GET", url: url})
                      .then(function(response){
                        console.log(response);
                            //that.ProcMapData = response.data;
                            var resp = response.data;
                            var data = ""; 
                            var content = '<table id="procMapTable'+maintenance.col_1+'" class="ui celled table" cellspacing="0" width="100%"><thead><tr>'+
                            '<th>Procedure Code</th>'+
                            '<th>Is Primary</th>'+
                            '<th>Is Secondary</th>'+
                            '<th>Actions</th>'+
                            '</tr></thead><tbody>';
                        var tabFooter = '</tbody></table>';
                          if (response.statusText == "OK") {  

                            for (var i = 0; i < resp.length; i++) {
                               content += '<tr>'+
                                                '<td>'+resp[i]["col_3"]+'</td>'+
                                                '<td>'+
                                                  '<input type="checkbox" style="zoom:1.2" value="" ng-checked="'+resp[i]["col_6"]+' == "True"">'+
                                                '</td>'+
                                                '<td>'+
                                                  '<input type="checkbox" style="zoom:1.2" value="" ng-checked="'+resp[i]["col_7"] +'== "True"">'+
                                                '</td>'+
                                                '<td>'+
                                                  '<button type="button" class="btn btn-warning btn-xs" data-ng-click="procMapEditModal(type="update",'+resp[i]+')">Edit</button>&nbsp;'+
                                                  '<button type="button" class="btn btn-danger btn-xs" ng-click="$ctrl.deleteProcMapModal('+resp[i]+', type="delete")">Delete</button>'+
                                                '</td>'+
                                                '</tr>';
                            }
                            $('#procMapTableDiv').html(content+tabFooter);
                            $compile(content)($scope);
                            $('#procMapModal').modal('show');
                            setTimeout(function(){ 
                               $('#procMapTable'+maintenance.col_1).DataTable({
                                  "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                               });
                            }, 500);
                        }else{
                            $('#procMapMsgDiv').html('<div class="alert alert-danger"><span class="close" data-dismiss="alert" aria-label="close">×</span> Something went wrong while fetching Procedure Mappings</div>');
                            $('#procMapTableDiv').html(content+tabFooter);
                            setTimeout(function(){ 
                               $('#procMapTable'+maintenance.col_1).DataTable({
                                  "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                               });
                            }, 500);
                        }
                    });
                }

                $scope.procMapEditModal = function(type, maintenance){
                  $scope.mapType = type;
                  if (type == "update") {
                    $scope.editProcMapCode = maintenance.col_3;
                    $scope.editProcMapProId = maintenance.col_2;
                    $scope.editProcMapId = maintenance.col_1;
                    $scope.editProcMapPrimary = maintenance.col_6;
                    $scope.editProcMapSecndry = maintenance.col_7;
                  }else{
                    $scope.editProcMapProId = $scope.ProcIDForSubMap;
                  }
                  $('#editProcMapDiv').show('slow');
                }

                that.dismissDiv = function(){
                  $('#editProcMapDiv').hide('slow');
                }

                that.insertProcmapData = function(){
                  var url = "";
                  if ($scope.mapType == "update") {
                      url = domainName+"api/Procedure_Mapping_Maintenance/?db_action_type="+$scope.mapType+"&MappingID="+$scope.editProcMapId+"&ProcedureCode="+$scope.editProcMapCode+"&IsPrimary="+$scope.editProcMapPrimary+"&IsSecondary="+$scope.editProcMapSecndry;
                  }
                  else{
                      url = domainName+"api/Procedure_Mapping_Maintenance/?db_action_type="+$scope.mapType+"&ProcedureID="+$scope.editProcMapProId+"&ProcedureCode="+$scope.editProcMapCode+"&IsPrimary="+$scope.editProcMapPrimary+"&IsSecondary="+$scope.editProcMapSecndry;
                  }
                  $http({method: "GET", url: url})
                    .then(function(response){
                        console.log(response);
                        if (response.statusText == "OK") {
                          $('.mappingmsgDiv').html('<div class="alert alert-success"><span class="close" data-dismiss="alert" aria-label="close">×</span> Mapping Updated Successfully</div>');
                            that.dismissDiv
                        }else{
                          $('.mappingmsgDiv').html('<div class="alert alert-danger"><span class="close" data-dismiss="alert" aria-label="close">×</span> Something went wrong while Creating</div>');
                        }
                    });
                }

                that.deleteProcMapModal = function(data, type){
                  var r = confirm("Are you Sure ! You want to delete ?");
                  if (r == true) {
                    $scope.mappingId = data.col_1;
                    $scope.type = type;

                    var url = domainName+"api/Procedure_Mapping_Maintenance/?db_action_type="+$scope.type+"&MappingID="+$scope.mappingId;

                    $http({method: "GET", url: url})
                      .then(function(response){
                          console.log(response);
                          if (response.statusText == "OK") {
                            $('.mappingmsgDiv').html('<div class="alert alert-success"><span class="close" data-dismiss="alert" aria-label="close">×</span> Mapping Deleted Successfully</div>');
                              that.dismissDiv
                          }else{
                            $('.mappingmsgDiv').html('<div class="alert alert-danger"><span class="close" data-dismiss="alert" aria-label="close">×</span> Something went wrong while Deleting</div>');
                          }
                      });
                  }
                }

              }
            ]
        });
}(window.angular));
