//Load Web App JavaScript Dependencies/Plugins
require([
    'fbapi'
], function(FBAPI) {

        //do stuff
        FBAPI.get_brief_code();
        FBAPI.query_train_hots();
        FBAPI.coach.query_origins("all");

});
