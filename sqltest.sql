 !--static final String JQL_QUERY_IN_DEV = "
 project in (QIS, QAS, QBS, QPAY, QWS) AND
    type = Epic and EpicType not in (OKR) AND
    labels in (ДП-Кредиты) AND
    status in (ToDo, Backlog, 'Ready to Dev', 'Planned to Dev', 'Ready To PBR', Ready, 'To Dev', 'Refinement Done') AND
    issueFunction in epicsOf('project in (\"QPAY-Online IOS\", \"QPAY-Online Android\", \"QPAY-Online Back\", \"Платежный кабинет-2\", \"MADG - Android - UPC Based Projects\", \"MADG - iOS - UPC Based Projects\", \"Подарочные карты\", FEEON)
    and type != Epic  and status in (\"In Dev\", \"Code Review\", \"Ready To Test\", \"In Test\", TESTCOMPLETED, \"Ready To Deploy\", Resolved, \"In Progress\", тестирование, \"ready for merge\", разработка, \"ожидает тестирования\", \"in review\") ') AND
    (cf[32652] not in (POT) OR cf[32652] = EMPTY)
 !--"

!--static final String JQL_QUERY_READY_TO_DEPLOY = "
project in (QIS, QAS, QBS, QPAY, QWS) AND
    type = Epic and EpicType not in (OKR) AND
    labels in (ДП-Кредиты) AND
    status in ('In Dev') AND
    issueFunction in epicsOf('project in (\"QPAY-Online IOS\", \"QPAY-Online Android\", \"QPAY-Online Back\", \"Платежный кабинет-2\", \"MADG - Android - UPC Based Projects\", \"MADG - iOS - UPC Based Projects\", \"Подарочные карты\", FEEON)') AND
    NOT issueFunction in epicsOf('status not in (\"Ready To Deploy\", \"Released\", \"Closed\", \"Trial\") and type != Epic')
    and cf[32652] not in (POT)
!--"

!--static final String JQL_QUERY_DOD = "
project in (QIS, QAS, QBS, QPAY, QWS) AND
    type = Epic and EpicType not in (OKR)
    AND labels = ДП-Кредиты and
    status in (\"Ready to Deploy\", Released, Done, Trial) and
    isDone = Undone
!--"


!--static final String JQL_QUERY_FINISH_DATE = "
project in (QIS, QAS, QBS, QPAY, QWS) AND
    type = Epic AND
    (issueFunction in issuePickerField(\"Team Link\", \"Subdivision = 'Кредитные решения'\")
    OR issueFunction in issuePickerField(\"Assistances Links\", \"Subdivision = 'Кредитные решения'\")) AND
    status not in (Released, Trial, Done, Cancelled, Backlog, Frozen) AND
    Завершение < startOfDay() ORDER BY cf[22353] ASC
!--"

!--static final String JQL_QUERY_TEAMS = "
project = QPAYTEAMS AND
    type = Epic AND
    status = Open
    AND Subdivision = \"Кредитные решения\"
!--"
