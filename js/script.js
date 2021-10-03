var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");



const resizeCanvas = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    draw();
}



var gateSelected = "AND";
var buttons = document.getElementsByClassName("buttonSelector");
for (let i = 0; i < buttons.length; ++i) {
    buttons[i].addEventListener('click', () => {
        gateSelected = buttons[i].innerText;
    });
}

var inputQuantity = 3;
var outputQuantity = 2;
var triangleSideLen = 30;
var triangleSeparation = 25;

var boundings = [];

for (let i = 0; i < inputQuantity; ++i) {
    factor = i - (inputQuantity/2 - 0.5);
    let startPoint = [0, innerHeight/2 - triangleSideLen/2 + triangleSideLen * factor + factor * triangleSeparation];
    new Input(ctx, startPoint[0], startPoint[1], triangleSideLen, true);
}
for (let i = 0; i < outputQuantity; ++i) {
    factor = i - (outputQuantity/2 - 0.5);
    let startPoint = [innerWidth, innerHeight/2 - triangleSideLen/2 + triangleSideLen * factor + factor * triangleSeparation];
    new Output(ctx, startPoint[0], startPoint[1], triangleSideLen, true);
}



const overlapHandler = (x, y, lastX, lastY, button) => {
    let firstOverlap;
    let secondOverlap;
    for (let i = 0; i < boundings.length; ++i) {
        let current = boundings[i];
        if (lastX >= current["element"].boundingBox[0] &&
            lastY >= current["element"].boundingBox[1] &&
            lastX <= current["element"].boundingBox[2] &&
            lastY <= current["element"].boundingBox[3]
        ) firstOverlap = current;
    }

    for (let i = 0; i < boundings.length; ++i) {
        let current = boundings[i];
        if (x >= current["element"].boundingBox[0] &&
            y >= current["element"].boundingBox[1] &&
            x <= current["element"].boundingBox[2] &&
            y <= current["element"].boundingBox[3]
        ) secondOverlap = current;
    }



    if (firstOverlap && secondOverlap) {
        if (button === 0) {
            if (
                firstOverlap["type"] === "fixedInput" && secondOverlap["type"] === "fixedInput" &&
                firstOverlap["element"] === secondOverlap["element"]
            ) {
                firstOverlap["element"].changeState();
                return;
            }

            else if (
                (firstOverlap["type"] === "fixedInput" ||
                firstOverlap["type"] === "gateInput") &&
                (secondOverlap["type"] === "fixedOutput" ||
                secondOverlap["type"] === "gateOutput")
            ) {
                secondOverlap["element"].addConnection(firstOverlap);
                firstOverlap["element"].addConnection(secondOverlap);
                return;
            }
        }
        else if (button === 2) {
            firstOverlap["element"].removeConnection();
        }
    }
    if (button === 1) {
        new LogicGate(ctx, x, y, gateSelected);
    }
}

new Mouse(overlapHandler);



const draw = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < Input.inputs.length; ++i) {
        Input.inputs[i].drawConnections();
        Input.inputs[i].draw();
    }
    for (let i = 0; i < Output.outputs.length; ++i) {
        Output.outputs[i].draw();
    }
    for (let i = 0; i < LogicGate.gates.length; ++i) {
        LogicGate.gates[i].draw();
    }
}



const handleLoad = () => {
    resizeCanvas();
    window.addEventListener('resize', () => resizeCanvas());
};