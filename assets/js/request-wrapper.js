function executeGetRequest(params) {
    if(!params.async) {
        setTimeout(function() {
            executeGetRequestInMain(params)
        }, 10);
    } else {
        executeGetRequestInMain(params);
    }
}

function executeGetRequestInMain(params) {
    jQuery.get({
        url: params.url,
        async: params.async,
        beforeSend: function() {
            showLoader("loader_div");
        },
        success: function(data) {
            params.success(data, params.options, this.url);
            hideLoader("loader_div");
        },
        error: function(data) {
            if(params.error) {
                params.error(data, params.options, this.url);
            }
            hideLoader("loader_div");
        }
    });
}

function executePostRequest(params) {
    jQuery.post({
        url: params.url,
        data: params.data,
        beforeSend: function() {
            showLoader("loader_div");
        },
        success: function(data) {
            params.success(data);
            hideLoader("loader_div");
        },
        error: function(data) {
            alert("Что-то пошло не так. Произошла ошибка сервера :(");
            if(params.error) {
                params.error(data);
            }
            hideLoader("loader_div");
        },
        contentType: "application/json"
    });
}