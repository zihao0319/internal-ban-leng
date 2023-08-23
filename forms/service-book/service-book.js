var teams = [];
var actions = [];
var services = [];
var services_search = [];
var daynotes = [];
var CustomerRowData = [];

var jobAppointmentModal = document.getElementById("job-appointment-modal");
var jobAppointmentModalClose = document.getElementById("job-appointment-modal-close")
var btnSaveAsNew = document.getElementById("btnSaveAsNew");
var btnDelete = document.getElementById("btnDelete");
var editDayModal = document.getElementById("edit-day-modal");
var editDayModalClose = document.getElementById("edit-day-modal-close")
var jobSearchModal = document.getElementById("job-search-modal");
var jobSearchModalClose = document.getElementById("job-search-modal-close");
var pasteStockOutModal = document.getElementById("paste-stockout-modal");
var pasteStockOutModalClose = document.getElementById("paste-stockout-modal-close");
var btnPasteFromStockout = document.getElementById("btnPasteFromStockout")
var btnSelectCustomer = document.getElementById("btnSelectCustomer")
var selectCustomerModal = document.getElementById("select-customer-modal");
var selectCustomerModalClose = document.getElementById("select-customer-modal-close");

const ServiceColumnDefs = [
    { headerName: 'Status', field: 'Status', width: 80 },
    { headerName: 'Type', field: 'Type', width: 80 },
    { headerName: 'Name', field: 'Name', width: 150 },
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

const CustomerColumnDefs = [
    { headerName: 'Name', field: 'Name' },
    { headerName: 'Address', field: 'Address' },
    { headerName: 'Phone', field: 'Phone' },
    { headerName: 'Fax', field: 'Fax' },
    { headerName: 'Registration No.', field: 'RegNo' },
    { headerName: 'Attn Person', field: 'AttnPerson' },
    { headerName: 'Attn Phone', field: 'AttnPhone' },
    { headerName: 'Email', field: 'Email' }
];

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
    //onFirstDataRendered: autoSizeAll_Service,
    rowSelection: 'single',
    onSelectionChanged: onSelectionChanged_Service,
};

const CustomerGridOptions = {
    defaultColDef: { resizable: true, sortable: true, filter: true },
    columnDefs: CustomerColumnDefs,
    rowData: CustomerRowData,
    rowSelection: 'single',
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
    let cashAmt = services.filter(s => s.Status != 'Cancelled').map((row) => {
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

const eCustDiv = document.querySelector('#CustomerGrid');
new agGrid.Grid(eCustDiv, CustomerGridOptions);

function autoSizeAll_Service() {
    var allColumnIds = [];
    ServiceGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    ServiceGridOptions.columnApi.autoSizeColumns(allColumnIds);
}
function onCustomerFilterTextBoxChanged() {
    CustomerGridOptions.api.setQuickFilter(document.getElementById('CustomerFilter').value);
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

var calendar = null;
if (window.innerWidth >= 800) {
    calendar = new tui.Calendar('#calendar', {
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

} else {
    calendar = new tui.Calendar('#calendar', {
        defaultView: 'day', // daily view option
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
}

window.addEventListener('resize', function (event) {
    if (window.innerWidth >= 800 && calendar.getViewName() == 'day') {
        calendar.changeView("week")
        updateDateRenderRange();
        requestData()
    }
    else if (window.innerWidth < 800 && calendar.getViewName() == 'week') {
        calendar.changeView("day")
        updateDateRenderRange();
        requestData()
    }

}, true);


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
    if (calendar.getViewName() == 'week')
        renderRangeElement.innerHTML = convertDateToString(calendar._renderRange.start) + "-" + convertDateToString(calendar._renderRange.end);
    else
        renderRangeElement.innerHTML = convertDateToString(calendar._renderRange.start);

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
    var url = "/forms/service-book/service-book.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            receiveData(this.responseText);
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onerror = function (e) {
        location.href = '/';
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
        CustomerRowData = responseJSON.Customer;
        CustomerGridOptions.api.setRowData(CustomerRowData);

        // onChangeWeekDaySelection();
        setSalesperson(responseJSON.LoginUser);
    }
    catch (e) {
        location.href = '/';
    }

}

function openJobSearchPopup() {
    jobSearchModal.style.display = "block";
    /*document.getElementById("serviceSearchInput").value = '';
    services_search = [];
    ServiceSearchGridOptions.api.setRowData([]);*/
}

function openPasteFromStockoutPopup() {
    pasteStockOutModal.style.display = 'block';
}

function openCustomerPopup() {
    selectCustomerModal.style.display = 'block';
}

function searchService() {
    if (isEmptyString(document.getElementById("serviceSearchInput").value))
        return;
    var xmlhttp = new XMLHttpRequest();
    var request_param = "&search=" + encodeURIComponent(document.getElementById("serviceSearchInput").value);
    var url = "/forms/service-book/service-search.php";

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
        location.href = '/';
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

var defaultSalesperson = '';
function setSalesperson(loginUser) {
    if (!isEmptyString(loginUser)) {
        let salesPersonEle = document.querySelector('#salesperson')
        salesPersonEle.value = loginUser;
        defaultSalesperson = loginUser
    }


}

function createSchedule() {
    let schedules = [];
    let daycashAmt = {};
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
                title: service.ApptFrom + "\n" + (service.Status == 'Completed' ? '&#10004; ' : '') + service.Name + "(" + service.Team + ")\n" + service.Action,
                category: 'time',
                start: service_start,
                end: service_end,
                bgColor: (team ? team.BgColor : '#FFFFFF'),
                color: (team ? team.FontColor : '#000000'),
            }
        )
        if (parseFloat(service.CashAmount) > 0 && service.Status != 'Cancelled') {
            if (daycashAmt[service.ApptDate] == undefined)
                daycashAmt[service.ApptDate] = 0;
            daycashAmt[service.ApptDate] += parseFloat(service.CashAmount);
        }

    }
    for (let daynote of daynotes) {
        if (daynote.Notes && daynote.Notes != '') {
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
    for (let date in daycashAmt) {
        schedules.push({
            id: 'dayCashAmt_' + date,
            calendarId: 'Calendar',
            title: 'Total: RM' + daycashAmt[date].toFixed(2),
            isAllDay: true,
            category: 'allday',
            start: date,
            end: date,
            bgColor: '#f44336',
            color: '#000000'
        })
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
var editdaydate = null;
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
    let url = "/forms/service-book/new-service.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            let reponseJSON = JSON.parse(this.response);
            if (this.status == 200 && reponseJSON.statusCode == 200) {
                jobAppointmentModal.style.display = 'none';
                requestData();
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

function deleteService() {
    if (confirm("Are you sure you want to delete this job?")) {
        let service_params = '&id=' + encodeURIComponent(serviceid)
        let xmlhttp = new XMLHttpRequest();
        let url = "/forms/service-book/delete-service.php";

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                let reponseJSON = JSON.parse(this.response);
                if (this.status == 200 && reponseJSON.statusCode == 200) {
                    jobAppointmentModal.style.display = 'none';
                    requestData();
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
}



function editService(service) {
    jobAppointmentModal.style.display = 'block';
    btnSaveAsNew.style.display = 'block';
    btnDelete.style.display = 'block';
    btnPasteFromStockout.style.display = 'none';
    btnSelectCustomer.style.display = 'none';

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

var defaultStart;
var defaultEnd;

function newService(start, end) {
    jobAppointmentModal.style.display = 'block';
    btnSaveAsNew.style.display = 'none';
    btnDelete.style.display = 'none';
    btnPasteFromStockout.style.display = 'block';
    btnSelectCustomer.style.display = 'block';

    defaultStart = start;
    defaultEnd = end;

    serviceid = '';
    setDefaultService();
    onTypeChange();
}

function setDefaultService() {
    document.querySelector('#Name').value = '';
    document.querySelector('#PIC').value = '';
    document.querySelector('#ContactNo').value = '';
    document.querySelector('#Address').value = '';
    document.querySelector('#Department').value = '';
    document.querySelector('#Team').value = '';
    document.querySelector('#salesperson').value = defaultSalesperson;
    ApptDatePicker.setDate(defaultStart.toDate());
    FromTimePicker.setTime(defaultStart.getHours(), defaultStart.getMinutes());
    ToTimePicker.setTime(defaultStart.getHours() + 1, defaultStart.getMinutes());
    document.querySelector('#Remark').value = '';
    document.querySelector('#Type').value = 'Company';
    document.querySelector('#Action').value = '';
    document.querySelector('#Status').value = 'Pending';
    document.querySelector('#CashAmount').value = '0';
    document.querySelector('#cashtype').value = '';
    document.querySelector('#DO').value = '';
    document.querySelector('#invoice').value = '';
    document.querySelector('#invoiceamount').value = '0';
    onTypeChange();
}

calendar.on('clickSchedule', function (event) {
    let click_schedule = event.schedule;
    let click_scheduleid = click_schedule.id;
    if (!click_schedule.isAllDay) {
        let service = services.find(s => s.ServiceID == click_scheduleid);
        editService(service);
    } else if (click_scheduleid.startsWith("daynote_")) {
        editDayModal.style.display = 'block';
        editdaydate = new Date(click_schedule.start.toDate() - tzoffset);
        this.printAsText(editdaydate);
        this.getDailyNote(editdaydate);
    }
});
calendar.on('beforeCreateSchedule', function (event) {
    if (!event.isAllDay) {
        newService(event.start, event.end)
    }
    else {
        editDayModal.style.display = 'block';
        editdaydate = new Date(event.start.toDate() - tzoffset);
        this.printAsText(editdaydate);
        this.getDailyNote(editdaydate);
    }


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
        jobSearchModal.style.display = "none";
    }
}

var today = new Date();
var todaywod = today.getDay();
//document.getElementById("PrintWeekdaySelection").value = todaywod;
function printAsText(date) {
    //let dayservices = this.services.filter(s => s.Status != 'Cancelled' && new Date(s.ApptDate).getDay() == parseInt(document.getElementById("PrintWeekdaySelection").value, 10));
    let printText = '';
    if (date != null) {
        let dayservices = this.services.filter(s => s.Status != 'Cancelled' && new Date(s.ApptDate).getTime() === date.getTime());
        dayservices.sort((a, b) => (a.Team > b.Team) ? 1 : (a.Team === b.Team) ? ((a.ApptFrom > b.ApptFrom) ? 1 : -1) : -1)


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
    }
    document.getElementById("PrintText").value = printText;
}

function getDailyNote(date) {
    //let dayNote = this.daynotes.find(dn => new Date(dn.Date).getDay() == parseInt(document.getElementById("PrintWeekdaySelection").value, 10));
    let note = '';
    if (date != null) {
        dayNote = this.daynotes.find(dn => new Date(dn.Date).getTime() === date.getTime());
        if (dayNote) {
            note = dayNote.Notes;
        }
    }
    document.getElementById("DayNote").value = note;
}

function saveDayNote() {
    // let date = new Date(calendar._renderRange.start.toDate());
    // while (date.getDay() != (parseInt(document.getElementById("PrintWeekdaySelection").value) % 7)) {
    //     date.setDate(date.getDate() + 1);
    // }
    // date = new Date(date.getTime() - tzoffset);
    if (editdaydate == null)
        return;
    let service_params = '&date=' + encodeURIComponent(editdaydate.toISOString().split('T')[0])
        + '&notes=' + encodeURIComponent(document.getElementById("DayNote").value);

    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/service-book/new-service-daynote.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            let reponseJSON = JSON.parse(this.response);
            if (this.status == 200 && reponseJSON.statusCode == 200) {
                editDayModal.style.display = 'none';
                this.requestData();
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
    setDefaultService();
    let textarea = document.getElementById('pasteFromStockOut');
    let obj = JSON.parse(textarea.value);
    document.querySelector('#Name').value = obj.Customer;
    document.querySelector('#ContactNo').value = obj.ContactNo;
    document.querySelector('#Address').value = obj.Address;
    let remark = '';
    for (let detail of obj.Details) {
        document.querySelector('#salesperson').value = detail.salesperson;
        remark += (detail.Model + ' x ' + detail.Unit) + '\n';
    }
    document.querySelector('#Remark').value = remark;
    textarea.value = "";
}


jobAppointmentModalClose.onclick = function () {
    jobAppointmentModal.style.display = "none";
}
editDayModalClose.onclick = function () {
    editDayModal.style.display = 'none';
}
jobSearchModalClose.onclick = function () {
    jobSearchModal.style.display = "none";
}
pasteStockOutModalClose.onclick = function () {
    pasteStockOutModal.style.display = 'none';
}

selectCustomerModalClose.onclick = function () {
    selectCustomerModal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == jobAppointmentModal) {
        jobAppointmentModal.style.display = "none";
    }
    else if (event.target == editDayModal) {
        editDayModal.style.display = "none";
    }
    else if (event.target == jobSearchModal) {
        jobSearchModal.style.display = "none";
    }
    else if (event.target == pasteStockOutModal) {
        pasteStockOutModal.style.display = 'none';
    }
    else if (event.target == selectCustomerModal) {
        selectCustomerModal.style.display = 'none';
    }
}

function copyDaySummary() {
    let daySummaryEle = document.getElementById("PrintText");
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        var el = daySummaryEle;
        var editable = el.contentEditable;
        var readOnly = el.readOnly;
        el.contentEditable = true;
        el.readOnly = false;
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        el.setSelectionRange(0, 999999);
        el.contentEditable = editable;
        el.readOnly = readOnly;
    } else {
        daySummaryEle.select();
    }
    document.execCommand('copy');
    daySummaryEle.blur();
}

function openTab(evt, tabName, section) {
    // Declare all variables
    var i, tabcontent, tablinks;
    var sectionElement = document.querySelector('#' + section);
    // Get all elements with class="tabcontent" and hide them
    tabcontent = sectionElement.querySelectorAll(".tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = sectionElement.querySelectorAll(".tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    sectionElement.querySelector('#' + tabName).style.display = "block";
    evt.currentTarget.className += " active";

    if (section == "JobSection") {
        requestData();
    }
}
document.querySelector('#CustomerSearch').style.display = "block";
document.querySelector('#CustomerSearchBtn').className += " active";
document.querySelector('#CalendarView').style.display = "block";
document.querySelector('#CalendarViewBtn').className += " active";

function saveCustomer() {
    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/service-book/new-customer.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                requestData();

                let closeBtn = document.createElement('span');
                closeBtn.innerHTML = '[x]';
                closeBtn.addEventListener('click', function () {
                    document.querySelector('#NewCustomerMsg').innerHTML = '';
                })
                document.querySelector('#NewCustomerMsg').innerHTML = 'Success: Customer has been saved into system '
                document.querySelector('#NewCustomerMsg').appendChild(closeBtn);
            }
            else {
                alert('ERROR: Unsuccessful transaction')
            }
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    let params = 'name=' + encodeURIComponent(document.querySelector('#NewCustomerName').value)
        + '&address=' + encodeURIComponent(document.querySelector('#NewCustomerAddress').value)
        + '&phone=' + encodeURIComponent(document.querySelector('#NewPhone').value)
        + '&fax=' + encodeURIComponent(document.querySelector('#NewFax').value)
        + '&regno=' + encodeURIComponent(document.querySelector('#NewRegNo').value)
        + '&attnperson=' + encodeURIComponent(document.querySelector('#NewAttnPerson').value)
        + '&attnphone=' + encodeURIComponent(document.querySelector('#NewAttnPhone').value)
        + '&email=' + encodeURIComponent(document.querySelector('#NewEmail').value);
    xmlhttp.send(params);
}

function selectNewCustomer() {
    setDefaultService();
    document.querySelector('#Name').value = document.querySelector('#NewCustomerName').value;
    document.querySelector('#Address').value = document.querySelector('#NewCustomerAddress').value;
    document.querySelector('#ContactNo').value = document.querySelector('#NewPhone').value;
    selectCustomerModal.style.display = 'none';
}

function selectExistingCustomer() {
    setDefaultService();
    let selectedCustomer = CustomerGridOptions.api.getSelectedRows();
    document.querySelector('#Name').value = selectedCustomer[0].Name;
    document.querySelector('#Address').value = selectedCustomer[0].Address;
    document.querySelector('#ContactNo').value = selectedCustomer[0].Phone;
    selectCustomerModal.style.display = 'none';
}