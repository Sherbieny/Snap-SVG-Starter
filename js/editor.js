/**
 * Main canvas class for the SVG Editor.
 * Initializes the canvas as a Snap SVG element.
 * Handles the following:
 * - Adding new elements to the canvas
 * - Clearing the canvas
 * - Selecting elements on the canvas
 * - Positioning elements on the canvas
 * - Return selected elements
 * - Exporting the canvas as an SVG string
 */

class Editor {
    /**
     * Creates a new instance of Snap SVG canvas.
     * @param {String} id - the id of the canvas div element that will contain the Snap Svg paper.
     * @param {Number} x - the x coordinate of the canvas viewbox.
     * @param {Number} y - the y coordinate of the canvas viewbox.
     * @param {Number} width - the width of the canvas viewbox.
     * @param {Number} height - the height of the canvas viewbox.
     **/
    constructor(id, x, y, width, height) {
        /**
         * The Snap SVG paper object.
         * @type {Snap.Paper}
         */
        this.paper = Snap(id);
        /**
         * Set initial attributes of the canvas.
         * make the main canvas responsive, centered and with max width and heigh
         */
        this.paper.attr({
            viewBox: `${x} ${y} ${width} ${height}`,
            x: `${x}`,
            y: `${y}`
        });

        /**
         * Set parameters of the canvas.
         */
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;

        /**
         * The Snap SVG group that contains all the elements on the canvas.
         * @type {Snap.Element}
         */
        if (this.paper.select('#main-group')) {
            this.paper.select('#main-group').remove();
        }
        this.group = this.paper.group();
        this.group.attr({
            id: 'main-group'
        });

        this.createGrid();
        this.createClipPath();

        this.group.add(this.border);
    }

    createClipPath() {
        //clear old defs
        this.paper.selectAll('defs').forEach((defs) => { defs.remove(); });
        // Create a clipPath element with a unique ID
        const clipPathId = "clip-path-" + Date.now();
        const clipPath = this.paper.el('clipPath').attr({ id: clipPathId });
        const clonedBorder = this.border.clone();
        clipPath.append(clonedBorder);
        clipPath.toDefs();
        this.group.attr({ "clip-path": "url(#" + clipPathId + ")" });
    }

    createGrid() {

        /**
        * The Snap SVG rect that represents the Border of the canvas.
        * @type {Snap.Element}
        */
        this.border = this.paper.rect(this.x, this.y, this.width, this.height);
        this.border.attr(
            {
                stroke: '#000000',
                fill: 'none',
                strokeWidth: 10,
            }
        );
    }

    /**
     * add group to the canvas.
     * @param {Snap.Element} group - the group to add.
     */
    addGroup(group) {
        this.group.add(group);
        group.node.addEventListener('click', (e) => {
            selectGroup(group);
        });
    }


    /**
     * Add a new element to the canvas. creating a new group for the element and adding it to the canvas.
     * @param {Snap.Element} element - the element to add to the canvas.
     */
    addElement(element) {
        const newGroup = this.paper.group();
        newGroup.node.id = generateId();
        element.node.id = generateId();
        newGroup.add(element);
        this.addGroup(newGroup);
        addDragEvent(newGroup);
        this.positionElement(newGroup);
    }

    /**
   * Set initial position of an element on the canvas.
   * @param {Snap.Element} group - the element to position.   
   */
    positionElement(group) {
        const element = group.select('.shape');
        let xPos, yPos;

        const stdDevX = this.width / 12; // Adjust these to change how concentrated the distribution is
        const stdDevY = this.height / 12; // around the center. Smaller values = more concentration.
        xPos = Math.floor(this.getRandomGaussian(this.centerX, stdDevX));
        yPos = Math.floor(this.getRandomGaussian(this.centerY, stdDevY));

        group.attr({
            transform: `t${xPos},${yPos}`
        });

    }

    getRandomGaussian(mean, stdDev) {
        let u1 = Math.random();
        let u2 = Math.random();
        let randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        return mean + stdDev * randStdNormal;
    }

    /**
     * Export the canvas as an SVG string.
     * @returns {String} the SVG string.
     */
    toSVGString() {
        return this.paper.toString();
    }

    /**
     * Clear the canvas.
     */
    clear() {
        this.group.remove();
        this.group = this.paper.group();
        this.clearLinesAndGuides();
        this.createGrid();
        this.createClipPath();
        this.group.add(this.border);
        this.group.node.id = 'main-group';
        removeAllHandles();
    }

    /**
     * Clear all orphans lines and rects.
     */
    clearLinesAndGuides() {
        this.paper.selectAll('line').forEach((line) => { line.remove(); });
        this.paper.selectAll('rect').forEach((rect) => { rect.remove(); });
    }

    /**
     * Select an svg element by id and return it's Snap Element.
     * @param {String} id - the id of the element to select.
     * @returns {Snap.Element} the Snap Element of the selected element.
     */
    selectElementById(id) {
        return Snap.select(`#${id}`);
    }

    getSelectedGroups() {
        return this.group.selectAll('.selected');
    }

    /**
     * Set the width of the canvas.
     */
    set width(value) {
        this._width = value;
    }
    /**
     * Get the width of the canvas.
     * @returns {Number} the width of the canvas.
     */
    get width() {
        return this._width;
    }
    /**
     * Set the height of the canvas.
     */
    set height(value) {
        this._height = value;
    }
    /**
     * Get the height of the canvas.
     * @returns {Number} the height of the canvas.
     */
    get height() {
        return this._height;
    }

    /**
     * Get the canvas center x coordinate.
     * @returns {Number} the canvas center x coordinate.
     */
    get centerX() {
        return this._width / 2;
    }
    /**
     * Get the canvas center y coordinate.
     * @returns {Number} the canvas center y coordinate.
     */
    get centerY() {
        return this._height / 2;
    }
    /**
     * Get X
     */
    get x() {
        return this._x;
    }
    /**
     * Get Y
     */
    get y() {
        return this._y;
    }
    /** 
     * Get the canvas viewBox.
     * @returns {Object} the canvas viewBox.
     * */
    get viewBox() {
        return this.paper.attr('viewBox');
    }
}