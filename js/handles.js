// Description: Handle all handles logic
function selectGroup(group) {
    toggleHandles(group);
}

function toggleHandles(group) {
    if (typeof group == 'object' && group.node === undefined) {
        group = editor.selectElementById(group.id);
    }

    if (hasHandles(group)) {
        removeAllHandlesFromGroup(group);
        return;
    }

    showAllHandlesForGroup(group);
}


// create scale handles
function createScaleHandles(group) {

    if (!isTransformValid(group)) {
        group.transform(group.data(OT));
    }

    // get the group bounding box (with transformations)
    const bbox = group.getBBox(1);
    const matrix = group.transform().localMatrix;
    const currentRotation = matrix.split().rotate;

    // define the size of the squares
    let squareSize = 15 * sizeFactor;
    let handleOffset = 0;  // offset for handle position

    if (group.select("line")) {
        handleOffset = 20 * sizeFactor;
    }

    // calculate the positions for each square
    let positions = [
        { x: bbox.x - handleOffset, y: bbox.y - handleOffset }, // top-left
        { x: bbox.cx, y: bbox.y - handleOffset }, // top-middle
        { x: bbox.x2 + handleOffset, y: bbox.y - handleOffset }, // top-right
        { x: bbox.x - handleOffset, y: bbox.cy }, // middle-left
        { x: bbox.x2 + handleOffset, y: bbox.cy }, // middle-right
        { x: bbox.x - handleOffset, y: bbox.y2 + handleOffset }, // bottom-left
        { x: bbox.cx, y: bbox.y2 + handleOffset }, // bottom-middle
        { x: bbox.x2 + handleOffset, y: bbox.y2 + handleOffset } // bottom-right
    ];

    const handles = positions.map((pos, index) => {
        // create a square at each position
        const point = transformPoint(matrix, pos.x, pos.y);
        const square = editor.paper.rect(point.x - squareSize / 2, point.y - squareSize / 2, squareSize, squareSize);
        square.addClass("resize-me");
        square.addClass(`handle-${index}`);
        square.addClass('handle');
        square.addClass('handle-' + group.id);
        square.data("group", group);

        // add drag events to the square
        addDragScaleEvent(square);


        // Apply the group's rotation to the handle and overlay
        square.transform(`r${currentRotation},${point.x},${point.y}`);


        // store the top left square
        if (index === 0) {
            group.data("topLeftHandle", square);
        }

        return square; // return the square
    });


    // create border lines
    const borders = [
        [handles[0], handles[1]], // top-left to top-middle
        [handles[1], handles[2]], // top-middle to top-right
        [handles[2], handles[4]], // top-right to middle-right
        [handles[4], handles[7]], // middle-right to bottom-right
        [handles[7], handles[6]], // bottom-right to bottom-middle
        [handles[6], handles[5]], // bottom-middle to bottom-left
        [handles[5], handles[3]], // bottom-left to middle-left
        [handles[3], handles[0]]  // middle-left to top-left
    ].map(([start, end], index) => {
        const line = editor.paper.line(
            start.getBBox().cx, start.getBBox().cy,
            end.getBBox().cx, end.getBBox().cy
        );
        line.attr({
            stroke: "#000",
            strokeWidth: 1 * sizeFactor
        });
        line.addClass(`border-${index}`);
        line.addClass('scale-border');
        line.addClass('handle-' + group.id);

        return line;
    });


    // add flag to prevent drag move event
    group.data("dragScaleStart", true);
    // return handles and borders arrays for further use
    return { handles, borders };
}

function getHandleClass(element) {
    // Get all classes of the element
    const classes = element.attr("class").split(" ");

    // Find the class that starts with "handle-" followed by a number
    const handleClass = classes.find(cls => /^handle-\d$/.test(cls));

    return handleClass;
}

// Create rotate handle
function createRotateHandle(group) {

    if (!isTransformValid(group)) {
        group.transform(group.data(OT));
    }

    // Get the group bounding box
    const bbox = group.getBBox(1);


    // Get the group's current transformation matrix
    const matrix = group.transform().localMatrix;
    const currentRotation = matrix.split().rotate;
    let handleOffset = 0;  // offset for handle position

    // Calculate the x and y position of the handle
    const x = bbox.x2 + handleOffset;
    const y = bbox.y2 + handleOffset;

    // Use the group's transformation matrix to calculate the handle's position
    const transformedPoint = transformPoint(matrix, x, y);

    const arrowSize = 20 * sizeFactor;
    const arrowSvgUrl = "assets/img/rotate.svg";

    // Create the handle at the calculated position
    const rotateArrowRect = editor.paper.rect(transformedPoint.x + arrowSize / 2 + handleOffset, transformedPoint.y + arrowSize / 2 + handleOffset, arrowSize, arrowSize);
    const rotateArrow = editor.paper.image(arrowSvgUrl, transformedPoint.x + arrowSize / 2 + handleOffset, transformedPoint.y + arrowSize / 2 + handleOffset, arrowSize, arrowSize);

    // Set attributes and data for the handle
    rotateArrowRect.addClass("rotate-me");
    rotateArrowRect.addClass('handle');
    rotateArrowRect.addClass('handle-' + group.id);
    rotateArrowRect.data("group", group);
    rotateArrow.addClass("rotate-me");
    rotateArrow.addClass('handle');
    rotateArrow.addClass('handle-' + group.id);
    rotateArrow.data("group", group);


    // Store a flag in the group's data
    group.data("dragRotateStart", true);

    // Apply the group's rotation to the handle
    rotateArrow.transform(`r${currentRotation},${transformedPoint.x},${transformedPoint.y}`);
    rotateArrowRect.transform(`r${currentRotation},${transformedPoint.x},${transformedPoint.y}`);

    // Add drag events to the handle
    addDragRotateEvent(rotateArrow);
}

function deleteAllHandles() {
    const handles = document.querySelectorAll('.handle, .scale-border');
    handles.forEach(function (a) {
        a.remove()
    });
}

/**
 * Remove all handles if they exists
 */
function removeAllHandlesFromGroup(group) {
    document.querySelectorAll(`.handle-${group.id}`).forEach(handle => {
        handle.remove();
    });

    group.removeClass("selected");

}

function showAllHandlesForGroup(snapGroup) {
    if (!isTransformValid(snapGroup)) {
        snapGroup.transform(snapGroup.data(OT));
    }
    createRotateHandle(snapGroup);
    createScaleHandles(snapGroup);

    snapGroup.addClass("selected");
}

function removeAllHandles() {
    document.querySelectorAll(".handle").forEach(handle => {
        handle.remove();
    });
}

function hasHandles(group) {
    return document.querySelectorAll(`.handle-${group.id}`).length > 0;
}


// Custom transformPoint function
function transformPoint(matrix, x, y) {
    return {
        x: matrix.x(x, y),
        y: matrix.y(x, y)
    };
}