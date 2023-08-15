// Description: Basic Snap svg shapes.

/**
 * Create a rectangle.
 */
function createRect() {
    const rect = editor.paper.rect();
    rect.attr({
        fill: randomColor(),
        stroke: "none",
        width: 100 * sizeFactor,
        height: 100 * sizeFactor,
    });
    //Add event classes
    rect.addClass("shape");
    rect.addClass("move-me");

    //Add to canvas
    editor.addElement(rect);
}

/**
 * Create a circle.
 */
function createCircle() {
    const circle = editor.paper.circle();
    circle.attr({
        fill: randomColor(),
        stroke: "none",
        r: 50 * sizeFactor,
    });
    //Add event classes
    circle.addClass("shape");
    circle.addClass("move-me");

    //Add to canvas
    editor.addElement(circle);
}

/**
 * Create an ellipse.
 */
function createEllipse() {
    const ellipse = editor.paper.ellipse();
    ellipse.attr({
        fill: randomColor(),
        stroke: "none",
        rx: 50 * sizeFactor,
        ry: 25 * sizeFactor,
    });
    //Add event classes
    ellipse.addClass("shape");
    ellipse.addClass("move-me");

    //Add to canvas
    editor.addElement(ellipse);
}

/**
 * Create a line.
 */
function createLine() {
    const line = editor.paper.line(0, 0, 100 * sizeFactor, 0);
    line.attr({
        fill: "none",
        stroke: randomColor(),
        strokeWidth: 5 * sizeFactor,
    });
    // Add event classes
    line.addClass("shape");
    line.addClass("move-me");

    // Add to canvas
    editor.addElement(line);
}

/**
 * Create a heart shape.
 */
function createHeart() {
    const heart = editor.paper.path("M200 100C325 0 400 200 200 350 0 200 75 0 200 100Z");
    heart.attr({
        fill: randomColor(),
        stroke: "none",
    });

    // Scale the heart based on the sizeFactor and move it to the top-left corner
    heart.transform(`s${sizeFactor / 2},${sizeFactor / 2},400,200`);

    // Add event classes
    heart.addClass("shape");
    heart.addClass("move-me");

    // Add to canvas
    editor.addElement(heart);
}




/**
 * Create a polygon. (triangle)
 */
function createTriangle() {
    const baseWidth = 100 * sizeFactor;
    const height = 100 * sizeFactor;
    const halfWidth = baseWidth / 2;
    const coordinates = `0,${height} ${halfWidth},0 ${baseWidth},${height}`;
    const triangle = editor.paper.polygon(coordinates);

    triangle.attr({
        fill: randomColor(),
        stroke: "none",
    });

    // Add event classes
    triangle.addClass("shape");
    triangle.addClass("move-me");

    // Add to canvas
    editor.addElement(triangle);
}


/**
 * Create a star.
 */
function createStar() {
    const starPoints = [];
    const innerRadius = 25 * sizeFactor;
    const outerRadius = 50 * sizeFactor;
    const numPoints = 5;
    const angle = Math.PI / numPoints;

    for (let i = 0; i < 2 * numPoints; i++) {
        const r = (i % 2 === 0) ? outerRadius : innerRadius;
        const x = outerRadius + r * Math.sin(i * angle);
        const y = outerRadius - r * Math.cos(i * angle);
        starPoints.push(x, y);
    }

    const star = editor.paper.polygon(starPoints);
    star.attr({
        fill: randomColor(),
        stroke: "none",
    });
    // Add event classes
    star.addClass("shape");
    star.addClass("move-me");

    // Add to canvas
    editor.addElement(star);
}

/**
 * Create a text element.
 * @param {string} text - The text to display.
 */
function createText() {
    const text = document.getElementById("text-input")?.value || "Sample Text";
    const textElement = editor.paper.text(0, 0, text);
    textElement.attr({
        fill: randomColor(),
        stroke: "none",
        fontSize: 50 * sizeFactor,
    });

    // Add event classes
    textElement.addClass("shape");
    textElement.addClass("move-me");

    // Add to canvas
    editor.addElement(textElement);
}
