ui["_add-ascii"] = ui._addAscii = (function(){

    var eAddFile, eTextArea, view;

    function init(){
        view = $("#add-ascii");
        eAddFile = view.find(".add-file");
        eTextArea = view.find(".ascii-text");
        addEvents();
    }

    function addEvents(){
        eAddFile.click(function(){
            if (eTextArea.val().length > 50){
                ui._trigger("add-ascii-file", eTextArea.val());
                ui.switchView("files");
            }else{
                ui.notify("Paste valid Ascii File (too short)", "error");
            }
        });
        view.find(".back.button").click(function(){
            ui.switchView("files");
        });
    }

    function onViewOpened(){
        eTextArea.val("");
    }

    return {
        init: init,
        onViewOpened: onViewOpened
    }
})();
