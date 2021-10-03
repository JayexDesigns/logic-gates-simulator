var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");



const resizeCanvas = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    draw();
}



var gateSelected = "AND";
const changeGateSelected = (e) => {
    gateSelected = e.target.innerText;
};
var buttons = document.getElementsByClassName("buttonSelector");
for (let i = 0; i < buttons.length; ++i) {
    buttons[i].addEventListener('click', changeGateSelected);
}

var inputQuantity = 2;
var outputQuantity = 1;
var triangleSideLen = 30;
var triangleSeparation = 25;

var boundings = [];

const createInputsAndOutputs = () => {
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
}
createInputsAndOutputs();



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
    else {
        new LogicGate(ctx, x, y, gateSelected);
    }
}

new Mouse(overlapHandler);



document.getElementById("createGate").addEventListener('click', () => {
    let name = document.getElementById("gateName").value;
    document.getElementById("gateName").value = "";
    let colors = ["#00ccff", "#004d7a", "#00bf72", "#ff8f00", "#512da8", "#2276bc", "#30b1ad", "#dc1c4b", "#8fc23f", "#06d6a0", "#ef476f", "#7400b8", "#ffc300", "#ba181b", "#007f5f", "#f15bb5"];
    let color = colors[Math.floor(Math.random() * (colors.length-1))];
    LogicGate.createGate(name, color);
    clear();
});



const clear = () => {
    boundings = [];
    while (Input.inputs.length > 0) {
        Input.inputs[0].remove();
    }
    while (Output.outputs.length > 0) {
        Output.outputs[0].remove();
    }
    while (LogicGate.gates.length > 0) {
        LogicGate.gates[0].remove();
    }
    createInputsAndOutputs();
    draw();
}

document.getElementById("clear").addEventListener('click', () => clear());



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