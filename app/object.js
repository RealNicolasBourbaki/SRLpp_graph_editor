/**
 * @author Nianheng Wu
 * Script that deals with objects(node, label, edge).
 */

/**
 * Draws a graph node at given position
 * @param {x position} x 
 * @param {y position} y 
 */
var drawNode = function (x, y) {
    var w = 400;
    var h = 200;
    var node = document.createElementNS(svgns, 'g');
    var roundRect = drawRoundRect(x, y, w, h, 5, 'white', 'black', 1.5);
    var mutator = drawMutator(x, y, w, h);
    var loop = drawHalfCircle(x,y, 20);
    loop.setAttribute('visibility', 'hidden');
    var terminal = drawRoundRect(x, y, 40, 20, 5, 'transparent', 'black', 1.5);
    terminal.setAttribute('visibility', 'hidden');

    var text;
    var recycledId = getReusableId();
    var isFF = typeof InstallTrigger !== 'undefined';
    var yShifted = isFF ? y+5 : y;
    if (recycledId >= 0) {
        node.setAttribute('id', recycledId);
        addVertex(recycledId, node);
        text = drawText(x + w/2, yShifted + h/2, recycledId);
    } else {
        node.setAttribute('id', serialId);
        addVertex(serialId, node);
        text = drawText(x + w/2, yShifted + h/2, serialId);
        serialId += 1;
    }

    node.appendChild(roundRect);
    node.appendChild(text);
    node.appendChild(mutator);
    node.appendChild(loop);
    node.appendChild(terminal);
    node.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    node.setAttribute('onmousedown', 'selectNode(evt)');
    node.setAttribute('class', 'node');
    node.setAttribute('onmouseover', 'hoverElement(evt)');
    node.setAttribute('onmouseout', 'outElement(evt)');
    node.setAttribute('rx', 5);
    node.setAttribute('width', w);
    node.setAttribute('height', h);
    node.setAttribute('diff', 0);
    node.setAttribute('position-x', x);
    node.setAttribute('position-y', y);
    node.setAttribute('origin-x', x);
    node.setAttribute('origin-y', y);

    return node;
};

/**
 * Draws mutators(scaler and linker) at given position
 * @param {x position} x 
 * @param {y position} y
 * @param {w weight} w
 * @param {h height} h
 */
var drawMutator = function (x, y, w, h) {
    var mutator = document.createElementNS(svgns, 'g');
    var scaler = drawScaler(x, y, w, h);
    var linker = drawLinker(x+w/2, y+h/2);
    mutator.appendChild(scaler);
    mutator.appendChild(linker);
    mutator.setAttribute('id', 'mutator');
    return mutator;
};

/**
 * Draws a linker at given position.
 * @param {x position} x 
 * @param {y position} y 
 */
var drawLinker = function (x, y) {
    var linker = drawRoundRect(x, y, 12, 12, 6, 'rgb(0,255,0)', 'black', 0.5);
    linker.setAttribute('class', 'linker');
    linker.setAttribute('onmousedown', 'selectLinker(evt)');

    return linker;
};

/**
 * Draws 4 scaler nodes at given position
 * @param {x position} x 
 * @param {y position} y
 */
var drawScaler = function (x, y, w, h) {
    var scaler = document.createElementNS(svgns, 'g');
    var scaleCircle1 = drawScalerNode(x + w, y + h, 'se');
    var scaleCircle2 = drawScalerNode(x, y, 'nw');
    var scaleCircle3 = drawScalerNode(x + w, y, 'ne');
    var scaleCircle4 = drawScalerNode(x, y + h, 'sw');
    var line1 = drawDashedLine(x, y, x + w, y, [2, 2], 2, 'rgb(0,122,255)');
    var line2 = drawDashedLine(x, y, x, y + h, [2, 2], 2, 'rgb(0,122,255)');
    var line3 = drawDashedLine(x + w, y, x + w, y + h, [2, 2], 2, 'rgb(0,122,255)');
    var line4 = drawDashedLine(x, y + h, x + w, y + h, [2, 2], 2, 'rgb(0,122,255)');
    scaler.appendChild(scaleCircle1);
    scaler.appendChild(scaleCircle2);
    scaler.appendChild(scaleCircle3);
    scaler.appendChild(scaleCircle4);
    line1.setAttribute('id', 'n');
    line2.setAttribute('id', 'w');
    line3.setAttribute('id', 'e');
    line4.setAttribute('id', 's');
    scaler.appendChild(line1);
    scaler.appendChild(line2);
    scaler.appendChild(line3);
    scaler.appendChild(line4);
    scaler.setAttributeNS(null, 'id', 'scaler');
    return scaler;
};

/**
 * Draws a scaler node at given position. The id of
 * scaler node represents its direction.
 * @param {x position} x 
 * @param {y position} y 
 * @param {scaler node id} id 
 */
var drawScalerNode = function (x, y, id) {
    var scaleRoundRect = drawRoundRect(x, y, 10, 10, 5, 'rgb(0,122,255)', 'white', 0.5);
    scaleRoundRect.setAttribute('onmousedown', 'selectScaler(evt)');
    scaleRoundRect.setAttribute('class', 'scale-node');
    scaleRoundRect.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    scaleRoundRect.setAttribute('id', id);
    return scaleRoundRect;
};

/**
 * Draws a label at given position
 * @param {x position} x 
 * @param {y position} y 
 */
var drawLabel = function (x, y) {
    var label = document.createElementNS(svgns, 'g');
    var text = drawText(x, y, '');
    text.setAttribute('font-size', 20);
    text.setAttribute('editable', 'true');
    var markerRect = drawRect(x, y, 0, 0);
    var input = drawInputBox(x, y, 0, 0);
    input.setAttribute('visibility', 'hidden');
    input.setAttribute('onmouseover', 'hoverElement(evt)');
    input.setAttribute('onmouseout', 'outElement(evt)');
    label.setAttribute('cursor', 'move');
    label.appendChild(text);
    label.appendChild(markerRect);
    label.appendChild(input);
    label.setAttribute('class', 'label');
    label.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    label.setAttribute('onmousedown', 'selectLabel(evt)');
    label.setAttribute('onmouseover', 'hoverElement(evt)');
    label.setAttribute('onmouseout', 'outElement(evt)');
    label.setAttribute('ondblclick', 'editLabel(evt)');
    label.setAttribute('position-x', x);
    label.setAttribute('position-y', y);
    label.setAttribute('origin-x', x);
    label.setAttribute('origin-y', y);
    return label;
};

/**
 * Check if object is a Node
 * @param {object} e 
 */
var isNode = function (e) {
    if (e.getAttribute('class') == 'node') {
        return true;
    } else {
        return false;
    }
};

/**
 * Check if object is an edge
 * @param {object} e 
 */
var isEdge = function (e) {
    if (e.getAttribute('class') == 'edge') {
        return true;
    } else {
        return false;
    }
};

/**
 * Check if object is a label
 * @param {object} e 
 */
var isLabel = function (e) {
    if (e.getAttribute('class') == 'label'){
        return true;
    } else {
        return false;
    }
};