'use strict';

// Confirm file deletion
eID('delete-file').onclick = function() {
	var nickname = eID('confirm-delete').querySelector('.nickname').innerHTML;
	deleteFile(nickname);
	hide('confirm-delete');
};
eID('cancel-delete').onclick = function() {
	hide('confirm-delete');
};

