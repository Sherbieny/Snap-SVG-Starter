const NS = 'http://www.w3.org/2000/svg';
const LAYER = "data-l";
const OT = "origTransform";
const sizeFactor = 1;

window.addEventListener("load", function () {
    //Set the dimensions
    //Gather the screen dimensions
    const board = document.getElementById('board');
    const boardRect = board.getBoundingClientRect();
    const boardWidth = boardRect.width;
    const boardHeight = boardRect.height;

    //Create the editor
    editor = new Editor('#canvas', 0, 0, boardWidth, boardHeight);
    //Add the event listeners
    addBtnEvents();
});

function addBtnEvents() {
    const saveBtn = document.getElementById('save_svg');
    const clearBtn = document.getElementById('clear_canvas');
    const skewBtn = document.getElementById('skew_btn');

    saveBtn?.addEventListener('click', saveSVG);

    clearBtn?.addEventListener('click', function () {
        editor.clear();
    });

    skewBtn?.addEventListener('click', onSkewButtonClick);


}