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
        new Input(ctx, 0, 0, triangleSideLen, triangleSeparation, true);
    }
    Input.sort();
    for (let i = 0; i < outputQuantity; ++i) {
        new Output(ctx, 0, 0, triangleSideLen, triangleSeparation, true);
    }
    Output.sort();
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
    else if (button == 0) {
        new LogicGate(ctx, x, y, gateSelected, triangleSideLen, triangleSeparation);
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



const addInput = () => {
    let pos = [];
    for (let i = 0; i < Input.inputs.length; ++i) {
        if (Input.inputs[Input.inputs.length-i-1].fixed) {
            pos.push(Input.inputs[Input.inputs.length-i-1].posX);
            pos.push(Input.inputs[Input.inputs.length-i-1].posY);
        }
    }
    inputQuantity++;
    new Input(ctx, pos[0], pos[1]+triangleSideLen+triangleSeparation, triangleSideLen, triangleSeparation, true);
    Input.sort();
    draw();
}
document.getElementById("addInput").addEventListener('click', addInput);

const removeInput = () => {
    for (let i = 0; i < Input.inputs.length; ++i) {
        if (Input.inputs[Input.inputs.length-i-1].fixed) {
            let input = Input.inputs[Input.inputs.length-i-1];
            for (let j = 0; j < boundings.length; ++j) {
                if (boundings.element === input) {
                    boundings.splice(j, 1);
                    break;
                }
            }
            input.remove();
            break;
        }
    }
    inputQuantity--;
    Input.sort();
    draw();
}
document.getElementById("removeInput").addEventListener('click', removeInput);


const addOutput = () => {
    let pos = [];
    for (let i = 0; i < Output.outputs.length; ++i) {
        if (Output.outputs[Output.outputs.length-i-1].fixed) {
            pos.push(Output.outputs[Output.outputs.length-i-1].posX);
            pos.push(Output.outputs[Output.outputs.length-i-1].posY);
        }
    }
    outputQuantity++;
    new Output(ctx, pos[0], pos[1]+triangleSideLen+triangleSeparation, triangleSideLen, triangleSeparation, true);
    Output.sort();
    draw();
}
document.getElementById("addOutput").addEventListener('click', addOutput);

const removeOutput = () => {
    for (let i = 0; i < Output.outputs.length; ++i) {
        if (Output.outputs[Output.outputs.length-i-1].fixed) {
            let output = Output.outputs[Output.outputs.length-i-1];
            for (let j = 0; j < boundings.length; ++j) {
                if (boundings.element === output) {
                    boundings.splice(j, 1);
                    break;
                }
            }
            output.remove();
            break;
        }
    }
    outputQuantity--;
    Output.sort();
    draw();
}
document.getElementById("removeOutput").addEventListener('click', removeOutput);



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
    createInputsAndOutputs();
    draw();
};