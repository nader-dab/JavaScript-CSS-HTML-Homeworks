var imageGalleryRepository = (function () {
    if (!Storage.prototype.setObject) {
        Storage.prototype.setObject = function setObject(key, obj) {
            var jsonObj = JSON.stringify(obj);
            this.setItem(key, jsonObj);
        }
    }
    if (!Storage.prototype.getObject) {
        Storage.prototype.getObject = function getObject(key) {
            var jsonObject = this.getItem(key);
            var obj = JSON.parse(jsonObject);
            return obj;
        }
    }

    function save(destination, gallery) {
        var serializedGallery = gallery.serialize();
        localStorage.setObject(destination, serializedGallery);
    }

    function load(destination) {
        var gallery = localStorage.getObject(destination);
        return gallery;
        
    }

    return {
        save: save,
        load: load
    }

}())