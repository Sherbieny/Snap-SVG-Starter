//  Description: Snap elements drag events
// Add drag events to the newly added element
function addDragEvent(group) {
    //Add drag events
    group.drag(dragMove, dragStart, dragEnd);
    //listen to the cover rect as well but send in the group

    //add move-me class if it doesn't exist
    if (!group.hasClass("move-me")) {
        group.addClass("move-me");
    }
}

//strore the initial transformation of the element
function dragStart(x, y, event) {

    if (isTransformValid(this)) {
        this.data(OT, this.transform().local);
    }
}

// Drag move event, using the initial transformation matrix, keeping track of the mouse position and smoothly moving the element
function dragMove(dx, dy, x, y, event) {
    if (dx === 0 && dy === 0) {
        return;
    }

    moveGroup(this, dx, dy);
}

function dragEnd(event) {
    if (isTransformValid(this)) {
        this.data(OT, this.transform().local);
    }
}

function moveGroup(group, dx, dy) {
    //needed to avoid recalculating the handles position on every move
    removeAllHandlesFromGroup(group);

    var snapInvMatrix = group.transform().diffMatrix.invert();
    snapInvMatrix.e = snapInvMatrix.f = 0;
    const tdx = snapInvMatrix.x(dx, dy);
    const tdy = snapInvMatrix.y(dx, dy);

    group.transform(group.data(OT) + (group.data(OT) ? "T" : "t") + [tdx, tdy]);
}
