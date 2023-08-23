
const installPreText = 'To supply and installation of new ...\n';
const installPostText = 'Note:\n1. Price valid until stock lasts.\n2. No customer gift is included.\n3. Price inclusive surface installation of 10ft 0.61mm copper piping, ½" thickness premium insulation, 100% pure copper wiring, and drainage piping to the drainage point.\n4. Any extra piping will be charged separately as follows: 1HP(RM18/ft), 1.5HP&2HP (RM20/ft), 2.5HP&3HP (RM25/ft) \n5. Full Payment upon confirmation. \n6. Order only recognized upon payment. May contact salesperson to proceed payment.  \n7. Risk assessment will be carried out. Company reserve the right, at its discretion, to cancel, modify, add or remove portions of the quotation at anytime as if the risk level is high.';
const supplyPreText = 'To supply of new ...\n';
const supplyPostText = 'Note:\n1. Price valid until stock lasts.\n2. No customer gift is included.\n3. Installation fee is not included in quotation.\n4. Full Payment upon confirmation. \n5. Order recognized upon payment. May contact salesperson to proceed payment.'
const nopipePreTextA = 'A. To supply of new...\n';
const nopipePreTextB = 'B. To supply labour and tool for installation of ...\n';
const nopipePostText = 'Note:\n1. Price valid until stock lasts\n2. No customer gift is included.\n3. Price exclusive surface installation of copper piping, insulation, copper wiring, and drainage piping (This is given that your premise already has air cond piping installed.)\n4. Full Payment upon confirmation. \n5. Order only recognized upon payment. May contact salesperson to proceed payment.';
const concealPreTextA = 'A. To supply labour & tool for concealing of\n';
const concealPreTextB = 'B. To supply of new ...\n';
const concealPreTextC = 'C. To supply labour and tool for installation of ...\n';
const concealPostText = 'Note:\n1. Job A: Price inclusive concealed installation of 10ft 0.61mm copper piping, ½" thickness premium insulation, 100% pure copper wiring, and drainage piping to the drainage point.\n2. Job A: Any extra piping will be charged separately as follows: 1HP(RM18/ft), 1.5HP&2HP (RM20/ft), 2.5HP&3HP (RM25/ft).\n3. Job C: install the air cond indoor & outdoor unit, testing & commisioning of each system, vacuum to the sytem and fill in with refrigerant gas, and testing in a good condition.\n4. Installation of air cond point is not included.\n5. Installation of Incoming wiring & air cond starter panel is not included\n6. Price valid until stock lasts.\n7. No customer gift is included.\n8. Full Payment upon confirmation.  \n9. Order only recognized upon payment. May contact salesperson to proceed payment.\n10. Risk assessment will be carried out. Company reserve the right, at its discretion, to cancel, modify, add or remove portions of the quotation at anytime as if the risk level is high.'

var rowData = [];

const columnDefs = [{
    headerName: 'Model',
    field: 'Model'
},
{
    headerName: 'Unit',
    field: 'Unit',
    editable: true
},
{
    headerName: 'Product Name',
    field: 'Product'
},
{
    headerName: 'Brand',
    field: 'Brand'
},
{
    headerName: 'BTU',
    field: 'BTU'
},
{
    headerName: 'Category',
    field: 'Category'
},
{
    headerName: 'Aircond price',
    field: 'PriceAC'
},
{
    headerName: 'W Install price',
    field: 'Price'
},
{
    headerName: 'Install price',
    field: 'Install'
},
{
    headerName: 'Conceal price',
    field: 'PriceConceal'
}
];

const gridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true
    },
    columnDefs: columnDefs,
    rowData: rowData,
    onFirstDataRendered: autoSizeAll,
    isExternalFilterPresent: (() => { return true; }),
    doesExternalFilterPass: ((node) => {
        // !node.data.IsObsolete;
        return (eObsolete.checked == true || !node.data.IsObsolete) && (eHotItem.checked == false || node.data.IsSellerPick)
    })
};
const eGridDiv = document.querySelector('#myGrid');
const eTextArea = document.querySelector('#quotationText');
const eObsolete = document.querySelector('#obsoleteCB');
const eHotItem = document.querySelector('#hotitemCB');
eTextArea.textContent = '';
new agGrid.Grid(eGridDiv, gridOptions);


function requestData() {
    var xmlhttp = new XMLHttpRequest();
    var url = "/forms/price-inquiry/price-inquiry.php";

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

function receiveData(response) {
    try {
        rowData = JSON.parse(response);
        gridOptions.api.setRowData(rowData);
        gridOptions.api.onFilterChanged();
    }
    catch (e) {
        location.href = '/';
    }

}

document.addEventListener('DOMContentLoaded', this.requestData);


function autoSizeAll() {
    var allColumnIds = [];
    gridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    gridOptions.columnApi.autoSizeColumns(allColumnIds);
}

function RefundedCellRenderer(params) {
    return params.value;
}

function generateText(mode) {
    let rows = rowData.filter(value => parseInt(value.Unit) > 0);

    let generatedText = '';
    if (rows.length > 0) {
        let preText = installPreText;
        if (mode == 'supply') {
            preText = supplyPreText;
        }
        generatedText = preText;

        // Get selected brands
        let brands = [];
        for (let ac of rows) {
            if (!brands.some(value => value == ac.Brand)) {
                brands.push(ac.Brand);
            }
        }

        // Air cond details
        let total = 0;
        for (let brand of brands) {
            generatedText += ('Brand: ' + brand + '\n');
            let brandrows = rows.filter(value => value.Brand == brand);
            let index = 1;

            for (let ac of brandrows) {
                let itemtotal = ((mode == 'supply') ? ac.PriceAC : ac.Price) * parseInt(ac.Unit);
                let text = index + '. ' +
                    ac.Product + ' @ ' +
                    ac.Model + ' ( ' +
                    'BTU ' + ac.BTU + ' ) ' +
                    'RM' + ((mode == 'supply') ? ac.PriceAC : ac.Price) + ' x ' +
                    ac.Unit + ' = ' +
                    'RM' + itemtotal +
                    '\n';
                generatedText += text;
                total += itemtotal;
                index++;
            }
            generatedText += '\n';
        }

        // Total and notes
        let totalText = 'Total = RM' + total + '\n\n';
        generatedText += totalText;
        let postText = installPostText;
        if (mode == 'supply') {
            postText = supplyPostText;
        }
        generatedText += postText + '\n\n';
    }

    eTextArea.value = generatedText;

}

function generateTextLabour(mode) {
    let rows = rowData.filter(value => parseInt(value.Unit) > 0);

    let generatedText = '';
    if (rows.length > 0) {
        let total = 0;

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
        let index = 1;
        let subtotal = 0;
        if (mode == 'conceal') {
            generatedText = concealPreTextA;

            for (let category of categories) {
                let itemtotal = category.PriceConceal * parseInt(category.Unit);
                let text = index + '. ' +
                    category.Category + ' @ ' +
                    'RM ' + category.PriceConceal +
                    ' x ' + category.Unit + ' = ' +
                    'RM ' + itemtotal + '\n';
                generatedText += text;
                subtotal += itemtotal;
                index++;
            }
            generatedText += ('Subtotal = RM ' + subtotal + '\n\n');
            total += subtotal;
        }

        // Air cond details
        generatedText += (mode == 'conceal' ? concealPreTextB : nopipePreTextA);
        subtotal = 0;
        for (let brand of brands) {
            generatedText += ('Brand: ' + brand + '\n');
            let brandrows = rows.filter(value => value.Brand == brand);
            index = 1;

            for (let ac of brandrows) {
                let itemtotal = ac.PriceAC * parseInt(ac.Unit);
                let text = index + '. ' +
                    ac.Product + ' @ ' +
                    ac.Model + ' ( ' +
                    'BTU ' + ac.BTU + ' ) ' +
                    'RM' + ac.PriceAC + ' x ' +
                    ac.Unit + ' = ' +
                    'RM' + itemtotal +
                    '\n';
                generatedText += text;
                subtotal += itemtotal;
                index++;
            }
            generatedText += '\n';
        }
        generatedText += 'Subtotal = RM' + subtotal + '\n\n';
        total += subtotal;

        // Labour charges details
        index = 1;
        subtotal = 0;
        generatedText += (mode == 'conceal' ? concealPreTextC : nopipePreTextB);
        for (let category of categories) {
            let itemtotal = category.Install * parseInt(category.Unit);
            let text = index + '. ' +
                category.Category + ' @ ' +
                'RM ' + category.Install +
                ' x ' + category.Unit + ' = ' +
                'RM ' + itemtotal + '\n';
            generatedText += text;
            subtotal += itemtotal;
            index++;
        }
        generatedText += ('Subtotal = RM ' + subtotal + '\n\n');
        total += subtotal;

        // Total & Notes
        generatedText += ('Total = RM ' + total + '\n\n');

        generatedText += ((mode == 'conceal' ? concealPostText : nopipePostText) + '\n\n');
    }

    eTextArea.value = generatedText;
}

function clearText() {
    eTextArea.value = '';
}

function copyText() {
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        var el = eTextArea;
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
        eTextArea.select();
    }
    document.execCommand('copy');
    eTextArea.blur();
}

function onObsoleteCBChanged() {
    gridOptions.api.onFilterChanged();
}

function onHotItemCBChanged() {
    gridOptions.api.onFilterChanged();
}