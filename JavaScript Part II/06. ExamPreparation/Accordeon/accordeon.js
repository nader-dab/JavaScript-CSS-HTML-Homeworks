var controls = (function () {
    function Accordeon(selector) {
        var items = [];
        var accordeonElement = document.querySelector(selector);
        var ul = document.createElement('ul');

        function hidePrev(item) {
            var node = item.previousElementSibling;
            while (node) {
                if (node.querySelector("ul")) {
                    node.querySelector("ul").style.display = "none";
                }
                
                node = node.previousElementSibling;
            }
        }

        function hideNext(item) {
            var node = item.nextElementSibling;
            while (node) {
                if(node.querySelector("ul")){
                    node.querySelector("ul").style.display = "none";
                }

                node = node.nextElementSibling;
            }
        }

        accordeonElement.addEventListener('click', function (ev) {
            if (!ev) ev = window.event;
            ev.stopPropagation();
            ev.preventDefault();

            var clickedItem = ev.target;

            if (!(clickedItem instanceof HTMLAnchorElement)) {
                return;
            }

            hidePrev(clickedItem.parentNode);
            hideNext(clickedItem.parentNode);

            var sublist = clickedItem.nextElementSibling;

            if (!sublist) {
                return;
            }

            if (sublist.style.display === "none") {
                sublist.style.display = "";
            } else {
                sublist.style.display = "none";
            }

        }, false);

        this.add = function (title) {
            var newItem = new Item(title);
            items.push(newItem);
            return newItem;
        }

        this.render = function () {

            while (accordeonElement.firstChild) {
                accordeonElement.removeChild(accordeonElement.firstChild);
            }

            for (var i = 0, len = items.length; i < len; i+=1) {
                ul.appendChild(items[i].render());
            }

            accordeonElement.appendChild(ul);
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

    function Item(title) {
        var items = [];
        var domItem = document.createElement('li');
        var hyperLink = document.createElement('a');
        hyperLink.innerHTML = title;
        hyperLink.href = "#";
        domItem.appendChild(hyperLink);

        this.add = function (title) {
            var newItem = new Item(title);
            items.push(newItem);
            return newItem;
        }

        this.render = function () {
            if (items.length > 0) {

                var subItem = document.createElement('ul');
                subItem.style.display = "none";
                for (var i = 0, len = items.length; i < len; i+=1) {
                    subItem.appendChild(items[i].render());
                }

                domItem.appendChild(subItem);
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
    }

    function addItem(item, newItem) {
        var accItem = item.add(newItem.title);
        if (newItem.items) {
            for (var i = 0; i < newItem.items.length; i++) {
                addItem(accItem, newItem.items[i]);
            }
        }
    }

    return {
        getAccordeon: function (selector) {
            return new Accordeon(selector);
        },

        getDeserializedAccordeon: function (selector, data) {
            var acc = this.getAccordeon(selector);

            if (data > 0) {
                for (var i = 0; i < data.length; i++) {
                    addItem(acc, data[i]);
                }
            }
            
            return acc;
        }
    }
}());