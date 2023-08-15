function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function generateId() {
    return (Math.random() + 1).toString(36).substring(7).replace(/^\d+/, '');
}

function saveSVG() {
    const svg = editor.toSVGString();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", "canvas.svg");
    link.click();
}

function isTransformValid(group) {
    const transformLocal = group.transform().local;
    if (transformLocal === "" || transformLocal.includes("NaN")) {
        return false;
    }

    return true;
}

/**
 * Calculates the delta for the scale factor based on the rotation of the group and the handle class
 */
function calculateDelta(rotation, handleClass, dx, dy, isTopOrBottomHandle, isLeftOrRightHandle, smoothFactor) {
    let scaleFactor = 1;
    if (isTopOrBottomHandle) {
        if (rotation <= 45) {
            // no change
        }
        else if (rotation <= 90) {
            dy = -dx;
        }
        else if (rotation <= 135) {
            dy = -dx;
        }
        else if (rotation <= 180) {
            dy = -dy;
        }
        else if (rotation <= 225) {
            dy = -dy;
        }
        else if (rotation <= 270) {
            dy = dx;
        }
        else if (rotation <= 315) {
            dy = dx;
        }

        scaleFactor = handleClass === 'handle-1' ? 1 - dy / smoothFactor : 1 + dy / smoothFactor; // top-middle
    } else if (isLeftOrRightHandle) {
        if (rotation <= 45) {
            //no change
        }
        else if (rotation <= 90) {
            dx = dy;
        }
        else if (rotation <= 135) {
            dx = dy;
        }
        else if (rotation <= 180) {
            dx = -dx;
        }
        else if (rotation <= 225) {
            dx = -dx;
        }
        else if (rotation <= 270) {
            dx = -dy;
        }
        else if (rotation <= 315) {
            dx = -dy;
        }
        else {
            dx = dx;
        }
        scaleFactor = handleClass === 'handle-3' ? 1 - dx / smoothFactor : 1 + dx / smoothFactor; // left-middle
    } else if (handleClass === 'handle-7') { //bottom-right
        if (rotation >= 85 && rotation < 180) {
            dy = -dx;
        }
        else if (rotation >= 180 && rotation < 270) {
            dy = -dy;
        }
        else if (rotation >= 270 && rotation < 360) {
            dy = dx;
        }

        scaleFactor = dy > 0 ? 1 + dy / smoothFactor : 1 - Math.abs(dy) / smoothFactor;
    } else if (handleClass === 'handle-5') { //bottom-left
        if (rotation >= 25 && rotation < 85) {
            dy = -dx;
        }
        else if (rotation >= 85 && rotation < 180) {
            dy = -dy;
        }
        else if (rotation >= 180 && rotation < 270) {
            dy = dx;
        }
        scaleFactor = dy > 0 ? 1 + dy / smoothFactor : 1 - Math.abs(dy) / smoothFactor;
    } else if (handleClass === 'handle-0') { //top-left
        if (rotation < 25) {
            dy = -dx;
        }
        else if (rotation >= 25 && rotation < 85) {
            dy = -dy;
        }
        else if (rotation >= 85 && rotation < 180) {
            dy = dx;
        }
        else if (rotation >= 270 && rotation < 360) {
            dy = -dx;
        }
        scaleFactor = dy > 0 ? 1 + dy / smoothFactor : 1 - Math.abs(dy) / smoothFactor;
    } else if (handleClass === 'handle-2') { //top-right
        if (rotation < 25) {
            dy = dx;
        }
        else if (rotation >= 25 && rotation < 85) {
            dy = dx;
        }
        else if (rotation >= 85 && rotation < 180) {
            // no change;
        }
        else if (rotation >= 180 && rotation < 270) {
            dy = -dx;
        }
        else if (rotation >= 270 && rotation < 360) {
            dy = -dy;
        }
        scaleFactor = dy > 0 ? 1 + dy / smoothFactor : 1 - Math.abs(dy) / smoothFactor;
    }

    return scaleFactor;
}
