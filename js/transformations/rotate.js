// Description: Rotate Snap svg elements.

// add drag rotate events to the newly added arrow
function addDragRotateEvent(arrow) {

    //Add drag events
    arrow.drag(dragRotateMove, dragRotateStart, dragRotateEnd);

}

// on drag start, save the initial angle
function dragRotateStart(x, y, event) {
    this.data("firstDrag", true);
    removeAllHandlesFromGroup(this.data("group"));
}

function dragRotateMove(dx, dy, x, y, event) {
    rotateElement(this, event);
}

function dragRotateEnd(event) {
    const group = this.data("group");
    if (isTransformValid(group)) {
        group.data(OT, group.transform().local);
    }
    showAllHandlesForGroup(group);

}

function rotateElement(element, event) {
    const group = element.data("group");
    const el = group.select(".shape").node;
    const position = el.getBoundingClientRect();

    const x = event.x;
    const y = event.y;

    const isFirstDrag = element.data("firstDrag") === true;

    const xx = x - (position.x + position.width / 2);
    const yy = position.y + position.height / 2 - y;
    const currentAngle = Math.atan(xx / yy) * (180 / Math.PI) + (yy < 0 ? 180 : 0);

    let initialAngle = group.data("initialAngle") || 0;

    if (isFirstDrag) {
        //handle first mouse drag that always jumps to a strange angle
        initialAngle = currentAngle;
        element.data("firstDrag", false);
    }

    var angle = currentAngle - initialAngle;

    group.data("initialAngle", currentAngle);

    rotateClockWise(group, angle);
}


function rotateClockWise(group, dragValue) {

    let incrementalValue = 1;

    if (dragValue !== undefined) {
        incrementalValue = dragValue;
    }
    const bbox = group.getBBox(1);
    // get the initial transformation matrix
    const origTransform = group.transform().localMatrix;
    const currentScaleX = origTransform.split().scalex;
    const currentScaleY = origTransform.split().scaley;

    // calculate the inverse scale
    const inverseScaleX = 1 / currentScaleX;
    const inverseScaleY = 1 / currentScaleY;

    // apply the inverse scale to "cancel out" the existing scale
    let newTransform = origTransform.scale(inverseScaleX, inverseScaleY, bbox.cx, bbox.cy);

    // apply the rotation
    newTransform = newTransform.rotate(incrementalValue, bbox.cx, bbox.cy);

    // reapply the original scale
    newTransform = newTransform.scale(currentScaleX, currentScaleY, bbox.cx, bbox.cy);

    // apply the new transformation matrix
    group.transform(newTransform);
}


function rotateAntiClockWise(group, dragValue) {

    let incrementalValue = -1;

    if (dragValue !== undefined) {
        incrementalValue = -1 * dragValue;
    }
    rotateClockWise(group, incrementalValue);
}

