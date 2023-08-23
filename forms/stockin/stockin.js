var stockins = [];
var models = [];
var brands = [];

const stockInColumnDefs = [
    {
        headerName: 'Date',
        field: 'Date',
        cellEditor: 'datePicker',
        minWidth: 200
    },
    {
        headerName: 'Invoice No',
        field: 'InvoiceNo'
    },
    {
        headerName: 'DO No',
        field: 'DONo'
    },
    {
        headerName: 'Model',
        field: 'Model',
        cellEditor: 'modelSelectBox'
    },
    {
        headerName: 'Unit',
        field: 'Unit',
    },
    {
        headerName: 'Amount',
        field: 'Amount',
        valueFormatter: (args) => parseFloat(args.value).toFixed(2)
    },
    {
        headerName: 'Total',
        field: 'Total',
        valueFormatter: (args) => parseFloat(args.value).toFixed(2),
        valueGetter: (args) => parseInt(args.data.Unit) * parseFloat(args.data.Amount),
        editable: false
    }
];

const brandColumnDefs = [
    {
        headerName: 'Brand',
        field: 'Brand'
    },
    {
        headerName: 'Unit',
        field: 'Unit'
    },
    {
        headerName: 'Amount',
        field: 'Amount',
        valueFormatter: (args) => parseFloat(args.value).toFixed(2),
    }
];

const stockInGridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
        editable: true
    },
    rowSelection: 'single',
    columnDefs: stockInColumnDefs,
    rowData: stockins,
    onFirstDataRendered: autoSizeAll_StockIn,
    components: {
        datePicker: getDatePicker(),
        modelSelectBox: getModelSelectBox(),
    },
    editType: 'fullRow',
    onRowValueChanged: this.saveRow,
    //stopEditingWhenCellsLoseFocus: true,
    getRowStyle : ((params) => {
        if (params.data.modified) {
            return { background: 'lightyellow' };
        }
    }),
    isExternalFilterPresent : (() => {return true;}),
    doesExternalFilterPass : ((node) => {
        return !node.data.deleted;
    })

};

const brandGridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
        editable: true
    },
    rowSelection: 'single',
    columnDefs: brandColumnDefs,
    rowData: brands,
    onFirstDataRendered: autoSizeAll_Brand,
};

const stockInGridDiv = document.querySelector('#stockInGrid');
new agGrid.Grid(stockInGridDiv, stockInGridOptions);

const brandGridDiv = document.querySelector('#brandGrid');
new agGrid.Grid(brandGridDiv, brandGridOptions);

function autoSizeAll_StockIn() {
    var allColumnIds = [];
    stockInGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    stockInGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

function autoSizeAll_Brand() {
    var allColumnIds = [];
    brandGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    brandGridOptions.columnApi.autoSizeColumns(allColumnIds);
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

    var request_param = "&month=" + encodeURIComponent(month + 1)
        + "&year=" + encodeURIComponent(year)
    var url = "/forms/stockin/stockin.php";

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
        stockins = responseJSON.StockIns;
        models = responseJSON.Models;
        brands = responseJSON.Brands;
        stockInGridOptions.api.setRowData(stockins);
        brandGridOptions.api.setRowData(brands);
    }
    catch (e) {
        debugger;
        location.href = '/';
    }

}

function saveRow(event) {
    event.data.modified = true;
    document.querySelector('#warningicon').style.display = 'inline';
    document.querySelector("#submitbutton").disabled = false;
    stockInGridOptions.api.refreshCells([event.node]);
}

function addRow() {
    let newRows = [{
        Date: '',
        InvoiceNo: '',
        DONo: '',
        Model: '',
        Unit: 0,
        Amount: 0,
        modified: true
    }];
    let length = this.getAllRows().length;
    stockInGridOptions.api.applyTransaction({ add: newRows });
    stockInGridOptions.api.startEditingCell({
        rowIndex: length,
        colKey: 'Date'
    });
    document.querySelector('#warningicon').style.display = 'inline';
    document.querySelector("#submitbutton").disabled = false;
}

function deleteRow() {
    let isconfirmdelete = confirm("Are you sure you want to delete this item?");
    if (!isconfirmdelete) {
        return;
    }
    let selectedRow = stockInGridOptions.api.getSelectedRows()[0];
    if(selectedRow){
        if(selectedRow.ID) {
            selectedRow.deleted = true;
            selectedRow.modified = true;
            document.querySelector('#warningicon').style.display = 'inline';
            document.querySelector("#submitbutton").disabled = false;
            stockInGridOptions.api.applyTransaction({ update: [selectedRow]});
        }
        else{
            stockInGridOptions.api.applyTransaction({ remove: [selectedRow]});
            let modified_rows = this.getAllRows().filter(row => row.modified);
            if(modified_rows.length == 0) {
                document.querySelector('#warningicon').style.display = 'none';
                document.querySelector("#submitbutton").disabled = true;
            }
        }
    }
    
}

function submit() {
    let modified_rows = this.getAllRows().filter(row => row.modified);

    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/stockin/stockin-change.php";

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

    var json = JSON.stringify(modified_rows);
    xmlhttp.send(json);


}

function getAllRows() {
    let rowData = [];
    stockInGridOptions.api.forEachNode(node => rowData.push(node.data));
    return rowData;
}






