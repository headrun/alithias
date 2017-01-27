;(function (angular) {
  "use strict";

  	angular.module("providermaintenance")
        .component("providermaintenance", {

           	"templateUrl": "/js/providermaintenance/providermaintenance.html",
           	"controller" : ["$http", "$scope", "Session", "$state", "$rootScope", "DTOptionsBuilder", "DTColumnBuilder",

              function ($http, $scope, Session, $state, $rootScope, DTOptionsBuilder, 
                        DTColumnBuilder) {
                 var that = this;

                 this.collapsed = true;

                 this.toggleCollapse = function () {
                 
                   this.collapsed = !this.collapsed;
                 }

                //Initializing the Provider Details 
                $http({method: "GET", url: domainName+"api/Provider_Maintenance/?db_action_type=all"})
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
                that.providerEditModal = function(type, maintenance){
                  $scope.editProviderNPI = maintenance.col_1;
                  $scope.editProviderTax = maintenance.col_6;
                  $scope.editProviderName = maintenance.col_2;
                  $scope.editProviderType = maintenance.col_5;
                  $scope.type = type;

                  $('#providerEdit').modal('show');
                }

                //Insert / Update Provider in to database
                that.insertProviderData = function(){
                  var url = domainName+"api/Provider_Maintenance/?db_action_type="+$scope.type+"&ProviderNPI="+$scope.editProviderNPI+"&ProviderName="+$scope.editProviderName+"&ProviderTaxID="+$scope.editProviderTax+"&ProviderTypeCode="+$scope.editProviderType;

                  $http({method: "GET", url: url})
                      .then(function(response){
                      console.log(response);
                      if (response.statusText == "OK") {
                        $('#editMsgDiv').html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a> Provider Updated Successfully. Please Wait Until Page Refresh.</div>');
                        setTimeout(function(){ 
                              window.location.reload(1);
                           }, 2000);
                      }else{
                        $('#editMsgDiv').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a> Something went wrongwhile  Updating Provider</div>');
                      }
                  });
                }
              }
            ]
        });
}(window.angular));
