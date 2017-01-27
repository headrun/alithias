;(function (angular) {
  "use strict";

  var endPoint = "/auth";

  angular.module("auth", []).service("Auth", ["$q", "$http", "Session",

    function ($q, $http, Session) {

        this.creden = { withCredentials: false };

      var deferredStatus = null;

      this.login = function (credentials) {

        deferredStatus = null;

        var login_url_to_fire = 'http://dcubeapi.alithias.com:8082/auth/login/';
        return $http.post(login_url_to_fire, credentials)
                    .then(function (resp) {
          resp = resp.data;
          Session.set(resp.result);
        });
      };

      this.isAuthorized = function () {

        var session = Session.get();

        return !!(session && session.userId);
      };

      this.logout = function () {

        return $http.get("http://dcubeapi.alithias.com:8082/auth/logout/").then(function () {

          Session.unset();
          deferredStatus = null;
        });
      };

      this.status = function () {

        if (deferredStatus) {

          return deferredStatus.promise;
        }

        deferredStatus = $q.defer();

        var url_to_fire = 'http://dcubeapi.alithias.com:8082/auth/status/';

        $http.get(url_to_fire,{ withCredentials: true }).then(function (resp) {

          resp = resp.data;

          if (resp.result && resp.result.user) {

            Session.set(resp.result.user);
          }

          deferredStatus.resolve(resp.result);
        });

        return deferredStatus.promise;
      };
  }]);

}(window.angular));
