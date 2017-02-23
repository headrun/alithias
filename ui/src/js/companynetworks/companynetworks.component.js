;(function (angular) {
  "use strict";

  	angular.module("companynetworks")
        .component("companynetworks", {

           	"templateUrl": "/js/companynetworks/companynetworks.html",
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

                 $http({method: "GET", url: domainName+"api/cmp_network_by_state_dropdowns/"})
                    .then(function(response){
                        that.companies = response.data[0].table_Companies;
                    });

                 that.printDiv = function(divName) {
                      var w=window.open();
                      w.document.write($('#'+divName).html());
                      w.print();
                      w.close();
                  }   

                  that.excelDownload = function(){
                    var excelUrl = domainName+'api/company_network_by_state_new/?CompanyID='+
                                  that.companyId+"&file_type=excel&companyName"+
                                  $('#companyName :selected').text();

                    window.location = excelUrl;
                  }

                 $scope.submit = function(param){

                    $('#loadingDiv').show();
                    that.companyId = param.companyId ? param.companyId : '';
                    that.apiUrl = domainName+'api/company_network_by_state_new/?CompanyID='+that.companyId;

                    $http({method: "GET", url: that.apiUrl})
                      .then(function(response){
                        console.log(response);
                        if (response.data.length > 0) {
                          
                          $('#notFound').hide();
                          vm.authorized = true;
                          that.companyData = response.data;
                          $('#loadingDiv').hide();
                        }else{

                          $('#loadingDiv').hide();
                          $('#notFound').show();
                        }
                    });
                  }
	            }	
           	]
        });
}(window.angular));
