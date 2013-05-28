var controls = (function () {
    String.prototype.htmlEscape = function () {
        var escapedStr = String(this).replace(/&/g, '&amp;');
        escapedStr = escapedStr.replace(/</g, '&lt;');
        escapedStr = escapedStr.replace(/>/g, '&gt;');
        escapedStr = escapedStr.replace(/"/g, '&quot;');
        escapedStr = escapedStr.replace(/'/g, "&#39");
        return escapedStr;
    }

    function Gallery(selector) {
        var items = [];
        var galleryElement = document.querySelector(selector);
        var imgHolder = document.createElement('div');

        galleryElement.addEventListener('click', function (ev) {
            if (!ev) ev = window.event;
            ev.stopPropagation();
            ev.preventDefault();

            var clickedItem = ev.target;

            if (clickedItem instanceof HTMLImageElement) {
                var oldImage = document.querySelector('#large-image');
                if (oldImage) {
                    oldImage.parentNode.removeChild(oldImage);
                }

                var largeImage = clickedItem.cloneNode();
                largeImage.id = "large-image";
                largeImage.style.width ="300px";
                largeImage.style.height = "240px";
                largeImage.style.position = "absolute";
                largeImage.style.left = "70%";
                largeImage.style.top = "0px";
                document.body.appendChild(largeImage);
            }

            if (!(clickedItem instanceof HTMLAnchorElement)) {
                return;
            }

            var node = clickedItem.parentNode;

            for (var i = 0, len = node.children.length; i < len; i += 1) {
                if (!(node.children[i] instanceof HTMLAnchorElement)) {

                    if (node.children[i].style.display === "none") {
                        node.children[i].style.display = "";
                    } else {
                        node.children[i].style.display = "none";
                    }
                }
            }

        }, false);

        this.addImage = function (title, source) {
            var newImage = new Image(title, source);
            items.unshift(newImage);
            return newImage;
        }

        this.addAlbum = function (title) {
            var newAlbum = new Album(title);
            items.push(newAlbum);
            return newAlbum;
        }

        this.render = function () {
            while (galleryElement.firstChild) {
                galleryElement.removeChild(galleryElement.firstChild);
            }

            for (var i = 0, len = items.length; i < len; i += 1) {
                imgHolder.appendChild(items[i].render());
            }

            galleryElement.appendChild(imgHolder);
            return this;
        }

        this.serialize = function () {
            var serializedItems = [];
            for (var i = 0; i < items.length; i++) {
                serializedItems.push(items[i].serialize());
            }

            return serializedItems;
        }

        this.getImageGalleryData = function () {
            return this;
        }
    }

    function Album(title) {
        var items = [];

        var domItem = document.createElement('div');
        var anchor = document.createElement('a');
        anchor.href = '#';
        anchor.innerHTML = title.htmlEscape();
        domItem.appendChild(anchor);

        var button = document.createElement('input');
        button.type = "button";
        button.value = "sort";
        button.addEventListener('click', sort, false);
        domItem.appendChild(button);

        domItem.className = "album-holder";

        function sort (ev) {
            if (!ev) ev = window.event;
            ev.stopPropagation();
            ev.preventDefault();
            console.log("not implemented exception.");

            items = items.sort(function (a, b) {
                console.log(a.title);
                if (a.title < b.title) {
                    return -1;
                }

                if (a.title > b.title) {
                    return 1;
                }

                return 0;
            });
        }

        this.addImage = function (title, source) {
            var newImage = new Image(title, source);
            items.unshift(newImage);
            return newImage;
        }

        this.addAlbum = function (title) {
            var newAlbum = new Album(title);
            items.push(newAlbum);
            return newAlbum;
        }

        this.render = function () {

            if (items.length > 0) {

                for (var i = 0, len = items.length; i < len; i += 1) {
                    domItem.appendChild(items[i].render());
                }
            }
            return domItem;
        }

        this.serialize = function () {
            var thisItem = {
                title: title
            }

            if (items.length > 0) {
                var serializedItems = [];
                for (var i = 0; i < items.length; i++) {
                    serializedItems.push(items[i].serialize());
                }

                thisItem.items = serializedItems;
            }

            return thisItem;
        }

        this.title = title;
    }

    function Image(title, source) {
        var domItem = document.createElement('div');
        domItem.innerHTML = title.htmlEscape();
        domItem.className = "image-holder";
        var imgItem = document.createElement('img');
        imgItem.src = source.htmlEscape();
        domItem.appendChild(imgItem);

        this.render = function () {
            return domItem;
        }

        this.serialize = function () {
            var thisItem = {
                title: title,
                source: source
            }

            return thisItem;
        }

        this.title = title;
    }

    function addItem(item, subItem) {
        var self;
        if (subItem.source && item.addImage) {
            item.addImage(subItem.title, subItem.source);
            return;
        }
        if (item.addAlbum && subItem.title) {
            self = item.addAlbum(subItem.title);
        }
        
        if (subItem.items) {
            for (var i = 0; i < subItem.items.length; i++) {
                addItem(self, subItem.items[i]);
            }
        }

        return;
    }

    return {
        
        getImageGallery: function (selector) {
            return new Gallery(selector);
        },

        buildImageGallery: function (selector, imageGalleryData) {
            var gallery = new Gallery(selector);

            if (imageGalleryData.length > 0) {
                for (var i = 0, len = imageGalleryData.length; i < len; i+=1) {
                    addItem(gallery, imageGalleryData[i]);
                }
            }
            
            return gallery;
        }
    }
}())