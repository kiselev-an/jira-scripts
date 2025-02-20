var JIRA_URL = "https://jira.ftc.ru";
var SCRIPT_RUNNER_PATH = "rest/scriptrunner/latest/custom";
var DATE_FROM = "2023-07-01";
var FOR_LAST_MONTHS = 3;

function gotoCollectionMetrics(reportType) {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getCollectionMetrics?dateFrom=2023-01-01&dateTo=2023-06-01&size=small&done&report=epicsTimeMetrics', '_blank'); return false;
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getCollectionMetrics?report=sprintsInWork', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getCollectionMetrics?";
    switch(reportType){
        case "epicsTimeMetrics":
            url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
            url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
            url += "size=" + "small" + "&";
            url += "done" + "&";
            break;
        case "tasksTimeMetrics":
            url += "user=" + "???" + "&";
    }
    url += "report=" + reportType;
    window.open(url, "_blank");
    return false;
}

function gotoEpicsTimeMetricsCollector_old() {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getEpicsTimeMetricsCollector?dateFrom=2023-01-01&dateTo=2023-07-07&size=small&done', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getEpicsTimeMetricsCollector?";
    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
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

function gotoOKRReport3() {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getOKRReport2', '_blank'); return false;
    window.open(JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getOKRReport3", "_blank");
    return false;
}

function gotoDeptSLA2Collector_Mirutov() {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getEpicsTimeMetrics2?dateFrom=2023-04-01&dateTo=2023-06-30&ra=cl&size=small&done', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getDeptSLAReport?";

    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "dept=" + "Коллектор" + "&";
    url += "showEpicName" + "&";
    url += "printJQL";
    window.open(url, "_blank");
    return false;
}

function gotoEpicsTimeMetrics2Collector_Mirutov() {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getEpicsTimeMetrics2?dateFrom=2023-04-01&dateTo=2023-06-30&ra=cl&size=small&done', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getFlowTimeMetrics?";
    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "depts=" + "Коллектор";
    window.open(url, "_blank");
    return false;
}

function gotoStoryPointsBoard(subdivision) {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getStoryPointsBoard?subdivision=%D0%9A%D0%BE%D0%BB%D0%BB%D0%B5%D0%BA%D1%82%D0%BE%D1%80', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getStoryPointsBoard?";
    url += "subdivision=" + subdivision;
    window.open(url, "_blank");
    return false;
}

function prepareFromDate(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth() - FOR_LAST_MONTHS,
        date.getDate()
    );
}

function dateToYYYYMMDD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return "" + y + "-" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);
}