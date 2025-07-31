var JIRA_URL = "https://jira.redelephant.ru";
var SCRIPT_RUNNER_PATH = "rest/scriptrunner/latest/custom";
var DATE_FROM = "2023-07-01";
var FOR_LAST_MONTHS = 3;
var TEAMS = [
    { teamId: "QPAYTEAMS-576", teamName: "CheersForКейптаун" },
    { teamId: "QPAYTEAMS-577", teamName: "Азгард" },
    { teamId: "QPAYTEAMS-578", teamName: "Хьюстон" },
    { teamId: "QPAYTEAMS-579", teamName: "Где деньги, Лебовски?" },
    { teamId: "QPAYTEAMS-580", teamName: "Фримэны" },
    { teamId: "QPAYTEAMS-1158", teamName: "CollValley" },
    { teamId: "QPAYTEAMS-1383", teamName: "7up"},
    { teamId: "QPAYTEAMS-1120", teamName: "Ковальски, Анализ" }
];
var EPIC_SIZES = [1, 2, 3, 5, 8, 13, 21];
var WORKLOAD_JQL_FILTER_NAME = "Коллекшн - фильтр трудозатрат";

function gotoCollectionMetricsBoard(reportType) {
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
            break;
        case "checkFinishDate":
            url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
            break;
        case "workloadMetrics":
            url += "jqlFilterName=" + WORKLOAD_JQL_FILTER_NAME + "&";
            break;
        case "deptMetrics":
            break;
    }
    url += "report=" + reportType;
    window.open(url, "_blank");
    return false;
}

function gotoDeptReport_Mirutov(subdivision) {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getDeptReport?dept=Коллектор&dateFrom=2025-04-01&dateTo=2025-04-30&type=B&level=O', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getDeptReport?";

    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "dept=" + subdivision + "&";
    url += "type=B" + "&";
    url += "level=O";
    window.open(url, "_blank");
    return false;
}

function gotoDeptSLABoard_Mirutov(subdivision) {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getEpicsTimeMetrics2?dateFrom=2023-04-01&dateTo=2023-06-30&ra=cl&size=small&done', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getDeptSLAReport?";

    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "dept=" + subdivision + "&";
    url += "showEpicName" + "&";
    url += "printJQL";
    window.open(url, "_blank");
    return false;
}

function gotoFlowTimeMetricsBoard_Mirutov(subdivision) {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getEpicsTimeMetrics2?dateFrom=2023-04-01&dateTo=2023-06-30&ra=cl&size=small&done', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getFlowTimeMetrics?";
    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "depts=" + subdivision;
    window.open(url, "_blank");
    return false;
}

function gotoStoryPointsBoard_Mirutov(subdivision) {
// window.open('https://jira.ftc.ru/rest/scriptrunner/latest/custom/getStoryPointsBoard?subdivision=%D0%9A%D0%BE%D0%BB%D0%BB%D0%B5%D0%BA%D1%82%D0%BE%D1%80', '_blank'); return false;
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getStoryPointsBoard?";
    url += "subdivision=" + subdivision;
    window.open(url, "_blank");
    return false;
}

function gotoReopenedBoard_Mirutov(subdivision) {
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getQPAYReopenedEpicsStatusHistory?";
    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "subdivision=" + subdivision;
    window.open(url, "_blank");
    return false;
}

function gotoQualityBoard_Mirutov(subdivision) {
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getQualityReport?";
    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "ra=" + subdivision;
    window.open(url, "_blank");
    return false;
}

function gotoChangingDifficultyScoreBoard_Mirutov(subdivision) {
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/ChangingDifficultyScoreReport?";
    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "mode=all" + "&";
    url += "ra=" + subdivision;
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