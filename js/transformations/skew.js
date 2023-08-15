function skewGroup(group, skewValX, skewValY) {
    const bbox = group.getBBox(1);
    const origTransform = group.transform().localMatrix;

    const skewTransform = new Snap.Matrix().skew(skewValY, skewValX);
    const newTransform = origTransform.add(skewTransform);

    const refPoint = { x: origTransform.x(bbox.cx, bbox.cy), y: origTransform.y(bbox.cx, bbox.cy) };
    const postSkewRefPoint = { x: newTransform.x(bbox.cx, bbox.cy), y: newTransform.y(bbox.cx, bbox.cy) };

    newTransform.e -= postSkewRefPoint.x - refPoint.x;
    newTransform.f -= postSkewRefPoint.y - refPoint.y;

    toggleHandles(group);

    group.transform(newTransform);

    toggleHandles(group);

    let currentSkewX = group.data("skewX") || 0;
    let currentSkewY = group.data("skewY") || 0;
    currentSkewX += skewValX;
    currentSkewY += skewValY;
    group.data("skewX", currentSkewX);
    group.data("skewY", currentSkewY);
}

function onSkewButtonClick(event) {
    const groups = editor.getSelectedGroups();
    if (groups.length === 0) {
        return;
    }
    const skewDirection = document.getElementById("skewDirection").value;
    if (skewDirection === "none") {
        return;
    }
    const skewAmount = parseInt(document.getElementById("skew_increment_val").value) || 1;
    const skewValX = skewDirection === "left" ? -skewAmount : skewDirection === "right" ? skewAmount : 0;
    const skewValY = skewDirection === "up" ? -skewAmount : skewDirection === "down" ? skewAmount : 0;

    groups.forEach(group => skewGroup(group, skewValX, skewValY));
}
