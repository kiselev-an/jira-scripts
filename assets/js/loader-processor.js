var activeAjaxRequests = 0;

function showLoader(loaderId) {
    activeAjaxRequests++;
    $("#" + loaderId).show(); // Or adjust visibility as needed
}

function hideLoader(loaderId) {
    activeAjaxRequests--;
    if (activeAjaxRequests <= 0) {
        $("#" + loaderId).hide(); // Or adjust visibility as needed
        activeAjaxRequests = 0; // Reset for future use
    }
}