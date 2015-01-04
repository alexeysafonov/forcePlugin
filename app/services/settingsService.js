angular.module('fpSettingsMod', []).service('settingsStorage', ['$http', '$q',
    function ($http, $q) {
        var storage = chrome.storage.sync;

        this.saveSettings = function (settings) {
            var deferred = $q.defer();
            storage.set(settings, function () {
                if (!chrome.runtime.lastError) {
                    deferred.resolve(settings);
                } else {
                    deferred.reject(chrome.runtime.lastError);
                }
            });
            return deferred.promise;
        };

        this.loadSettings = function (keys) {
            var deferred = $q.defer();
            storage.get(keys, function (data) {
                if (!chrome.runtime.lastError) {
                    deferred.resolve(data);
                } else {
                    deferred.reject(chrome.runtime.lastError);
                }
            });
            return deferred.promise;
        };
    }]);