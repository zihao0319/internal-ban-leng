
var CustomerRowData = [];
var ActionRowData = [];
var QuotationRowData = [];
var HistoryRowData = [];
var HistoryDetailRowData = [];
var ActionPreText = [];
var ActionPostText = [];

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

const ActionColumnDefs = [
    // { headerName: 'ID', field: 'ActionID' },
    { headerName: 'Name', field: 'Name' },
    { headerName: 'Type', field: 'Type' },
    { headerName: 'Price', field: 'Price', valueFormatter: (args) => parseFloat(args.value).toFixed(2) },
    { headerName: 'Description', field: 'Description' },
]

const QuotationColumnDefs = [
    { headerName: 'No.', field: 'No', width: 30, editable: false, valueGetter: (args) => args.node.rowIndex + 1 },
    { headerName: 'Action', field: 'ActionName', width: 50, editable: false },
    { headerName: 'Job Description', field: 'Description', editable: true },
    { headerName: 'Unit', field: 'Unit', width: 50, editable: true },
    { headerName: 'UOM', field: 'UOM', width: 50, editable: true },
    { headerName: 'Unit Price', field: 'UnitPrice', width: 50, editable: true, valueFormatter: (args) => parseFloat(args.value).toFixed(2) },
    { headerName: 'Total', field: 'Total', width: 50, editable: false, valueGetter: (args) => parseInt(args.data.Unit) * parseFloat(args.data.UnitPrice), valueFormatter: (args) => args.value.toFixed(2) },
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

const HistoryDetailColumnDefs = [
    //{ headerName: 'Action ID', field: 'ActionID' },
    { headerName: 'Action', field: 'Action' },
    { headerName: 'Job Description', field: 'Description' },
    { headerName: 'Unit', field: 'Unit' },
    { headerName: 'UOM', field: 'UOM' },
    { headerName: 'Unit Price', field: 'UnitPrice', valueFormatter: (args) => parseFloat(args.value).toFixed(2) },
    { headerName: 'Total', field: 'Total', valueGetter: (args) => parseInt(args.data.Unit) * parseFloat(args.data.UnitPrice), valueFormatter: (args) => args.value.toFixed(2) },
    {
        headerName: 'Job Information',
        children: [
            { headerName: 'Horse Power', field: 'HorsePower', },
            { headerName: 'Aircond Type', field: 'ACType', columnGroupShow: 'open' },
            { headerName: 'Feature', field: 'Feature', columnGroupShow: 'open' },
            { headerName: 'Gas Type', field: 'GasType', columnGroupShow: 'open' },
            { headerName: 'Brand', field: 'Brand', columnGroupShow: 'open' },
            { headerName: 'Indoor Model', field: 'ModelIndoor', columnGroupShow: 'open' },
            { headerName: 'Outdoor Model', field: 'ModelOutdoor', columnGroupShow: 'open' },
        ]
    }
]

const CustomerGridOptions = {
    defaultColDef: { resizable: true, sortable: true, filter: true },
    columnDefs: CustomerColumnDefs,
    rowData: CustomerRowData,
    rowSelection: 'single',
    onFirstDataRendered: autoSizeAll
};

const ActionGridOptions = {
    defaultColDef: { resizable: true, sortable: true, filter: true },
    columnDefs: ActionColumnDefs,
    rowData: ActionRowData,
    rowSelection: 'single',
    onFirstDataRendered: autoSizeAll,
    isExternalFilterPresent: isActionFilterPresent,
    doesExternalFilterPass: doesActionFilterPass
};

const QuotationGridOptions = {
    defaultColDef: { resizable: true, sortable: true, filter: true },
    columnDefs: QuotationColumnDefs,
    rowSelection: 'single',
    rowData: QuotationRowData,
    onSelectionChanged: externalHistoryFilterChanged,
};

const HistoryDetailGridOptions = {
    defaultColDef: { resizable: true, sortable: true, filter: true },
    columnDefs: HistoryDetailColumnDefs,
    rowData: HistoryDetailRowData,
    onFirstDataRendered: autoSizeAll,
    isExternalFilterPresent: (() => { return true }),
    doesExternalFilterPass: doesHistoryItemFilterPass
}

const HistoryGridOptions = {
    defaultColDef: { resizable: true, sortable: true, filter: true },
    columnDefs: HistoryColumnDefs,
    rowData: HistoryRowData,
    onFirstDataRendered: autoSizeAll,
    rowSelection: 'multiple',
    onSelectionChanged: externalHistoryItemFilterChanged,
    doesExternalFilterPass: doesHistoryFilterPass,
    isExternalFilterPresent: (() => { return true })
};



const eCustDiv = document.querySelector('#CustomerGrid');
const eActionDiv = document.querySelector('#ActionGrid');
const eQuotationDiv = document.querySelector('#QuotationGrid');
const eHistoryDiv = document.querySelector('#HistoryGrid');
const eHistoryDetailDiv = document.querySelector('#HistoryDetailGrid');

const eActionTypeSelector = document.querySelector('#ActionTypeSelector');
const mainInputPreText = document.querySelector('#mainInputPreText');
const hiddenInputPreText = document.querySelector('#hiddenInputPreText');
const mainInputPostText = document.querySelector('#mainInputPostText');
const hiddenInputPostText = document.querySelector('#hiddenInputPostText');
const preTextDiv = document.querySelector('#preTextDiv');
const postTextDiv = document.querySelector('#postTextDiv');
const cbHistoryFilterByCustomer = document.querySelector('#HistoryFilterByCustomer');
const cbHistoryFilterByAction = document.querySelector('#HistoryFilterByAction');

new agGrid.Grid(eCustDiv, CustomerGridOptions);
new agGrid.Grid(eActionDiv, ActionGridOptions);
new agGrid.Grid(eQuotationDiv, QuotationGridOptions);
new agGrid.Grid(eHistoryDiv, HistoryGridOptions);
new agGrid.Grid(eHistoryDetailDiv, HistoryDetailGridOptions);

//CustomerGridOptions.api.sizeColumnsToFit();
//ActionGridOptions.api.sizeColumnsToFit();
QuotationGridOptions.api.sizeColumnsToFit();
HistoryGridOptions.api.sizeColumnsToFit();
HistoryDetailGridOptions.api.sizeColumnsToFit();

function requestData(f) {
    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/quotation-maint/quotation-maint.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            receiveData(this.responseText);
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onerror = function(e) {
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
        location.href = './';
    }
    CustomerRowData = responseJSON.Customer;
    CustomerGridOptions.api.setRowData(CustomerRowData);
    ActionRowData = responseJSON.Action;
    ActionGridOptions.api.setRowData(ActionRowData);
    var actionTypes = [];
    for (let action of responseJSON.Action) {
        if (!actionTypes.some(value => value == action.Type)) {
            actionTypes.push(action.Type);
        }
    }
    eActionTypeSelector.innerHTML = actionTypes.map(function (v) {
        return '<option value="' + v + '">' + v + '</option>';
    }).join('');

    this.externalActionFilterChanged();

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
    let url = "/forms/quotation-maint/quotation-maint-history.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                responseJSON = JSON.parse(this.responseText);
            }
            catch (e) {
                location.href = '/';
            }
            HistoryRowData = responseJSON.History;
            HistoryGridOptions.api.setRowData(HistoryRowData);
            HistoryDetailRowData = responseJSON.Items;
            HistoryDetailGridOptions.api.setRowData(HistoryDetailRowData);

            externalHistoryItemFilterChanged();
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function onCustomerFilterTextBoxChanged() {
    CustomerGridOptions.api.setQuickFilter(document.getElementById('CustomerFilter').value);
}

function onActionFilterTextBoxChanged() {
    ActionGridOptions.api.setQuickFilter(document.getElementById('ActionFilter').value);
}

function isActionFilterPresent() {
    // if ageType is not everyone, then we are filtering
    let actionType = eActionTypeSelector.value;
    return actionType != '' && actionType != null;
}

function doesActionFilterPass(node) {
    let actionType = eActionTypeSelector.value;
    return node.data.Type == actionType;
}

function externalActionFilterChanged() {
    ActionGridOptions.api.onFilterChanged();
}

function doesHistoryItemFilterPass(node) {
    let selectedHistory = HistoryGridOptions.api.getSelectedRows();
    let isPass = false;
    if (selectedHistory != null && selectedHistory.length > 0) {
        isPass = selectedHistory.some(value => value.QuotationNo == node.data.QuotationNo);
    }
    else {
        return false;
    }
    if (cbHistoryFilterByAction.checked) {
        let selectedItems = QuotationGridOptions.api.getSelectedRows();
        if (selectedItems != null && selectedItems.length == 1) {
            let selectedItem = selectedItems[0];
            isPass = isPass && selectedItem.ActionID == node.data.ActionID;
        }
    }
    return isPass;
}

function doesHistoryFilterPass(node) {
    let isPass = true;
    if (cbHistoryFilterByCustomer.checked) {
        let custName = document.querySelector('#CustomerName').value;
        isPass = node.data.CustomerName == custName;
    }
    if (cbHistoryFilterByAction.checked) {
        let selectedItems = QuotationGridOptions.api.getSelectedRows();
        if (selectedItems != null && selectedItems.length == 1) {
            let selectedItem = selectedItems[0];
            let historyDetails = HistoryDetailRowData.filter(value => value.QuotationNo == node.data.QuotationNo);
            isPass = isPass && historyDetails.some(value => value.ActionID == selectedItem.ActionID);
        }
    }

    return isPass;
}

function externalHistoryItemFilterChanged() {
    HistoryDetailGridOptions.api.onFilterChanged();
}

function externalHistoryFilterChanged() {
    HistoryGridOptions.api.onFilterChanged();
    externalHistoryItemFilterChanged();
}

function onHistoryTextBoxChanged() {
    HistoryGridOptions.api.setQuickFilter(document.getElementById('HistoryFilter').value);
}

function onHistoryItemFilterTextBoxChanged() {
    HistoryDetailGridOptions.api.setQuickFilter(document.getElementById('HistoryDetailFilter').value);
}



function autoSizeAll() {
    var allColumnIds = [];
    CustomerGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    CustomerGridOptions.columnApi.autoSizeColumns(allColumnIds);
}

function getHistoryDetailRowData(params) {
    params.successCallback(params.data.childRecords);
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
    let url = "/forms/quotation-maint/new-customer.php";

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

function addQuotationItem() {
    let selectedAction = ActionGridOptions.api.getSelectedRows();
    if (selectedAction == null || selectedAction.length == 0) {
        alert('Action must be selected!');
        return;
    }
    let newQuotationItem = {};
    newQuotationItem.ActionID = selectedAction[0].ActionID;
    newQuotationItem.ActionName = selectedAction[0].Name;
    newQuotationItem.Description = selectedAction[0].Description;
    newQuotationItem.Unit = 0;
    newQuotationItem.UnitPrice = parseFloat(selectedAction[0].Price);
    newQuotationItem.PreText = selectedAction[0].PreText;
    newQuotationItem.PostText = selectedAction[0].PostText;
    QuotationRowData.push(newQuotationItem);
    QuotationGridOptions.api.setRowData(QuotationRowData);
    refreshPreTextAction();
    refreshPostTextAction();
}

function removeQuotationItem() {
    var selectedData = QuotationGridOptions.api.getSelectedRows();
    if (selectedData == null || selectedData.length == 0) {
        alert('No item is selected!');
        return;
    }
    QuotationRowData = QuotationRowData.filter(value => value.ActionID != selectedData[0].ActionID);
    QuotationGridOptions.api.setRowData(QuotationRowData);
    refreshPreTextAction();
    refreshPostTextAction();
}

function refreshPreTextAction() {
    let toBeRemoved = [];
    let actionPreTexts = [];
    for (let quotationItem of QuotationRowData) {
        let preTexts = quotationItem.PreText.split('|');
        if (preTexts.length > 0) {
            for (let fulltext of preTexts) {
                let replaceArray = fulltext.split('--');
                let preText = replaceArray[0].trim();
                if (!actionPreTexts.includes(preText)) {
                    actionPreTexts.push(preText)
                }
                if (replaceArray.length > 1) {
                    toBeRemoved.push(replaceArray[1]);
                }
            }
        }
    }
    for (let text of toBeRemoved) {
        actionPreTexts = actionPreTexts.filter(value => value != text);
    }
    let length = ActionPreText.length;
    for (let i = 0; i < length; i++) {
        removeTag(0, ActionPreText, hiddenInputPreText, preTextDiv);
    }
    mainInputPreText.value = actionPreTexts.join(',');
    onAddActionPreText();
}

function refreshPostTextAction() {
    let toBeRemoved = [];
    let actionPostTexts = [];
    for (let quotationItem of QuotationRowData) {
        let postTexts = quotationItem.PostText.split('|');
        if (postTexts.length > 0) {
            for (let fulltext of postTexts) {
                let replaceArray = fulltext.split('--');
                let postText = replaceArray[0].trim();
                if (!actionPostTexts.includes(postText)) {
                    actionPostTexts.push(postText)
                }
                if (replaceArray.length > 1) {
                    toBeRemoved.push(replaceArray[1]);
                }
            }
        }
    }
    for (let text of toBeRemoved) {
        actionPostTexts = actionPostTexts.filter(value => value != text);
    }
    let length = ActionPostText.length;
    for (let i = 0; i < length; i++) {
        removeTag(0, ActionPostText, hiddenInputPostText, postTextDiv);
    }
    mainInputPostText.value = actionPostTexts.join(',');
    onAddActionPostText();
}

mainInputPreText.addEventListener('input', onAddActionPreText);
mainInputPostText.addEventListener('input', onAddActionPostText);

function onAddActionPreText() {
    let enteredTags = mainInputPreText.value.split(',');
    if (enteredTags.length > 1) {
        enteredTags.forEach(function (t) {
            let filteredTag = filterTag(t);
            if (filteredTag.length > 0)
                addTag(filteredTag, ActionPreText, mainInputPreText, hiddenInputPreText, preTextDiv);
        });
        mainInputPreText.value = '';
    }
}
function onAddActionPostText() {
    let enteredTags = mainInputPostText.value.split(',');
    if (enteredTags.length > 1) {
        enteredTags.forEach(function (t) {
            let filteredTag = filterTag(t);
            if (filteredTag.length > 0)
                addTag(filteredTag, ActionPostText, mainInputPostText, hiddenInputPostText, postTextDiv);
        });
        mainInputPostText.value = '';
    }
}

mainInputPreText.addEventListener('keydown', function (e) {
    let keyCode = e.which || e.keyCode;
    if (keyCode === 8 && mainInputPreText.value.length === 0 && ActionPreText.length > 0) {
        removeTag(ActionPreText.length - 1, ActionPreText, hiddenInputPreText, preTextDiv);
    }
    else if (keyCode === 13 && mainInputPreText.value.length > 0) {
        mainInputPreText.value += ','
        onAddActionPreText();
    }
});
mainInputPreText.addEventListener('focusout', function (e) {
    mainInputPreText.value += ','
    onAddActionPreText()
});
mainInputPostText.addEventListener('keydown', function (e) {
    let keyCode = e.which || e.keyCode;
    if (keyCode === 8 && mainInputPostText.value.length === 0 && ActionPostText.length > 0) {
        removeTag(ActionPostText.length - 1, ActionPostText, hiddenInputPostText, postTextDiv);
    }
    else if (keyCode === 13 && mainInputPostText.value.length > 0) {
        mainInputPostText.value += ','
        onAddActionPostText();
    }
});
mainInputPostText.addEventListener('focusout', function (e) {
    mainInputPostText.value += ','
    onAddActionPostText()
});
preTextDiv.addEventListener('click', function (e) {
    mainInputPreText.focus();
})
postTextDiv.addEventListener('click', function (e) {
    mainInputPostText.focus();
})

function movePreText(isnext) {
    let el = preTextDiv;
    let tagElement = el.querySelector('.tag.active');
    if (tagElement == undefined || tagElement == null) {
        return;
    }
    let tagElements = Array.from(el.querySelectorAll('.tag'));
    let index = tagElements.indexOf(tagElement);
    if (isnext == true) {
        this.moveNext(index, tagElements, ActionPreText, hiddenInputPreText, el);
    }
    else {
        this.movePrevious(index, tagElements, ActionPreText, hiddenInputPreText, el);
    }
}

function movePostText(isnext) {
    let el = postTextDiv;
    let tagElement = el.querySelector('.tag.active');
    if (tagElement == undefined || tagElement == null) {
        return;
    }
    let tagElements = Array.from(el.querySelectorAll('.tag'));
    let index = tagElements.indexOf(tagElement);
    if (isnext == true) {
        this.moveNext(index, tagElements, ActionPostText, hiddenInputPostText, el);
    }
    else {
        this.movePrevious(index, tagElements, ActionPostText, hiddenInputPostText, el);
    }
}

function addTag(text, tags, mainInput, hiddenInput, el) {
    let tag = {
        text: text,
        element: document.createElement('span'),
    };

    tag.element.classList.add('tag');
    tag.element.textContent = tag.text;

    let closeBtn = document.createElement('span');
    closeBtn.classList.add('close');
    closeBtn.addEventListener('click', function () {
        removeTag(tags.indexOf(tag), tags, hiddenInput, el);
    });

    tag.element.addEventListener('click', function () {
        let tags = el.querySelectorAll('.tag');
        let isactive = tag.element.classList.contains('active');
        for (let te of tags) {
            te.classList.remove('active');
        }
        if (!isactive) {
            tag.element.classList.add('active');
        }
    });

    tag.element.appendChild(closeBtn);


    tags.push(tag);

    el.insertBefore(tag.element, mainInput);

    refreshTags(tags, hiddenInput);
}

function movePrevious(index, tagElements, tags, hiddenInput, el) {
    let tag = tags[index];
    if (index > 0) {
        el.insertBefore(tagElements[index], tagElements[index - 1]);
        tags[index] = tags.splice(index - 1, 1, tags[index])[0];
        refreshTags(tags, hiddenInput);
    }
}

function moveNext(index, tagElements, tags, hiddenInput, el) {
    let tag = tags[index];
    if (index < tags.length - 1) {
        el.insertBefore(tagElements[index + 1], tagElements[index]);
        tags[index] = tags.splice(index + 1, 1, tags[index])[0];
        refreshTags(tags, hiddenInput);
    }
}

function removeTag(index, tags, hiddenInput, el) {
    let tag = tags[index];
    tags.splice(index, 1);
    el.removeChild(tag.element);
    refreshTags(tags, hiddenInput);
}

function refreshTags(tags, hiddenInput) {
    let tagsList = [];
    tags.forEach(function (t) {
        tagsList.push(t.text);
    });
    hiddenInput.value = tagsList.join(',');
}

function filterTag(tag) {
    return tag.trim();
}

function updateSpan(spanId, inputId) {
    let span = document.querySelector('#' + spanId);
    let input = document.querySelector('#' + inputId);
    span.innerHTML = input.value;
}

function OverrideACInfo() {
    let overrideACInfo = document.querySelector('#OverrideACInfo');
    if (overrideACInfo.readOnly == true) {
        overrideACInfo.readOnly = false;
    } else {
        overrideACInfo.readOnly = true;
        overrideACInfo.value = '';
    }

}

function createReport(company) {
    var popup = open("/forms/quotation-maint/report.html", "Popup", "width=794,height=1123");


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
        let sowstring = document.querySelector('#ScopeOfWork').value;
        let sowarray = sowstring.split('|').map( value => '<li>' + value + '</li>' );
        popup.document.querySelector('#ScopeOfWork').innerHTML = sowarray.join('');

        // Pre Text
        let intro = document.querySelector('#quotationIntro').value;
        let preText = (!isEmptyString(intro) ? intro + ' ' : '') + ActionPreText.map(function (elem) { return elem.text; }).join(', ');
        let horsePower = document.querySelector('#HorsePowerSpan').innerHTML;
        let feature = document.querySelector('#FeatureSpan').innerHTML;
        let actype = document.querySelector('#ACTypeSpan').innerHTML;

        let overrideACInfo = document.querySelector('#OverrideACInfo');
        if (overrideACInfo.readOnly == true) {
            preText = preText + (!isEmptyString(horsePower) ? ' ' + horsePower : '');
            preText = preText + (!isEmptyString(feature) ? ' ' + feature : '');
            preText = preText + (!isEmptyString(actype) ? ' ' + actype : '');
        }
        else {
            preText = preText + ' ' + overrideACInfo;
        }
        popup.document.querySelector('#PreText').innerHTML = preText;

        //Post Text
        let postText = ActionPostText.map(function (elem) { return elem.text; }).join(', ')
        let ending = document.querySelector('#quotationEnding').value;
        postText = postText + (!isEmptyString(ending) ? ' ' + ending : '');
        popup.document.querySelector('#PostText').innerHTML = postText;

        // Quotation Items
        let quotationTable = popup.document.getElementById('quotationTable');
        let totalPrice = 0.0;
        let index = 2;
        for (let quotationItem of QuotationRowData) {
            if (quotationItem.Unit > 0) {
                let row = quotationTable.insertRow(index);
                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                let cell4 = row.insertCell(3);
                let cell5 = row.insertCell(4);

                cell2.innerHTML = quotationItem.Description;
                cell3.innerHTML = quotationItem.Unit + ' ' + (!isEmptyString(quotationItem.UOM) ? quotationItem.UOM : '');
                let unitPrice = parseFloat(quotationItem.UnitPrice);
                let unitTotal = unitPrice * parseInt(quotationItem.Unit);
                cell4.innerHTML = "RM <span style='float:right'>" + unitPrice.toFixed(2) + "</span>"
                cell5.innerHTML = "RM <span style='float:right'>" + unitTotal.toFixed(2) + "</span>"
                index++;
                totalPrice += unitTotal;
            }
        }

        // Refund
        let checkbox = document.querySelector('#hasRefund');
        let desc = document.querySelector('#refundDescription');
        let amt = document.querySelector('#refundAmount');
        let qty = document.querySelector('#refundQty');
        let uom = document.querySelector('#refundUOM');
        let price = document.querySelector('#refundPrice');

        if (checkbox.checked) {
            let row = quotationTable.insertRow(index + 1);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            let cell5 = row.insertCell(4);

            cell2.innerHTML = desc.value;
            cell3.innerHTML = qty.value + ' ' + uom.value;
            cell4.innerHTML = "RM <span style='float:right'> -" + parseFloat(price.value).toFixed(2) + "</span>"
            cell5.innerHTML = "RM <span style='float:right'> -" + parseFloat(amt.value).toFixed(2) + "</span>"

            totalPrice -= parseFloat(amt.value);
        }

        // Total
        popup.document.querySelector('#TotalPrice').innerHTML = "RM <span style='float:right'>" + totalPrice.toFixed(2) + "</span>"


    }, false);

    // var txtOk = popup.document.createElement("TEXTAREA");
    // var aOk = popup.document.createElement("a");
    // aOk.innerHTML = "Click here";

    // popup.document.body.appendChild(txtOk);
    // popup.document.body.appendChild(aOk);
}

var itemCount = 0;
var successCount = 0;

function validateSaveRecord() {
    let quotation_params = '&quotationNo=' + encodeURIComponent(document.querySelector('#QuotationID').value);
    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/quotation-maint/new-quotation-validate.php";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            let reponseJSON = JSON.parse(this.response);
            if (this.status == 200 && reponseJSON.statusCode == 200) {
               if(reponseJSON.result > 0) {
                    var conf = confirm('Quotation (' + document.querySelector('#QuotationID').value + ') already exists. Continue to override quotation?');
                    if(conf) {
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
        'customerName':document.querySelector('#CustomerName').value
        , 'customerAddress':document.querySelector('#CustomerAddress').value
        , 'phone':document.querySelector('#Phone').value
        , 'fax':document.querySelector('#Fax').value
        , 'regNo':document.querySelector('#RegNo').value
        , 'attnPerson':document.querySelector('#AttnPerson').value
        , 'attnPhone':document.querySelector('#AttnPhone').value
        , 'email':document.querySelector('#Email').value
        , 'quotationNo':document.querySelector('#QuotationID').value
        , 'date':document.querySelector('#Date').value
        , 'jobDepartment':document.querySelector('#JobDepartment').value
        , 'acUnit':document.querySelector('#ACUnit').value
        , 'reqNo':document.querySelector('#RequisitionNo').value
        , 'deliveryNo':document.querySelector('#DeliveryNo').value
        , 'serviceNo':document.querySelector('#ServiceNo').value
        , 'poNo':document.querySelector('#PONo').value
        , 'invoiceNo':document.querySelector('#InvoiceNo').value
        , 'serviceDate':document.querySelector('#ServiceNoDate').value
        , 'poDate':document.querySelector('#PONoDate').value
        , 'invoiceDate':document.querySelector('#InvoiceNoDate').value
        , 'servicePrice':document.querySelector('#ServiceNoPrice').value
        , 'poPrice':document.querySelector('#PONoPrice').value
        , 'invoicePrice':document.querySelector('#InvoiceNoPrice').value
        , 'remark':document.querySelector('#Remark').value
        , 'qid':QID
        , 'doid':DOID
        , 'year':today.getFullYear()
        , 'month':(today.getMonth() + 1)
        , 'hasRefund':(document.querySelector('#hasRefund').checked ? 1 : 0)
        , 'refundDescription':document.querySelector('#refundDescription').value
        , 'refundQty':document.querySelector('#refundQty').value
        , 'refundUOM':document.querySelector('#refundUOM').value
        , 'refundPrice':document.querySelector('#refundPrice').value
        , 'preText':ActionPreText.map(function (elem) { return elem.text; }).join(', ')
        , 'postText':ActionPostText.map(function (elem) { return elem.text; }).join(', ')
        , 'startWith':document.querySelector('#quotationIntro').value
        , 'endWith':document.querySelector('#quotationEnding').value
        , 'isACInfoOverride':(document.querySelector('#isOverrideACInfo').checked ? 1 : 0)
        , 'overrideACInfo':document.querySelector('#OverrideACInfo').value
        , 'quotationTotal':calculateTotal()
        , 'scopeOfWork':document.querySelector('#ScopeOfWork').value
        , 'paymentMode':document.querySelector('#PaymentMode').value
        , 'jobStatus':document.querySelector('input[name=JobStatus]:checked').value
    }

    let index = 0;
    quotation_params.Items = [];
    for(let item of QuotationRowData) {
        quotation_params.Items.push({
            'quotationNo' : document.querySelector('#QuotationID').value
            , 'horsepower' : document.querySelector('#HorsePower').value
            , 'actype' : document.querySelector('#ACType').value
            , 'feature' : document.querySelector('#Feature').value
            , 'gastype' : document.querySelector('#Gas').value
            , 'brand' : document.querySelector('#Brand').value
            , 'modelIndoor' : document.querySelector('#ModelIndoor').value
            , 'modelOutdoor' : document.querySelector('#ModelOutdoor').value
            , 'actionID' : item.ActionID
            , 'unitPrice' : item.UnitPrice
            , 'unit' : item.Unit
            , 'uom' : item.UOM
        })
        index++;
    }

    let xmlhttp = new XMLHttpRequest();
    let url = "/forms/quotation-maint/new-quotation.php";

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

    for (let quotationItem of QuotationRowData) {
        if (quotationItem.Unit > 0) {
            let unitPrice = parseFloat(quotationItem.UnitPrice);
            let unitTotal = unitPrice * parseInt(quotationItem.Unit);
            totalPrice += unitTotal;
        }
    }

    let amt = document.querySelector('#refundAmount');
    let checkbox = document.querySelector('#hasRefund');
    if (checkbox.checked) {
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
		var jobStatusRB = document.getElementsByName('JobStatus');
		for (var i = 0; i < jobStatusRB.length; i++) {
			if (jobStatusRB[i].value == selectedHistory.JobStatus) {
				jobStatusRB[i].checked = true;
				break;
			}
		}
		
        if (!isEmptyString(selectedHistory.ScopeOfWork)) {
            document.querySelector('#ScopeOfWork').value = selectedHistory.ScopeOfWork;
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

        // Pre & Post Text
        let preTextLength = ActionPreText.length;
        for (let i = 0; i < preTextLength; i++) {
            removeTag(0, ActionPreText, hiddenInputPreText, preTextDiv);
        }
        let postTextLength = ActionPostText.length;
        for (let i = 0; i < postTextLength; i++) {
            removeTag(0, ActionPostText, hiddenInputPostText, postTextDiv);
        }
        mainInputPreText.value = selectedHistory.PreText + ',';
        mainInputPostText.value = selectedHistory.PostText + ',';
        onAddActionPreText();
        onAddActionPostText();


        document.querySelector('#quotationIntro').value = selectedHistory.StartWith;
        document.querySelector('#quotationEnding').value = selectedHistory.EndWith;
        let isACInfoOverride = selectedHistory.IsACInfoOverride == "0" ? false : true;
        document.querySelector('#isOverrideACInfo').checked = isACInfoOverride;
        if (isACInfoOverride) {
            document.querySelector('#OverrideACInfo').readOnly = false;
            document.querySelector('#OverrideACInfo').value = selectedHistory.ACInfoOverride;
        }
        else {
            document.querySelector('#OverrideACInfo').readOnly = true;
        }


        let selectedHistoryItems = HistoryDetailRowData.filter(detail => detail.QuotationNo == selectedHistory.QuotationNo);
        QuotationRowData = [];

        if (selectedHistoryItems.length > 0) {
            for (let item of selectedHistoryItems) {
                let newQuotationItem = {};
                let selectedAction = ActionRowData.find(action => action.ActionID == item.ActionID);
                if (selectedAction != undefined) {
                    newQuotationItem.ActionID = item.ActionID;
                    newQuotationItem.ActionName = item.Action;
                    newQuotationItem.Description = item.Description;
                    newQuotationItem.Unit = item.Unit;
                    newQuotationItem.UnitPrice = parseFloat(item.UnitPrice);
                    newQuotationItem.UOM = item.UOM;
                    QuotationRowData.push(newQuotationItem);
                }
            }
            if (QuotationRowData.length > 0) {
                QuotationGridOptions.api.setRowData(QuotationRowData);
            }
            document.querySelector('#HorsePower').value = selectedHistoryItems[0].HorsePower;
            document.querySelector('#ACType').value = selectedHistoryItems[0].ACType;
            document.querySelector('#Feature').value = selectedHistoryItems[0].Feature;
            document.querySelector('#Gas').value = selectedHistoryItems[0].GasType;
            document.querySelector('#Brand').value = selectedHistoryItems[0].Brand;
            document.querySelector('#ModelIndoor').value = selectedHistoryItems[0].ModelIndoor;
            document.querySelector('#ModelOutdoor').value = selectedHistoryItems[0].ModelOutdoor;
            updateSpan('HorsePowerSpan', 'HorsePower');
            updateSpan('ACTypeSpan', 'ACType');
            updateSpan('FeatureSpan', 'Feature');
        }

        this.externalHistoryFilterChanged();
    }
}


