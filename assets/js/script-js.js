function loadPageAddOnMouseEvents() {
    document.querySelectorAll('.tdStandard').forEach((node) => {
        node.onmouseover = applyEffect;
        node.onmouseout = applyEffect;
    });
}
function loadPageAddCollapsibleEvents() {
    var coll = document.getElementsByClassName('collapsible');
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener('click', function() {
            this.classList.toggle('active');
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    }
    var coll = document.getElementsByClassName('clickToCollapseElements');
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener('click', function() {
            var classOfElementsToCollapse = getCustomAttributeValue(this, 'classOfElementsToCollapse');
            var elementsToCollapse = document.getElementsByClassName(classOfElementsToCollapse);
            for (var j = 0; j < elementsToCollapse.length; j++) {
                var content = elementsToCollapse[j];
                content.classList.toggle('visibleElement');
            }
        });
    }
}
function applyEffect(event) {
    var element = event.target;
    var aggregatedId = element.id;
    var subIds = aggregatedId.split('-');
    var isElementMetric = getCustomAttributeValue(element, 'metric') == 'true';
    //var log = '';
    for (var i = 0; i < element.parentElement.children.length; i++) {
        var child = element.parentElement.children[i];
        for(var j = 0; j < subIds.length; j++) {
            var id = subIds[j];
            //log += child.id + '  vs  ' + id + '|' + child.id.includes(id) + '<br/>';
            var isChildElementMetric = getCustomAttributeValue(child, 'metric') == 'true';
            if(event.type == 'mouseover' && (element == child || !isElementMetric || !isChildElementMetric) && id.length > 0 && child.id.includes(id)) {
                child.className = 'tdMarked';
                break;
            } else {
                var isChildElementUpOfLimit = getCustomAttributeValue(child, 'upOfColumnLimit') == 'true';
                if(isChildElementUpOfLimit) {
                    child.className = 'tdLimitWarning';
                } else {
                    child.className = 'tdStandard';
                }
            }
        }
    }
    //console.log('Hello: ' + log);
}
function getCustomAttributeValue(element, attributeName) {
    if(element && element.hasAttribute(attributeName)) {
        return element.getAttribute(attributeName);
    } else {
        return "";
    }
}
function sortTable(columnIndex, tableId) {
    var table = document.getElementById(tableId);
    //var tbody = table.tBodies[0];
    var thead = table.querySelector("thead");
    var tbody = table.querySelector("tbody");
    var rows = Array.from(tbody.rows);

    // Toggle sort direction (simple version)
    var isAscending = table.getAttribute("data-sort-dir") === "desc";
    table.setAttribute("data-sort-dir", isAscending ? "desc" : "asc");

    var headers = thead.querySelectorAll("th");
    headers.forEach((header, index) => {
        header.classList.remove("sort-asc", "sort-desc");
        if(index == columnIndex) {
            header.classList.add(isAscending ? "sort-desc" : "sort-asc");
        }
    });

    rows.sort((rowA, rowB) => {
        var valA = rowA.cells[columnIndex].textContent.trim();
        var valB = rowB.cells[columnIndex].textContent.trim();

        // Check if numeric or string for better sorting
        return isAscending
            ? valA.localeCompare(valB, undefined, {numeric: true})
            : valB.localeCompare(valA, undefined, {numeric: true});
    });

    // Re-append rows in new order
    rows.forEach(row => tbody.appendChild(row));
}