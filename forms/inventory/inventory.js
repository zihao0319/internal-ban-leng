var stocks = [];
const stockColumnDefs = [{
    headerName: 'Model',
    field: 'Model'
},
{
    headerName: 'Brand',
    field: 'Brand'
},
{
    headerName: 'Initial Stock',
    field: 'InitialStock',
    valueGetter: (args) => parseInt(args.data.Balance) + parseInt(args.data.StockOut) - parseInt(args.data.StockIn)
},
{
    headerName: 'Initial Stock',
    field: 'InitialStockFloor',
    valueGetter: (args) => parseInt(args.data.BalanceFloor) + parseInt(args.data.StockOutFloor) - parseInt(args.data.StockIn)
},
{
    headerName: 'Stock In',
    field: 'StockIn'
},
{
    headerName: 'Stock Out',
    field: 'StockOut'
},
{
    headerName: 'Stock Out',
    field: 'StockOutFloor'
},
{
    headerName: 'Balance',
    field: 'Balance'
},
{
    headerName: 'Balance',
    field: 'BalanceFloor'
},
];

const stockGridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true
    },
    columnDefs: stockColumnDefs,
    rowData: stocks,
    onFirstDataRendered: autoSizeAll_Stock,
    isExternalFilterPresent: (() => { return true; }),
    doesExternalFilterPass: ((node) => {
        // !node.data.IsObsolete;
        return (eObsolete.checked == true || !node.data.IsObsolete) && (eHotItem.checked == false || node.data.IsSellerPick)
    })
};
const stockGridDiv = document.querySelector('#stockGrid');
const eObsolete = document.querySelector('#obsoleteCB');
const eHotItem = document.querySelector('#hotitemCB');
new agGrid.Grid(stockGridDiv, stockGridOptions);


function autoSizeAll_Stock() {
    var allColumnIds = [];
    stockGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    stockGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

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

function updateDateRenderRange() {
    var renderRangeElement = document.querySelector('#renderRange');
    renderRangeElement.innerHTML = (month + 1) + "/" + year;
}
updateDateRenderRange();

document.addEventListener('DOMContentLoaded', this.requestData);
function requestData() {
    var xmlhttp = new XMLHttpRequest();
    
    var request_param = "&month="  + encodeURIComponent(month + 1)
                        + "&year=" + encodeURIComponent(year)
    var url = "https://internal.ban-leng.com/forms/inventory/inventory.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            receiveData(this.responseText);
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onerror = function (e) {
        debugger;
        location.href = 'https://internal.ban-leng.com';
    }
    xmlhttp.send(request_param);
}

function receiveData(response) {
    try {
        responseJSON = JSON.parse(response);
        stocks = responseJSON.Stocks;
        stockGridOptions.api.setRowData(stocks);
        stockGridOptions.api.onFilterChanged();
    }
    catch (e) {
        debugger;
        location.href = 'https://internal.ban-leng.com';
    }

}

var showActualStock = true;
function changeStockType() {
    showActualStock = document.getElementById('actual').checked;
    stockGridOptions.columnApi.setColumnVisible('InitialStockFloor', !showActualStock);
    stockGridOptions.columnApi.setColumnVisible('InitialStock', showActualStock);
    stockGridOptions.columnApi.setColumnVisible('StockOutFloor', !showActualStock);
    stockGridOptions.columnApi.setColumnVisible('StockOut', showActualStock);
    stockGridOptions.columnApi.setColumnVisible('BalanceFloor', !showActualStock);
    stockGridOptions.columnApi.setColumnVisible('Balance', showActualStock);
    autoSizeAll_Stock();
}
changeStockType();

function onObsoleteCBChanged() {
    stockGridOptions.api.onFilterChanged();
}

function onHotItemCBChanged() {
    stockGridOptions.api.onFilterChanged();
}
