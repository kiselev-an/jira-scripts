function loadExternalPage(externalPageURL, onPreparedCallBack) {
    jQuery.get({
        url: externalPageURL,
        success: function(data) {
            responseHandlerExternalPage(data, externalPageURL, onPreparedCallBack);
        }
    });
}

function responseHandlerExternalPage(responseData, externalPageURL, onPreparedCallBack) {
    var responseHtml = $.parseHTML(responseData, null);
    $(document).attr("title", $(responseHtml).filter("title").text());
    var externalBodyContent = /<body.*>([\s\S]+)<\/body>/.exec(responseData);

    document.getElementsByTagName('body')[0].outerHTML = externalBodyContent[0]; //replace body content
    $(document).find("head").each(function(index, element) { // magic
        if(index != 0) {
            $(element).remove();
        }
    });
    $(document).find("img").each(function(index, element) { // replace 'src' attribute for images
        var externalHost = getHost(externalPageURL);
        if(null != externalHost) {
            var newUrl = replaceUrlHost($(element).prop("src"), externalHost);
            alert($(element).prop("src") + " " + externalHost + " " + newUrl);
            $(element).prop("src", newUrl);
        }
    });
    onPreparedCallBack();
}

function getHost(url) {
    try {
        var urlObj = new URL(url);
        return urlObj.host;
    } catch (e) {
        return null;
    }
}

function replaceUrlHost(url, newHost) {
    try {
        var urlObj = new URL(url);
        urlObj.host = newHost;
        return urlObj.href;
    } catch (e) {
        return url;
    }
}