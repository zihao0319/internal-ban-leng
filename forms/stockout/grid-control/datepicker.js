// Date Picker
function getDatePicker() {
    // function to act as a class
    function Datepicker() { }

    // gets called once before the renderer is used
    Datepicker.prototype.init = function (params) {
        // create the cell
        this.eInput = document.createElement('input');
        this.eInput.value = params.value;
        this.eInput.classList.add('ag-input-field-input');
        this.eInput.type = "date";

        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        if(!this.eInput.value) {
            var today = new Date(new Date() - tzoffset);
            this.eInput.value = today.toISOString().substr(0, 10);
        }
        // https://jqueryui.com/datepicker/
        // $(this.eInput).datepicker({
        //     dateFormat: 'yy-mm-dd',
        // });
    };

    // gets called once when grid ready to insert the element
    Datepicker.prototype.getGui = function () {
        return this.eInput;
    };

    // focus and select can be done after the gui is attached
    Datepicker.prototype.afterGuiAttached = function () {
        this.eInput.focus();
        this.eInput.select();
    };

    // returns the new value after editing
    Datepicker.prototype.getValue = function () {
        return this.eInput.value;
    };

    // any cleanup we need to be done here
    Datepicker.prototype.destroy = function () {
        // but this example is simple, no cleanup, we could
        // even leave this method out as it's optional
    };

    // if true, then this editor will appear in a popup
    Datepicker.prototype.isPopup = function () {
        // and we could leave this method out also, false is the default
        return false;
    };

    return Datepicker;
}