;(function (angular) {
  "use strict";

  	angular.module("costcompsummary")
        .component("costcompsummary", {

           	"templateUrl": "/js/costcompsummary/costcompsummary.html",
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

                 $http({method: "GET", url: domainName+"api/cost_cmpr_summary_dropdowns"})
                    .then(function(response){
                        that.company_drop= response.data[0].table_Companies;
                    });  

                 $scope.submit = function(){
                    $('#loadingDiv').show();
                    that.companyId = $scope.companyId ? $scope.companyId : '';
                    that.sourceZip = $scope.sourceZip ? $scope.sourceZip : '';
                    that.milesRadius = $scope.milesRadius ? $scope.milesRadius : '';
                    that.year = $scope.year ? $scope.year : '';

                    that.apiUrl = domainName+'api/cost_comparison_summary/?CompanyID='+that.companyId+'&SourceZIP='+that.sourceZip+'&MilesRadius='+that.milesRadius+'&Year='+that.year;

                    $http({method: "GET", url: that.apiUrl})
                      .then(function(response){
                          if (response.data.length > 0) {
                            vm.authorized = true;
                            that.costData = response.data[0];
                            that.pdfUrl = domainName+'api/cost_comparison_summary/?CompanyID='+
                                  $scope.companyId+'&SourceZIP='+
                                  $scope.sourceZip+'&MilesRadius='+
                                  $scope.milesRadius+'&Year='+
                                  $scope.year+"&file_type=pdf&companyName="+
                                  $('#companyId :selected').text();
                            $('#notFound').hide();
                            $('#loadingDiv').hide();

                          }else{
                            $('#loadingDiv').hide();
                            $('#notFound').show();
                          }
                      });
                  }

                  that.getCompaId = function(){
                    that.compId = $scope.companyId;
                  }

                  that.excelDownload = function(){
                    var excelUrl = domainName+'api/cost_comparison_summary/?CompanyID='+
                                  $scope.companyId+'&SourceZIP='+
                                  $scope.sourceZip+'&MilesRadius='+
                                  $scope.milesRadius+'&Year='+
                                  $scope.year+"&file_type=excel&companyName="+
                                  $('#companyId :selected').text();

                    window.location = excelUrl;
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
