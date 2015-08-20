ui._files = (function(){

    var view, eUploadFile, eFileBlueprint, eFiles, eSearch, eSearchBox, eAddAscii;

    function init(){
        view = $("#files");
		eRenterPrice = view.find(".renter-price");
		eRenterHostCount = view.find(".renter-host-count");
        eUploadFile = view.find(".upload-public");
        eFileBlueprint = view.find(".file.blueprint");
        eSearchBox = view.find(".search");
        eSearch = view.find(".search .text");
        eAddAscii = view.find(".add-ascii");
        eFiles = $();

        addEvents();
    }

    function addEvents(){
        eUploadFile.click(function(e){
            ui._uploadFile.setPrivacy("public");
            ui.switchView("upload-file");
        });
        eSearch.keydown(function(e){
            if (e.keyCode == 13){
                e.preventDefault();
            }
            updateFileList(lastLoadedFiles);
        });
        eSearchBox.click(function(e){
            eSearch.focus();
            updateFileList(lastLoadedFiles);
        });
        eAddAscii.click(function(e){
            ui.switchView("add-ascii");
        });
    }

    var lastLoadedFiles = [];
    function update(data){
        if (data.file.Files && fileListHasImportantChanges(data.file.Files, lastLoadedFiles)){
            updateFileList(data.file.Files);
            updateFilePrice(data.filePrice);
            updateHostCount(data.hostCount);
        }
    }

    function onViewOpened(data){
        if (data.file.Files){
            updateFileList(data.file.Files);
            updateFilePrice(data.filePrice);
            updateHostCount(data.hostCount);
        }
        eSearch[0].innerHTML = "";
    }

    function getSearchValue(){
        return eSearch[0].innerHTML;
    }

    function hashFileList(flist){
        flist = sortFileList(flist);
        return flist.map(function(file){
            return file.Nickname + file.Available.toString() + file.UploadProgress;
        }).join("");
    }

    function sortFileList(flist){
        return flist.sort(function(a,b){
            var sa = a.Nickname + a.Available.toString();
            var sb = b.Nickname + b.Available.toString();
            if (sa < sb) return -1;
            if (sb < sa) return 1;
            return 0;
        });
    }

    function fileListHasImportantChanges(a,b){
        // we only care about availability and names
        return hashFileList(a) != hashFileList(b);
    }

    function updateFileList(files){
        lastLoadedFiles = sortFileList(files);
        eFiles.remove();
        var newFileElements = [];
        var searchValue = getSearchValue();
        files.forEach(function(fileObject){
            var fileNickname = fileObject.Nickname;
            if (!searchValue || fileNickname.indexOf(searchValue)!=-1){
                var blocksRemaining = fileObject.TimeRemaining;
                var eFile = eFileBlueprint.clone().removeClass("blueprint");
                var available = fileObject.Available;
				var shortName = fileNickname;
				if (fileNickname.length > 30) {
					shortName = fileNickname.substr(0,27) + "...";
				}
                eFile.find(".name").text(shortName);
                eFile.find(".size").text(util.formatBytes(fileObject.Filesize));
                if (fileObject.UploadProgress == 0) {
                    eFile.find(".time").text("Processing...");
                } else if (fileObject.UploadProgress < 100) {
                    eFile.find(".time").text(fileObject.UploadProgress.toFixed(2) + "%");
                } else {
                	eFile.find(".time").text(blocksRemaining + " Blocks Remaining"); //TODO this unit is bad
				}
                if (fileObject.Repairing){
                    eFile.find(".graphic i").removeClass("fa-file").addClass("fa-wrench");
                }else{
                    eFile.find(".graphic i").removeClass("fa-wrench").addClass("fa-file");
                }
                if (available){
                    eFile.find(".available").find(".yes").show();
                    eFile.find(".available").find(".no").hide();
                }else{
                    eFile.find(".available").find(".yes").hide();
                    eFile.find(".available").find(".no").show();
                }
                eFileBlueprint.parent().append(eFile);
                newFileElements.push(eFile[0]);
                eFile.find(".download").click(function(){
                    ui._trigger("download-file", fileNickname);
                });
                eFile.find(".share").click(function(){
                    ui._trigger("share-file", fileNickname);
                });
                eFile.find(".delete").click(function(){
                    ui._trigger("delete-file", fileNickname);
                });
            }
        });
        eFiles = $(newFileElements);
    }

    function updateFilePrice(filePrice){
        eRenterPrice.text("Estimated Price Per GB: " + util.siacoin(filePrice).toFixed(5) + " KS");
    }
    function updateHostCount(hostCount){
        eRenterHostCount.text("Known Hosts: " + hostCount);
    }

    return {
        init:init,
        update: update,
        onViewOpened: onViewOpened
    };
})();
