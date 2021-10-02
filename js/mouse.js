class Mouse {
    constructor(overlapHandler) {
        this.left = {
            lastX: 0,
            lastY: 0,
            x: 0,
            y: 0,
            button: 0
        }
        this.middle = {
            lastX: 0,
            lastY: 0,
            x: 0,
            y: 0,
            button: 1
        }
        this.right = {
            lastX: 0,
            lastY: 0,
            x: 0,
            y: 0,
            button: 2
        }
        this.overlapHandler = overlapHandler;
        this.mouseHandler();
    }

    mouseHandler() {
        canvas.addEventListener("mousedown", e => {
            if (e.button === 0) {
                this.left.lastX = e.clientX;
                this.left.lastY = e.clientY;
            }
            else if (e.button === 1) {
                this.middle.lastX = e.clientX;
                this.middle.lastY = e.clientY;
            }
            else if (e.button === 2) {
                this.right.lastX = e.clientX;
                this.right.lastY = e.clientY;
            }
        });
        canvas.addEventListener("mouseup", e => {
            if (e.button === 0) {
                this.left.x = e.clientX;
                this.left.y = e.clientY;
                this.overlapHandler(this.left.x, this.left.y, this.left.lastX, this.left.lastY, this.left.button);
            }
            else if (e.button === 1) {
                this.middle.x = e.clientX;
                this.middle.y = e.clientY;
                this.overlapHandler(this.middle.x, this.middle.y, this.middle.lastX, this.middle.lastY, this.middle.button);
            }
            else if (e.button === 2) {
                this.right.x = e.clientX;
                this.right.y = e.clientY;
                this.overlapHandler(this.right.x, this.right.y, this.right.lastX, this.right.lastY, this.right.button);
            }
        });
        canvas.addEventListener("contextmenu", e => {
            e.preventDefault();
        });
    }
}