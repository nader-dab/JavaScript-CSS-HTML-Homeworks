var controls = (function () {
    function Gallery(selector) {
        var items = [];
        var galleryElement = document.querySelector(selector);
        var imgHolder = document.createElement('div');

        galleryElement.addEventListener('click', function (ev) {
            if (!ev) ev = window.event;
            ev.stopPropagation();
            ev.preventDefault();

            var clickedItem = ev.target;
            console.log(clickedItem);
            if (!(clickedItem instanceof HTMLAnchorElement)) {
                return;
            }

            var node = clickedItem.parentNode;

            for (var i = 0; i < node.children.length; i++) {
                if (node.children[i] instanceof HTMLDivElement) {

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
            items.push(newImage);
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
    }

    function Album(title) {
        var items = [];

        var domItem = document.createElement('div');
        var anchor = document.createElement('a');
        anchor.href = '#';
        anchor.innerHTML = title;
        domItem.appendChild(anchor);
        domItem.className = "album-holder";

        this.addImage = function (title, source) {
            var newImage = new Image(title, source);
            items.push(newImage);
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
    }

    function Image(title, source) {
        var domItem = document.createElement('div');
        domItem.innerHTML = title;
        domItem.className = "image-holder";
        var imgItem = document.createElement('img');
        imgItem.src = source;
        domItem.appendChild(imgItem);

        this.render = function () {
            return domItem;
        }

    }

    return {
        getImageGallery: function (selector) {
            return new Gallery(selector);
        }
    }
}())