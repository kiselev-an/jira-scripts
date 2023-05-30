function loadPage() {
    document.querySelectorAll('.tdStandard').forEach((node) => {
        node.onmouseover = applyEffect;
        node.onmouseout = applyEffect;
    });
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
}
function applyEffect(event) {
    //"alert('Hello: ' + event.target.parentElement.children);
    var aggregatedId = event.target.id;
    var subIds = aggregatedId.split('-');
    var log = '';
    for (var i = 0; i < event.target.parentElement.children.length; i++) {
        var child = event.target.parentElement.children[i];
        for(var j = 0; j < subIds.length; j++) {
            var id = subIds[j];
            log += child.id + '  vs  ' + id + '|' + child.id.includes(id) + '<br/>';
            if(event.type == 'mouseover' && id.length > 0 && getCustomAttributeValue(child, 'metric') != 'true' && child.id.includes(id)) {
                child.className = 'tdMarked';
                break;
            } else {
                child.className = 'tdStandard';
            }
        }
    }
    console.log('Hello: ' + log);
}
function getCustomAttributeValue(element, attributeName) {
    if(element && element.hasAttribute(attributeName)) {
        return element.getAttribute(attributeName);
    } else {
        return "";
    }
}