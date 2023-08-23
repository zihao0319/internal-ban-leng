var orders = [];
var services = [];

const orderColumnDefs = [
    { headerName: 'Order Date', field: 'OrderDate' },
    { headerName: 'Model', field: 'Model'},
    { headerName: 'Package', field: 'Package'},
    { headerName: 'Unit', field: 'Unit' },
    { headerName: 'Price', field: 'Price', valueFormatter: (args) => parseFloat(args.value).toFixed(2)},
    { headerName: 'Total', field: 'Total', valueFormatter: (args) => parseFloat(args.value).toFixed(2), valueGetter: (args) => parseInt(args.data.Unit) * parseFloat(args.data.Price)},
    { headerName: 'Sales Order No', field: 'SalesOrderNo' },
    { headerName: 'Kalt No', field: 'KaltNo' },
    { headerName: 'Invoice No', field: 'InvoiceNo' },
    { headerName: 'Invoice Date', field: 'InvoiceDate' },
    { headerName: 'Job Type', field: 'JobType' },
    { headerName: 'Customer', field: 'Customer'},
    { headerName: 'Contact No', field: 'ContactNo' },
    { headerName: 'Address', field: 'Address' },
    { headerName: 'Note', field: 'Note' },
    { headerName: 'Serial No', field: 'SerialNo'},
    { headerName: 'Expect Delivery Date', field: 'ExpectedDeliveryDate' }
]

const ServiceColumnDefs = [
    { headerName: 'Status', field: 'Status', width: 80 },
    { headerName: 'Type', field: 'Type', width: 80 },
    { headerName: 'Name', field: 'Name', width: 100 },
    { headerName: 'PIC', field: 'PIC', width: 100 },
    { headerName: 'ContactNo', field: 'ContactNo', width: 100 },
    { headerName: 'Address', field: 'Address', width: 300 },
    { headerName: 'Department', field: 'Department', width: 100 },
    { headerName: 'Team', field: 'Team', width: 70 },
    { headerName: 'Appt Date', field: 'ApptDate', width: 100 },
    { headerName: 'From', field: 'ApptFrom', width: 70 },
    { headerName: 'To', field: 'ApptTo', width: 70 },
    { headerName: 'Action', field: 'Action', width: 120 },
    { headerName: 'DO #', field: 'DO', width: 100 },
    { headerName: 'CashAmount', field: 'CashAmount', width: 80 },
    { headerName: 'Remark', field: 'Remark', width: 300 },
]

const orderGridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
        editable: false
    },
    columnDefs: orderColumnDefs,
    rowData: orders,
    onFirstDataRendered: autoSizeAll_Order,
}

const ServiceGridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true
    },
    columnDefs: ServiceColumnDefs,
    rowData: services,
    onFirstDataRendered: autoSizeAll_Service,
};

const orderGridDiv = document.querySelector('#orderGrid');
new agGrid.Grid(orderGridDiv, orderGridOptions);

const serviceGridDiv = document.querySelector('#serviceGrid');
new agGrid.Grid(serviceGridDiv, ServiceGridOptions);

function autoSizeAll_Order() {
    var allColumnIds = [];
    orderGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    orderGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

function autoSizeAll_Service() {
    var allColumnIds = [];
    ServiceGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    ServiceGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

function search() {
    let searchValue = document.getElementById("serviceSearchInput").value;
    if(!searchValue || searchValue.trim() == "") {
        alert('Search box must not be empty!');
        return
    }
    var xmlhttp = new XMLHttpRequest();
    var request_param = "&search="  + encodeURIComponent(searchValue);
    var url = "/forms/warranty/warranty.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            responseJSON = JSON.parse(this.responseText);
            orders = responseJSON.Orders;
            orderGridOptions.api.setRowData(orders);

            services = responseJSON.Services;
            ServiceGridOptions.api.setRowData(services);
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onerror = function (e) {
        location.href = '/';
    }
    xmlhttp.send(request_param);
}