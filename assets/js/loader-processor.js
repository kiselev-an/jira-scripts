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

function processWithLoaderAnimation(process) {
    showLoader("loader_div");
    process();
    hideLoader("loader_div");
}