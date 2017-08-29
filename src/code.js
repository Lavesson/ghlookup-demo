angular.module('GithubApp', [])

// Note 1: This is just a chained call on whatever "angular.module" returns
// Note 2: We're injecting another magic AngularJS thingie ($http). This is a core service in AngularJS.
// Note 3: We're using a simple component (check the bottom).
.controller('ghController', function ($scope, $http) {
    const BaseUrl = 'https://api.github.com';
    $scope.data = {};

    // We don't have enums in JS, so this will have to do:
    $scope.status = {
        noSearchYet: -1,
        ok: 0,
        notFound: 1,
        other: 2
    };

    // Default value when initializing the app
    $scope.result = $scope.status.noSearchYet;

    // This is where we'll end up when clicking the search button
    $scope.search = function () {
        // 1. Grab the username. I'll put it in a separate variable for easier access, that's all.
        // Note that we're using the ES6 keyword 'let' to declare the variable
        let username = $scope.username;

        // 2. Make an *asynchronous* call to api.github.com/users/whatever-we-typed
        // Note that we're using template strings from ES6 here. This is a perfect use-case for them!
        $http.get(BaseUrl + `/users/${username}`).then(response => {
            // 3a. This is where we'll end up if everything is fine
            $scope.data = response.data;
            $scope.result = $scope.status.ok;
        }).catch(response => {
            // 3b. This is where we'll end up if something borked
            $scope.result = response.status === 404
                ? $scope.status.notFound
                : $scope.status.other;

            // Set some error data to show the user
            $scope.data = {
                username: username
            };
        })
    }
})

.component('allIsGood', {
    templateUrl: 'all-is-good.html',
    bindings: {
        data: '='
    }
});