;(function (angular) {
  "use strict";

  	angular.module("proceduremaintenance")
        .component("proceduremaintenance", {

           	"templateUrl": "/js/proceduremaintenance/proceduremaintenance.html",
           	"controller" : ["$http", "$scope", "Session", "$state", "$rootScope", "DTOptionsBuilder", "DTColumnBuilder", "$compile",

              function ($http, $scope, Session, $state, $rootScope, DTOptionsBuilder, 
                        DTColumnBuilder, $compile) {
                 var that = this;
                 var vm = this;

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

                           setTimeout(function(){ 
                              $('#example').DataTable({
                                  "order": [[ 1, "asc" ]],
                                  "lengthMenu": [[10, 50, 100, -1], [10, 50, 100, "All"]]
                              });
                           }, 300);
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
                   

                   vm.dtOptions = DTOptionsBuilder.newOptions()
                       .withOption('ajax', {
                              url: url,
                              type: 'GET'
                           })
                       .withOption('processing', true)
                       .withOption('createdRow', function(row, data, dataIndex) {
                              $compile(angular.element(row).contents())($scope);
                          })
                          .withOption('headerCallback', function(header) {
                              if (!vm.headerCompiled) {
                                  vm.headerCompiled = true;
                                  $compile(angular.element(header).contents())($scope);
                              }
                          })
                       .withOption('serverSide', false)
                       .withOption('lengthMenu', [5, 10, 25, 50])
                       .withPaginationType('full_numbers');

                    vm.authenticated = true;
                    vm.dtColumns = [
                          DTColumnBuilder.newColumn('col_3').withTitle('Procedure Code'),
                          DTColumnBuilder.newColumn('col_6').withTitle('Is Primary').renderWith(function(col_6) {
                                var check = col_6 == "True" ? "checked" : "";
                                return '<input type="checkbox" style="zoom:1.2" value="" '+ check +'>';
                            }),
                          DTColumnBuilder.newColumn('col_7').withTitle('Is Secondary').renderWith(function(col_7) {
                                var check = col_7 == "True" ? "checked" : "";
                                return '<input type="checkbox" style="zoom:1.2" value="" '+ check +'>';
                            }),
                          DTColumnBuilder.newColumn('col_18').withTitle('Actions').renderWith(function(data, type, full, meta) {
                                var delParms = full.col_1+',"delete"';
                                var params = '"update",'+full.col_3+','+full.col_2+','+full.col_1+',"'+full.col_6+'","'+full.col_7+'"';
                                var content = '<button type="button" class="btn btn-warning btn-xs" ng-click=$ctrl.procMapEditModal('+params+')>Edit</button>&nbsp;'+
                                              '<button type="button" class="btn btn-danger btn-xs" ng-click=$ctrl.deleteProcMapModal('+delParms+') >Delete</button>';          
                                return content;
                            }),
                          DTColumnBuilder.newColumn('col_1').withTitle('test_1').notVisible(),
                          DTColumnBuilder.newColumn('col_2').withTitle('test_2').notVisible(),
                          DTColumnBuilder.newColumn('col_3').withTitle('test_3').notVisible(),
                          DTColumnBuilder.newColumn('col_4').withTitle('test_4').notVisible(),
                          DTColumnBuilder.newColumn('col_5').withTitle('test_5').notVisible(),
                          DTColumnBuilder.newColumn('col_9').withTitle('test_6').notVisible(),
                          DTColumnBuilder.newColumn('col_8').withTitle('test_7').notVisible(),
                          DTColumnBuilder.newColumn('col_10').withTitle('test_8').notVisible(),
                          DTColumnBuilder.newColumn('col_11').withTitle('test_9').notVisible(),
                          DTColumnBuilder.newColumn('col_13').withTitle('test_10').notVisible(),
                          DTColumnBuilder.newColumn('col_14').withTitle('test_11').notVisible(),
                          DTColumnBuilder.newColumn('col_15').withTitle('test_12').notVisible(),
                          DTColumnBuilder.newColumn('col_16').withTitle('test_13').notVisible(),
                          DTColumnBuilder.newColumn('col_17').withTitle('test_14').notVisible(),
                        ];  
                        $('#editProcMapDiv').hide();
                        $('#procMapModal').modal('show');
                }

                that.procMapEditModal = function(type, col_3, col_2, col_1, col_6, col_7){
                  $scope.mapType = type;
                  if (type == "update") {
                    $scope.editProcMapCode = col_3;
                    $scope.editProcMapProId = col_2;
                    $scope.editProcMapId = col_1;
                    $scope.editProcMapPrimary = col_6;
                    $scope.editProcMapSecndry = col_7;
                  }else{
                    $scope.editProcMapProId = $scope.ProcIDForSubMap;
                    $scope.editProcMapCode = "";
                    $scope.editProcMapId = "";
                    $scope.editProcMapPrimary = "";
                    $scope.editProcMapSecndry = "";
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

                that.deleteProcMapModal = function(col_1, type){
                  var r = confirm("Are you Sure ! You want to delete ?");
                  if (r == true) {
                    $scope.mappingId = col_1;
                    $scope.type = type;

                    var url = domainName+"api/Procedure_Mapping_Maintenance/?db_action_type="+$scope.type+"&MappingID="+$scope.mappingId;

                    $http({method: "GET", url: url})
                      .then(function(response){
                          console.log(response);
                          if (response.statusText == "OK") {
                            $('.mappingmsgDiv').html('<div class="alert alert-success"><span class="close" data-dismiss="alert" aria-label="close">×</span> Mapping Deleted Successfully. Please wait until page refresh.</div>');
                            setTimeout(function(){ 
                                window.location.reload(1);
                             }, 1500);
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
