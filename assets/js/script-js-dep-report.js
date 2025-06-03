function ddd() {
    alert("ffff");
    jQuery.get({
        url: 'https://jira.ftc.ru/rest/scriptrunner/latest/custom/getDeptReport?dept=%D0%9A%D0%BE%D0%BB%D0%BB%D0%B5%D0%BA%D1%82%D0%BE%D1%80&dateFrom=2025-05-01&dateTo=2025-05-31&level=O&type=A&teams=QPAYTEAMS-576,QPAYTEAMS-577,QPAYTEAMS-578,QPAYTEAMS-579,QPAYTEAMS-580,QPAYTEAMS-1158',
        headers: {
            //'Accept': 'text/html'
            //'Mode': 'cors',
            //'Access-Control-Allow-Origin': '*',
            //'Host': 'jira.ftc.ru',
            //'Referer': '',
            //'Cookie': 'ga=GA1.1.42245197.1727346540; _ga_FVWC4GKEYS=GS1.1.1727346540.1.1.1727348626.0.0.0; _cft2.id=afdcdcbb735c4c938260e8fcaceb22c3; _ym_uid=1678107408394246066; _ym_d=1741072518; sr-selectedScriptRoot=/pub/jira/jira_home/scripts; seraph.rememberme.cookie=395668%3A45355ad4a1b30a62e67916a121b5d29736d9cb0b; atlassian.xsrf.token=BVKA-OGV5-RMHY-473Y_dd900a65a705780b7018b8f8335a23564e5f1f90_lin; JSESSIONID=092E1CFC1EAABD4E2AF5A1A1C01D3A5F; cpa_i=JTdCJTIyaXAlMjIlM0ElMjIxOTQuODUuMTI2LjQ4JTIyJTdE',
            //'User-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
            //'Upgrade-insecure-requests': '1'
        },
        success: responseHandler
    });
    $("#includedContent").load("https://jira.ftc.ru/rest/scriptrunner/latest/custom/getDeptReport?dept=%D0%9A%D0%BE%D0%BB%D0%BB%D0%B5%D0%BA%D1%82%D0%BE%D1%80&dateFrom=2025-05-01&dateTo=2025-05-31&level=O&type=A&teams=QPAYTEAMS-576,QPAYTEAMS-577,QPAYTEAMS-578,QPAYTEAMS-579,QPAYTEAMS-580,QPAYTEAMS-1158");
}

function responseHandler(responseData) {
    alert("Data: " + responseData);
}