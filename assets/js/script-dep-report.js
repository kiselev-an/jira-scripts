var DATE_FORMAT_PERIOD = "DD MMMM YYYY";
var DATE_FORMAT_MONTH = "MMMM YYYY";
var DATE_FORMAT_MONTH_MIN = "MMMM";
var DEBUG_MODE = false;

function onLoadDepReportPage() {
    DEBUG_MODE = window.location.href.startsWith("http://localhost"); //TODO: switcher to debug mode
    initRangePickers();
    initSelectInputs();
    loadDepReportsContent();
    initTextareaEditorsByDefaults()
    initEventsTextareaEditors();
    initEventsTextareaViews();
}

function prepareGetDeptReportURL(options) {
//https://jira.ftc.ru/rest/scriptrunner/latest/custom/getDeptReport?dateFrom=2025-05-01&dateTo=2025-06-04&dept=Коллектор&type=B&level=O
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getDeptReport?";
    if(DEBUG_MODE) {
        url = "./assets/data/test-dep-report.html?";
    }
    url += "dept=" + "Коллектор" + "&";
    url += "dateFrom=" + dateToYYYYMMDD(options.from.toDate()) + "&";
    url += "dateTo=" + dateToYYYYMMDD(options.to.toDate()) + "&";
    url += "level=" + options.reportLevel + "&";
    url += "type=" + options.epicTypes;

    url += options.teams && options.teams.length > 0 ? "&teams=" : "";
    options.teams.forEach((item, index, arr) => {
        url += item.teamId + (index === arr.length - 1 ? "" : ",");
    });

    return url;
}

function prepareGetQualityReportURL(options) {
//https://jira.ftc.ru/rest/scriptrunner/latest/custom/getQualityReport?dateFrom=2025-05-01&dateTo=2025-06-04&ra=Коллектор
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getQualityReport?";
    if(DEBUG_MODE) {
        url = "./assets/data/test-quality-report.html?";
    }
    url += "ra=" + "Коллектор" + "&";
    url += "dateFrom=" + dateToYYYYMMDD(options.from.toDate()) + "&";
    url += "dateTo=" + dateToYYYYMMDD(options.to.toDate());

    return url;
}

function prepareGetDeptSLAReportURL(options) {
//https://jira.redelephant.ru/rest/scriptrunner/latest/custom/getDeptSLAReport?level=O&type=B&dateFrom=2025-04-01&dateTo=2025-06-29&dept=Коллектор
    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getDeptSLAReport?";
    if(DEBUG_MODE) {
        url = "./assets/data/test-dep-report.html?";
    }
    url += "dept=" + "Коллектор" + "&";
    url += "dateFrom=" + dateToYYYYMMDD(options.from.toDate()) + "&";
    url += "dateTo=" + dateToYYYYMMDD(options.to.toDate()) + "&";
    url += "level=" + options.reportLevel + "&";
    url += "type=" + options.epicTypes;

    return url;
}

function loadDepReportsContent() {
    var rangeMonthPickerData = $('#rangeMonthPicker').data('daterangepicker');
    var optionsMonthData = {"from": rangeMonthPickerData.startDate, "to": rangeMonthPickerData.endDate, "reportLevel": $("#reportLevel").val(), "epicTypes": $("#epicTypes").val(), "teams": TEAMS};
    var monthStr = optionsMonthData.to.format(DATE_FORMAT_MONTH);
    $(document).attr("title", $(document).attr("title").split("_")[0] + "_" + monthStr);
    jQuery.get({
        url: prepareGetDeptReportURL(optionsMonthData),
        success: function(data) {
            responseHandlerDeptReportMonth(data, optionsMonthData, this.url);
        }
    });

    var rangePeriodPickerData = $('#rangePeriodPicker').data('daterangepicker');
    var optionsPeriodData = {"from": rangePeriodPickerData.startDate, "to": rangePeriodPickerData.endDate, "reportLevel": $("#reportLevel").val(), "epicTypes": $("#epicTypes").val(), "teams": TEAMS};
    jQuery.get({
        url: prepareGetDeptReportURL(optionsPeriodData),
        success: function(data) {
            responseHandlerDeptReportPeriod(data, optionsPeriodData, this.url);
        }
    });

    $("#subHeaderTeams").html(monthStr);
    jQuery.get({
        url: prepareGetDeptSLAReportURL(optionsMonthData),
        success: function(dataSLA) {
            TEAMS.forEach((item) => {
                var optionsTeamMonthData = {"from": rangeMonthPickerData.startDate, "to": rangeMonthPickerData.endDate, "reportLevel": $("#reportLevel").val(), "epicTypes": $("#epicTypes").val(), "teams": [item]};
                jQuery.get({
                    url: prepareGetDeptReportURL(optionsTeamMonthData),
                    async: false,
                    success: function(data) {
                        responseHandlerTeamReportMonth(data, item, optionsTeamMonthData, this.url);
                    }
                });
            });
        }
    });

    jQuery.get({
        url: prepareGetQualityReportURL(optionsMonthData),
        success: function(data) {
            responseHandlerQualityReportMonth(data, optionsMonthData, this.url);
        }
    });
}

function replaceContentByH1(element) {
    var elContent = $(element).html(); // Get the content of the element
    $(element).replaceWith('<h1>' + elContent + '</h1>'); // Replace the element with an h1
}

function prepareCleanPageHTML(expandableClean, callBackOnPageLoad) {
    var pageDataClone = $("html").clone();
    pageDataClone.find('label').each(function(index, element) {
        $(element).remove();
    });
    pageDataClone.find('style').each(function(index, element) {
        $(element).remove();
    });
    pageDataClone.find('script').each(function(index, element) {
        $(element).remove();
    });
    pageDataClone.find('textarea').each(function(index, element) {
        $(element).remove();
    });
    pageDataClone.find('button').each(function(index, element) {
        $(element).remove();
    });
    pageDataClone.find('input[type="checkbox"]').each(function(index, element) {
        $(element).remove();
    });

    pageDataClone.find('.controlPanel').remove();
    pageDataClone.find('.daterangepicker').each(function(index, element) {
         $(element).remove();
    });
    pageDataClone.find('.textarea-view-notincluded').each(function(index, element) {
        $(element).remove();
    });
    pageDataClone.find('.notincluded').each(function(index, element) {
        $(element).remove();
    });

    if(expandableClean) {
        pageDataClone.find('meta').each(function(index, element) {
            $(element).remove();
        });
        pageDataClone.find('link').each(function(index, element) {
            $(element).remove();
        });
        pageDataClone.find('img').each(function(index, element) {
            $(element).remove();
        });

        pageDataClone.find('.sub-header').each(function(index, element) {
            replaceContentByH1(element);
        });
    }

    var headDataHTML = pageDataClone.find('head').html();
    var bodyDataHTML = pageDataClone.find('body').html();
    var result = '<html><head>' + headDataHTML + '</head>';
    result += '<body' + (callBackOnPageLoad && callBackOnPageLoad.length > 0 ? ' onload="' + callBackOnPageLoad + '"': '') +  '>' + bodyDataHTML + '</body></html>';
    return result;
}

function sendEmail() {
    var emailAddresses = prompt("Укажите на какие email адреса требуется отправить сообщение?", 'a.kiseljov@korona.net'); // <-- для IE
    if (!emailAddresses || null == emailAddresses) {
        return;
    }

    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getCollectionMetrics?action=sendEmail";
    if(DEBUG_MODE) {
        url = "./assets/data/test-dep-report.html?action=sendEmail";
    }

    var emailDataHTML = prepareCleanPageHTML(true, null);
    //alert("  --- " + emailDataHTML);

    jQuery.post({
        url: url,
        data: JSON.stringify({ "emailSubject": $(document).attr("title"), "emailAddresses": emailAddresses, "emailBody": emailDataHTML}),
        success: function(data) {
            alert("Отчет успешно отправлен! ;)");
        },
        error: function(data) {
            alert("Что-то пошло не так. Произошла ошибка :(");
        },
        contentType: "application/json"
    });
}

function generatePDF() {
    var printWindow = window.open('', 'PRINT', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,height=650,width=900,top=0,left=0');
    printWindow.document.write(prepareCleanPageHTML(false, "window.print();window.close();"));
    printWindow.document.close(); // necessary for IE >= 10
    printWindow.focus(); // necessary for IE >= 10*/
}

function publishingToConfluence() {
    var pass = prompt("Введите секретное слово ;)", 'u5YkU'); // <-- для IE
    if (!pass || null == pass) {
        return;
    }

    var url = JIRA_URL + "/" + SCRIPT_RUNNER_PATH + "/getCollectionMetrics?action=publishingPage";
    if(DEBUG_MODE) {
        url = "./assets/data/test-dep-report.html?action=publishingPage";
    }

    var pageDataHTML = prepareCleanPageHTML(true, null);

    jQuery.post({
        url: url,
        data: JSON.stringify({ "secretPass": pass, "pageTitle": $(document).attr("title"), "pageBody": pageDataHTML}),
        success: function(data) {
            alert("Отчет успешно опубликован! ;)");
            $("#uploadedReportUrlDiv").html("<a href='" + data + "' target='_blank' rel='noopener noreferrer'>Ссылка на опубликованный отчет</a>");
        },
        error: function(data) {
            alert("Что-то пошло не так. Произошла ошибка :(");
        },
        contentType: "application/json"
    });
}

function responseHandlerDeptReportMonth(responseData, range, url) {
    //alert("Data: " + responseData);
    var responseHtml = $.parseHTML(responseData, null);
    var monthStr = range.to.format(DATE_FORMAT_MONTH);

    var depTotalCurrentMonthMetricsTableHTML = getMetricsTableHTML(0, $(responseHtml));
    $("#depTotalCurrentMonthMetricsDiv").addClass("slaContent");
    //css('width', '30%').css('text-align','center');
    $("#depTotalCurrentMonthMetricsDiv").html("<b>" + monthStr + "</b>" + depTotalCurrentMonthMetricsTableHTML);

    var depTotalInjectionMetricsTableHTML = getMetricsTableHTML(2, $(responseHtml));
    $("#depTotalInjectionMetricsDiv").css('width', '70%').css('text-align','center');
    $("#depTotalInjectionMetricsDiv").html(depTotalInjectionMetricsTableHTML);
    $("#subHeaderInjection").html(monthStr);
}

function responseHandlerQualityReportMonth(responseData, range, url) {
    var responseHtml = $.parseHTML(responseData, null);
    var monthStr = range.to.format(DATE_FORMAT_MONTH);

    var depTotalQualityMetricsTableHTML = getMetricsTableHTML(0, $(responseHtml));
    var wasCancelledHTML = getContentHTML(0, $(responseHtml), "p", function() {
        return $(this).text().includes("cancelled");
    });
    $("#depTotalQualityMetricsDiv").css('width', '60%').css('text-align','center');
    $("#depTotalQualityMetricsDiv").html(depTotalQualityMetricsTableHTML + wasCancelledHTML);
    $("#subHeaderQuality").html(monthStr);
}

function responseHandlerDeptReportPeriod(responseData, range, url) {
    var responseHtml = $.parseHTML(responseData, null);
    var periodStr = range.from.format(DATE_FORMAT_PERIOD) + ' - ' + range.to.format(DATE_FORMAT_PERIOD);

    var depTotalPeriodMetricsTableHTML = getMetricsTableHTML(0, $(responseHtml));
    $("#depTotalPeriodMetricsDiv").addClass("slaContent");
    //.css('width', '30%').css('text-align','center');
    $("#depTotalPeriodMetricsDiv").html("<b>" + periodStr +"</b>" + depTotalPeriodMetricsTableHTML);
}

function responseHandlerTeamReportMonth(responseData, team, range, url) {
    var responseHtml = $.parseHTML(responseData, null);
    var teamMetricsTableHTML = getMetricsTableHTML(0, $(responseHtml));

    var htmlTeamMetricsString = "<b>" + team.teamName + "</b>";
    htmlTeamMetricsString += "<label><input type=\"checkbox\" checked=\"checked\" ";
    htmlTeamMetricsString += "onclick=\"toggleContents(['teamMetricsDiv_" + team.teamId + "', 'analyseTeamMetrics-" + team.teamId + "_div']);\" ";
    htmlTeamMetricsString += "title=\"Исключить/Включить секцию в отчете\"/></label>";

    htmlTeamMetricsString += "<table class=\"teamMetricsTableViewWrap\"><tr>";
    htmlTeamMetricsString += "<td class=\"emptyCell\"></td>";
    htmlTeamMetricsString += "<td>" + teamMetricsTableHTML + "</td>";
    htmlTeamMetricsString += "<td class=\"emptyCell\"></td>";
    htmlTeamMetricsString += "<td>" + teamMetricsTableHTML + "</td>";
    htmlTeamMetricsString += "</tr></table>";

    var teamMetricsDiv = $("#teamMetricsDiv_" + team.teamId);
    if(teamMetricsDiv && teamMetricsDiv != null && teamMetricsDiv != 'undefined' && teamMetricsDiv.length > 0) {
        teamMetricsDiv.html(htmlTeamMetricsString);
    } else {
        var htmlString = $("#depTeamsMetricsDiv").html();
        htmlString += "<p></p>";
        htmlString += "<div id=\"teamMetricsDiv_" + team.teamId + "\" ";
        htmlString += "class=\"slaContent slaTeamContent\">";
        htmlString += htmlTeamMetricsString;
        htmlString += "</div>";
        htmlString += "<div id=\"analyseTeamMetrics-" + team.teamId + "_div\" class=\"textarea-view\"></div>";
        htmlString += "<label><textarea id=\"analyseTeamMetrics-" + team.teamId + "\" placeholder=\"" + analyseTeamMetrics_QPAYTEAM_PLACEHOLDER + " '" + team.teamName + "'\" " +
            "cols=\"60\" rows=\"3\" class=\"textarea-editor\"></textarea></label>";
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

function getContentHTML(index, dataDOM, elementTag, checkConditionFunction) {
    // Filter all <elementTag> elements that satisfies the condition "checkConditionFunction"
    var resElements = $(dataDOM).filter(elementTag).filter(checkConditionFunction);
    var element1 = $(resElements[index]);
    var elementHTML = $(element1).prop('outerHTML');
    return elementHTML;
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
    $("#uploadedReportUrlDiv").html("");
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
            $("#" + $(this).prop("id") + "_div").removeClass('textarea-view-notincluded');
            $("#" + $(this).prop("id") + "_div").text($(this).val());
        } else {
            $("#" + $(this).prop("id") + "_div").addClass('textarea-view-notincluded');
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
        updateRangePickerView(id, start, end);
        loadDepReportsContent();
    });
    updateRangePickerView(id, start, end);
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

function updateRangePickerView(id, start, end) {
    $('#' + id + ' span').html(start.format(DATE_FORMAT_PERIOD) + ' - ' + end.format(DATE_FORMAT_PERIOD));
    $('#' + id + ' em').html(end.format(DATE_FORMAT_MONTH_MIN));
}

function initSelectInputs() {
    REPORT_LEVEL_OPTIONS.forEach((item, index, arr) => {
        var option = new Option(item.levelTitle, item.level);
        $(option).attr("alt", item.description);
        if(item.selected) {
            $(option).prop("selected", "selected");
        }
        $("#reportLevel").append(option);
    });
    $("#reportLevel").on("change", function() {
        loadDepReportsContent();
    });

    EPIC_TYPES_OPTIONS.forEach((item, index, arr) => {
        var option = new Option(item.typeTitle, item.type);
        $(option).attr("alt", item.description);
        if(item.selected) {
            $(option).prop("selected", "selected");
        }
        $("#epicTypes").append(option);
    });
    $("#epicTypes").on("change", function() {
        loadDepReportsContent();
    });
}

function toggleContents(elementsId, clickedElement) {
    if(clickedElement) {
        $(clickedElement).html($(clickedElement).html() === 'Исключить из отчета'? 'Включить' :'Исключить из отчета');
    }
    elementsId.forEach((item, index, arr) => {
        $("#" + item).toggleClass("notincluded");
    });
}