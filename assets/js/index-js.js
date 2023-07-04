var JIRA_URL = "https://jira.ftc.ru";
var SCRIPT_RUNNER_PATH = "rest/scriptrunner/latest/custom";

function gotoCollectionMetrics(reportType) {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getCollectionMetrics?dateFrom=2023-01-01&dateTo=2023-06-01&size=small&done&report=epicsTimeMetrics', '_blank'); return false;
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getCollectionMetrics?report=sprintsInWork', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getCollectionMetrics?";
    switch(reportType){
        case "epicsTimeMetrics":
            url += "dateFrom=" + "2023-01-01" + "&";
            url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
            url += "size=" + "small" + "&";
            url += "done" + "&";
            break;
    }
    url += "report=" + reportType
    window.open(url, "_blank");
    return false;
}

function gotoEpicsTimeMetricsCollector_old() {
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getEpicsTimeMetricsCollector?";
    url += "dateFrom=" + "2023-01-01" + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "size=" + "small" + "&";
    url += "done";
    window.open(url, "_blank");
    return false;
}

function gotoSprintsInWorkCollector_old() {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getSprintsInWorkCollector', '_blank'); return false;
    window.open(JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getSprintsInWorkCollector", "_blank");
    return false;
}

function gotoCollectionUpStream() {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getCollectionUpStream', '_blank'); return false;
    window.open(JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getCollectionUpStream", "_blank");
    return false;
}

function gotoOKRReport2() {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getOKRReport2', '_blank'); return false;
    window.open(JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getOKRReport3", "_blank");
    return false;
}

function dateToYYYYMMDD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return "" + y + "-" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);
}