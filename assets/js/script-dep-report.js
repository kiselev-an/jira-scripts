var DATE_FORMAT_PERIOD = "DD MMMM YYYY";
var DATE_FORMAT_MONTH = "MMMM YYYY";
var DATE_FORMAT_MONTH_MIN = "MMMM";
var CURRENT_VERSION_OF_HISTORY_KEY = "currentHistoryVersion";
var DEBUG_MODE = false;

function onLoadDepReportPage() {
    DEBUG_MODE = window.location.href.startsWith("http://localhost"); //TODO: switcher to debug mode
    initRangePickers();
    initSelectInputs();
    loadDepReportsContent(function () {
        initTextareaElements();
    });
}

function initTextareaElements() {
    //initTextareaEditorsByDefaults() // инициализируем данные из сохраненной истории и навешиваем обработчики на поля ввода
    initTextareaEditorsByCurrentVersionOfHistory();
    initEventsTextareaEditors();
    initEventsTextareaViews();
}

function prepareGetDeptReportURL(options) {
//../getDeptReport?dateFrom=2025-05-01&dateTo=2025-06-04&dept=Коллектор&type=B&level=O
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getDeptReport?";
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
//../getQualityReport?dateFrom=2025-05-01&dateTo=2025-06-04&ra=Коллектор
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getQualityReport?";
    if(DEBUG_MODE) {
        url = "./assets/data/test-quality-report.html?";
    }
    url += "ra=" + "Коллектор" + "&";
    url += "dateFrom=" + dateToYYYYMMDD(options.from.toDate()) + "&";
    url += "dateTo=" + dateToYYYYMMDD(options.to.toDate());

    return url;
}

function prepareGetDeptSLAReportURL(options) {
//../getDeptSLAReport?level=O&type=B&dateFrom=2025-04-01&dateTo=2025-06-29&dept=Коллектор
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getDeptSLAReport?";
    if(DEBUG_MODE) {
        url = "./assets/data/test-dep-sla-report.html?";
    }
    url += "dept=" + "Коллектор" + "&";
    url += "dateFrom=" + dateToYYYYMMDD(options.from.toDate()) + "&";
    url += "dateTo=" + dateToYYYYMMDD(options.to.toDate()) + "&";
    url += "level=" + options.reportLevel + "&";
    url += "type=" + options.epicTypes + "&";
    url += "showEpicName";

    return url;
}

function prepareGetFlowTimeMetricsReportURL(options) {
//../getFlowTimeMetrics?dateFrom=2024-01-01&dateTo=2025-07-13&ra=cl&teams=QPAYTEAMS-577
    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getFlowTimeMetrics?";
    if(DEBUG_MODE) {
        url = "./assets/data/test-dep-flowtime-report.html?";
    }
    url += "ra=" + "cl" + "&";
    url += "dateFrom=" + dateToYYYYMMDD(options.from.toDate()) + "&";
    url += "dateTo=" + dateToYYYYMMDD(options.to.toDate());

    url += options.teams && options.teams.length > 0 ? "&teams=" : "";
    options.teams.forEach((item, index, arr) => {
        url += item.teamId + (index === arr.length - 1 ? "" : ",");
    });

    return url;
}

function loadDepReportsContent(onComplete) {
    var rangeMonthPickerData = $('#rangeMonthPicker').data('daterangepicker');
    var optionsMonthData = {"from": rangeMonthPickerData.startDate, "to": rangeMonthPickerData.endDate, "reportLevel": $("#reportLevel").val(), "epicTypes": $("#epicTypes").val(), "teams": TEAMS};
    var monthStr = optionsMonthData.to.format(DATE_FORMAT_MONTH);
    $(document).attr("title", $(document).attr("title").split("_")[0] + "_" + monthStr);

    executeGetRequestWithLoaderAnimation({
        url: prepareGetDeptReportURL(optionsMonthData),
        async: true,
        options: optionsMonthData,
        success: function(data, options, url) {
            responseHandlerDeptReportMonth(data, options, url);
        }
    });

    var rangePeriodPickerData = $('#rangePeriodPicker').data('daterangepicker');
    var optionsPeriodData = {"from": rangePeriodPickerData.startDate, "to": rangePeriodPickerData.endDate, "reportLevel": $("#reportLevel").val(), "epicTypes": $("#epicTypes").val(), "teams": TEAMS};
    executeGetRequestWithLoaderAnimation({
        url: prepareGetDeptReportURL(optionsPeriodData),
        async: true,
        options: optionsPeriodData,
        success: function(data, options, url) {
            responseHandlerDeptReportPeriod(data, options, url);
        }
    });

    $("#subHeaderTeams").html(monthStr);
    executeGetRequestWithLoaderAnimation({
        url: prepareGetDeptSLAReportURL(optionsMonthData),
        async: false,
        options: optionsMonthData,
        success: function(deptSLAReportData, deptSLAReportOptions, deptSLAReportURL) {
            TEAMS.forEach(function (item, idx, array) {
                var optionsTeamMonthData = {"from": rangeMonthPickerData.startDate, "to": rangeMonthPickerData.endDate, "reportLevel": $("#reportLevel").val(), "epicTypes": $("#epicTypes").val(), "teams": [item]};
                executeGetRequestWithLoaderAnimation({
                    url: prepareGetFlowTimeMetricsReportURL(optionsTeamMonthData),
                    async: true,
                    options: optionsTeamMonthData,
                    success: function(flowTimeMetricsReportData, flowTimeMetricsReportOptions, flowTimeMetricsReportURL) {
                        executeGetRequestWithLoaderAnimation({
                            url: prepareGetDeptReportURL(optionsTeamMonthData),
                            async: false,
                            options: optionsTeamMonthData,
                            success: function(deptReportData, deptReportOptions, deptReportURL) {
                                responseHandlerTeamReportMonth(deptReportData, deptSLAReportData, flowTimeMetricsReportData, item, deptReportOptions, deptReportURL, deptSLAReportURL, flowTimeMetricsReportURL);

                                if(idx === array.length - 1 && onComplete && null != onComplete) { // после загрузки данных для всех команд из списка, вызываем функцию onComplete
                                    onComplete();
                                }
                            }
                        });
                    }
                });
            });
        }
    });

    executeGetRequestWithLoaderAnimation({
        url: prepareGetQualityReportURL(optionsMonthData),
        async: true,
        options: optionsMonthData,
        success: function(data, options, url) {
            responseHandlerQualityReportMonth(data, options, url);
        }
    });
}

function replaceContentByH1(element) {
    //var elContent = $(element).html(); // Get the content of the element
    //$(element).replaceWith('<h1>' + elContent + '</h1>'); // Replace the element with an h1
    replaceContentByTag(element, "h1");// Replace the element with an h1
}

function replaceContentByTag(element, replacedTag) {
    var elContent = $(element).html(); // Get the content of the element
    $(element).replaceWith('<'+ replacedTag +'>' + elContent + '</' + replacedTag + '>'); // Replace the element with a 'newtag'
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

        pageDataClone.find('font').each(function(index, element) {
            replaceContentByTag(element, "span");
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

    var url = DOMAIN_URL + "/" + SCRIPT_RUNNER_PATH + "/getCollectionMetrics?action=sendEmail";
    if(DEBUG_MODE) {
        url = "./assets/data/test-dep-report.html?action=sendEmail";
    }

    var emailDataHTML = prepareCleanPageHTML(true, null);
    executePostRequestWithLoaderAnimation({
        url: url,
        data: JSON.stringify({ "emailSubject": $(document).attr("title"), "emailAddresses": emailAddresses, "emailBody": emailDataHTML}),
        success: function(data) {
            alert("Отчет успешно отправлен! ;)");
            updateHistoryModeInCurrentVersionOfHistory("sendEmail");
        }
    });
}

function generatePDF() {
    var printWindow = window.open('', 'PRINT', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,height=650,width=900,top=0,left=0');
    printWindow.document.write(prepareCleanPageHTML(false, "window.print();window.close();"));
    printWindow.document.close(); // necessary for IE >= 10
    printWindow.focus(); // necessary for IE >= 10*/
    updateHistoryModeInCurrentVersionOfHistory("generatePDF");
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
    executePostRequestWithLoaderAnimation({
        url: url,
        data: JSON.stringify({ "secretPass": pass, "pageTitle": $(document).attr("title") + "_DRAFT", "pageBody": pageDataHTML}),
        success: function(data) {
            alert("Отчет успешно опубликован! ;)");
            $("#uploadedReportUrlDiv").html("<a href='" + data + "' target='_blank' rel='noopener noreferrer'>Ссылка на опубликованный отчет</a>");
            updateHistoryModeInCurrentVersionOfHistory("publishingToConfluence");
        }
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
    var wasCancelledHTML = getContentHTML(0, $(responseHtml), "p", "", false, function() {
        return $(this).text().includes("cancelled");
    });
    $("#depTotalQualityMetricsDiv").css('width', '100%').css('text-align','center');
    $("#depTotalQualityMetricsDiv").html(depTotalQualityMetricsTableHTML);
    $("#depTotalQualityMetricsDiv").find("table").append("<tr><td colspan='9'>" + wasCancelledHTML + "</td></tr>");
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

function responseHandlerTeamReportMonth(responseDataDept, responseDataSLA, responseDataFlowtime, team, range, deptReportURL, deptSLAReportURL, flowTimeMetricsReportURL) {
    var responseHtml = $.parseHTML(responseDataDept, null);
    var teamMetricsTableHTML = getMetricsTableHTML(0, $(responseHtml));

    var responseSLAHtml = $.parseHTML(responseDataSLA, null);
    //var teamMetricsSLATableHTML = getMetricsTableHTML(findTeamSLATableIndex(team, $(responseSLAHtml)), $(responseSLAHtml));
    var teamMetricsSLATableHTML = getContentHTML(0, $(responseSLAHtml), "table", "timeMetricsTableView", true, function() {
        return $(this).prev("p").prev("p").text().includes(team.teamName);
    });

    var responseFlowtimeHtml = $.parseHTML(responseDataFlowtime, null);
    var teamFlowtimeMetricsTableHTML = getContentHTML(0, $(responseFlowtimeHtml), "table", "timeMetricsTableView", true, function() {
        return $(this).prev("p").prev("p").prev("h1").text().includes("Downstream");
    });

    var htmlTeamMetricsString = "<b>" + team.teamName + "</b>";
    htmlTeamMetricsString += "<label><input type=\"checkbox\" checked=\"checked\" ";
    htmlTeamMetricsString += "onclick=\"toggleContents(['teamMetricsDiv_" + team.teamId + "', 'analyseTeamMetrics-" + team.teamId + "_div']);\" ";
    htmlTeamMetricsString += "title=\"Исключить/Включить секцию в отчете\"/></label>";

    /*htmlTeamMetricsString += "<table class=\"teamMetricsTableViewWrap\"><tr>";
    htmlTeamMetricsString += "<td class=\"emptyCell\"></td>";
    htmlTeamMetricsString += "<td class=\"contentCell\">" + teamMetricsTableHTML + "</td>";
    htmlTeamMetricsString += "<td class=\"emptyCell\"></td>";
    htmlTeamMetricsString += "<td class=\"contentCell\">" + teamMetricsSLATableHTML + "</td>";
    htmlTeamMetricsString += "</tr></table>";*/

    htmlTeamMetricsString += "<div class=\"teamMetricsDivWrap\">";
    htmlTeamMetricsString += teamMetricsTableHTML;
    htmlTeamMetricsString += teamMetricsSLATableHTML;
    htmlTeamMetricsString += getStatisticCountOfEpicsGroupingBySizes(teamFlowtimeMetricsTableHTML, "timeMetricsTableView", flowTimeMetricsReportURL);
    htmlTeamMetricsString += "</div>";

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

function getContentHTML(index, dataDOM, elementTag, applyClass, asOuterHTML, checkConditionFunction) {
    // Filter all <elementTag> elements that satisfies the condition "checkConditionFunction"
    var element = findContentElement(index, dataDOM, elementTag, checkConditionFunction);
    if(element && null != element) {
        if(applyClass && applyClass.length > 0) {
            $(element).addClass(applyClass);
        }
        var elementHTML = asOuterHTML ? $(element).prop('outerHTML') : $(element).text();
        return elementHTML;
    } else {
        return "";
    }
}

function findContentElement(index, dataDOM, elementTag, checkConditionFunction) {
    // Filter all <elementTag> elements that satisfies the condition "checkConditionFunction"
    var resElements = $(dataDOM).filter(elementTag).filter(checkConditionFunction);
    if(resElements.length > index) {
        var element = $(resElements[index]);
        return element;
    } else {
        return null;
    }
}

function getMetricsSLATableHTML(index, team, dataDOM) {
    var resElements = $(dataDOM).filter("table").filter(function() {
        return $(this).prev("p").prev("p").text().includes(team.teamName);
    });
    if(resElements.length > index) {
        var element1 = $(resElements[index]);
        var elementHTML = $(element1).prop('outerHTML');
        return elementHTML;
    } else {
        return "&nbsp;";
    }
}

function getStatisticCountOfEpicsGroupingBySizes(flowtimeMetricsTableHTML, applyClass, url) {
    var flowtimeMetricsTableDOM = $.parseHTML(flowtimeMetricsTableHTML, null);
    var statistic = new Map();
    var matchingRows = $(flowtimeMetricsTableDOM).find("td").filter(function() {
        if($(this).index() === 5 && $(this).text() != "Size") { // кривой способ группировки ;)
            var value = statistic.get($(this).text());
            if(!value || null == value) {
                statistic.set($(this).text(), 1);
            } else {
                statistic.set($(this).text(), ++value);
            }
        }
        return false;
    }).closest('tr');

    if(statistic.size > 0) {
        // Convert Map entries to an array, sort by key, and convert back to a new Map
        var sortedStatisticByKey = new Map([...statistic.entries()].sort((a, b) => a[0]- b[0]));
        var tableStr = "<table border='1'" + (applyClass && applyClass.length > 0 ? " class='" + applyClass + "'" : "") + ">";
        tableStr += "<tbody>";
        tableStr += "<tr><td>ОС</td><td>Кол-во эпиков</td></tr>";
        var totalCount = 0;
        var velocity = 0;
        EPIC_SIZES.forEach((key) => {
            var value = sortedStatisticByKey.get("" + key);
            if(value && null != value) {
                tableStr += "<tr>";
                tableStr += "<td>" + key + "</td>";
                tableStr += "<td>" + value + "</td>";
                tableStr += "</tr>";
                totalCount += value;
                velocity += key * value;
            } else {
                tableStr += "<tr><td>" + key + "</td><td>&ndash;</td></tr>";
            }
        });
        /*sortedStatisticByKey.forEach((value, key, map) => {
            tableStr += "<tr>";
            tableStr += "<td>" + key + "</td>";
            tableStr += "<td>" + value + "</td>";
            tableStr += "</tr>";
            totalCount += value;
            velocity += key * value;
        });*/
        tableStr += "<tr><td>&nbsp;</td><td><a href='" + url + "' title='FlowTimeMetrics - Downstream'>" + totalCount + "/" + velocity + "</a></td></tr>"
        tableStr += "</tbody>";
        tableStr += "</table>"
        return tableStr;
    } else {
        return "&nbsp;";
    }
}

function initTextareaEditorsByDefaults() {
    $("#welcome").val("").prop("placeholder", WELCOME_PLACEHOLDER);
    $("#overview").val("").prop("placeholder", OVERVIEW_PLACEHOLDER);
    $("#analyseDepTotalCurrentMonthMetrics").val("").prop("placeholder", analyseDepTotalCurrentMonthMetrics_PLACEHOLDER);
    $("#analyseDepTotalPeriodMetrics").val("").prop("placeholder", analyseDepTotalPeriodMetrics_PLACEHOLDER);
    $("#analyseDepTotalInjectionMetrics").val("").prop("placeholder", analyseDepTotalInjectionMetrics_PLACEHOLDER);
    $("#analyseDepTotalQualityMetrics").val("").prop("placeholder", analyseDepTotalQualityMetrics_PLACEHOLDER);

    TEAMS.forEach((item) => {
        $("#analyseTeamMetrics-" + item.teamId).val("");
    });

    $("#summary").val("").prop("placeholder", SUMMARY_PLACEHOLDER);
    $("#uploadedReportUrlDiv").html("");
    reinitTextareaViews();
    initNewVersionOfHistory();
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
    //$("#analyseTeamMetrics-QPAYTEAMS-1383").val("");
    $("#analyseTeamMetrics-QPAYTEAMS-1120").val("");
    $("#summary").val(EXAMPLE_SUMMARY_TEXT)
        .prop("placeholder", EXAMPLE_DEFAULT_USERNAME + "! " + SUMMARY_PLACEHOLDER);
    reinitTextareaViews();
    initNewVersionOfHistory();
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

        $(this).on('change', function() {
            updatePageContentInCurrentVersionOfHistory($(this).prop("id"), $(this).val());
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
        loadDepReportsContentWithLoaderAnimation(function () {
            updateRangePickerView(id, start, end);
        });
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
    prepareDateRangePicker("rangeMonthPicker", moment().startOf('month'), moment(), rangesMonths, localeRU, true);

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
        loadDepReportsContentWithLoaderAnimation(null);
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
        loadDepReportsContentWithLoaderAnimation(null);
    });

    var option = new Option("Новая версия (пустой)", -1);
    $(option).prop("selected", "selected");
    $("#versionOfHistory").append(option);
    var cVersion = getCurrentVersionOfHistory();
    for(var i = 1; i <= cVersion; i++) {
        var wrapObjectStr = localStorage.getItem("v" + i);
        var wrapObject = wrapObjectStr && null != wrapObjectStr ? JSON.parse(wrapObjectStr) : null;
        if(wrapObject && null != wrapObject) {
            var option = new Option(prepareOptionTextForVersionOfHistory(i, wrapObject[0].date, wrapObject[0].historyMode), i);
            $("#versionOfHistory").append(option);
        }
    }
    $("#versionOfHistory").on("change", function() {
        confirmInitTextareaEditorsByVersionOfHistory($(this).val());
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

function reinitCurrentVersionOfHistory() {
    saveHistoryInLocalStorage(getCurrentVersionOfHistory());
}

function initNewVersionOfHistory() {
    var cVersion = getCurrentVersionOfHistory();
    cVersion++;
    saveHistoryInLocalStorage(cVersion);
}

function getCurrentVersionOfHistory() {
    var cVersion = localStorage.getItem(CURRENT_VERSION_OF_HISTORY_KEY);
    if(!cVersion || null == cVersion) {
        cVersion = 0;
    }
    return cVersion;
}

function saveHistoryInLocalStorage(version) {
    var history = [];
    $(".textarea-editor").each(function() {
        history.push({ id: $(this).prop("id"), text: $(this).val(), date: new Date() });
    });
    var wrapObject = [];
    var currentDate = new Date();
    wrapObject.push({ version: "v" + version, historyMode: "intermediate", date: currentDate, history: history });
    localStorage.setItem("v" + version, JSON.stringify(wrapObject));
    localStorage.setItem(CURRENT_VERSION_OF_HISTORY_KEY, version);

    var option = new Option(prepareOptionTextForVersionOfHistory(version, wrapObject[0].date, wrapObject[0].historyMode), version);
    $(option).prop("selected", "selected");
    $("#versionOfHistory").append(option);
}

function updatePageContentInCurrentVersionOfHistory(key, text) {
    var cVersion = getCurrentVersionOfHistory();
    var wrapObjectStr = localStorage.getItem("v" + cVersion);
    var wrapObject = wrapObjectStr && null != wrapObjectStr ? JSON.parse(wrapObjectStr) : null;
    if(!wrapObject || null == wrapObject) {
        reinitCurrentVersionOfHistory();
        return;
    }

    var history = wrapObject[0].history;
    if(!history || null == history) {
        history = [];
    }
    var historyItem = history.find(item => item.id === key);
    if(!historyItem || null == historyItem) {
        history.push({ id: key, text: text, date: new Date() });
    } else {
        historyItem.text = text;
        historyItem.date = new Date();
    }
    wrapObject[0].history = history;
    localStorage.setItem("v" + cVersion, JSON.stringify(wrapObject));
}

function updateHistoryModeInCurrentVersionOfHistory(historyMode) {
    var cVersion = getCurrentVersionOfHistory();
    var wrapObjectStr = localStorage.getItem("v" + cVersion);
    var wrapObject = wrapObjectStr && null != wrapObjectStr ? JSON.parse(wrapObjectStr) : null;
    if(wrapObject && null != wrapObject) {
        wrapObject[0].historyMode = historyMode;
        localStorage.setItem("v" + cVersion, JSON.stringify(wrapObject));

        var optionByValue = $("#versionOfHistory option[value='" + cVersion + "']");
        $(optionByValue).text(prepareOptionTextForVersionOfHistory(cVersion, wrapObject[0].date, wrapObject[0].historyMode));
    }
    initNewVersionOfHistory();
}

function initTextareaEditorsByCurrentVersionOfHistory() {
    initTextareaEditorsByVersionOfHistory(getCurrentVersionOfHistory());
}

function initTextareaEditorsByVersionOfHistory(version) {
    var wrapObjectStr = localStorage.getItem("v" + version);
    while( (!wrapObjectStr || null == wrapObjectStr) && version >= 0) { // находим наиболее свежую версию, если текущей версии нет в хранилище
        version--;
        wrapObjectStr = localStorage.getItem("v" + version);
    }
    var wrapObject = wrapObjectStr && null != wrapObjectStr ? JSON.parse(wrapObjectStr) : null;
    if(wrapObject && null != wrapObject) {
        var history = wrapObject[0].history;
        if(!history || null == history) {
            return;
        }
        history.forEach((item) => {
            $("#" + item.id).val(item.text);
        });

        $("#welcome").prop("placeholder", WELCOME_PLACEHOLDER);
        $("#overview").prop("placeholder", OVERVIEW_PLACEHOLDER);
        $("#analyseDepTotalCurrentMonthMetrics").prop("placeholder", analyseDepTotalCurrentMonthMetrics_PLACEHOLDER);
        $("#analyseDepTotalPeriodMetrics").prop("placeholder", analyseDepTotalPeriodMetrics_PLACEHOLDER);
        $("#analyseDepTotalInjectionMetrics").prop("placeholder", analyseDepTotalInjectionMetrics_PLACEHOLDER);
        $("#analyseDepTotalQualityMetrics").prop("placeholder", analyseDepTotalQualityMetrics_PLACEHOLDER);
        $("#summary").prop("placeholder", SUMMARY_PLACEHOLDER);
        $("#uploadedReportUrlDiv").html("");

        reinitTextareaViews();
        initNewVersionOfHistory();
    } else { // пользователь выбрал История отчета "Новая версия/По умолчанию" или в хранилище нет подходящей версии
        initTextareaEditorsByDefaults();
    }
}

function confirmInitTextareaEditorsByVersionOfHistory(version) {
    if(confirm("Если продолжить, то все твои \"записульки\" потеряются. Уверен?")) {
        initTextareaEditorsByVersionOfHistory(version);
    }
}

function confirmClearVersionOfHistory() {
    if(confirm("Очистить историю отчетов?")) {
        var clearAll = confirm("Очистить всю историю или только промежуточную?\n\nНажмите 'Ок' - если хотите удалить всю историю.\n'Отмена' - если только промежуточную.");
        var cVersion = getCurrentVersionOfHistory();
        var lastNotRemovedVersion = 0;
        for(var i = 1; i <= cVersion; i++) {
            var wrapObjectStr = localStorage.getItem("v" + i);
            var wrapObject = wrapObjectStr && null != wrapObjectStr ? JSON.parse(wrapObjectStr) : null;
            if(wrapObject && null != wrapObject) {
                if(clearAll || (!clearAll && wrapObject[0].historyMode == "intermediate")) {
                    localStorage.removeItem("v" + i);
                    $("#versionOfHistory option[value='" + i + "']").remove();
                } else {
                    lastNotRemovedVersion = i;
                }
            }
        }
        lastNotRemovedVersion++;
        localStorage.setItem(CURRENT_VERSION_OF_HISTORY_KEY, lastNotRemovedVersion);
        reinitCurrentVersionOfHistory()
    }
}

function prepareOptionTextForVersionOfHistory(version, date, historyMode) {
    var strResult = "Версия: v" + version + ", ";
    strResult += "Дата: " + moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss");
    strResult += " (" + (historyMode == "intermediate" ? "не исп." : historyMode) + ")";
    return strResult;
}