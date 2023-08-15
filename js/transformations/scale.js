// add drag scale events to the newly added circle handles
function addDragScaleEvent(circle) {
    //Add drag events
    circle.drag(dragScaleMove, dragScaleStart, dragScaleEnd);
}

// Store the initial transformation of the group
function dragScaleStart(x, y, event) {
    const group = this.data("group");
    if (isTransformValid(group)) {
        group.data(OT, group.transform().local);
    }
    removeAllHandlesFromGroup(group);
    group.data("initBBox", group.getBBox());
}

// Drag scale event, only update the scaling handles positions
// Drag scale event, only update the scaling handles positions
function dragScaleMove(dx, dy, x, y, event) {
    scaleElement(this, event, dx, dy);
}


// Apply the scaling transformation only when the drag ends
function dragScaleEnd(event) {
    const group = this.data("group");

    if (isTransformValid(group)) {
        group.data(OT, group.transform().local);
    }
    showAllHandlesForGroup(group);
}

function scaleElement(element, event, dx, dy) {
    // get the group
    const group = element.data("group");
    const shape = group.select(".shape");
    // get the group bounding box
    const bbox = group.data("initBBox");
    let rotation = group.transform().localMatrix.split().rotate;
    let handleClass = getHandleClass(element);
    const cornerHandleClasses = ["handle-0", "handle-2", "handle-5", "handle-7"];
    const topOrBottomHandleClasses = ["handle-1", "handle-6"];
    const leftOrRightHandleClasses = ["handle-3", "handle-4"];

    // determine which handle is being dragged
    const isCornerHandle = cornerHandleClasses.includes(handleClass);
    const isTopOrBottomHandle = topOrBottomHandleClasses.includes(handleClass);
    const isLeftOrRightHandle = leftOrRightHandleClasses.includes(handleClass);
    const smoothFactor = 500;
    const preserveAspectRatio = isCornerHandle;


    // calculate the scale factor, prevent scaling by 0
    let scaleFactorX = isCornerHandle || isLeftOrRightHandle ? dx / smoothFactor + 1 : 1;
    let scaleFactorY = isCornerHandle || isTopOrBottomHandle ? dy / smoothFactor + 1 : 1;

    // for corner handles, adjust the scale factor based on the direction of dragging
    if (isCornerHandle) {
        if (handleClass === 'handle-0' || handleClass === 'handle-5') {  // top-left or bottom-right
            scaleFactorX = dx < 0 ? 1 + Math.abs(dx) / smoothFactor : 1 - dx / smoothFactor;
            scaleFactorY = dy < 0 ? 1 + Math.abs(dy) / smoothFactor : 1 - dy / smoothFactor;
        } else {  // top-right or bottom-left
            scaleFactorX = dx > 0 ? 1 + dx / smoothFactor : 1 - Math.abs(dx) / smoothFactor;
            scaleFactorY = dy < 0 ? 1 + Math.abs(dy) / smoothFactor : 1 - dy / smoothFactor;
        }
    }

    // for top-middle, left-middle, bottom-left, and bottom-right handles, adjust the scale factor based on the direction of dragging
    rotation = rotation < 0 ? 360 + rotation : rotation;

    if (isTopOrBottomHandle) {
        scaleFactorY = calculateDelta(
            rotation,
            handleClass,
            dx,
            dy,
            isTopOrBottomHandle,
            isLeftOrRightHandle,
            smoothFactor
        );
    } else if (isLeftOrRightHandle) {
        scaleFactorX = calculateDelta(
            rotation,
            handleClass,
            dx,
            dy,
            isTopOrBottomHandle,
            isLeftOrRightHandle,
            smoothFactor
        );
    } else if (handleClass === 'handle-7') { //bottom-right
        scaleFactorX = calculateDelta(
            rotation,
            handleClass,
            dx,
            dy,
            isTopOrBottomHandle,
            isLeftOrRightHandle,
            smoothFactor
        );
    } else if (handleClass === 'handle-5') { //bottom-left
        scaleFactorX = calculateDelta(
            rotation,
            handleClass,
            dx,
            dy,
            isTopOrBottomHandle,
            isLeftOrRightHandle,
            smoothFactor
        );
    } else if (handleClass === 'handle-0') { //top-left
        scaleFactorX = calculateDelta(
            rotation,
            handleClass,
            dx,
            dy,
            isTopOrBottomHandle,
            isLeftOrRightHandle,
            smoothFactor
        );
    } else if (handleClass === 'handle-2') { //top-right
        scaleFactorX = calculateDelta(
            rotation,
            handleClass,
            dx,
            dy,
            isTopOrBottomHandle,
            isLeftOrRightHandle,
            smoothFactor
        );
    }

    // prevent scaling by 0 or less
    const minScale = 0.01;
    const maxScale = 10; // Adjust this value based on your requirements
    let scaleX = parseFloat(Math.min(Math.max(scaleFactorX, minScale), maxScale));
    let scaleY = parseFloat(Math.min(Math.max(scaleFactorY, minScale), maxScale));

    // prevent bad transformation matrix
    if (isNaN(scaleX) || isNaN(scaleY) || isNaN(bbox.cx) || isNaN(bbox.cy)) {
        return;
    }

    if (scaleX <= minScale || scaleX >= maxScale || scaleY <= minScale || scaleY >= maxScale) {
        return;
    }

    // get the initial transformation matrix
    const origTransform = group.data(OT);
    var newTransform = "";
    // calculate the new transformation matrix
    if (preserveAspectRatio) {
        newTransform = origTransform + (origTransform ? "S" : "s") + [scaleX, scaleX, bbox.cx, bbox.cy];
    } else {
        newTransform = origTransform + (origTransform ? "S" : "s") + [scaleX, scaleY, bbox.cx, bbox.cy];
    }

    // apply the new transformation matrix
    group.transform(newTransform);

}
