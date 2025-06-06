function loadExternalPage(externalPageURL, onPreparedCallBack) {
    jQuery.get({
        url: externalPageURL,
        success: function(data) {
            responseHandlerExternalPage(data, onPreparedCallBack);
        }
    });
}

function responseHandlerExternalPage(responseData, onPreparedCallBack) {
    var responseHtml = $.parseHTML(responseData, null);
    $(document).attr("title", $(responseHtml).filter("title").text());
    var externalBodyContent = /<body.*>([\s\S]+)<\/body>/.exec(responseData);

    document.getElementsByTagName('body')[0].outerHTML = externalBodyContent[0]; //replace body content
    $(document).find("head").each(function(index, element) { // magic
        if(index != 0) {
            $(element).remove();
        }
    });
    onPreparedCallBack();
}