ui._uploadFile = ui["_upload-file"] = (function(){

    var view, eDescription, eSubmit, eFileName, eStep2, eStep3;

    var privacyType; // "public" or "private"

    function init(){
        view = $("#upload-file");
        eDescription = view.find(".description-field");
        eSubmit = view.find(".button.upload");
        eFileName = view.find(".file-upload-filename");
        eStep2 = view.find(".step2");
        eStep3 = view.find(".step3");

        addEvents();
    }

    function addEvents(){
        //TODO: Abstract server call logic to controller
        $(function(){
            $("#fileupload").fileupload({
                datatype: "plaintext",
                add: function(e, data){
                    eFileName.text(data.files[0].name);
                    var filePath = data.files[0].path;
                    eDescription.val(data.files[0].name);
                    eStep2.slideDown();
                    eStep3.slideDown();
                    view.find(".button.upload").off("click").click(function(){
                        var nickname = eDescription.val();
                        ui._trigger("upload-file", filePath, nickname);
                        controller.addDataListener("file", function(data){
                            return data.file.Files.some(function(file){
                                if (file.Nickname == nickname && file.Available){
                                    ui.notify("\"" + nickname +"\" Uploaded!","success");
                                    return true;
                                }
                                return false;
                            });
                        });
                        ui.switchView("files");
                    });
                },
                done: function(e, data){
                    console.log(data._response.result);
                    ui.notify("File upload started", "sent");
                },
                error: function(err){
                    console.log(arguments);
                    ui.notify("Error uploading: " + err.responseText, "error");
                }
            });
        });

        view.find(".back.button").click(function(){
            ui.switchView("files");
        });
    }

    function setPrivacy(_privacyType){
        privacyType = _privacyType;
    }

    function onViewOpened(data){
        eFileName.text("No File Selected");
        eDescription.val("");
        eStep2.hide();
        eStep3.hide();
    }


    return {
        init: init,
        setPrivacy: setPrivacy,
        onViewOpened: onViewOpened
    };
})();
