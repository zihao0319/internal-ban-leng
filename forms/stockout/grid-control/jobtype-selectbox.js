// JobType Selection
function getJobTypeSelectBox() {
    // function to act as a class
    function JobTypeSelectBox() { }


    // gets called once before the renderer is used
    JobTypeSelectBox.prototype.init = function (params) {
        // create the cell
        var array = ["SUPPLY","INSTALL","INSTALL W/O PIPE","CONCEAL"];

        this.eInput = document.createElement('select');
        this.eInput.value = params.value;
        
        for (var i = 0; i < array.length; i++) {
            var option = document.createElement("option");
            option.value = array[i];
            option.text = array[i];
            this.eInput.appendChild(option);
        }
    };

    // gets called once when grid ready to insert the element
    JobTypeSelectBox.prototype.getGui = function () {
        return this.eInput;
    };

    // focus and select can be done after the gui is attached
    JobTypeSelectBox.prototype.afterGuiAttached = function () {
    };

    // returns the new value after editing
    JobTypeSelectBox.prototype.getValue = function () {
        return this.eInput.value;
    };

    // any cleanup we need to be done here
    JobTypeSelectBox.prototype.destroy = function () {
        // but this example is simple, no cleanup, we could
        // even leave this method out as it's optional
    };

    // if true, then this editor will appear in a popup
    JobTypeSelectBox.prototype.isPopup = function () {
        // and we could leave this method out also, false is the default
        return false;
    };

    return JobTypeSelectBox;
}