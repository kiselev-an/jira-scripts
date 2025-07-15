var activeAjaxRequests = 0;

function showLoader(loaderId) {
    activeAjaxRequests++;
    console.log("activeAjaxRequests = " + activeAjaxRequests);
    $("#" + loaderId).show(); // Or adjust visibility as needed
}

function hideLoader(loaderId) {
    activeAjaxRequests--;
    console.log("activeAjaxRequests = " + activeAjaxRequests);
    if (activeAjaxRequests <= 0) {
        $("#" + loaderId).hide(); // Or adjust visibility as needed
        activeAjaxRequests = 0; // Reset for future use
    }
}

function executeGetRequestWithLoaderAnimation(params) {
    params.preSend = function() {
        showLoader("loader_div");
    };
    params.onComplete = function() {
        hideLoader("loader_div");
    };
    if(params.async == false) {
        setTimeout(function() {
            executeGetRequest(params)
        }, 10);
    } else {
        executeGetRequest(params);
    }
}

function executePostRequestWithLoaderAnimation(params) {
    params.preSend = function() {
        showLoader("loader_div");
    };
    params.onComplete = function() {
        hideLoader("loader_div");
    };
    if(params.async == false) {
        setTimeout(function() {
            executePostRequest(params)
        }, 10);
    } else {
        executePostRequest(params);
    }
}

function processWithLoaderAnimation(process) {
    showLoader("loader_div");
    if(process.preAction && null != process.preAction) {
        process.preAction();
    }
    if(process.action && null != process.action) {
        process.action();
    }
    if(process.postAction && null != process.postAction) {
        process.postAction();
    }
    hideLoader("loader_div");
}

function loadDepReportsContentWithLoaderAnimation(preAction) {
    processWithLoaderAnimation({
        preAction: preAction,
        action: function() {
            loadDepReportsContent();
        }
    });
}

function sendEmailWithLoaderAnimation() {
    processWithLoaderAnimation({
        action: function() {
            sendEmail();
        }
    });
}

function generatePDFWithLoaderAnimation() {
    processWithLoaderAnimation({
        action: function() {
            generatePDF();
        }
    });
}

function publishingToConfluenceWithLoaderAnimation() {
    processWithLoaderAnimation({
        action: function() {
            publishingToConfluence();
        }
    });
}