class Input {
    static inputs = [];

    constructor(ctx, posX, posY, sideLength, fixed=true) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.sideLength = sideLength;
        this.height = Math.sqrt(this.sideLength ** 2 - (this.sideLength/2) ** 2);
        this.fixed = fixed;
        this.state = 0;
        this.connections = [];
        this.lineWidth = 5;
        this.boundingBox = [
            this.posX,
            this.posY,
            this.posX + this.height,
            this.posY + this.sideLength
        ];
        boundings.push({type: "fixedInput", element: this});
        Input.inputs.push(this);
    }

    draw() {
        if (this.state === 0) {
            ctx.fillStyle = "#000000";
        }
        else if (this.state === 1) {
            ctx.fillStyle = "#f44336";
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.posX, this.posY);
        this.ctx.lineTo(this.posX + this.height, this.posY + this.sideLength/2);
        ctx.lineTo(this.posX, this.posY + this.sideLength);
        ctx.fill();
    }

    drawConnections() {
        if (this.state === 0) {
            ctx.strokeStyle = "#000000";
        }
        else if (this.state === 1) {
            ctx.strokeStyle = "#f44336";
        }
        ctx.lineWidth = this.lineWidth;
        for (let i = 0; i < this.connections.length; ++i) {
            ctx.beginPath();
            ctx.moveTo(this.posX + this.height/2, this.posY + this.sideLength/2);
            ctx.lineTo(
                this.connections[i]["element"].posX - this.connections[i]["element"].height/2,
                this.connections[i]["element"].posY + this.connections[i]["element"].sideLength/2
            );
            ctx.stroke();
        }
    }

    changeState(state = null) {
        if (state === null) {
            if (this.state === 0) this.state = 1;
            else if (this.state === 1) this.state = 0;
            draw();
        }
        else if (this.state !== state) {
            this.state = state;
            draw();
        }
        else {
            return;
        }
        for (let i = 0; i < this.connections.length; ++i) {
            this.connections[i]["element"].changeState(this.state);
        }
    }

    addConnection(connection) {
        for (let i = 0; i < this.connections.length; ++i) {
            if (this.connections[i]["element"] === connection["element"]) return;
        }
        this.connections.push(connection);
        if (this.state === 1) {
            connection["element"].changeState(this.state);
        }
        draw();
    }

    removeConnection(connection=null) {
        if (!connection) {
            for (let i = 0; i < this.connections.length; ++i) {
                if (this.state === 1) {
                    this.connections[i]["element"].changeState(0);
                }
                this.connections[i]["element"].removeConnection(this);
            }
            this.connections = [];
        }
        else {
            for (let i = 0; i < this.connections.length; ++i) {
                if (this.connections[i]["element"] === connection) {
                    this.connections.splice(i, 1);
                    break;
                }
            }
        }
        draw();
    }
}