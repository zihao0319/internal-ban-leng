var teams = [];
var actions = [];
var services = [];
var services_search = [];
var daynotes = [];

const ServiceColumnDefs = [
    { headerName: 'Status', field: 'Status', width: 80 },
    { headerName: 'Type', field: 'Type', width: 80 },
    { headerName: 'Name', field: 'Name', width: 100 },
    { headerName: 'PIC', field: 'PIC', width: 100 },
    { headerName: 'ContactNo', field: 'ContactNo', width: 100 },
    { headerName: 'Address', field: 'Address', width: 300 },
    { headerName: 'Department', field: 'Department', width: 100 },
    { headerName: 'Team', field: 'Team', width: 70 },
    { headerName: 'salesperson', field: 'salesperson', width: 70 },
    { headerName: 'Appt Date', field: 'ApptDate', width: 100 },
    { headerName: 'From', field: 'ApptFrom', width: 70 },
    { headerName: 'To', field: 'ApptTo', width: 70 },
    { headerName: 'Action', field: 'Action', width: 120 },
    { headerName: 'DO #', field: 'DO', width: 100 },
    { headerName: 'cashtype', field: 'cashtype', width: 100 },
    { headerName: 'CashAmount', field: 'CashAmount', width: 80 },
    { headerName: 'Remark', field: 'Remark', width: 300 },
    { headerName: 'invoice #', field: 'invoice', width: 100 },
    { headerName: 'invoiceamount', field: 'invoiceamount', width: 80 },
]

const ServiceSearchColumnDefs = [
    { headerName: 'Appt Date', field: 'ApptDate', width: 200 }
]

const ServiceGridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true
    },
    columnDefs: ServiceColumnDefs,
    rowData: services,
    onFirstDataRendered: autoSizeAll_Service,
    rowSelection: 'single',
    onSelectionChanged: onSelectionChanged_Service,
};
ServiceGridOptions.getRowStyle = function (params) {
    if (params.data.Status === 'Cancelled') {
        return { color: 'lightgray' };
    }
    if (params.node.rowPinned) {
        return { 'font-weight': 'bold' };
    }
}

function createSumRow() {
    let cashAmt = services.map((row) => {
        return parseFloat(row.CashAmount);
    });
    var sum = cashAmt.reduce(function (a, b) {
        return a + b;
    }, 0);
    return [{ CashAmount: sum.toFixed(2) }]
}

const ServiceSearchGridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true
    },
    columnDefs: ServiceSearchColumnDefs,
    rowData: services_search,
    rowSelection: 'single',
    onSelectionChanged: onSelectionChanged_ServiceSearch
};

const eGridDiv = document.querySelector('#serviceGrid');
new agGrid.Grid(eGridDiv, ServiceGridOptions);

const eGridSearchDiv = document.querySelector('#serviceSearchGrid');
new agGrid.Grid(eGridSearchDiv, ServiceSearchGridOptions);

function autoSizeAll_Service() {
    var allColumnIds = [];
    ServiceGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    ServiceGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

var ApptDatePicker = new tui.DatePicker('#ApptDateWrapper', {
    date: new Date(),
    input: {
        element: '#ApptDate',
        format: 'yyyy-MM-dd'
    }
});
var FromTimePicker = new tui.TimePicker('#FromTime', {
    initialHour: 9,
    initialMinute: 0,
    inputType: 'selectbox',
    minuteStep: 15
});
var ToTimePicker = new tui.TimePicker('#ToTime', {
    initialHour: 18,
    initialMinute: 0,
    inputType: 'selectbox',
    minuteStep: 15
});

var calendar = new tui.Calendar('#calendar', {
    defaultView: 'week', // weekly view option
    taskView: false,
    scheduleView: true,
    options: {
        isReadOnly: true,
    },
    week: {
        startDayOfWeek: 1,
        hourStart: 9,
        hourEnd: 18
    }
});


function calendarMoveToday() {
    calendar.today();
    updateDateRenderRange();
    requestData();
}
function calendarMovePrev() {
    calendar.prev();
    updateDateRenderRange();
    requestData();
}
function calendarMoveNext() {
    calendar.next();
    updateDateRenderRange();
    requestData();
}

function updateDateRenderRange() {
    var renderRangeElement = document.querySelector('#renderRange');
    renderRangeElement.innerHTML = convertDateToString(calendar._renderRange.start) + "-" + convertDateToString(calendar._renderRange.end);
}
updateDateRenderRange();

function convertDateToString(date) {
    return date.getDate() + "/" + (date.getMonth() + 1)
}

var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
function requestData() {
    calendar.clear(true);
    var xmlhttp = new XMLHttpRequest();

    var request_param = "&from=" + encodeURIComponent(new Date(calendar._renderRange.start.toDate() - tzoffset).toISOString().split('T')[0])
        + "&to=" + encodeURIComponent(new Date(calendar._renderRange.end.toDate() - tzoffset).toISOString().split('T')[0])
        + "&team=" + encodeURIComponent(document.getElementById("TeamFilter").value);
    var url = "https://internal.ban-leng.com/forms/service-book/service-book.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            receiveData(this.responseText);
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onerror = function (e) {
        location.href = 'https://internal.ban-leng.com';
    }
    xmlhttp.send(request_param);
}

function receiveData(response) {
    try {
        responseJSON = JSON.parse(response);
        teams = responseJSON.Teams;
        actions = responseJSON.Actions;
        daynotes = responseJSON.ServiceDayNotes;
        if (!isOptionAdded) populateTeamSelection();
        populateActionSelection();
        services = responseJSON.Services;
        ServiceGridOptions.api.setRowData(services);
        createSchedule();
        ServiceGridOptions.api.setPinnedBottomRowData(createSumRow());

        onChangeWeekDaySelection();
    }
    catch (e) {
        location.href = 'https://internal.ban-leng.com';
    }

}

function searchService() {
    var xmlhttp = new XMLHttpRequest();
    var request_param = "&search=" + encodeURIComponent(document.getElementById("serviceSearchInput").value);
    var url = "https://internal.ban-leng.com/forms/service-book/service-search.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            responseJSON = JSON.parse(this.responseText);
            services_search = responseJSON.Services;
            ServiceSearchGridOptions.api.setRowData(services_search);
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onerror = function (e) {
        location.href = 'https://internal.ban-leng.com';
    }
    xmlhttp.send(request_param);
}

isOptionAdded = false;
function populateTeamSelection() {
    var ddlTeam = document.getElementById("Team");
    var ddlTeamFilter = document.getElementById("TeamFilter");


    var option_all = document.createElement("option");

    option_all.innerHTML = "All"
    option_all.value = "All";

    ddlTeamFilter.options.add(option_all);
    for (var i = 0; i < teams.length; i++) {
        var option = document.createElement("option");
        var option2 = document.createElement("option");

        option.innerHTML = teams[i].Name;
        option.value = teams[i].Name;
        option2.innerHTML = teams[i].Name;
        option2.value = teams[i].Name;

        ddlTeam.options.add(option);
        ddlTeamFilter.options.add(option2)
    }

    isOptionAdded = true;
}

function populateActionSelection() {
    var ddlAction = document.getElementById("ActionSelection");

    for (var i = 0; i < actions.length; i++) {
        var option = document.createElement("option");

        option.innerHTML = actions[i].Name;
        option.value = actions[i].Name;

        ddlAction.options.add(option);
    }
}

function addAction() {
    let actionEle = document.querySelector('#Action')
    let action = actionEle.value;
    let actionSelectionEle = document.querySelector('#ActionSelection');
    let actionSelection = actionSelectionEle.value;

    if (actionSelection != null && actionSelection != "") {
        if (action != null && action != "") {
            actionEle.value = action + "," + actionSelection;
        }
        else {
            actionEle.value = actionSelection;
        }
    }
}

function createSchedule() {
    let schedules = [];
    for (let service of services) {
        if (service.Status == 'Cancelled') {
            continue;
        }
        let service_start = service.ApptDate + "T" + service.ApptFrom + "+08:00";
        let service_end = service.ApptDate + "T" + service.ApptTo + "+08:00";

        let team = teams.find(t => t.Name == service.Team);

        schedules.push(
            {
                id: service.ServiceID,
                calendarId: 'Calendar',
                title: (service.Status == 'Completed' ? '&#10004; ' : '') + service.Name + "(" + service.Team + ")\n" + service.Action,
                category: 'time',
                start: service_start,
                end: service_end,
                bgColor: (team ? team.BgColor : '#FFFFFF'),
                color: (team ? team.FontColor : '#000000'),
            }
        )
    }
    for (let daynote of daynotes) {
        if(daynote.Notes && daynote.Notes != '') {
            schedules.push({
                id: 'daynote_' + daynote.Date,
                calendarId: 'Calendar',
                title: daynote.Notes,
                isAllDay: true,
                category: 'allday',
                start: daynote.Date,
                end: daynote.Date,
                bgColor: '#fed766',
                color: '#000000'
            })
        }
    }
    calendar.createSchedules(schedules);
    calendar.toggleScheduleView(true);
}

document.addEventListener('DOMContentLoaded', this.requestData);


function onTypeChange() {
    let type = document.querySelector('#Type').value;
    if (type == "Customer") {
        document.querySelector("#DepartmentWrapper").style.display = 'none';
        document.querySelector("#PICWrapper").style.display = 'none';
    }
    else {
        document.querySelector("#DepartmentWrapper").style.display = 'table-row';
        document.querySelector("#PICWrapper").style.display = 'table-row';
    }

}
var serviceid = '';
function saveService(asNew) {
    let submitServiceId = '';
    if (!asNew) {
        submitServiceId = serviceid;
    }
    let service_params = '&id=' + encodeURIComponent(submitServiceId)
        + '&name=' + encodeURIComponent(document.querySelector('#Name').value)
        + '&pic=' + encodeURIComponent(document.querySelector('#PIC').value)
        + '&contactno=' + encodeURIComponent(document.querySelector('#ContactNo').value)
        + '&address=' + encodeURIComponent(document.querySelector('#Address').value)
        + '&department=' + encodeURIComponent(document.querySelector('#Department').value)
        + '&team=' + encodeURIComponent(document.querySelector('#Team').value)
        + '&salesperson=' + encodeURIComponent(document.querySelector('#salesperson').value)
        + '&apptdate=' + encodeURIComponent(new Date(ApptDatePicker.getDate() - tzoffset).toISOString().split('T')[0])
        + '&apptfrom=' + encodeURIComponent((FromTimePicker.getHour() > 9 ? '' : '0') + FromTimePicker.getHour() + ':' + (FromTimePicker.getMinute() > 9 ? '' : '0') + FromTimePicker.getMinute())
        + '&apptto=' + encodeURIComponent((ToTimePicker.getHour() > 9 ? '' : '0') + ToTimePicker.getHour() + ':' + (ToTimePicker.getMinute() > 9 ? '' : '0') + ToTimePicker.getMinute())
        + '&remark=' + encodeURIComponent(document.querySelector('#Remark').value)
        + '&type=' + encodeURIComponent(document.querySelector('#Type').value)
        + '&action=' + encodeURIComponent(document.querySelector('#Action').value)
        + '&status=' + encodeURIComponent(document.querySelector('#Status').value)
        + '&cashamount=' + encodeURIComponent(document.querySelector('#CashAmount').value)
        + '&cashtype=' + encodeURIComponent(document.querySelector('#cashtype').value)        
        + '&do=' + encodeURIComponent(document.querySelector('#DO').value)
        + '&invoiceamount=' + encodeURIComponent(document.querySelector('#invoiceamount').value)
        + '&invoice=' + encodeURIComponent(document.querySelector('#invoice').value);

    let xmlhttp = new XMLHttpRequest();
    let url = "https://internal.ban-leng.com/forms/service-book/new-service.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            let reponseJSON = JSON.parse(this.response);
            if (this.status == 200 && reponseJSON.statusCode == 200) {
                location.reload();
            }
            else {
                alert('ERROR: Unsuccessful transaction')
            }
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xmlhttp.send(service_params);
}

function editService(service) {
    serviceid = service.ServiceID;
    document.querySelector('#Name').value = service.Name;
    document.querySelector('#PIC').value = service.PIC;
    document.querySelector('#ContactNo').value = service.ContactNo;
    document.querySelector('#Address').value = service.Address;
    document.querySelector('#Department').value = service.Department;
    document.querySelector('#Team').value = service.Team;
    document.querySelector('#salesperson').value = service.salesperson;
    ApptDatePicker.setDate(new Date(service.ApptDate));
    FromTimePicker.setTime(parseInt(service.ApptFrom.split(':')[0]), parseInt(service.ApptFrom.split(':')[1]));
    ToTimePicker.setTime(parseInt(service.ApptTo.split(':')[0]), parseInt(service.ApptTo.split(':')[1]));
    document.querySelector('#Remark').value = service.Remark;
    document.querySelector('#Type').value = service.Type;
    document.querySelector('#Action').value = service.Action;
    document.querySelector('#Status').value = service.Status;
    document.querySelector('#CashAmount').value = service.CashAmount;
    document.querySelector('#cashtype').value = service.cashtype;
    document.querySelector('#DO').value = service.DO;
    document.querySelector('#invoice').value = service.invoice;
    document.querySelector('#invoiceamount').value = service.invoiceamount;
    onTypeChange();
}

calendar.on('clickSchedule', function (event) {
    let click_schedule = event.schedule;
    let click_scheduleid = click_schedule.id;
    let service = services.find(s => s.ServiceID == click_scheduleid);
    editService(service);
});

function onSelectionChanged_Service(event) {
    var selectedRows = ServiceGridOptions.api.getSelectedRows();
    if (selectedRows.length > 0) {
        editService(selectedRows[0]);

    }
}

function onSelectionChanged_ServiceSearch(event) {
    var selectedSearchRows = ServiceSearchGridOptions.api.getSelectedRows();
    if (selectedSearchRows.length > 0) {
        calendar.setDate(selectedSearchRows[0].ApptDate)
        updateDateRenderRange();
        requestData();
    }
}

var today = new Date();
var todaywod = today.getDay();
document.getElementById("PrintWeekdaySelection").value = todaywod;
function printAsText() {
    let dayservices = this.services.filter(s => s.Status != 'Cancelled' && new Date(s.ApptDate).getDay() == parseInt(document.getElementById("PrintWeekdaySelection").value, 10));
    dayservices.sort((a, b) => (a.Team > b.Team) ? 1 : (a.Team === b.Team) ? ((a.ApptFrom > b.ApptFrom) ? 1 : -1) : -1)

    let printText = '';
    if (dayservices.length > 0) {
        printText += ('Date: ' + dayservices[0].ApptDate + "\n\n");
        for (let service of dayservices) {
            printText += formatPrintText(service.Name);
            printText += !isEmptyString(service.ContactNo.trim()) ? formatPrintText("(" + service.ContactNo + ")") : "";
            printText += formatPrintText(service.Address);
            printText += formatPrintText(service.Department);
            printText += !isEmptyString(service.Team.trim()) ? formatPrintText("Team " + service.Team) : "";
            printText += formatPrintText(service.salesperson);
            printText += formatPrintText(service.Action);
            printText += formatPrintText(service.ApptFrom + '-' + service.ApptTo);
            printText += !isEmptyString(service.PIC) ? formatPrintText("PIC: " + service.PIC) : "";
            printText += formatPrintText(service.Remark);
            printText += "\n";
        }
    }
    document.getElementById("PrintText").value = printText;
}

function getDailyNote() {
    let dayNote = this.daynotes.find(dn => new Date(dn.Date).getDay() == parseInt(document.getElementById("PrintWeekdaySelection").value, 10));
    let note = '';
    if (dayNote) {
        note = dayNote.Notes;
    }
    document.getElementById("DayNote").value = note;
}

function saveDayNote() {
    let date = new Date(calendar._renderRange.start.toDate());
    while (date.getDay() != (parseInt(document.getElementById("PrintWeekdaySelection").value) % 7)) {
        date.setDate(date.getDate() + 1);
    }
    date = new Date(date.getTime() - tzoffset);

    let service_params = '&date=' + encodeURIComponent(date.toISOString().split('T')[0])
        + '&notes=' + encodeURIComponent(document.getElementById("DayNote").value);

    let xmlhttp = new XMLHttpRequest();
    let url = "https://internal.ban-leng.com/forms/service-book/new-service-daynote.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            let reponseJSON = JSON.parse(this.response);
            if (this.status == 200 && reponseJSON.statusCode == 200) {
                location.reload();
            }
            else {
                alert('ERROR: Unsuccessful transaction')
            }
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xmlhttp.send(service_params);
}

function onChangeWeekDaySelection() {
    this.printAsText();
    this.getDailyNote();
}

function isEmptyString(text) {
    return text == null || text == "" || text == undefined;
}

function formatPrintText(text) {
    if (!isEmptyString(text.trim())) {
        return text.trim() + "\n";
    }
    return "";
}

function pasteFromStockOut() {
    let textarea = document.getElementById('pasteFromStockOut');
    let obj = JSON.parse(textarea.value);
    document.querySelector('#salesperson').value = obj.salesperson;
    document.querySelector('#Name').value = obj.Customer;
    document.querySelector('#ContactNo').value = obj.ContactNo;
    document.querySelector('#Address').value = obj.Address;
    let remark = '';
    for (let detail of obj.Details) {
        remark += (detail.Model + ' x ' + detail.Unit) + '\n';
    }
    document.querySelector('#Remark').value = remark;
    textarea.value = "";
}