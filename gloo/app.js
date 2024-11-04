"use strict";

const canvas = document.getElementById("canvas");
canvas.addEventListener("click", _ => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const gloo = {
        ctx: canvas.getContext("2d"),
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: 1,
        dy: 0,
        angle: 0,
        pen: false
    };
    const code = document.getElementById("code").value.split("\n");
    gloo.ctx.beginPath();
    runCode(gloo, code);
    gloo.ctx.stroke();
});

const isInt = s => Number.isInteger(parseInt(s));
const deg2rad = deg => (deg * Math.PI) / 180;

function runCode(gloo, code) {
    for (let i = 0; i < code.length; i++) {
        const line = code[i];
        const stat = parse(line);
        switch (stat.opcode) {
            case "noop":
                break;
            case "pen":
                if (stat.args.length === 1 && ["up", "down"].includes(stat.args[0])) {
                    gloo.pen = stat.args[0] === "down";
                    gloo.ctx.moveTo(gloo.x, gloo.y);
                } else {
                    window.alert(`I don't undestand ${line}`);
                }
                break;
            case "fore":
            case "back":
                draw(gloo, stat);
                break;
            case "right":
            case "left":
                turn(gloo, stat);
                break;
            case "repeat":
                const block = [];
                do {
                    i++;
                    if (code[i] === "}") break;
                    block.push(code[i]);
                } while (code[i] !== undefined);
                for (let j = 0; j < parseInt(stat.args[0]); j++) {
                    runCode(gloo, block);
                }
                i++;
                break;
            default:
                break;
        }
    }
}

function draw(gloo, stat) {
    if (stat.args.length === 1 && isInt(stat.args[0])) {
        const dir = stat.opcode === "fore" ? 1 : -1;
        const len = dir * parseInt(stat.args[0]);
        gloo.x += len * gloo.dx;
        gloo.y += len * gloo.dy;
        gloo.ctx[gloo.pen ? "lineTo" : "moveTo"](gloo.x, gloo.y);
        gloo.lines = true;
    }
}

function turn(gloo, stat) {
    if (stat.args.length === 1 && isInt(stat.args[0])) {
        const dir = stat.opcode === "right" ? 1 : -1;
        gloo.angle += dir * parseInt(stat.args[0]);
        gloo.dx = Math.cos(deg2rad(gloo.angle));
        gloo.dy = Math.sin(deg2rad(gloo.angle));
    }
}

function parse(line) {
    line = line.trim();
    if (line === "") return { opcode: "noop" };
    const re = /[a-zA-Z]+|\d+|,/g;
    const tokens = [];
    let match;
    while ((match = re.exec(line)) !== null) tokens.push(match[0]);
    if (tokens.length >= 2 && tokens.length <= 6) {
        const stat = { opcode: tokens[0], args: [] };
        for (let i = 1; i < tokens.length; i += 2) {
            stat.args.push(tokens[i]);
        }
        return stat;
    }
}
