class LogicGate {
    static gates = [];

    constructor(ctx, posX, posY, nInputs, nOutputs, name, table=null, preset=null) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.nInputs = nInputs;
        this.nOutputs = nOutputs;
        this.name = name;
        this.fontSize = 25;
        this.xFrameOffset = 10;
        this.yFrameOffset = 15;
        if (preset == "AND") {
            this.table = {
                i1: [0, 1, 0, 1],
                i2: [0, 0, 1, 1],
                o1: [0, 0, 0, 1],
            };
        }
        else if (preset == "NOT") {
            this.table = {
                i1: [0, 1],
                o1: [1, 0],
            };
        }
        else {
            this.table = table;
        }
        LogicGate.gates.push(this);
        size = draw();
    }

    draw() {
        ctx.fillStyle = "#ff0066";
        ctx.font = `700 ${this.fontSize}px Open Sans`;
        let metrics = ctx.measureText(this.name);
        let width = metrics.width;
        let height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        ctx.fillRect(
            this.posX - this.xFrameOffset,
            this.posY - height - this.yFrameOffset,
            width + this.xFrameOffset*2,
            height + this.yFrameOffset*2
        );
        ctx.fillStyle = "#ffffff";
        ctx.fillText(this.name, this.posX, this.posY);
        return [width, height];
    }
}