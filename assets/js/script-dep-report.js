var DATE_FORMAT_PERIOD = "DD MMMM YYYY";
var DATE_FORMAT_MONTH = "MMMM YYYY";
var DEBUG_MODE = true;

function onLoadDepReportPage() {
    initRangePickers();
    loadDepReportsContent();
    initTextareaEditorsByDefaults()
    initEventsTextareaEditors();
    initEventsTextareaViews();
}

function prepareGetDeptReportURL(range) {
//https://jira.ftc.ru/rest/scriptrunner/latest/custom/getDeptReport?dateFrom=2025-05-01&dateTo=2025-06-04&dept=Коллектор&type=B&level=O
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getDeptReport?";
    if(DEBUG_MODE) {
        url = "./assets/data/test-dep-report.html?";
    }
    url += "dept=" + "Коллектор" + "&";
    url += "dateFrom=" + dateToYYYYMMDD(range.from.toDate()) + "&";
    url += "dateTo=" + dateToYYYYMMDD(range.to.toDate()) + "&";
    url += "level=" + "O" + "&";
    url += "type=" + "A";

    return url;
}

function prepareGetQualityReportURL(range) {
//https://jira.ftc.ru/rest/scriptrunner/latest/custom/getQualityReport?dateFrom=2025-05-01&dateTo=2025-06-04&ra=Коллектор
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getQualityReport?";
    if(DEBUG_MODE) {
        url = "./assets/data/test-quality-report.html?";
    }
    url += "ra=" + "Коллектор" + "&";
    url += "dateFrom=" + dateToYYYYMMDD(range.from.toDate()) + "&";
    url += "dateTo=" + dateToYYYYMMDD(range.to.toDate());

    return url;
}

function loadDepReportsContent() {
    var rangeMonthPickerData = $('#rangeMonthPicker').data('daterangepicker');
    var rangePeriodPickerData = $('#rangePeriodPicker').data('daterangepicker');

    var rangeMonthData = {"from": rangeMonthPickerData.startDate, "to": rangeMonthPickerData.endDate};
    var rangePeriodData = {"from": rangePeriodPickerData.startDate, "to": rangePeriodPickerData.endDate};

    var getDeptReportMonthURL = prepareGetDeptReportURL(rangeMonthData);
    var getDeptReportPeriodURL = prepareGetDeptReportURL(rangePeriodData);
    var getQualityReportMonthURL = prepareGetQualityReportURL(rangeMonthData);

    var teams = "";
    TEAMS.forEach((item, index, arr) => {
        teams += item.teamId + (index === arr.length - 1 ? "" : ",");
    });

    jQuery.get({
        url: getDeptReportMonthURL + "&teams=" + teams,
        success: function(data) {
            responseHandlerDeptReportMonth(data, rangeMonthData);
        }
    });

    jQuery.get({
        url: getDeptReportPeriodURL + + "&teams=" + teams,
        success: function(data) {
            responseHandlerDeptReportPeriod(data, rangePeriodData);
        }
    });

    var monthStr = rangeMonthData.to.format(DATE_FORMAT_MONTH);
    $("#subHeaderTeams").html(monthStr);
    TEAMS.forEach((item) => {
        jQuery.get({
            url: getDeptReportMonthURL + "&teams=" + item.teamId,
            async: false,
            success: function(data) {
                responseHandlerTeamReportMonth(data, item, rangeMonthData);
            }
        });
    });

    jQuery.get({
        url: getQualityReportMonthURL,
        success: function(data) {
            responseHandlerQualityReportMonth(data, rangeMonthData);
        }
    });
}

function responseHandlerDeptReportMonth(responseData, range) {
    //alert("Data: " + responseData);
    var responseHtml = $.parseHTML(responseData, null);
    var monthStr = range.to.format(DATE_FORMAT_MONTH);

    var depTotalCurrentMonthMetricsTableHTML = getMetricsTableHTML(0, $(responseHtml));
    $("#depTotalCurrentMonthMetricsDiv").css('width', '50%').css('text-align','center');
    $("#depTotalCurrentMonthMetricsDiv").html("<b>" + monthStr + "</b>" + depTotalCurrentMonthMetricsTableHTML);

    var depTotalInjectionMetricsTableHTML = getMetricsTableHTML(2, $(responseHtml));
    $("#depTotalInjectionMetricsDiv").css('width', '70%').css('text-align','center');
    $("#depTotalInjectionMetricsDiv").html(depTotalInjectionMetricsTableHTML);
    $("#subHeaderInjection").html(monthStr);
}

function responseHandlerQualityReportMonth(responseData, range) {
    var responseHtml = $.parseHTML(responseData, null);
    var monthStr = range.to.format(DATE_FORMAT_MONTH);

    var depTotalQualityMetricsTableHTML = getMetricsTableHTML(0, $(responseHtml));
    $("#depTotalQualityMetricsDiv").css('width', '50%').css('text-align','center');
    $("#depTotalQualityMetricsDiv").html(depTotalQualityMetricsTableHTML);
    $("#subHeaderQuality").html(monthStr);
}

function responseHandlerDeptReportPeriod(responseData, range) {
    var responseHtml = $.parseHTML(responseData, null);
    var periodStr = range.from.format(DATE_FORMAT_PERIOD) + ' - ' + range.to.format(DATE_FORMAT_PERIOD);

    var depTotalPeriodMetricsTableHTML = getMetricsTableHTML(0, $(responseHtml));
    $("#depTotalPeriodMetricsDiv").css('width', '50%').css('text-align','center');
    $("#depTotalPeriodMetricsDiv").html("<b>" + periodStr + "</b>" + depTotalPeriodMetricsTableHTML);
}

function responseHandlerTeamReportMonth(responseData, team, range) {
    var responseHtml = $.parseHTML(responseData, null);
    var teamMetricsTableHTML = getMetricsTableHTML(0, $(responseHtml));

    var teamMetricsDiv = $("#teamMetricsDiv_" + team.teamId);
    if(teamMetricsDiv && teamMetricsDiv != null && teamMetricsDiv != 'undefined' && teamMetricsDiv.length > 0) {
        teamMetricsDiv.html("<b>" + team.teamName + "</b>" + teamMetricsTableHTML);
    } else {
        var htmlString = $("#depTeamsMetricsDiv").html();
        htmlString += "<div id=\"teamMetricsDiv_" + team.teamId + "\" ";
        htmlString += "style=\"width: 50%; text-align: center\">";
        htmlString += "<b>" + team.teamName + "</b>";
        htmlString += teamMetricsTableHTML;
        htmlString += "</div>";
        htmlString += "<div id=\"analyseTeamMetrics-" + team.teamId + "_div\" class=\"textarea-view\"></div>";
        htmlString += "<label><textarea id=\"analyseTeamMetrics-" + team.teamId + "\" placeholder=\"Напиши тут 'пасхалку' команде '" + team.teamName + "'\" " +
            "cols=\"60\" rows=\"3\" class=\"textarea-editor\">" + (team.comment && team.comment.trim().length > 0 ? team.comment : "") +
            "</textarea></label>" +
            "<p></p><p></p>";
        $("#depTeamsMetricsDiv").html(htmlString);
    }
}

function getMetricsTableHTML(index, dataDOM) {
    var resTables = $(dataDOM).filter("table");
    var table1 = $(resTables[index]);
    $(table1).addClass('timeMetricsTableView');
    var tableHTML = $(table1).prop('outerHTML');
    return tableHTML;
}

function initTextareaEditorsByDefaults() {
    $("#welcome").val("").prop("placeholder", WELCOME_PLACEHOLDER);
    $("#overview").val("").prop("placeholder", OVERVIEW_PLACEHOLDER);
    $("#analyseDepTotalCurrentMonthMetrics").val("").prop("placeholder", analyseDepTotalCurrentMonthMetrics_PLACEHOLDER);
    $("#analyseDepTotalPeriodMetrics").val("").prop("placeholder", analyseDepTotalPeriodMetrics_PLACEHOLDER);
    $("#analyseDepTotalInjectionMetrics").val("").prop("placeholder", analyseDepTotalInjectionMetrics_PLACEHOLDER);
    $("#analyseDepTotalQualityMetrics").val("").prop("placeholder", analyseDepTotalQualityMetrics_PLACEHOLDER);
    $("#analyseTeamMetrics-QPAYTEAMS-576").val("");
    $("#analyseTeamMetrics-QPAYTEAMS-577").val("");
    $("#analyseTeamMetrics-QPAYTEAMS-578").val("");
    $("#analyseTeamMetrics-QPAYTEAMS-579").val("");
    $("#analyseTeamMetrics-QPAYTEAMS-580").val("");
    $("#analyseTeamMetrics-QPAYTEAMS-1158").val("");
    $("#summary").val("").prop("placeholder", SUMMARY_PLACEHOLDER);
    reinitTextareaViews();
}

function confirmInitTextareaEditorsByDefaults() {
    if(confirm("Если продолжить, то все твои \"записульки\" потеряются. Уверен?")) {
        initTextareaEditorsByDefaults();
    }
}

function initTextareaEditorsByExamples() {
    $("#welcome").val(EXAMPLE_WELCOME_TEXT)
        .prop("placeholder", EXAMPLE_DEFAULT_USERNAME + "! " + WELCOME_PLACEHOLDER);
    $("#overview").val(EXAMPLE_OVERVIEW_TEXT)
        .prop("placeholder", EXAMPLE_DEFAULT_USERNAME + "! " + OVERVIEW_PLACEHOLDER);
    $("#analyseDepTotalCurrentMonthMetrics").val(EXAMPLE_analyseDepTotalCurrentMonthMetrics_TEXT)
        .prop("placeholder", EXAMPLE_DEFAULT_USERNAME + "! " + analyseDepTotalCurrentMonthMetrics_PLACEHOLDER);
    $("#analyseDepTotalPeriodMetrics").val(EXAMPLE_analyseDepTotalPeriodMetrics_TEXT)
        .prop("placeholder", EXAMPLE_DEFAULT_USERNAME + "! " + analyseDepTotalPeriodMetrics_PLACEHOLDER);
    $("#analyseDepTotalInjectionMetrics").val(EXAMPLE_analyseDepTotalInjectionMetrics_TEXT)
        .prop("placeholder", EXAMPLE_DEFAULT_USERNAME + "! " + analyseDepTotalInjectionMetrics_PLACEHOLDER);
    $("#analyseDepTotalQualityMetrics").val(EXAMPLE_analyseDepTotalQualityMetrics_TEXT)
        .prop("placeholder", EXAMPLE_DEFAULT_USERNAME + "! " + analyseDepTotalQualityMetrics_PLACEHOLDER);
    $("#analyseTeamMetrics-QPAYTEAMS-576").val(EXAMPLE_analyseTeamMetrics_QPAYTEAMS_576_TEXT);
    $("#analyseTeamMetrics-QPAYTEAMS-577").val(EXAMPLE_analyseTeamMetrics_QPAYTEAMS_577_TEXT);
    $("#analyseTeamMetrics-QPAYTEAMS-578").val(EXAMPLE_analyseTeamMetrics_QPAYTEAMS_578_TEXT);
    $("#analyseTeamMetrics-QPAYTEAMS-579").val(EXAMPLE_analyseTeamMetrics_QPAYTEAMS_579_TEXT);
    $("#analyseTeamMetrics-QPAYTEAMS-580").val(EXAMPLE_analyseTeamMetrics_QPAYTEAMS_580_TEXT);
    $("#analyseTeamMetrics-QPAYTEAMS-1158").val(EXAMPLE_analyseTeamMetrics_QPAYTEAMS_1158_TEXT);
    $("#summary").val(EXAMPLE_SUMMARY_TEXT)
        .prop("placeholder", EXAMPLE_DEFAULT_USERNAME + "! " + SUMMARY_PLACEHOLDER);
    reinitTextareaViews();
}

function confirmInitTextareaEditorsByExamples() {
    if(confirm("Если продолжить, то все твои \"записульки\" потеряются. Уверен?")) {
        initTextareaEditorsByExamples();
    }
}

function initEventsTextareaEditors() {
    $(".textarea-editor").each(function() {
        $(this).blur(function() {
            reinitTextareaViews();
            $(".textarea-editor").each(function() {
                $(this).css('display', 'none');     //.textarea-editor -> hidden
            });
            $(".textarea-view").each(function() {
                $(this).css('display', 'block');    //.textarea-view -> visible
            });
        });
    });
}

function reinitTextareaViews() {
    $(".textarea-editor").each(function() {
        if($(this).val() && $(this).val().trim().length > 0) {
            $("#" + $(this).prop("id") + "_div").css('color', 'black');
            $("#" + $(this).prop("id") + "_div").text($(this).val());
        } else {
            //alert($(this).prop("id"));
            $("#" + $(this).prop("id") + "_div").css('color', 'grey');
            $("#" + $(this).prop("id") + "_div").text($(this).prop("placeholder"));
        }
    });
}

function initEventsTextareaViews() {
    $(".textarea-view").each( function() {
        $(this).on('click', function() {
            $(".textarea-view").each(function() {
                $(this).css('display', 'none');     //.textarea-view -> hidden
            });

            $(".textarea-editor").each(function() {
                $(this).css('display', 'block');    //.textarea-editor -> visible
            });
            $("#" + $(this).prop("id").split("_")[0]).focus();
        });
    });
}

function prepareDateRangePicker(id, start, end, ranges, locale, showCustomRangeLabel) {
    $("#" + id).daterangepicker({
        startDate: start,
        endDate: end,
        ranges: ranges,
        locale: locale,
        showCustomRangeLabel: showCustomRangeLabel
    }, function (start, end) {
        updateRangePikerView(id, start, end);
        loadDepReportsContent();
    });
    updateRangePikerView(id, start, end);
}

function initRangePickers() {
    moment.locale('ru');
    var localeRU = {
        "format": DATE_FORMAT_PERIOD,
        "separator": " - ",
        "applyLabel": "Применить",
        "cancelLabel": "Закрыть",
        "fromLabel": "С",
        "toLabel": "По",
        "customRangeLabel": "Пользовательский"
    };

    var rangesMonths = {
       'Два месяца назад': [moment().subtract(2, 'month').startOf('month'), moment().subtract(2, 'month').endOf('month')],
       'Предыдущий месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
       'Текущий месяц': [moment().startOf('month'), moment()]
    };
    prepareDateRangePicker("rangeMonthPicker", moment().startOf('month'), moment(), rangesMonths, localeRU, false);

    var rangesPeriods = {
       //'Today': [moment(), moment()],
       //'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
       //'Last 7 Days': [moment().subtract(6, 'days'), moment()],
       //'Last 30 Days': [moment().subtract(29, 'days'), moment()],
       //'Текущий месяц': [moment().startOf('month'), moment().endOf('month')],
       //'Предыдущий месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
       'Два квартала назад': [moment().subtract(2, 'quarter').startOf('quarter'), moment().subtract(2, 'quarter').endOf('quarter')],
       'Предыдущий квартал': [moment().subtract(1, 'quarter').startOf('quarter'), moment().subtract(1, 'quarter').endOf('quarter')],
       'Текущий квартал': [moment().startOf('quarter'), moment()]
    };
    prepareDateRangePicker("rangePeriodPicker", moment().startOf('quarter'), moment(), rangesPeriods, localeRU, true);
}

function updateRangePikerView(id, start, end) {
    $('#' + id + ' span').html(start.format(DATE_FORMAT_PERIOD) + ' - ' + end.format(DATE_FORMAT_PERIOD));
}

function sendEmail() {
    var emailAddresses = prompt("Укажите на какие email адреса требуется отправить сообщение?", 'a.kiseljov@korona.net'); // <-- для IE
    alert(emailAddresses  + "\n" +  $("#container").html());

    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getCollectionMetrics?action=sendEmail";
    if(DEBUG_MODE) {
        url = "http://localhost:63342?report=sendEmail";
    }

    jQuery.post({
        url: url,
        data: { "emailBody": $("#container").html(), "emailAddresses": emailAddresses},
        success: function(data) {
            alert(data + " |||| ");
        },
        dataType: "json"
    });
}