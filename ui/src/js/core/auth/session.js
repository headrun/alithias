;(function (angular) {
  "use strict";

  angular.module("auth").service("Session", function () {

    var that = this;

    function resetSession () {

      angular.extend(that, {

        "userId"  : null,
        "userName": null,
        "email"   : null,
        "user_type": null
      });
    }

    resetSession();

    this.get = function () {

      return {

        "userId"  : this.userId,
        "userName": this.userName,
        "email"   : this.email,
        "user_type": this.user_type
      };
    };

    this.set = function (data) {

      this.userId   = data.userId;
      this.userName = data.userName;
      this.email    = data.email;
      this.user_type= data.user_type;
      this.session  = data.session;
    };

    this.unset = resetSession;
  });

}(window.angular));
