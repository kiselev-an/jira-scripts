var JIRA_URL = "https://jira.ftc.ru";
var SCRIPT_RUNNER_PATH = "rest/scriptrunner/latest/custom";
var DATE_FROM = "2023-04-01";

function gotoCollectionMetrics(reportType) {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getCollectionMetrics?dateFrom=2023-01-01&dateTo=2023-06-01&size=small&done&report=epicsTimeMetrics', '_blank'); return false;
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getCollectionMetrics?report=sprintsInWork', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getCollectionMetrics?";
    switch(reportType){
        case "epicsTimeMetrics":
            url += "dateFrom=" + DATE_FROM + "&";
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
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getEpicsTimeMetricsCollector?dateFrom=2023-01-01&dateTo=2023-07-07&size=small&done', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getEpicsTimeMetricsCollector?";
    url += "dateFrom=" + DATE_FROM + "&";
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

function gotoEpicsTimeMetrics2Collector_Mirutov() {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getEpicsTimeMetrics2?dateFrom=2023-04-01&dateTo=2023-06-30&ra=cl&size=small&done', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getEpicsTimeMetrics2?";
    url += "dateFrom=" + DATE_FROM + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "ra=" + "cl" + "&";
    url += "size=" + "small" + "&";
    url += "done";
    window.open(url, "_blank");
    return false;
}

function dateToYYYYMMDD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return "" + y + "-" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);
}