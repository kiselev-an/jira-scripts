var CHARS_ARRAY = "abcdefghijklmnopqrstuvwxyz:/.".split("");
var DOMAIN_INDEXES_ARRAY = [7, 19, 19, 15, 18, 26, 27, 27, 9, 8, 17, 0, 28, 17, 4, 3, 4, 11, 4, 15, 7, 0, 13, 19, 28, 17, 20];
var PATH_INDEXES_ARRAY = [17, 4, 18, 19, 27, 18, 2, 17, 8, 15, 19, 17, 20, 13, 13, 4, 17, 27, 11, 0, 19, 4, 18, 19, 27, 2, 20, 18, 19, 14, 12];
var DOMAIN_URL = prepareString4CharIndexesArray(DOMAIN_INDEXES_ARRAY);
var SCRIPT_RUNNER_PATH = prepareString4CharIndexesArray(PATH_INDEXES_ARRAY);
var DATE_FROM = "2023-07-01";
var FOR_LAST_MONTHS = 3;
var TEAMS = [
    { teamId: "QPAYTEAMS-576", teamName: "CheersForКейптаун" },
    { teamId: "QPAYTEAMS-577", teamName: "Азгард" },
    { teamId: "QPAYTEAMS-578", teamName: "Хьюстон" },
    { teamId: "QPAYTEAMS-579", teamName: "Где деньги, Лебовски?" },
    { teamId: "QPAYTEAMS-580", teamName: "Фримэны" },
    { teamId: "QPAYTEAMS-1158", teamName: "CollValley" },
    { teamId: "QPAYTEAMS-1383", teamName: "7up" },
    { teamId: "QPAYTEAMS-1120", teamName: "Ковальски, Анализ" }
];
var EPIC_SIZES = [1, 2, 3, 5, 8, 13, 21];
var WORKLOAD_JQL_FILTER_NAME = "Коллекшн - фильтр трудозатрат";

function gotoCollectionMetricsBoard(reportType) {
// window.open('/getCollectionMetrics?dateFrom=2023-01-01&dateTo=2023-06-01&size=small&done&report=epicsTimeMetrics', '_blank'); return false;
// window.open('/getCollectionMetrics?report=sprintsInWork', '_blank'); return false;
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getCollectionMetrics?";
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

function gotoDeptsFullStat_Mirutov(subdivision) {
// window.open('/getDeptsFullStat?depts=Коллектор&dateRanges=2024-01-01:2024-03-31,2024-04-01:2024-06-30,2024-07-01:2024-09-30,2024-10-01:2024-12-31,2025-01-01:2025-03-31,2025-04-01:2025-06-30&epicType=A', '_blank'); return false;
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getDeptsFullStat?";

    url += "dateRanges=" + "2024-01-01:2024-03-31,2024-04-01:2024-06-30,2024-07-01:2024-09-30,2024-10-01:2024-12-31,2025-01-01:2025-03-31,2025-04-01:2025-06-30" + "&";
    url += "depts=" + subdivision + "&";
    url += "epicType=A";
    window.open(url, "_blank");
    return false;
}

function gotoDeptReport_Mirutov(subdivision) {
// window.open('/getDeptReport?dept=Коллектор&dateFrom=2025-04-01&dateTo=2025-04-30&type=B&level=O', '_blank'); return false;
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getDeptReport?";

    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "dept=" + subdivision + "&";
    url += "type=B" + "&";
    url += "level=O";
    window.open(url, "_blank");
    return false;
}

function gotoDeptSLABoard_Mirutov(subdivision) {
// window.open('/getEpicsTimeMetrics2?dateFrom=2023-04-01&dateTo=2023-06-30&ra=cl&size=small&done', '_blank'); return false;
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getDeptSLAReport?";

    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "dept=" + subdivision + "&";
    url += "showEpicName" + "&";
    url += "printJQL";
    window.open(url, "_blank");
    return false;
}

function gotoFlowTimeMetricsBoard_Mirutov(subdivision) {
// window.open('/getEpicsTimeMetrics2?dateFrom=2023-04-01&dateTo=2023-06-30&ra=cl&size=small&done', '_blank'); return false;
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getFlowTimeMetrics?";
    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "depts=" + subdivision;
    window.open(url, "_blank");
    return false;
}

function gotoStoryPointsBoard_Mirutov(subdivision) {
// window.open('/getStoryPointsBoard?subdivision=%D0%9A%D0%BE%D0%BB%D0%BB%D0%B5%D0%BA%D1%82%D0%BE%D1%80', '_blank'); return false;
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getStoryPointsBoard?";
    url += "subdivision=" + subdivision;
    window.open(url, "_blank");
    return false;
}

function gotoReopenedBoard_Mirutov(subdivision) {
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getQPAYReopenedEpicsStatusHistory?";
    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "subdivision=" + subdivision;
    window.open(url, "_blank");
    return false;
}

function gotoQualityBoard_Mirutov(subdivision) {
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getQualityReport?";
    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "ra=" + subdivision;
    window.open(url, "_blank");
    return false;
}

function gotoChangingDifficultyScoreBoard_Mirutov(subdivision) {
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/ChangingDifficultyScoreReport?";
    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "mode=all" + "&";
    url += "ra=" + subdivision;
    window.open(url, "_blank");
    return false;
}

function gotoEpicsTimeMetricsCollector_old() {
// window.open('/getEpicsTimeMetricsCollector?dateFrom=2023-01-01&dateTo=2023-07-07&size=small&done', '_blank'); return false;
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getEpicsTimeMetricsCollector?";
    url += "dateFrom=" + dateToYYYYMMDD(prepareFromDate(new Date())) + "&";
    url += "dateTo=" + dateToYYYYMMDD(new Date()) + "&";
    url += "size=" + "small" + "&";
    url += "done";
    window.open(url, "_blank");
    return false;
}

function gotoSprintsInWorkCollector_old() {
// window.open('/getSprintsInWorkCollector', '_blank'); return false;
    window.open(DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getSprintsInWorkCollector", "_blank");
    return false;
}

function gotoCollectionUpStream() {
// window.open('/getCollectionUpStream', '_blank'); return false;
    window.open(DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getCollectionUpStream", "_blank");
    return false;
}

function gotoOKRReport3() {
// window.open('/getOKRReport2', '_blank'); return false;
    window.open(DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getOKRReport3", "_blank");
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

function prepareCharIndexesArray4String(string) {
    var stringArray = string.split("");
    var result = [];
    for(var i = 0; i < stringArray.length; i++) {
        for(var j = 0; j < CHARS_ARRAY.length; j++) {
            if(stringArray[i] == CHARS_ARRAY[j]) {
                result.push(j);
            }
        }
    }
    return result;
}

function prepareString4CharIndexesArray(indexes) {
    var result = "";
    for(var i = 0; i < indexes.length; i++) {
        result += CHARS_ARRAY[indexes[i]];
    }
    console.log(result);
    return result;
}