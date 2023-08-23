const supplyGroupHeader = 'Supply of new \n';
const installGroupHeader = 'Supply and installation of new \n';
const concealGroupHeader = 'Supply, installation and concealing of new \n';

const supplySOW = [
    'Installation is not included'
]
const installSOW = [
    'Install the air cond indoor & outdoor unit, testing & commisioning of each system, vacuum to the sytem and fill in with refrigerant gas, and testing in a good condition.'
    , 'Price inclusive of surface installation of 10ft 0.61mm copper piping, ½" thickness premium insulation, 100% pure copper wiring, and drainage piping to the drainage point.'
    , 'Any extra piping will be charged separately as follows: 1HP(RM18/ft), 1.5HP&2HP (RM20/ft), 2.5HP&3HP (RM25/ft).'
    , 'Risk assessment will be carried out. Company reserve the right, at its discretion, to cancel, modify, add or remove portions of the quotation at anytime as if the risk level is high.'
];
const installNoPipeSOW = [
    'Install the air cond indoor & outdoor unit, testing & commisioning of each system, vacuum to the sytem and fill in with refrigerant gas, and testing in a good condition.'
    , 'Price exclusive of surface installation of copper piping, insulation, copper wiring, and drainage piping. (This is given that your premise already has air cond piping installed)'
    , 'Risk assessment will be carried out. Company reserve the right, at its discretion, to cancel, modify, add or remove portions of the quotation at anytime as if the risk level is high.'
];

const concealSOW = [
    'Install the air cond indoor & outdoor unit, testing & commisioning of each system, vacuum to the sytem and fill in with refrigerant gas, and testing in a good condition.'
    , 'Price inclusive of concealed installation of 10ft 0.61mm copper piping, ½" thickness premium insulation, 100% pure copper wiring, and drainage piping to the drainage point.'
    , 'Any extra piping will be charged separately as follows: 1HP(RM18/ft), 1.5HP&2HP (RM20/ft), 2.5HP&3HP (RM25/ft).'
    , 'Risk assessment will be carried out. Company reserve the right, at its discretion, to cancel, modify, add or remove portions of the quotation at anytime as if the risk level is high.'
]

const kaltNote = '1. Kindly make payment to CIMB BANK BERHAD 8009700703';
const banlengNote = '1. Kindly make payment to MAYBANK BERHAD 5070 9514 3059';


var invoices = [];
var orders = [];
var orderExtraCharges = [];
var payments = [];
var details = [];
var detailExtraCharges = [];
var models = [];
var extraCharges = [];

const invoiceColumnDefs = [
    { headerName: 'Date', field: 'InvoiceDate', cellEditor: 'datePicker' },
    { headerName: 'Type', field: 'Type', editable: false },
    { headerName: 'Invoice/SO No', field: 'InvoiceNo' },
    { headerName: 'Total', field: 'Total', valueFormatter: (args) => parseFloat(args.value).toFixed(2), editable: false },
    { headerName: 'Customer', field: 'Customer' },
    { headerName: 'Contact No', field: 'ContactNo' },
    { headerName: 'Address', field: 'Address' },
];

const orderColumnDefs = [
    { headerName: 'Order Date', field: 'OrderDate', cellEditor: 'datePicker' },
    { headerName: 'Model', field: 'Model', cellEditor: 'modelSelectBox' },
    { headerName: 'Unit', field: 'Unit' },
    {
        headerName: 'Price', field: 'Price',
        valueFormatter: (args) => parseFloat(args.value).toFixed(2),
    },
    {
        headerName: 'Extra Charge', field: 'TotalExtraCharge',
        valueFormatter: (args) => parseFloat(args.value).toFixed(2),
        editable: false
    },
    {
        headerName: 'Total', field: 'Total',
        valueFormatter: (args) => parseFloat(args.value).toFixed(2),
        valueGetter: (args) => (parseInt(args.data.Unit) * parseFloat(args.data.Price)) + parseFloat(args.data.TotalExtraCharge),
        editable: false
    },
    { headerName: 'S/O No', field: 'SalesOrderNo' },
    { headerName: 'Kalt No', field: 'KaltNo' },
    { headerName: 'Invoice No', field: 'InvoiceNo' },
    { headerName: 'Job Type', field: 'JobType', cellEditor: 'jobTypeSelectBox' },
    { headerName: 'salesperson', field: 'salesperson' },
    { headerName: 'Customer', field: 'Customer', editable: false },
    { headerName: 'Contact No', field: 'ContactNo', editable: false },
    { headerName: 'ETD', field: 'ExpectedDeliveryDate', cellEditor: 'datePicker' },
    { headerName: 'Note', field: 'Note' },
    {
        headerName: 'Serial No', field: 'SerialNo', minWidth: 500,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: { maxLength: 500 }
    },
    { headerName: 'ETI', field: 'ETI', cellEditor: 'datePicker' },
    { headerName: 'ETIref', field: 'ETIref' },
    { headerName: 'Address', field: 'Address', editable: false },
]

const paymentColumnDefs = [
    { headerName: 'Payment Date', field: 'PaymentDate', cellEditor: 'datePicker' },
    { headerName: 'Amount', field: 'Amount', valueFormatter: (args) => parseFloat(args.value).toFixed(2), },
    { headerName: 'Type', field: 'Type' },
     { headerName: 'Check Date', field: 'CheckDate', cellEditor: 'datePicker' },
]

const detailColumnDefs = [
    { headerName: 'Order Date', field: 'OrderDate' },
    { headerName: 'Model', field: 'Model' },
    { headerName: 'Unit', field: 'Unit' },
    { headerName: 'S/O No', field: 'SalesOrderNo' },
    { headerName: 'Kalt No', field: 'KaltNo' },
    { headerName: 'Invoice No', field: 'InvoiceNo' },
    {
        headerName: 'Price', field: 'Price',
        valueFormatter: (args) => parseFloat(args.value).toFixed(2),
    },
    {
        headerName: 'Extra Charge', field: 'TotalExtraCharge',
        valueFormatter: (args) => parseFloat(args.value).toFixed(2),
    },
    {
        headerName: 'Total', field: 'Total',
        valueFormatter: (args) => parseFloat(args.value).toFixed(2),
        valueGetter: (args) => (parseInt(args.data.Unit) * parseFloat(args.data.Price)) + parseFloat(args.data.TotalExtraCharge),
    },
    { headerName: 'Job Type', field: 'JobType' },
    { headerName: 'salesperson', field: 'salesperson' },
    { headerName: 'ETD', field: 'ExpectedDeliveryDate' },
    { headerName: 'ETI', field: 'ETI' },
    { headerName: 'ETIref', field: 'ETIref' },
    { headerName: 'Note', field: 'Note' },
    { headerName: 'Serial No', field: 'SerialNo' },
];

const detailExtraChargeColumnDefs = [
    { headerName: 'Description', field: 'Description', width: 300 },
    { headerName: 'Unit', field: 'Unit', width: 100 },
    { headerName: 'UOM', field: 'UOM', width: 100 },
    { headerName: 'Unit Price', field: 'UnitPrice', width: 100, valueFormatter: (args) => (isEmptyString(args.value) ? '' : parseFloat(args.value).toFixed(2)) },
    { headerName: 'Total', field: 'Total', width: 100, valueGetter: (args) => (!isEmptyString(args.data.Unit) && !isEmptyString(args.data.UnitPrice) ? parseInt(args.data.Unit) * parseFloat(args.data.UnitPrice) : ''), valueFormatter: (args) => (isEmptyString(args.value) ? '' : args.value.toFixed(2)) },
];


const extraChargeColumnDefs = [
    { headerName: 'Description', field: 'Description', width: 300 },
    { headerName: 'Unit Price', field: 'UnitPrice', width: 100, editable: true, valueFormatter: (args) => (isEmptyString(args.value) ? '' : parseFloat(args.value).toFixed(2)) },

];

const orderExtraChargeColumnDefs = [
    { headerName: 'Description', field: 'Description', width: 300, editable: true },
    { headerName: 'Unit', field: 'Unit', width: 100, editable: true },
    { headerName: 'UOM', field: 'UOM', width: 100, editable: true },
    { headerName: 'Unit Price', field: 'UnitPrice', width: 100, editable: true, valueFormatter: (args) => (isEmptyString(args.value) ? '' : parseFloat(args.value).toFixed(2)) },
    { headerName: 'Total', field: 'Total', width: 100, editable: false, valueGetter: (args) => (!isEmptyString(args.data.Unit) && !isEmptyString(args.data.UnitPrice) ? parseInt(args.data.Unit) * parseFloat(args.data.UnitPrice) : ''), valueFormatter: (args) => (isEmptyString(args.value) ? '' : args.value.toFixed(2)) },
];

const invoiceGridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
        editable: true
    },
    rowSelection: 'single',
    columnDefs: invoiceColumnDefs,
    rowData: invoices,
    onFirstDataRendered: autoSizeAll_Invoice,
    components: {
        datePicker: getDatePicker(),
    },
    editType: 'fullRow',
    onRowEditingStarted: this.editInvoiceRow,
    onRowValueChanged: this.saveInvoiceRow,
    //stopEditingWhenGridLosesFocus: true,
    getRowStyle: ((params) => {
        if (params.data.modified) {
            return { background: 'lightyellow' };
        }
    }),
    onSelectionChanged: externalInvoiceFilterChanged,
    isExternalFilterPresent: (() => { return true; }),
    doesExternalFilterPass: ((node) => {
        return !node.data.deleted;
    })
};

const orderGridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
        editable: true
    },
    rowSelection: 'single',
    columnDefs: orderColumnDefs,
    rowData: orders,
    onFirstDataRendered: autoSizeAll_Order,
    components: {
        datePicker: getDatePicker(),
        modelSelectBox: getModelSelectBox(),
        jobTypeSelectBox: getJobTypeSelectBox(),
    },
    onCellValueChanged: this.saveOrderRow,
    //stopEditingWhenGridLosesFocus: true,
    getRowStyle: ((params) => {
        if (params.data.modified) {
            return { background: 'lightyellow' };
        }
    }),
    onSelectionChanged: externalOrderFilterChanged,
    isExternalFilterPresent: (() => { return true; }),
    doesExternalFilterPass: ((node) => {
        return !node.data.deleted;
    })
}

const orderExtraChargeGridOptions = {
    defaultColDef: { resizable: true, sortable: false, filter: true },
    columnDefs: orderExtraChargeColumnDefs,
    rowSelection: 'single',
    rowData: orderExtraCharges,
    isExternalFilterPresent: (() => { return true }),
    doesExternalFilterPass: doesOrderExtraChargesFilterPass
};

const paymentGridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
        editable: true
    },
    rowSelection: 'single',
    columnDefs: paymentColumnDefs,
    rowData: payments,
    onFirstDataRendered: autoSizeAll_Payment,
    components: {
        datePicker: getDatePicker(),
    },
    editType: 'fullRow',
    onRowValueChanged: this.savePaymentRow,
    //stopEditingWhenGridLosesFocus: true,
    getRowStyle: ((params) => {
        if (params.data.modified) {
            return { background: 'lightyellow' };
        }
    }),
    isExternalFilterPresent: (() => { return true; }),
    doesExternalFilterPass: doesInvoicePaymentFilterPass
}

const detailGridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
        editable: false
    },
    rowSelection: 'single',
    columnDefs: detailColumnDefs,
    rowData: details,
    onFirstDataRendered: autoSizeAll_Detail,
    onSelectionChanged: externalDetailFilterChanged,
    isExternalFilterPresent: (() => { return true }),
    doesExternalFilterPass: doesInvoiceDetailsFilterPass
}

const detailExtraChargesGridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
        editable: false
    },
    rowSelection: 'single',
    columnDefs: detailExtraChargeColumnDefs,
    rowData: detailExtraCharges,
    onFirstDataRendered: autoSizeAll_DetailExtraCharge,
    isExternalFilterPresent: (() => { return true }),
    doesExternalFilterPass: doesInvoiceDetailExtraChargesFilterPass
}

const extraChargeGridOptions = {
    defaultColDef: { resizable: true, sortable: false, filter: true },
    columnDefs: extraChargeColumnDefs,
    rowSelection: 'single',
    rowData: extraCharges,
    isExternalFilterPresent: (() => { return true }),
    doesExternalFilterPass: doesExtraChargesFilterPass
};

function doesInvoicePaymentFilterPass(node) {
    if (node.data.deleted) {
        return false;
    }
    let selectedInvoices = invoiceGridOptions.api.getSelectedRows();
    if (selectedInvoices != null && selectedInvoices.length > 0) {
        return selectedInvoices.some(value => value.InvoiceNo == node.data.InvoiceNo);
    }
    return false;
}

function doesInvoiceDetailsFilterPass(node) {
    if (node.data.deleted) {
        return false;
    }
    let selectedInvoices = invoiceGridOptions.api.getSelectedRows();
    if (selectedInvoices != null && selectedInvoices.length > 0) {
        return selectedInvoices.some(value => {
            return (node.data.Type == 'Invoice' && value.InvoiceNo == node.data.InvoiceNo)
                || (node.data.Type == 'Sales Order' && value.InvoiceNo == node.data.SalesOrderNo)
        });
    }
    return false;
}

function doesExtraChargesFilterPass(node) {
    let selectedOrders = orderGridOptions.api.getSelectedRows();
    if (selectedOrders != null && selectedOrders.length == 1) {
        let model = models.find(m => m.Model == selectedOrders[0].Model);
        if (model) {
            return node.data.Category == model.Category || isEmptyString(node.data.Category);
        }
    }
    return false;
}

function doesOrderExtraChargesFilterPass(node) {
    let selectedOrders = orderGridOptions.api.getSelectedRows();
    if (selectedOrders != null && selectedOrders.length == 1) {
        return selectedOrders[0].ID == node.data.StockOutID;
    }
    return false;
}

function doesInvoiceDetailExtraChargesFilterPass(node) {
    let selectedDetails = detailGridOptions.api.getSelectedRows();
    if (selectedDetails != null && selectedDetails.length == 1) {
        return selectedDetails[0].ID == node.data.StockOutID;
    }
    return false;
}

function externalInvoiceFilterChanged() {
    detailGridOptions.api.onFilterChanged();
    paymentGridOptions.api.onFilterChanged();
}

function externalOrderFilterChanged() {
    extraChargeGridOptions.api.onFilterChanged();
    orderExtraChargeGridOptions.api.onFilterChanged();
}

function externalDetailFilterChanged() {
    detailExtraChargesGridOptions.api.onFilterChanged();
}

const invoiceGridDiv = document.querySelector('#invoiceGrid');
new agGrid.Grid(invoiceGridDiv, invoiceGridOptions);

const orderGridDiv = document.querySelector('#orderGrid');
new agGrid.Grid(orderGridDiv, orderGridOptions);

const orderExtraChargeGridDiv = document.querySelector('#orderExtraChargeGrid');
new agGrid.Grid(orderExtraChargeGridDiv, orderExtraChargeGridOptions);

const paymentGridDiv = document.querySelector('#paymentGrid');
new agGrid.Grid(paymentGridDiv, paymentGridOptions);

const detailGridDiv = document.querySelector('#detailGrid');
new agGrid.Grid(detailGridDiv, detailGridOptions);

const detailExtraChargeGridDiv = document.querySelector('#detailExtraChargeGrid');
new agGrid.Grid(detailExtraChargeGridDiv, detailExtraChargesGridOptions);

const extraChargesDiv = document.querySelector('#extraChargeGrid');
new agGrid.Grid(extraChargesDiv, extraChargeGridOptions);

function autoSizeAll_Invoice() {
    var allColumnIds = [];
    invoiceGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    invoiceGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

function autoSizeAll_Order() {
    var allColumnIds = [];
    orderGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    orderGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

function autoSizeAll_Payment() {
    var allColumnIds = [];
    paymentGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    paymentGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

function autoSizeAll_Detail() {
    var allColumnIds = [];
    detailGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    detailGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

function autoSizeAll_DetailExtraCharge() {
    var allColumnIds = [];
    detailExtraChargesGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    detailExtraChargesGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

// Order Date
var d = new Date();
var month = d.getMonth();
var year = d.getFullYear();


function moveToday() {
    var d = new Date();
    month = d.getMonth();
    year = d.getFullYear();
    updateDateRenderRange();
    requestData();
}

function movePrev() {
    var d = new Date(year, month - 1, 1);
    month = d.getMonth();
    year = d.getFullYear();
    updateDateRenderRange();
    requestData();
}

function moveNext() {
    var d = new Date(year, month + 1, 1);
    month = d.getMonth();
    year = d.getFullYear();
    updateDateRenderRange();
    requestData();
}

function showAllPendingOrders() {
    requestData(true);
}

function updateDateRenderRange() {
    var renderRangeElement = document.querySelector('#renderRange');
    renderRangeElement.innerHTML = (month + 1) + "/" + year;
}
updateDateRenderRange();

// Invoice Date
var d = new Date();
var month_inv = d.getMonth();
var year_inv = d.getFullYear();


function moveTodayInvoice() {
    var d = new Date();
    month_inv = d.getMonth();
    year_inv = d.getFullYear();
    updateDateRenderRangeInvoice();
    requestDataInvoice();
}

function movePrevInvoice() {
    var d = new Date(year_inv, month_inv - 1, 1);
    month_inv = d.getMonth();
    year_inv = d.getFullYear();
    updateDateRenderRangeInvoice();
    requestDataInvoice();
}

function moveNextInvoice() {
    var d = new Date(year_inv, month_inv + 1, 1);
    month_inv = d.getMonth();
    year_inv = d.getFullYear();
    updateDateRenderRangeInvoice();
    requestDataInvoice();
}

function updateDateRenderRangeInvoice() {
    var renderRangeElementInvoice = document.querySelector('#renderRangeInvoice');
    renderRangeElementInvoice.innerHTML = (month_inv + 1) + "/" + year_inv;
}
updateDateRenderRangeInvoice();

document.addEventListener('DOMContentLoaded', this.requestDataPageLoad);
document.addEventListener('DOMContentLoaded', this.requestDataInvoice);

function requestDataPageLoad() {
    requestData(false);
}

function requestData(showAllPending = false) {
    var xmlhttp = new XMLHttpRequest();

    var request_param = "&month=" + encodeURIComponent(month + 1)
        + "&year=" + encodeURIComponent(year)
        + "&showpending=" + encodeURIComponent(showAllPending ? 1 : 0)
    var url = "/forms/stockout/stockout.php";

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
        orders = responseJSON.StockOuts;
        orderExtraCharges = responseJSON.StockOutExtraCharges;
        models = responseJSON.Models;
        extraCharges = responseJSON.ExtraCharges;
        orderGridOptions.api.setRowData(orders);
        orderExtraChargeGridOptions.api.setRowData(orderExtraCharges);
        extraChargeGridOptions.api.setRowData(extraCharges);
        updateMonthTotalElement(responseJSON.Totals, responseJSON.Pendings);
    }
    catch (e) {
        debugger;
        location.href = '/';
    }

}

function updateMonthTotalElement(totals, pendings) {
    let totalunit = 0;
    let totalprice = 0.0;
    if (totals.length > 0) {
        totalunit = parseInt(totals[0].TotalUnit);
        totalprice = parseFloat(totals[0].TotalPrice);
    }
    let pendingunit = 0;
    let pendingprice = 0.0;
    if (pendings.length > 0) {
        pendingunit = parseInt(pendings[0].PendingUnit);
        pendingprice = parseFloat(pendings[0].PendingPrice);
    }
    var monthTotalElement = document.querySelector('#monthTotal');
    let displayText = 'Total unit sold in the month: <b>' + totalunit + '</b> | Total revenue for the month: <b>RM ' + totalprice.toFixed(2) + '</b><br>';
    displayText += 'Pending unit sold in the month: <b>' + pendingunit + '</b> | Pending revenue for the month: <b>RM ' + pendingprice.toFixed(2) + '</b>';
    monthTotalElement.innerHTML = displayText;
}

function requestDataInvoice() {
    var xmlhttp = new XMLHttpRequest();

    var request_param = "&month=" + encodeURIComponent(month_inv + 1)
        + "&year=" + encodeURIComponent(year_inv)
    var url = "/forms/stockout/stockout-invoice.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            receiveDataInvoice(this.responseText);
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onerror = function (e) {
        location.href = '/';
    }
    xmlhttp.send(request_param);
}

function receiveDataInvoice(response) {
    try {
        responseJSON = JSON.parse(response);
        invoices = responseJSON.Invoices;
        payments = responseJSON.Payments;
        details = responseJSON.Details;
        detailExtraCharges = responseJSON.ExtraCharges;
        invoiceGridOptions.api.setRowData(invoices);
        paymentGridOptions.api.setRowData(payments);
        detailGridOptions.api.setRowData(details);
        detailExtraChargesGridOptions.api.setRowData(detailExtraCharges);
        externalInvoiceFilterChanged();
    }
    catch (e) {
        debugger;
        location.href = '/';
    }

}

var editingInvoiceNo = "";
function editInvoiceRow(event) {
    editingInvoiceNo = event.data.InvoiceNo;
}
function saveInvoiceRow(event) {
    event.data.modified = true;
    if (editingInvoiceNo !== event.data.InvoiceNo) {
        // Payment
        var paymentsToUpdate = [];
        paymentGridOptions.api.forEachNodeAfterFilterAndSort(function (rowNode, index) {
            if (rowNode.data.InvoiceNo == editingInvoiceNo) {
                var paymentData = rowNode.data;
                paymentData.modified = true;
                paymentData.InvoiceNo = event.data.InvoiceNo
                paymentsToUpdate.push(paymentData);
            }
        });
        paymentGridOptions.api.applyTransaction({ update: paymentsToUpdate });
    }
    document.querySelector('#warningInvoicesIcon').style.display = 'inline';
    document.querySelector("#submitInvoicesButton").disabled = false;
    invoiceGridOptions.api.refreshCells([event.node]);
}

function saveOrderRow(event) {
    event.data.modified = true;
    document.querySelector('#warningOrdersIcon').style.display = 'inline';
    document.querySelector("#submitOrdersButton").disabled = false;
    orderGridOptions.api.refreshCells([event.node]);
}

function savePaymentRow(event) {
    event.data.modified = true;
    document.querySelector('#warningInvoicesIcon').style.display = 'inline';
    document.querySelector("#submitInvoicesButton").disabled = false;
    paymentGridOptions.api.refreshCells([event.node]);
}

function addInvoiceRow() {
    let newRows = [{
        InvoiceDate: '',
        Type: 'Invoice',
        InvoiceNo: '',
        Customer: '',
        ContactNo: '',
        Address: '',
        modified: true
    }];
    let length = this.getAllInvoiceRows().length;
    invoiceGridOptions.api.applyTransaction({ add: newRows });
    invoiceGridOptions.api.startEditingCell({
        rowIndex: length,
        colKey: 'InvoiceDate'
    });
    document.querySelector('#warningInvoicesIcon').style.display = 'inline';
    document.querySelector("#submitInvoicesButton").disabled = false;
}

function addInvoiceSORow() {
    let newRows = [{
        InvoiceDate: '',
        Type: 'Sales Order',
        InvoiceNo: '',
        Customer: '',
        ContactNo: '',
        Address: '',
        modified: true
    }];
    let length = this.getAllInvoiceRows().length;
    invoiceGridOptions.api.applyTransaction({ add: newRows });
    invoiceGridOptions.api.startEditingCell({
        rowIndex: length,
        colKey: 'InvoiceDate'
    });
    document.querySelector('#warningInvoicesIcon').style.display = 'inline';
    document.querySelector("#submitInvoicesButton").disabled = false;
}

function copyInvoiceRow() {
    let selectedRow = invoiceGridOptions.api.getSelectedRows()[0];
    if (selectedRow) {
        let newRows = [{
            InvoiceDate: selectedRow.InvoiceDate,
            Type: 'Invoice',
            InvoiceNo: '',
            Customer: selectedRow.Customer,
            ContactNo: selectedRow.ContactNo,
            Address: selectedRow.Address,
            modified: true
        }];
        let length = this.getAllInvoiceRows().length;
        invoiceGridOptions.api.applyTransaction({ add: newRows });
        invoiceGridOptions.api.startEditingCell({
            rowIndex: length,
            colKey: 'InvoiceDate'
        });
        document.querySelector('#warningInvoicesIcon').style.display = 'inline';
        document.querySelector("#submitInvoicesButton").disabled = false;
    }
    else {
        alert('Please select Sales Order/Invoice');
    }
}

function copyInvoiceSORow() {
    let selectedRow = invoiceGridOptions.api.getSelectedRows()[0];
    if (selectedRow) {
        let newRows = [{
            InvoiceDate: selectedRow.InvoiceDate,
            Type: 'Sales Order',
            InvoiceNo: '',
            Customer: selectedRow.Customer,
            ContactNo: selectedRow.ContactNo,
            Address: selectedRow.Address,
            modified: true
        }];
        let length = this.getAllInvoiceRows().length;
        invoiceGridOptions.api.applyTransaction({ add: newRows });
        invoiceGridOptions.api.startEditingCell({
            rowIndex: length,
            colKey: 'InvoiceDate'
        });
        document.querySelector('#warningInvoicesIcon').style.display = 'inline';
        document.querySelector("#submitInvoicesButton").disabled = false;
    }
    else {
        alert('Please select Sales Order/Invoice');
    }
}

function addOrderRow() {
    let newRows = [{
        OrderDate: '',
        Model: '',
        Unit: 0,
        Price: 0,
        InvoiceNo: '',
        SalesOrderNo: '',
        JobType: '',
        salesperson: '',
        Note: '',
        SerialNo: '',
        ExpectedDeliveryDate: '',
        ETI: '',
        ETIref: '',
        modified: true
    }];
    let length = this.getAllOrderRows().length;
    orderGridOptions.api.applyTransaction({ add: newRows });
    orderGridOptions.api.startEditingCell({
        rowIndex: length,
        colKey: 'OrderDate'
    });
    document.querySelector('#warningOrdersIcon').style.display = 'inline';
    document.querySelector("#submitOrdersButton").disabled = false;
}

function addOrderExtraChargeRow() {
    let selectedRow = extraChargeGridOptions.api.getSelectedRows();
    if (selectedRow && selectedRow.length == 1) {
        let selectedOrders = orderGridOptions.api.getSelectedRows();
        if (selectedOrders && selectedOrders.length == 1) {
            if (this.isEmptyString(selectedOrders[0].ID)) {
                alert("Please save the order record first");
                return;
            }
            let newRows = [{
                StockOutID: selectedOrders[0].ID,
                Description: selectedRow[0].Description,
                Unit: 0,
                UOM: selectedRow[0].UOM,
                UnitPrice: selectedRow[0].UnitPrice,
            }];
            let length = this.getAllOrderExtraChargeRows().length;
            orderExtraChargeGridOptions.api.applyTransaction({ add: newRows });
            orderExtraChargeGridOptions.api.startEditingCell({
                rowIndex: length,
                colKey: 'Unit'
            });
        }
    }
    else {
        alert("Please select an extra charge");
    }

}

function addPaymentRow() {
    let invoiceRow = invoiceGridOptions.api.getSelectedRows()[0];
    let newRows = [{
        PaymentDate: '',
        Type: '',
        InvoiceNo: invoiceRow.InvoiceNo,
        Amount: 0,
        modified: true
    }];
    let length = this.getAllPaymentRows().length;
    paymentGridOptions.api.applyTransaction({ add: newRows });
    paymentGridOptions.api.startEditingCell({
        rowIndex: length,
        colKey: 'PaymentDate'
    });
    document.querySelector('#warningInvoicesIcon').style.display = 'inline';
    document.querySelector("#submitInvoicesButton").disabled = false;
}

function deleteInvoiceRow() {
    let isconfirmdelete = confirm("Are you sure you want to delete this item?");
    if (!isconfirmdelete) {
        return;
    }
    let selectedRow = invoiceGridOptions.api.getSelectedRows()[0];
    if (selectedRow) {
        // Payment
        paymentGridOptions.api.forEachNodeAfterFilterAndSort(function (rowNode, index) {
            if (rowNode.data.InvoiceNo == selectedRow.InvoiceNo) {
                this.deletePaymentRow(rowNode.data);
            }
        });

        if (selectedRow.ID) {
            selectedRow.deleted = true;
            selectedRow.modified = true;

            document.querySelector('#warningInvoicesIcon').style.display = 'inline';
            document.querySelector("#submitInvoicesButton").disabled = false;
            invoiceGridOptions.api.applyTransaction({ update: [selectedRow] });
        }
        else {
            invoiceGridOptions.api.applyTransaction({ remove: [selectedRow] });
            let modified_rows = this.getAllInvoiceRows().filter(row => row.modified);
            if (modified_rows.length == 0) {
                document.querySelector('#warningInvoicesIcon').style.display = 'none';
                document.querySelector("#submitInvoicesButton").disabled = true;
            }
        }
    }

}

function deleteOrderRow() {
    let isconfirmdelete = confirm("Are you sure you want to delete this item?");
    if (!isconfirmdelete) {
        return;
    }
    let selectedRow = orderGridOptions.api.getSelectedRows()[0];
    if (selectedRow) {
        if (selectedRow.ID) {
            selectedRow.deleted = true;
            selectedRow.modified = true;
            document.querySelector('#warningOrdersIcon').style.display = 'inline';
            document.querySelector("#submitOrdersButton").disabled = false;
            orderGridOptions.api.applyTransaction({ update: [selectedRow] });
        }
        else {
            orderGridOptions.api.applyTransaction({ remove: [selectedRow] });
            let modified_rows = this.getAllOrderRows().filter(row => row.modified);
            if (modified_rows.length == 0) {
                document.querySelector('#warningOrdersIcon').style.display = 'none';
                document.querySelector("#submitOrdersButton").disabled = true;
            }
        }
    }
}

function deleteOrderExtraChargeRow() {
    let isconfirmdelete = confirm("Are you sure you want to delete this item?");
    if (!isconfirmdelete) {
        return;
    }
    let selectedRow = orderExtraChargeGridOptions.api.getSelectedRows()[0];
    if (selectedRow) {
        orderExtraChargeGridOptions.api.applyTransaction({ remove: [selectedRow] });
    }

}

function deletePaymentRow(selectedRow) {
    if (!selectedRow) {
        let isconfirmdelete = confirm("Are you sure you want to delete this item?");
        if (!isconfirmdelete) {
            return;
        }
        selectedRow = paymentGridOptions.api.getSelectedRows()[0];
    }
    if (selectedRow) {
        if (selectedRow.ID) {
            selectedRow.deleted = true;
            selectedRow.modified = true;
            document.querySelector('#warningInvoicesIcon').style.display = 'inline';
            document.querySelector("#submitInvoicesButton").disabled = false;
            paymentGridOptions.api.applyTransaction({ update: [selectedRow] });
        }
        else {
            paymentGridOptions.api.applyTransaction({ remove: [selectedRow] });
            let modified_rows = this.getAllPaymentRows().filter(row => row.modified);
            if (modified_rows.length == 0) {
                document.querySelector('#warningInvoicesIcon').style.display = 'none';
                document.querySelector("#submitInvoicesButton").disabled = true;
            }
        }
    }

}

function submitOrders() {
    let submitdata = {
        'Orders': this.getAllOrderRows().filter(row => row.modified),
    }

    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/stockout/stockout-change.php";

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
    xmlhttp.setRequestHeader("Content-Type", "application/json");

    var json = JSON.stringify(submitdata);
    xmlhttp.send(json);
}

function submitOrderExtraCharge() {
    let selectedOrders = orderGridOptions.api.getSelectedRows();
    if (selectedOrders && selectedOrders.length == 1 && !this.isEmptyString(selectedOrders[0].ID)) {
        let submitdata = {
            'StockOutID': selectedOrders[0].ID,
            'StockOutExtraCharges': this.getAllOrderExtraChargeRows().filter(row => row.StockOutID == selectedOrders[0].ID)
        };

        let xmlhttp = new XMLHttpRequest();
        let url = "/forms/stockout/stockout-change-ec.php";

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
        xmlhttp.setRequestHeader("Content-Type", "application/json");

        var json = JSON.stringify(submitdata);
        xmlhttp.send(json);
    }
    else {
        alert("Please select a saved record from order list");
    }
}

function submitInvoices() {
    let submitdata = {
        'Invoices': this.getAllInvoiceRows().filter(row => row.modified),
        'Payments': this.getAllPaymentRows().filter(row => row.modified)
    }

    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/stockout/stockout-change-invoice.php";

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
    xmlhttp.setRequestHeader("Content-Type", "application/json");

    var json = JSON.stringify(submitdata);
    xmlhttp.send(json);


}

function getAllInvoiceRows() {
    let rowData = [];
    invoiceGridOptions.api.forEachNode(node => rowData.push(node.data));
    return rowData;
}

function getAllOrderRows() {
    let rowData = [];
    orderGridOptions.api.forEachNode(node => rowData.push(node.data));
    return rowData;
}

function getAllOrderExtraChargeRows() {
    let rowData = [];
    orderExtraChargeGridOptions.api.forEachNode(node => rowData.push(node.data));
    return rowData;
}

function getAllDetailRows() {
    let rowData = [];
    detailGridOptions.api.forEachNode(node => rowData.push(node.data));
    return rowData;
}

function getAllDetailExtraChargeRows() {
    let rowData = [];
    detailExtraChargesGridOptions.api.forEachNode(node => rowData.push(node.data));
    return rowData;
}

function getAllPaymentRows() {
    let rowData = [];
    paymentGridOptions.api.forEachNode(node => rowData.push(node.data));
    return rowData;
}

function generatePickingList() {
    let pickListDate = document.getElementById('pickingListDate').value;
    let orderList = this.getAllOrderRows().filter(s => s.ExpectedDeliveryDate == pickListDate);
    let pickList = [];
    for (let order of orderList) {
        let customer = pickList.find(pl => pl.Customer == order.Customer && pl.Address == order.Address && pl.ContactNo == order.ContactNo);
        if (!customer) {
            customer = { 'Customer': order.Customer, 'ContactNo': order.ContactNo, 'Address': order.Address, 'OrderList': [] };
            pickList.push(customer);
        }
        customer.OrderList.push(order);
    }

    let printText = '';
    if (pickList.length > 0) {
        printText += ('Date: ' + pickListDate + "\n\n");
        for (let item of pickList) {
            printText += formatPrintText(item.Customer);
            for (let order of item.OrderList) {
                printText += formatPrintText(order.Model + '(Qty:' + order.Unit + ')');
            }

            printText += "\n";
        }
    }
    document.getElementById("pickingList").value = printText;

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

function copyToService() {
    let selectedInvoices = invoiceGridOptions.api.getSelectedRows();
    if (selectedInvoices.length == 1) {
        let selected = JSON.parse(JSON.stringify(selectedInvoices[0]));
        selected.Details = details.filter(detail => {
            return (detail.Type == 'Invoice' && selectedInvoices[0].InvoiceNo == detail.InvoiceNo)
                || (detail.Type == 'Sales Order' && selectedInvoices[0].InvoiceNo == detail.SalesOrderNo)
        });

        var dummy = document.createElement("textarea");
        // to avoid breaking orgain page when copying more words
        // cant copy when adding below this code
        // dummy.style.display = 'none'
        document.body.appendChild(dummy);
        //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
        dummy.value = JSON.stringify(selected);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);

    }

}

function onItemFilterTextBoxChanged() {
    orderGridOptions.api.setQuickFilter(document.getElementById('ItemFilter').value);
}

function onInvoiceFilterTextBoxChanged() {
    invoiceGridOptions.api.setQuickFilter(document.getElementById('InvoiceFilter').value);
}

function ReturnSpaceIfEmpty(e) {
    return isEmptyString(e) ? '&nbsp;' : e;
}

function createReport(company) {
    let selectedInvoices = invoiceGridOptions.api.getSelectedRows();
    if (selectedInvoices != null && selectedInvoices.length == 1 && selectedInvoices[0].Type == 'Sales Order') {
        let salesOrder = selectedInvoices[0];
        let details_SOrows = this.getAllDetailRows().filter(detail => detail.SalesOrderNo == salesOrder.InvoiceNo);
        let detailExtraCharges_allrows = this.getAllDetailExtraChargeRows();

        var popup = open("/forms/stockout/report.html", "Popup", "width=794,height=1123");

        popup.addEventListener('DOMContentLoaded', function () {
            if (company == 'kalt') {
                popup.document.querySelector('#banlengheader').style.display = 'none';
                popup.document.querySelector('#kaltheader').style.display = 'block';
            }

            // Customer Info
            popup.document.querySelector('#CustomerName').innerHTML = ReturnSpaceIfEmpty(salesOrder.Customer);
            popup.document.querySelector('#Address').innerHTML = ReturnSpaceIfEmpty(salesOrder.Address);
            popup.document.querySelector('#Phone').innerHTML = ReturnSpaceIfEmpty(salesOrder.ContactNo);

            // Sales Order
            popup.document.querySelector('#SalesOrderNo').innerHTML = ReturnSpaceIfEmpty(salesOrder.InvoiceNo);
            let date = new Date(salesOrder.InvoiceDate);
            var options = { year: 'numeric', month: 'short', day: 'numeric' };
            popup.document.querySelector('#SalesOrderDate').innerHTML = ReturnSpaceIfEmpty(date.toLocaleDateString("en-GB", options));

            // Sales Order Item
            let salesOrderTable = popup.document.getElementById('salesOrderTable');
            let totalPrice = 0.0;
            let rowIndex = 1;
            let index = 1;

            let jobtypes = ["SUPPLY", "INSTALL", "INSTALL W/O PIPE", "CONCEAL"];
            let jobASCII = 65;
            let sowObjList = [];

            for (let jobtype of jobtypes) {
                let orderlist = details_SOrows.filter(d => d.JobType.toUpperCase() == jobtype);
                let jobId;
                let sowList;

                if (orderlist.length > 0) {
                    let row = salesOrderTable.insertRow(rowIndex);
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    row.insertCell(2);
                    row.insertCell(3);
                    row.insertCell(4);

                    switch (jobtype) {
                        case 'INSTALL':
                            cell2.innerHTML = 'Job <b>' + String.fromCharCode(jobASCII) + '</b>. ' + installGroupHeader;
                            jobId = String.fromCharCode(jobASCII);
                            sowList = installSOW;
                            break;
                        case 'INSTALL W/O PIPE':
                            cell2.innerHTML = 'Job <b>' + String.fromCharCode(jobASCII) + '</b>. ' + installGroupHeader;
                            jobId = String.fromCharCode(jobASCII);
                            sowList = installNoPipeSOW;
                            break;
                        case 'CONCEAL':
                            cell2.innerHTML = 'Job <b>' + String.fromCharCode(jobASCII) + '</b>. ' + concealGroupHeader;
                            jobId = String.fromCharCode(jobASCII);
                            sowList = concealSOW;
                            break;
                        default:
                            cell2.innerHTML = 'Job <b>' + String.fromCharCode(jobASCII) + '</b>. ' + supplyGroupHeader;
                            jobId = String.fromCharCode(jobASCII);
                            sowList = supplySOW;
                    }
                    row.className = 'groupHeader';
                    rowIndex++;
                    jobASCII++;

                    for (let salesOrderItem of orderlist) {
                        if (salesOrderItem.Unit > 0) {
                            let row = salesOrderTable.insertRow(rowIndex);
                            let cell1 = row.insertCell(0);
                            let cell2 = row.insertCell(1);
                            let cell3 = row.insertCell(2);
                            let cell4 = row.insertCell(3);
                            let cell5 = row.insertCell(4);

                            cell1.innerHTML = index;
                            let model = models.find(m => m.Model == salesOrderItem.Model);
                            if (model) {
                                let desc = model.Brand + ' ' + model.Product + ' @ ' + model.Model + ' (BTU ' + model.BTU + ' ) ';
                                cell2.innerHTML = desc;
                            }
                            cell3.innerHTML = salesOrderItem.Unit + ' set';
                            let unitPrice = parseFloat(salesOrderItem.Price);
                            let unitTotal = unitPrice * parseInt(salesOrderItem.Unit);
                            cell4.innerHTML = "RM <span style='float:right'>" + unitPrice.toFixed(2) + "</span>"
                            cell5.innerHTML = "RM <span style='float:right'>" + unitTotal.toFixed(2) + "</span>"
                            rowIndex++;
                            index++;
                            totalPrice += unitTotal;

                            let extraChargesList = detailExtraCharges_allrows.filter(d => d.StockOutID == salesOrderItem.ID);
                            for (let ec of extraChargesList) {
                                let row = salesOrderTable.insertRow(rowIndex);
                                let cell1 = row.insertCell(0);
                                let cell2 = row.insertCell(1);
                                let cell3 = row.insertCell(2);
                                let cell4 = row.insertCell(3);
                                let cell5 = row.insertCell(4);

                                let desc = ec.Description;
                                if (desc.startsWith('--')) {
                                    desc = '<i>' + desc + '</i>';
                                    desc = desc.replace('--', '&emsp;');
                                }
                                cell2.innerHTML = desc;
                                cell3.innerHTML = ec.Unit + ' ' + ec.UOM;
                                let unitPrice = parseFloat(ec.UnitPrice);
                                let unitTotal = unitPrice * parseInt(ec.Unit);
                                cell4.innerHTML = "RM <span style='float:right'>" + unitPrice.toFixed(2) + "</span>"
                                cell5.innerHTML = "RM <span style='float:right'>" + unitTotal.toFixed(2) + "</span>"
                                rowIndex++;
                                index++;
                                totalPrice += unitTotal;
                            }

                        }
                    }

                    for (let sowText of sowList) {
                        let foundSow = sowObjList.find(s => s.Text == sowText);
                        if (foundSow) {
                            foundSow.Job.push(jobId);
                        } else {
                            sowObjList.push({ Text: sowText, Job: [jobId] })
                        }
                    }

                }

            }
            let sowHTML = '';
            let sortedSowObjList = sowObjList.sort((a, b) => a.Job.length - b.Job.length);
            for (let sowObj of sortedSowObjList) {
                sowHTML += ('<li><div><span style="width:70px;display:inline-block;">Job <b>' + sowObj.Job.join(',') + '</b></span><span> : ' + sowObj.Text + '</span></div></li>');
            }
            popup.document.querySelector('#ScopeOfWork').innerHTML = sowHTML;
            let note = document.querySelector('#Note').value;
            if (!isEmptyString(note)) {
                popup.document.querySelector('#Note').innerHTML = document.querySelector('#Note').value;
            } else {
                popup.document.querySelector('#Note').innerHTML = 'N/A'
            }




            // Total
            popup.document.querySelector('#TotalPrice').innerHTML = "RM <span style='float:right'>" + totalPrice.toFixed(2) + "</span>"

        }, false);
    } else {
        alert("Please select a sales order record")
    }
}

function setNote(company) {
    if (company == 'kalt') {
        document.querySelector('#Note').value = kaltNote;
    } else {
        document.querySelector('#Note').value = banlengNote;
    }
}
setNote('banleng');

function printReceipt(company) {
    let selectedPayment = paymentGridOptions.api.getSelectedRows();
    let selectedInvoice = invoiceGridOptions.api.getSelectedRows();
    if (selectedPayment != null && selectedPayment.length == 1 && !this.isEmptyString(selectedPayment[0].ID)
        && selectedInvoice != null && selectedInvoice.length == 1) {
        let payment = selectedPayment[0];
        let invoice = selectedInvoice[0];

        let isCustomerOnly = document.querySelector('#receiptCustomerOnly').checked;
        let url = '/forms/stockout/receipt/receipt.html';
        let size = 'width=794,height=1123'
        if (isCustomerOnly) {
            url = '/forms/stockout/receipt/receipt-customer.html';
            size = 'width=794,height=562'
        }
        var popup = open(url, "Popup", size);

        popup.addEventListener('DOMContentLoaded', function () {
            if (company == 'kalt') {
                popup.document.querySelector('#banlengheader').style.display = 'none';
                popup.document.querySelector('#kaltheader').style.display = 'block';
                if (!isCustomerOnly) {
                    popup.document.querySelector('#banlengheader-seller').style.display = 'none';
                    popup.document.querySelector('#kaltheader-seller').style.display = 'block';
                }

            }

            popup.document.querySelector('#CustomerName').innerHTML = ReturnSpaceIfEmpty(invoice.Customer);
            popup.document.querySelector('#ReceiptNo').innerHTML = ReturnSpaceIfEmpty(payment.ID);
            let date = new Date(payment.PaymentDate);
            var options = { year: 'numeric', month: 'short', day: 'numeric' };
            popup.document.querySelector('#ReceiptDate').innerHTML = ReturnSpaceIfEmpty(date.toLocaleDateString("en-GB", options));
            let amount = parseFloat(payment.Amount);
            if (isNaN(amount)) {
                amount = 0;
            }
            let amountText = toAmountText(amount);
            popup.document.querySelector('#Amount').innerHTML = amount.toFixed(2);
            popup.document.querySelector('#AmountText').innerHTML = amountText;
            popup.document.querySelector('#PaymentMode').innerHTML = ReturnSpaceIfEmpty(payment.Type);
            let paymentOf = 'Sales Order #'
            if (invoice.Type == 'Invoice') {
                paymentOf = 'Invoice #'
            }
            popup.document.querySelector('#PaymentOf').innerHTML = paymentOf;
            popup.document.querySelector('#PaymentOfNo').innerHTML = invoice.InvoiceNo;

            if (!isCustomerOnly) {
                popup.document.querySelector('#CustomerName-seller').innerHTML = ReturnSpaceIfEmpty(invoice.Customer);
                popup.document.querySelector('#ReceiptNo-seller').innerHTML = ReturnSpaceIfEmpty(payment.ID);
                popup.document.querySelector('#ReceiptDate-seller').innerHTML = ReturnSpaceIfEmpty(date.toLocaleDateString("en-GB", options));
                popup.document.querySelector('#Amount-seller').innerHTML = amount.toFixed(2);
                popup.document.querySelector('#AmountText-seller').innerHTML = amountText;
                popup.document.querySelector('#PaymentMode-seller').innerHTML = ReturnSpaceIfEmpty(payment.Type);
                popup.document.querySelector('#PaymentOf-seller').innerHTML = paymentOf;
                popup.document.querySelector('#PaymentOfNo-seller').innerHTML = invoice.InvoiceNo;
            }
        }, false);
    } else {
        alert("Please select a saved payment record")
    }
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function toAmountText(number) {
    let amountText;
    let sen = parseInt((number % 1) * 100);
    if( sen == 0 ) {
        amountText = toTitleCase(toWordsconver(number)) + " Ringgit Only";
    } else {
        amountText = toTitleCase(toWordsconver(Math.floor(number))) + " Ringgit And " + toTitleCase(toWordsconver(sen)) + " Sen Only" ;
    }
    
    return amountText;
}