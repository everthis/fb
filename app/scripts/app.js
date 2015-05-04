
// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
requirejs.config({
    "baseUrl": "scripts/vendor",
    "paths": {
      "app": "../app"
      // "jquery":     "jquery",
      // "md5utf8":     "md5utf8",
      // "fbapi":     "app/fbapi",
      // "listcity":     "app/listcity",
      // "main":     "app/main",
      // "partial_loader":     "app/partial_loader",
      // "buscity":     "app/buscity",
      // "calendar":     "app/calendar"
    },
    "shim": {
        // "backbone": ["jquery", "underscore"],
        // "bootstrap": ["jquery"]
    }
});

// Load the main app module to start the app
requirejs(["app/index"]);