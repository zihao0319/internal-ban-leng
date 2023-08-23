const installPreText = 'To supply and installation of new \n';
const installSOW =
    [
        'Price inclusive surface installation of 10ft 0.61mm copper piping, ½" thickness premium insulation, 100% pure copper wiring, and drainage piping to the drainage point.'
        , 'Any extra piping will be charged separately as follows: 1HP(RM18/ft), 1.5HP&2HP (RM20/ft), 2.5HP&3HP (RM25/ft).'
        , 'Risk assessment will be carried out. Company reserve the right, at its discretion, to cancel, modify, add or remove portions of the quotation at anytime as if the risk level is high.'
    ];
const supplyPreText = 'To supply of new \n';
const supplySOW =
    [
        'Cash before delivery.'
    ]
const nopipePreTextA = 'To supply of new \n';
const nopipePreTextB = 'To supply labour and tool for installation of \n';
const nopipeSOWB =
    [
        'Price exclusive surface installation of copper piping, insulation, copper wiring, and drainage piping. (This is given that your premise already has air cond piping installed)'
    ]
const concealPreTextA = 'To supply labour & tool for concealing of\n';
const concealPreTextB = 'To supply of new \n';
const concealPreTextC = 'To supply labour and tool for installation of \n';
const concealSOWA =
    [
        'Price inclusive concealed installation of 10ft 0.61mm copper piping, ½" thickness premium insulation, 100% pure copper wiring, and drainage piping to the drainage point.'
        , 'Any extra piping will be charged separately as follows: 1HP(RM18/ft), 1.5HP&2HP (RM20/ft), 2.5HP&3HP (RM25/ft).'
        , 'Risk assessment will be carried out. Company reserve the right, at its discretion, to cancel, modify, add or remove portions of the quotation at anytime as if the risk level is high.'
    ]
const concealSOWC =
    [
        'Install the air cond indoor & outdoor unit, testing & commisioning of each system, vacuum to the sytem and fill in with refrigerant gas, and testing in a good condition.'
        , 'Risk assessment will be carried out. Company reserve the right, at its discretion, to cancel, modify, add or remove portions of the quotation at anytime as if the risk level is high.'
    ]

const defaultSOW = [
    { 'Job': '', 'Text': 'Price valid until stock lasts.', 'RowID': uuidv4() }
    , { 'Job': '', 'Text': 'No customer gift is included.', 'RowID': uuidv4() }
]


var CustomerRowData = [];
var ACRowData = [];
var QuotationRowData = [];
var HistoryRowData = [];
var HistoryDetailRowData = [];
var HistorySOWRowData = [];
var SOWRowData = JSON.parse(JSON.stringify(defaultSOW));
var ExtraChargesRowData = [];
var QuotationExtraChargesRowData = [];

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

const ACColumnDefs = [
    { headerName: 'Model', field: 'Model' },
    { headerName: 'Unit', field: 'Unit', editable: true },
    { headerName: 'Product', field: 'Product' },
    { headerName: 'Brand', field: 'Brand' },
    { headerName: 'BTU', field: 'BTU' },
    { headerName: 'Category', field: 'Category' },
    { headerName: 'Aircond price', field: 'PriceAC' },
    { headerName: 'W Install price', field: 'Price' },
    { headerName: 'Install price', field: 'Install' },
    { headerName: 'Conceal price', field: 'PriceConceal' }
];

const SOWColumnDefs = [
    { headerName: 'Job', field: 'Job', editable: true, width: 100 },
    { headerName: 'Text', field: 'Text', editable: true, width: 500 },
]

const HistoryColumnDefs = [
    { headerName: 'Quotation No.', field: 'QuotationNo', cellRenderer: 'agGroupCellRenderer' },
    { headerName: 'Customer', field: 'CustomerName' },
    { headerName: 'Job Status', field: 'JobStatus' },
    { headerName: 'Date', field: 'Date' },
    { headerName: 'Job Department', field: 'JobDepartment' },
    { headerName: 'AC Unit', field: 'ACUnit' },
    { headerName: 'Total', field: 'QuotationTotal', valueFormatter: (args) => parseFloat(args.value).toFixed(2) }
]

const QuotationColumnDefs = [
    { headerName: 'Job', field: 'Job', width: 80, editable: true },
    { headerName: 'Description', field: 'Description', width: 300, editable: true },
    { headerName: 'Unit', field: 'Unit', width: 100, editable: true },
    { headerName: 'UOM', field: 'UOM', width: 100, editable: true },
    { headerName: 'Unit Price', field: 'UnitPrice', width: 100, editable: true, valueFormatter: (args) => (isEmptyString(args.value) ? '' : parseFloat(args.value).toFixed(2)) },
    { headerName: 'Total', field: 'Total', width: 100, editable: false, valueGetter: (args) => (!isEmptyString(args.data.Unit) && !isEmptyString(args.data.UnitPrice) ? parseInt(args.data.Unit) * parseFloat(args.data.UnitPrice) : ''), valueFormatter: (args) => (isEmptyString(args.value) ? '' : args.value.toFixed(2)) },
]

const QuotationExtraChargesColumnDefs = [
    { headerName: 'Description', field: 'Description', width: 300, editable: true },
    { headerName: 'Unit', field: 'Unit', width: 100, editable: true },
    { headerName: 'UOM', field: 'UOM', width: 100, editable: true },
    { headerName: 'Unit Price', field: 'UnitPrice', width: 100, editable: true, valueFormatter: (args) => (isEmptyString(args.value) ? '' : parseFloat(args.value).toFixed(2)) },
    { headerName: 'Total', field: 'Total', width: 100, editable: false, valueGetter: (args) => (!isEmptyString(args.data.Unit) && !isEmptyString(args.data.UnitPrice) ? parseInt(args.data.Unit) * parseFloat(args.data.UnitPrice) : ''), valueFormatter: (args) => (isEmptyString(args.value) ? '' : args.value.toFixed(2)) },
]

const CustomerGridOptions = {
    defaultColDef: { resizable: true, sortable: true, filter: true },
    columnDefs: CustomerColumnDefs,
    rowData: CustomerRowData,
    rowSelection: 'single',
    onFirstDataRendered: autoSizeAllCustomer
};

const ACGridOptions = {
    defaultColDef: { resizable: true, sortable: true, filter: true },
    columnDefs: ACColumnDefs,
    rowData: ACRowData,
    rowSelection: 'single',
    onFirstDataRendered: autoSizeAllAC,
    isExternalFilterPresent: (() => { return true; }),
    doesExternalFilterPass: ((node) => {
        // !node.data.IsObsolete;
        return (eObsolete.checked == true || !parseInt(node.data.IsObsolete)) && (eHotItem.checked == false || parseInt(node.data.IsSellerPick))
    })
};

const SOWGridOptions = {
    defaultColDef: { resizable: true, sortable: true, filter: true },
    columnDefs: SOWColumnDefs,
    rowData: SOWRowData,
    rowSelection: 'single',
};

const QuotationGridOptions = {
    defaultColDef: { resizable: true, sortable: false, filter: true },
    columnDefs: QuotationColumnDefs,
    rowSelection: 'single',
    rowData: QuotationRowData,
    onSelectionChanged: onSelectionChanged_Quotation
};

const QuotationExtraChargesGridOptions = {
    defaultColDef: { resizable: true, sortable: false, filter: true },
    columnDefs: QuotationExtraChargesColumnDefs,
    rowSelection: 'single',
    rowData: QuotationExtraChargesRowData
};

const HistoryGridOptions = {
    defaultColDef: { resizable: true, sortable: true, filter: true },
    columnDefs: HistoryColumnDefs,
    rowData: HistoryRowData,
    rowSelection: 'multiple',
    doesExternalFilterPass: doesHistoryFilterPass,
    isExternalFilterPresent: (() => { return true }),
    onFirstDataRendered: autoSizeAllHistory
};

function autoSizeAllCustomer() {
    var allColumnIds = [];
    CustomerGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    CustomerGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

function autoSizeAllAC() {
    var allColumnIds = [];
    ACGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    ACGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

function autoSizeAllHistory() {
    var allColumnIds = [];
    HistoryGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    HistoryGridOptions.columnApi.autoSizeColumns(allColumnIds);
}


const eCustDiv = document.querySelector('#CustomerGrid');
const eACDiv = document.querySelector('#ACGrid');
const eHistoryDiv = document.querySelector('#HistoryGrid');
const eQuotationDiv = document.querySelector('#QuotationGrid');
const eSOWDiv = document.querySelector('#SOWGrid');
const eExtraChargesDiv = document.querySelector('#ExtraChargesGrid');
const eObsolete = document.querySelector('#obsoleteCB');
const eHotItem = document.querySelector('#hotitemCB');

const cbHistoryFilterByCustomer = document.querySelector('#HistoryFilterByCustomer');

new agGrid.Grid(eCustDiv, CustomerGridOptions);
new agGrid.Grid(eACDiv, ACGridOptions);
new agGrid.Grid(eHistoryDiv, HistoryGridOptions);
new agGrid.Grid(eQuotationDiv, QuotationGridOptions);
new agGrid.Grid(eSOWDiv, SOWGridOptions);
new agGrid.Grid(eExtraChargesDiv, QuotationExtraChargesGridOptions);


function requestData(f) {
    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/quotation-aircond/quotation-aircond.php";

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
    xmlhttp.send();

}

document.addEventListener('DOMContentLoaded', this.requestData);

function receiveData(response) {
    try {
        responseJSON = JSON.parse(response);
    }
    catch (e) {
        location.href = '/';
    }
    CustomerRowData = responseJSON.Customer;
    CustomerGridOptions.api.setRowData(CustomerRowData);
    ACRowData = responseJSON.ACPrice;
    ACGridOptions.api.setRowData(ACRowData);
    ACGridOptions.api.onFilterChanged();
    ExtraChargesRowData = responseJSON.ExtraCharges;

    this.setDefaultValues(responseJSON.GlobalParam);

    this.getHistoryItem();

}

var QID = 1;
var DOID = 10000;

function setDefaultValues(globalParam) {
    let date = new Date();
    document.querySelector('#Date').valueAsDate = date;
    document.querySelector('#ServiceNoDate').valueAsDate = date;
    document.querySelector('#InvoiceNoDate').valueAsDate = date;
    document.querySelector('#PONoDate').valueAsDate = date;

    let year = date.getFullYear();
    let month = date.getMonth() + 1;


    if (globalParam.length > 0) {
        let param = globalParam[0];
        if (param.LastRecordYear == year
            && param.LastRecordMonth == month) {
            QID = parseInt(param.LastRecordQID) + 1;
        }
        DOID = parseInt(param.LastRecordDO) + 1;
    }

    document.querySelector('#QuotationID').value = year.toString() + (month > 9 ? '' : '0') + month.toString() + (QID > 99 ? '' : '0') + (QID > 9 ? '' : '0') + QID.toString();
    document.querySelector('#DeliveryNo').value = 'R' + DOID.toString();


}

function getHistoryItem() {
    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/quotation-aircond/quotation-aircond-history.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                responseJSON = JSON.parse(this.responseText);
            }
            catch (e) {
                location.href = '/';
                debugger;
            }
            HistoryRowData = responseJSON.History;
            HistoryGridOptions.api.setRowData(HistoryRowData);
            HistoryDetailRowData = responseJSON.Items;
            HistorySOWRowData = responseJSON.SOW;
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function onCustomerFilterTextBoxChanged() {
    CustomerGridOptions.api.setQuickFilter(document.getElementById('CustomerFilter').value);
}

function onACFilterTextBoxChanged() {
    ACGridOptions.api.setQuickFilter(document.getElementById('ACFilter').value);
}

function doesHistoryFilterPass(node) {
    let isPass = true;
    if (cbHistoryFilterByCustomer.checked) {
        let custName = document.querySelector('#CustomerName').value;
        isPass = node.data.CustomerName == custName;
    }
    return isPass;
}

function externalHistoryFilterChanged() {
    HistoryGridOptions.api.onFilterChanged();
}

function onHistoryTextBoxChanged() {
    HistoryGridOptions.api.setQuickFilter(document.getElementById('HistoryFilter').value);
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
}
document.querySelector('#CustomerSearch').style.display = "block";
document.querySelector('#CustomerSearchBtn').className += " active";

function saveCustomer() {
    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/quotation-aircond/new-customer.php";

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
                alert('ERROR: Unsuccessful transAC')
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
    document.querySelector('#CustomerName').value = document.querySelector('#NewCustomerName').value;
    document.querySelector('#CustomerAddress').value = document.querySelector('#NewCustomerAddress').value;
    document.querySelector('#Phone').value = document.querySelector('#NewPhone').value;
    document.querySelector('#Fax').value = document.querySelector('#NewFax').value;
    document.querySelector('#RegNo').value = document.querySelector('#NewRegNo').value;
    document.querySelector('#AttnPerson').value = document.querySelector('#NewAttnPerson').value;
    document.querySelector('#AttnPhone').value = document.querySelector('#NewAttnPhone').value;
    document.querySelector('#Email').value = document.querySelector('#NewEmail').value;
    this.externalHistoryFilterChanged();
}

function selectExistingCustomer() {
    let selectedCustomer = CustomerGridOptions.api.getSelectedRows();
    document.querySelector('#CustomerName').value = selectedCustomer[0].Name;
    document.querySelector('#CustomerAddress').value = selectedCustomer[0].Address;
    document.querySelector('#Phone').value = selectedCustomer[0].Phone;
    document.querySelector('#Fax').value = selectedCustomer[0].Fax;
    document.querySelector('#RegNo').value = selectedCustomer[0].RegNo;
    document.querySelector('#AttnPerson').value = selectedCustomer[0].AttnPerson;
    document.querySelector('#AttnPhone').value = selectedCustomer[0].AttnPhone;
    document.querySelector('#Email').value = selectedCustomer[0].Email;
    this.externalHistoryFilterChanged();
}

function updateSpan(spanId, inputId) {
    let span = document.querySelector('#' + spanId);
    let input = document.querySelector('#' + inputId);
    span.innerHTML = input.value;
}

function createReport(company) {
    var popup = open("/forms/quotation-aircond/report.html", "Popup", "width=794,height=1123");


    popup.addEventListener('DOMContentLoaded', function () {
        if(company == 'kalt') {
            popup.document.querySelector('#banlengheader').style.display = 'none';
            popup.document.querySelector('#kaltheader').style.display = 'block';
        }
        // Customer Info
        popup.document.querySelector('#CompanyName').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#CustomerName').value);
        popup.document.querySelector('#RegNo').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#RegNo').value);
        popup.document.querySelector('#Address').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#CustomerAddress').value);
        popup.document.querySelector('#Phone').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#Phone').value);
        popup.document.querySelector('#Fax').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#Fax').value);
        popup.document.querySelector('#AttnPerson').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#AttnPerson').value);
        popup.document.querySelector('#AttnPhone').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#AttnPhone').value);
        popup.document.querySelector('#Email').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#Email').value);

        // Quotation Info
        popup.document.querySelector('#QuotationId').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#QuotationID').value);
        let date = document.querySelector('#Date').valueAsDate;
        var options = { year: 'numeric', month: 'short', day: 'numeric' };
        popup.document.querySelector('#QuotationDate').innerHTML = ReturnSpaceIfEmpty(date.toLocaleDateString("en-GB", options));
        popup.document.querySelector('#JobDepartment').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#JobDepartment').value);
        popup.document.querySelector('#AircondNo').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#ACUnit').value);
        popup.document.querySelector('#RequisitionNo').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#RequisitionNo').value);
        popup.document.querySelector('#DeliveryNo').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#DeliveryNo').value);
        popup.document.querySelector('#PaymentMode').innerHTML = ReturnSpaceIfEmpty(document.querySelector('#PaymentMode').value);

        let sowarray = SOWRowData.map(value => {
            return '<li>'
                + (!isEmptyString(value.Job) ? 'Job ' + value.Job + ': ' : '')
                + value.Text
                + '</li>';
        });
        popup.document.querySelector('#ScopeOfWork').innerHTML = sowarray.join('');
        let periodOfWarrantyText = document.querySelector('#PeriodOfWarranty').value;
        if (isEmptyString(periodOfWarrantyText)) {
            popup.document.querySelector('#PeriodOfWarrantySection').style.display = 'none';
        }
        else {
            popup.document.querySelector('#PeriodOfWarranty').innerHTML = document.querySelector('#PeriodOfWarranty').value;
        }


        // Quotation Items
        let quotationTable = popup.document.getElementById('quotationTable');
        let totalPrice = 0.0;
        let subTotal = 0.0;
        let index = 1;
        let currentJob = '';
        let hasFixedTotal = document.querySelector('#hasFixedTotal').checked;
        let fixedTotal = document.querySelector('#fixedTotal');
        if (hasFixedTotal) {
            totalPrice = parseFloat(fixedTotal.value);
            popup.document.getElementById('quotationTable').style.display = 'none';
            quotationTable = popup.document.getElementById('quotationTableFixedTotal');
            quotationTable.style.display = 'block';
        }
        for (let quotationItem of QuotationRowData) {
            if (!hasFixedTotal && currentJob !== quotationItem.Job && !isEmptyString(currentJob)) {
                let subTotalRow = quotationTable.insertRow(index);
                let subTotalCell1 = subTotalRow.insertCell(0);
                let subTotalCell2 = subTotalRow.insertCell(1);
                subTotalCell1.colSpan = 4;
                subTotalCell1.className = 'subTotal-label';
                subTotalCell1.innerHTML = 'Subtotal ';
                subTotalCell2.className = 'subTotal-value'
                subTotalCell2.innerHTML = "RM <span style='float:right'>" + subTotal.toFixed(2) + "</span>";
                subTotal = 0.0;
                index++;
            }
            let row = quotationTable.insertRow(index);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = null;
            let cell4 = null;
            let cell5 = null;
            if (!hasFixedTotal) {
                cell3 = row.insertCell(2);
                cell4 = row.insertCell(3);
                cell5 = row.insertCell(4);
            }
            else {
                cell2.colSpan = 2;
            }


            if (currentJob !== quotationItem.Job) {
                currentJob = quotationItem.Job;
                cell1.innerHTML = quotationItem.Job;
            }

            let desc = quotationItem.Description;
            if (desc.startsWith('--')) {
                desc = '<i>' + desc + '</i>';
                desc = desc.replace('--', '&emsp;');
            }
            cell2.innerHTML = desc;
            if (!hasFixedTotal && quotationItem.Unit > 0) {
                cell3.innerHTML = quotationItem.Unit + ' ' + (!isEmptyString(quotationItem.UOM) ? quotationItem.UOM : '');
                let unitPrice = parseFloat(quotationItem.UnitPrice);
                let unitTotal = unitPrice * parseInt(quotationItem.Unit);
                cell4.innerHTML = "RM <span style='float:right'>" + unitPrice.toFixed(2) + "</span>"
                cell5.innerHTML = "RM <span style='float:right'>" + unitTotal.toFixed(2) + "</span>"
                totalPrice += unitTotal;
                subTotal += unitTotal;
            }
            index++;

        }

        let quotationItem = QuotationRowData[QuotationRowData.length - 1];
        if (!hasFixedTotal && QuotationRowData[0].Job !== quotationItem.Job) {
            let subTotalRow = quotationTable.insertRow(index);
            let subTotalCell1 = subTotalRow.insertCell(0);
            let subTotalCell2 = subTotalRow.insertCell(1);
            subTotalCell1.colSpan = 4;
            subTotalCell1.className = 'subTotal-label';
            subTotalCell1.innerHTML = 'Subtotal ';
            subTotalCell2.className = 'subTotal-value';
            subTotalCell2.innerHTML = "RM <span style='float:right'>" + subTotal.toFixed(2) + "</span>";
            index++;
        }

        let hasRefundCheckbox = document.querySelector('#hasRefund');
        let desc = document.querySelector('#refundDescription');
        let amt = document.querySelector('#refundAmount');
        let qty = document.querySelector('#refundQty');
        let uom = document.querySelector('#refundUOM');
        let price = document.querySelector('#refundPrice');

        if (hasRefundCheckbox.checked) {
            if (!hasFixedTotal) {
                let row = quotationTable.insertRow(index);
                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                let cell4 = row.insertCell(3);
                let cell5 = row.insertCell(4);

                cell2.innerHTML = desc.value;
                cell3.innerHTML = qty.value + ' ' + uom.value;
                cell4.innerHTML = "RM <span style='float:right'> -" + parseFloat(price.value).toFixed(2) + "</span>"
                cell5.innerHTML = "RM <span style='float:right'> -" + parseFloat(amt.value).toFixed(2) + "</span>"
            }

            totalPrice -= parseFloat(amt.value);
        }

        // Total
        if (!hasFixedTotal) {
            popup.document.querySelector('#TotalPrice').innerHTML = "RM <span style='float:right'>" + totalPrice.toFixed(2) + "</span>"
        }
        else {
            popup.document.querySelector('#TotalPriceFixed').innerHTML = "RM <span style='float:right'>" + totalPrice.toFixed(2) + "</span>"
        }



    }, false);

    // var txtOk = popup.document.createElement("TEXTAREA");
    // var aOk = popup.document.createElement("a");
    // aOk.innerHTML = "Click here";

    // popup.document.body.appendChild(txtOk);
    // popup.document.body.appendChild(aOk);
}

var itemCount = 0;
var successCount = 0;

var itemCountSOW = 0;
var successCountSOW = 0;

function validateSaveRecord() {
    let quotation_params = '&quotationNo=' + encodeURIComponent(document.querySelector('#QuotationID').value);
    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/quotation-aircond/new-quotation-validate.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            let reponseJSON = JSON.parse(this.response);
            if (this.status == 200 && reponseJSON.statusCode == 200) {
                if (reponseJSON.result > 0) {
                    var conf = confirm('Quotation (' + document.querySelector('#QuotationID').value + ') already exists. Continue to override quotation?');
                    if (conf) {
                        saveRecord();
                    }
                }
                else {
                    saveRecord();
                }
            }
            else {
                alert('ERROR: Unsuccessful transaction')
            }
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xmlhttp.send(quotation_params);

}

function saveRecord() {
    let today = new Date();
    let quotation_params = {
        'customerName': document.querySelector('#CustomerName').value
        , 'customerAddress': document.querySelector('#CustomerAddress').value
        , 'phone': document.querySelector('#Phone').value
        , 'fax': document.querySelector('#Fax').value
        , 'regNo': document.querySelector('#RegNo').value
        , 'attnPerson': document.querySelector('#AttnPerson').value
        , 'attnPhone': document.querySelector('#AttnPhone').value
        , 'email': document.querySelector('#Email').value
        , 'quotationNo': document.querySelector('#QuotationID').value
        , 'date': document.querySelector('#Date').value
        , 'jobDepartment': document.querySelector('#JobDepartment').value
        , 'acUnit': document.querySelector('#ACUnit').value
        , 'reqNo': document.querySelector('#RequisitionNo').value
        , 'deliveryNo': document.querySelector('#DeliveryNo').value
        , 'serviceNo': document.querySelector('#ServiceNo').value
        , 'poNo': document.querySelector('#PONo').value
        , 'invoiceNo': document.querySelector('#InvoiceNo').value
        , 'serviceDate': document.querySelector('#ServiceNoDate').value
        , 'poDate': document.querySelector('#PONoDate').value
        , 'invoiceDate': document.querySelector('#InvoiceNoDate').value
        , 'servicePrice': document.querySelector('#ServiceNoPrice').value
        , 'poPrice': document.querySelector('#PONoPrice').value
        , 'invoicePrice': document.querySelector('#InvoiceNoPrice').value
        , 'remark': document.querySelector('#Remark').value
        , 'qid': QID
        , 'doid': DOID
        , 'year': today.getFullYear()
        , 'month': (today.getMonth() + 1)
        , 'hasRefund': (document.querySelector('#hasRefund').checked ? 1 : 0)
        , 'refundDescription': document.querySelector('#refundDescription').value
        , 'refundQty': document.querySelector('#refundQty').value
        , 'refundUOM': document.querySelector('#refundUOM').value
        , 'refundPrice': document.querySelector('#refundPrice').value
        , 'quotationTotal': calculateTotal()
        , 'paymentMode': document.querySelector('#PaymentMode').value
        , 'jobStatus': document.querySelector('input[name=JobStatus]:checked').value
        , 'hasFixedTotal': (document.querySelector('#hasFixedTotal').checked ? 1 : 0)
        , 'fixedTotal': document.querySelector('#fixedTotal').value
        , 'periodOfWarranty': document.querySelector('#PeriodOfWarranty').value
    }

    let index = 0;
    quotation_params.Items = [];
    quotation_params.SOW = [];
    for (let item of QuotationRowData) {
        quotation_params.Items.push({
            'quotationNo': document.querySelector('#QuotationID').value
            , 'job': item.Job
            , 'description': item.Description
            , 'unitPrice': item.UnitPrice
            , 'unit': item.Unit
            , 'uom': item.UOM
            , 'index': index
            , 'category': item.Category
        })
        index++
    }
    index = 0;
    for (let sow of SOWRowData) {
        quotation_params.SOW.push({
            'quotationNo': document.querySelector('#QuotationID').value
            , 'job': sow.Job
            , 'text': sow.Text
            , 'index': index
        });
        index++
    }
    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/quotation-aircond/new-quotation.php";

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

    var json = JSON.stringify(quotation_params);
    xmlhttp.send(json);

}

function calculateTotal() {
    let totalPrice = 0.0;

    let hasFixedTotal = document.querySelector('#hasFixedTotal');
    let fixedTotal = document.querySelector('#fixedTotal');
    if (hasFixedTotal.checked) {
        totalPrice = parseFloat(fixedTotal.value);
    }
    else {
        for (let quotationItem of QuotationRowData) {
            if (quotationItem.Unit > 0) {
                let unitPrice = parseFloat(quotationItem.UnitPrice);
                let unitTotal = unitPrice * parseInt(quotationItem.Unit);
                totalPrice += unitTotal;
            }
        }
    }

    let amt = document.querySelector('#refundAmount');
    let hasRefund = document.querySelector('#hasRefund');
    if (hasRefund.checked) {
        totalPrice -= parseFloat(amt.value);
    }

    // Total
    return totalPrice
}



function isEmptyString(e) {
    return e == undefined || e == null || e == '';
}

function ReturnSpaceIfEmpty(e) {
    return isEmptyString(e) ? '&nbsp;' : e;
}

function toggleRefund() {
    let checkbox = document.querySelector('#hasRefund');
    let desc = document.querySelector('#refundDescription');
    let qty = document.querySelector('#refundQty');
    let uom = document.querySelector('#refundUOM');
    let price = document.querySelector('#refundPrice');
    desc.readOnly = !checkbox.checked;
    qty.readOnly = !checkbox.checked;
    uom.readOnly = !checkbox.checked;
    price.readOnly = !checkbox.checked;
}

let price = document.querySelector('#refundPrice');
let amt = document.querySelector('#refundAmount');
let qty = document.querySelector('#refundQty');
price.addEventListener('focusout', function (e) {
    price.value = parseFloat(price.value).toFixed(2);
    amt.value = (parseInt(qty.value) * parseFloat(price.value)).toFixed(2);
})

function toggleFixedTotal() {
    let checkbox = document.querySelector('#hasFixedTotal');
    let fixedTotal = document.querySelector('#fixedTotal');
    fixedTotal.readOnly = !checkbox.checked;
}

let fixedTotal = document.querySelector('#fixedTotal');
fixedTotal.addEventListener('focusout', function (e) {
    fixedTotal.value = parseFloat(fixedTotal.value).toFixed(2);
})



function updateQuotation() {
    let selectedHistoryRows = HistoryGridOptions.api.getSelectedRows();
    if (selectedHistoryRows != null && selectedHistoryRows.length == 1) {
        let selectedHistory = selectedHistoryRows[0];

        document.querySelector('#CustomerName').value = selectedHistory.CustomerName;
        document.querySelector('#CustomerAddress').value = selectedHistory.CustomerAddress;
        document.querySelector('#Phone').value = selectedHistory.Phone;
        document.querySelector('#Fax').value = selectedHistory.Fax;
        document.querySelector('#RegNo').value = selectedHistory.RegNo;
        document.querySelector('#AttnPerson').value = selectedHistory.AttnPerson;
        document.querySelector('#AttnPhone').value = selectedHistory.AttnPhone;
        document.querySelector('#Email').value = selectedHistory.Email;

        document.querySelector('#QuotationID').value = selectedHistory.QuotationNo;
        document.querySelector('#Date').value = selectedHistory.Date;
        document.querySelector('#JobDepartment').value = selectedHistory.JobDepartment;
        document.querySelector('#ACUnit').value = selectedHistory.ACUnit;
        document.querySelector('#RequisitionNo').value = selectedHistory.RequisitionNo;
        document.querySelector('#DeliveryNo').value = selectedHistory.DeliveryNo;
        document.querySelector('#ServiceNo').value = selectedHistory.ServiceNo;
        document.querySelector('#PONo').value = selectedHistory.PONo;
        document.querySelector('#InvoiceNo').value = selectedHistory.InvoiceNo;
        document.querySelector('#ServiceNoDate').value = selectedHistory.ServiceNoDate;
        document.querySelector('#PONoDate').value = selectedHistory.PODate;
        document.querySelector('#InvoiceNoDate').value = selectedHistory.InvoiceDate
        document.querySelector('#ServiceNoPrice').value = selectedHistory.ServiceNoPrice;
        document.querySelector('#PONoPrice').value = selectedHistory.POPrice;
        document.querySelector('#InvoiceNoPrice').value = selectedHistory.InvoicePrice;
        document.querySelector('#Remark').value = selectedHistory.Remark;
        document.querySelector('#PeriodOfWarranty').value = selectedHistory.PeriodOfWarranty;
        var jobStatusRB = document.getElementsByName('JobStatus');
        for (var i = 0; i < jobStatusRB.length; i++) {
            if (jobStatusRB[i].value == selectedHistory.JobStatus) {
                jobStatusRB[i].checked = true;
                break;
            }
        }
        if (!isEmptyString(selectedHistory.PaymentMode)) {
            document.querySelector('#PaymentMode').value = selectedHistory.PaymentMode;
        }

        // Refund 
        let hasRefund = selectedHistory.HasRefund == "0" ? false : true;
        document.querySelector('#hasRefund').checked = hasRefund;
        document.querySelector('#refundDescription').value = selectedHistory.RefundDescription;
        document.querySelector('#refundQty').value = selectedHistory.RefundUnit;
        document.querySelector('#refundUOM').value = selectedHistory.RefundUOM;
        document.querySelector('#refundPrice').value = selectedHistory.RefundPrice;
        toggleRefund();
        let amt = document.querySelector('#refundAmount');
        amt.value = (parseInt(selectedHistory.RefundUnit) * parseFloat(selectedHistory.RefundPrice)).toFixed(2);

        // Fixed Total
        let hasFixedTotal = selectedHistory.HasFixedTotal == "0" ? false : true;
        document.querySelector('#hasFixedTotal').checked = hasFixedTotal;
        document.querySelector('#fixedTotal').value = selectedHistory.FixedTotal;

        // Quotation Row Data
        let selectedHistoryItems = HistoryDetailRowData.filter(detail => detail.QuotationNo == selectedHistory.QuotationNo);
        QuotationRowData = [];

        if (selectedHistoryItems.length > 0) {
            for (let item of selectedHistoryItems) {
                let newQuotationItem = {};
                newQuotationItem.Job = item.Job;
                newQuotationItem.Description = item.Description;
                newQuotationItem.Unit = item.Unit;
                newQuotationItem.UnitPrice = parseFloat(item.UnitPrice);
                newQuotationItem.UOM = item.UOM;
                newQuotationItem.RowID = uuidv4();
                newQuotationItem.Category = item.Category;
                QuotationRowData.push(newQuotationItem);
            }
        }
        if (QuotationRowData.length > 0) {
            QuotationGridOptions.api.setRowData(QuotationRowData);
        }

        // SOW
        let selectedHistorySOWs = HistorySOWRowData.filter(sow => sow.QuotationNo == selectedHistory.QuotationNo);
        SOWRowData = [];

        if (selectedHistorySOWs.length > 0) {
            for (let sow of selectedHistorySOWs) {
                let newSOW = {};
                newSOW.Job = sow.Job;
                newSOW.Text = sow.Text;
                newSOW.RowID = uuidv4();
                SOWRowData.push(newSOW);
            }
        }
        if (SOWRowData.length > 0) {
            SOWGridOptions.api.setRowData(SOWRowData);
        }
        freezeQuotation();
    }


}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

var jobASCII = 65;
var lastFrozenQuotationRows = [];
var lastFrozenJobASCII = 65;
var lastFrozenSOW = JSON.parse(JSON.stringify(defaultSOW));

function generateQuotationRows(mode) {
    let rows = ACRowData.filter(value => parseInt(value.Unit) > 0);
    if (lastFrozenQuotationRows.length > 0) {
        jobASCII = lastFrozenJobASCII;
        QuotationRowData = JSON.parse(JSON.stringify(lastFrozenQuotationRows));
        SOWRowData = JSON.parse(JSON.stringify(lastFrozenSOW));
    }
    else {
        QuotationRowData = [];
        SOWRowData = JSON.parse(JSON.stringify(defaultSOW));
        jobASCII = 65;
    }


    if (rows.length > 0) {
        let preText = installPreText;
        if (mode == 'supply') {
            preText = supplyPreText;
        }
        let row = { 'Job': String.fromCharCode(jobASCII), 'RowID': uuidv4(), 'Description': preText, 'UOM': '' }
        QuotationRowData.push(row);

        // Get selected brands
        let brands = [];
        for (let ac of rows) {
            if (!brands.some(value => value == ac.Brand)) {
                brands.push(ac.Brand);
            }
        }

        // Air cond details
        for (let brand of brands) {
            let brandDesc = ('Brand: ' + brand + '\n');
            let row = { 'Job': String.fromCharCode(jobASCII), 'RowID': uuidv4(), 'Description': brandDesc, 'UOM': '' }
            QuotationRowData.push(row);
            let brandrows = rows.filter(value => value.Brand == brand);

            for (let ac of brandrows) {
                let desc = ac.Product + ' @ ' +
                    ac.Model + ' ( ' +
                    'BTU ' + ac.BTU + ' ) ';
                let uprice = ((mode == 'supply') ? ac.PriceAC : ac.Price);
                let unit = ac.Unit;
                let row = { 'Job': String.fromCharCode(jobASCII), 'RowID': uuidv4(), 'Description': desc, 'Unit': unit, 'UnitPrice': uprice, 'UOM': '', 'Category': ac.Category }

                QuotationRowData.push(row);
            }
        }

        let SOWArray = installSOW;
        if (mode == 'supply') {
            SOWArray = supplySOW;
        }

        for (let sowRow of SOWArray) {
            let foundRow = SOWRowData.find(row => row.Text == sowRow);
            if (foundRow) {
                foundRow.Job += (',' + String.fromCharCode(jobASCII));
            }
            else {
                SOWRowData.push({ Job: String.fromCharCode(jobASCII), Text: sowRow, 'RowID': uuidv4() })
            }
        }

        QuotationGridOptions.api.setRowData(QuotationRowData);
        SOWGridOptions.api.setRowData(SOWRowData);
    }

}

function generateQuotationRowsLabour(mode) {
    let rows = ACRowData.filter(value => parseInt(value.Unit) > 0);
    if (lastFrozenQuotationRows.length > 0) {
        jobASCII = lastFrozenJobASCII;
        QuotationRowData = JSON.parse(JSON.stringify(lastFrozenQuotationRows));
        SOWRowData = JSON.parse(JSON.stringify(lastFrozenSOW));
    }
    else {
        QuotationRowData = [];
        SOWRowData = JSON.parse(JSON.stringify(defaultSOW));
        jobASCII = 65;
    }

    if (rows.length > 0) {

        // Get Selected Categories
        let categories = [];
        for (let ac of rows) {
            let category = categories.find(value => value.Category == ac.Category)
            if (category == undefined) {
                categories.push({ Category: ac.Category, Install: ac.Install, PriceConceal: ac.PriceConceal, Unit: parseInt(ac.Unit) })
            }
            else {
                category.Unit = category.Unit + parseInt(ac.Unit);
            }
        }

        // Get Selected brands
        let brands = [];
        for (let ac of rows) {
            if (!brands.some(value => value == ac.Brand)) {
                brands.push(ac.Brand);
            }
        }

        // Concealing details
        if (mode == 'conceal') {
            let row = { 'RowID': uuidv4(), 'Job': String.fromCharCode(jobASCII), 'Description': concealPreTextA, 'UOM': '' }
            QuotationRowData.push(row);

            for (let category of categories) {
                let row = { 'RowID': uuidv4(), 'Job': String.fromCharCode(jobASCII), 'Description': category.Category, 'Unit': category.Unit, 'UnitPrice': category.PriceConceal, 'UOM': '' }
                QuotationRowData.push(row);
            }

            SOWArray = concealSOWA;

            for (let sowRow of SOWArray) {
                let foundRow = SOWRowData.find(row => row.Text == sowRow);
                if (foundRow) {
                    foundRow.Job += (',' + String.fromCharCode(jobASCII));
                }
                else {
                    SOWRowData.push({ Job: String.fromCharCode(jobASCII), Text: sowRow, 'RowID': uuidv4() })
                }
            }

            jobASCII++;
        }

        // Air cond details
        let job = String.fromCharCode(jobASCII);
        let desc = (mode == 'conceal' ? concealPreTextB : nopipePreTextA);
        let row = { 'RowID': uuidv4(), 'Job': job, 'Description': desc, 'UOM': '' };
        QuotationRowData.push(row);
        for (let brand of brands) {

            let brandDesc = ('Brand: ' + brand + '\n');
            let row = { 'RowID': uuidv4(), 'Job': job, 'Description': brandDesc, 'UOM': '' }
            QuotationRowData.push(row);

            let brandrows = rows.filter(value => value.Brand == brand);

            for (let ac of brandrows) {
                let desc = ac.Product + ' @ ' + ac.Model + ' ( ' + 'BTU ' + ac.BTU + ' ) ';
                let row = { 'RowID': uuidv4(), 'Job': job, 'Description': desc, 'UnitPrice': ac.PriceAC, 'Unit': ac.Unit, 'UOM': '', 'Category': ac.Category };
                QuotationRowData.push(row);
            }
        }
        jobASCII++;

        // Labour charges details
        job = String.fromCharCode(jobASCII);
        desc = (mode == 'conceal' ? concealPreTextC : nopipePreTextB);
        row = { 'RowID': uuidv4(), 'Job': job, 'Description': desc, 'UOM': '' };
        QuotationRowData.push(row);
        for (let category of categories) {
            let row = { 'RowID': uuidv4(), 'Job': job, 'Description': category.Category, 'Unit': category.Unit, 'UnitPrice': category.Install, 'UOM': '' }
            QuotationRowData.push(row);

        }

        SOWArray = (mode == 'conceal' ? concealSOWC : nopipeSOWB);

        for (let sowRow of SOWArray) {
            let foundRow = SOWRowData.find(row => row.Text == sowRow);
            if (foundRow) {
                foundRow.Job += (',' + String.fromCharCode(jobASCII));
            }
            else {
                SOWRowData.push({ Job: String.fromCharCode(jobASCII), Text: sowRow, 'RowID': uuidv4() })
            }
        }

        QuotationGridOptions.api.setRowData(QuotationRowData);
        SOWGridOptions.api.setRowData(SOWRowData);
    }

}

// Manual action for Quotation Grid
function AddRow_Quotation() {
    let newQuotationItem = { 'RowID': uuidv4() };
    QuotationRowData.push(newQuotationItem);
    QuotationGridOptions.api.setRowData(QuotationRowData);
    
}
function DeleteRow_Quotation() {
    var selectedData = QuotationGridOptions.api.getSelectedRows();
    if (selectedData == null || selectedData.length == 0) {
        alert('No item is selected!');
        return;
    }
    QuotationRowData = QuotationRowData.filter(value => value.RowID != selectedData[0].RowID);
    QuotationGridOptions.api.setRowData(QuotationRowData);
}
function MoveUp_Quotation() {
    var selectedRow = QuotationGridOptions.api.getSelectedRows();
    let rowID = selectedRow[0].RowID;
    var index = QuotationRowData.findIndex(value => value.RowID == rowID);
    if (index > 0) {
        MoveItem_Quotation(index, index - 1)
    }
    QuotationGridOptions.api.setRowData(QuotationRowData);
    QuotationGridOptions.api.forEachNode(function (node) {
        node.setSelected(node.data.RowID === rowID);
    });
}
function MoveDown_Quotation() {
    var selectedRow = QuotationGridOptions.api.getSelectedRows();
    let rowID = selectedRow[0].RowID;
    var index = QuotationRowData.findIndex(value => value.RowID == rowID);
    if (index < QuotationRowData.length - 1) {
        MoveItem_Quotation(index, index + 1)
    }
    QuotationGridOptions.api.setRowData(QuotationRowData);
    QuotationGridOptions.api.forEachNode(function (node) {
        node.setSelected(node.data.RowID === rowID);
    });
}

function MoveItem_Quotation(from, to) {
    // remove `from` item and store it
    var f = QuotationRowData.splice(from, 1)[0];
    // insert stored item into position `to`
    QuotationRowData.splice(to, 0, f);
}

function onSelectionChanged_Quotation(event) {
    var selectedRows = QuotationGridOptions.api.getSelectedRows();
    QuotationExtraChargesRowData = [];
    if (selectedRows.length > 0) {
        for (let ec of ExtraChargesRowData) {
            if (isEmptyString(ec.Category) || ec.Category == selectedRows[0].Category) {
                QuotationExtraChargesRowData.push({ 'Description': ec.Description, 'Unit': 0, 'UnitPrice': ec.UnitPrice, 'UOM': ec.UOM });
            }
        }

    }
    QuotationExtraChargesGridOptions.api.setRowData(QuotationExtraChargesRowData);
}

function ConfirmCharges() {
    let charges = QuotationExtraChargesRowData.filter(charge => charge.Unit > 0);
    var selectedRows = QuotationGridOptions.api.getSelectedRows();
    if (selectedRows.length > 0 && charges.length > 0) {
        let selectedRow = selectedRows[0];
        let index = QuotationRowData.findIndex(row => row.RowID == selectedRow.RowID) + 1;
        for (let charge of charges) {
            let newSOWItem = { 'RowID': uuidv4(), 'Job': selectedRow.Job, 'Description': charge.Description, 'Unit': charge.Unit, 'UOM': charge.UOM, 'UnitPrice': charge.UnitPrice };
            QuotationRowData.splice(index, 0, newSOWItem);
            index++;
        }
        QuotationGridOptions.api.setRowData(QuotationRowData);
    }
}

// Manual action for SOW Grid
function AddRow_SOW() {
    let newSOWItem = { 'RowID': uuidv4() };
    SOWRowData.push(newSOWItem);
    SOWGridOptions.api.setRowData(SOWRowData);
    
}
function DeleteRow_SOW() {
    var selectedData = SOWGridOptions.api.getSelectedRows();
    if (selectedData == null || selectedData.length == 0) {
        alert('No item is selected!');
        return;
    }
    SOWRowData = SOWRowData.filter(value => value.RowID != selectedData[0].RowID);
    SOWGridOptions.api.setRowData(SOWRowData);
}
function MoveUp_SOW() {
    var selectedRow = SOWGridOptions.api.getSelectedRows();
    let rowID = selectedRow[0].RowID;
    var index = SOWRowData.findIndex(value => value.RowID == rowID);
    if (index > 0) {
        MoveItem_SOW(index, index - 1)
    }
    SOWGridOptions.api.setRowData(SOWRowData);
    SOWGridOptions.api.forEachNode(function (node) {
        node.setSelected(node.data.RowID === rowID);
    });
}
function MoveDown_SOW() {
    var selectedRow = SOWGridOptions.api.getSelectedRows();
    let rowID = selectedRow[0].RowID;
    var index = SOWRowData.findIndex(value => value.RowID == rowID);
    if (index < SOWRowData.length - 1) {
        MoveItem_SOW(index, index + 1)
    }
    SOWGridOptions.api.setRowData(SOWRowData);
    SOWGridOptions.api.forEachNode(function (node) {
        node.setSelected(node.data.RowID === rowID);
    });
}

function MoveItem_SOW(from, to) {
    // remove `from` item and store it
    var f = SOWRowData.splice(from, 1)[0];
    // insert stored item into position `to`
    SOWRowData.splice(to, 0, f);
}

function freezeQuotation() {
    lastFrozenJobASCII = ++jobASCII;
    for (let qr of QuotationRowData) {
        if (qr.Job.charCodeAt(0) > lastFrozenJobASCII) {
            lastFrozenJobASCII = qr.Job.charCodeAt(0) + 1;
        }
    }
    lastFrozenQuotationRows = JSON.parse(JSON.stringify(QuotationRowData));
    lastFrozenSOW = JSON.parse(JSON.stringify(SOWRowData));

    for (let row of ACRowData) {
        row.Unit = 0;
    }
    ACGridOptions.api.setRowData(ACRowData);
}

function reset() {
    lastFrozenJobASCII = 65;
    jobASCII = 65;
    QuotationRowData = [];
    lastFrozenQuotationRows = [];
    lastFrozenSOW = JSON.parse(JSON.stringify(defaultSOW));
    SOWRowData = JSON.parse(JSON.stringify(defaultSOW));

    for (let row of ACRowData) {
        row.Unit = 0;
    }
    ACGridOptions.api.setRowData(ACRowData);
    QuotationGridOptions.api.setRowData(QuotationRowData);
    SOWGridOptions.api.setRowData(SOWRowData);
}

function onObsoleteCBChanged() {
    ACGridOptions.api.onFilterChanged();
}

function onHotItemCBChanged() {
    ACGridOptions.api.onFilterChanged();
}


