// Model Selection
function getModelSelectBox() {
    // function to act as a class
    function ModelSelectBox() { }

    // gets called once before the renderer is used
    ModelSelectBox.prototype.init = function (params) {
        // create the cell
        this.eInput = document.createElement('input');
        this.eInput.value = params.value;
        this.eInput.classList.add('ag-input-field-input');

        $(this.eInput).autocomplete({
            source: models
        });
    };

    // gets called once when grid ready to insert the element
    ModelSelectBox.prototype.getGui = function () {
        return this.eInput;
    };

    // focus and select can be done after the gui is attached
    ModelSelectBox.prototype.afterGuiAttached = function () {
    };

    // returns the new value after editing
    ModelSelectBox.prototype.getValue = function () {
        return this.eInput.value;
    };

    // any cleanup we need to be done here
    ModelSelectBox.prototype.destroy = function () {
        // but this example is simple, no cleanup, we could
        // even leave this method out as it's optional
    };

    // if true, then this editor will appear in a popup
    ModelSelectBox.prototype.isPopup = function () {
        // and we could leave this method out also, false is the default
        return false;
    };

    return ModelSelectBox;
}