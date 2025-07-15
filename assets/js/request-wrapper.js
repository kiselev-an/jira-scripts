function executeGetRequest(params) {
    jQuery.get({
        url: params.url,
        async: params.async,
        beforeSend: function() {
            if(params.preSend && null != params.preSend) {
                params.preSend();
            }
        },
        success: function(data) {
            params.success(data, params.options, this.url);
            if(params.onComplete && null != params.onComplete) {
                params.onComplete();
            }
        },
        error: function(data) {
            if(params.error && null != params.error) {
                params.error(data, params.options, this.url);
            }
            if(params.onComplete && null != params.onComplete) {
                params.onComplete();
            }
        }
    });
}

function executePostRequest(params) {
    jQuery.post({
        url: params.url,
        data: params.data,
        beforeSend: function() {
            if(params.preSend && null != params.preSend) {
                params.preSend();
            }
        },
        success: function(data) {
            params.success(data);
            if(params.onComplete && null != params.onComplete) {
                params.onComplete();
            }
        },
        error: function(data) {
            alert("Что-то пошло не так. Произошла ошибка сервера :(");
            if(params.error && null != params.error) {
                params.error(data, params.options, this.url);
            }
            if(params.onComplete && null != params.onComplete) {
                params.onComplete();
            }
        },
        contentType: "application/json"
    });
}