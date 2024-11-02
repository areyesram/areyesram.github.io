"use strict";

const canvas = document.getElementById("canvas");
canvas.addEventListener("click", _ => runCode());

const isInt = s => Number.isInteger(parseInt(s));
const knownColors = [
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "violet",
    "pink",
    "brown",
    "skyblue",
    "teal",
    "magenta",
    "black",
    "white",
    "gray",
    "silver"
];

function runCode() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const gloo = {
        ctx: canvas.getContext("2d"),
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: 1,
        dy: 0,
        angle: 0,
        pen: false,
        ink: "black",
        lines: false
    };
    const code = document.getElementById("code").value.split("\n");

    gloo.ctx.beginPath();
    for (let line of code) {
        const stat = parse(line);
        switch (stat.opcode) {
            case "noop":
                break;
            case "ink":
                if (gloo.lines) {
                    gloo.ctx.stroke();
                }
                if (stat.args.length === 1 && knownColors.includes(stat.args[0])) {
                    gloo.ctx.strokeStyle = stat.args[0];
                } else if (stat.args.length === 3 && stat.args.every(o => isInt(o))) {
                    gloo.ctx.strokeStyle = ` rgb(${stat.args.join(",")})`;
                }
                if (gloo.lines) {
                    gloo.ctx.beginPath();
                    gloo.ctx.moveTo(gloo.x, gloo.y);
                    gloo.lines = false;
                }
                break;
            case "pen":
                if (stat.args.length === 1 && ["up", "down"].includes(stat.args[0])) {
                    gloo.pen = stat.args[0] === "down";
                    gloo.ctx.moveTo(gloo.x, gloo.y);
                }
                break;
            case "fore":
            case "back":
                draw(gloo, stat);
                break;
            case "right":
                if (stat.args.length === 1 && isInt(stat.args[0])) {
                    gloo.angle += parseInt(stat.args[0]);
                    gloo.dx = Math.cos(deg2rad(gloo.angle));
                    gloo.dy = Math.sin(deg2rad(gloo.angle));
                }
                break;
            case "left":
                if (stat.args.length === 1 && isInt(stat.args[0])) {
                    gloo.angle -= parseInt(stat.args[0]);
                    gloo.dx = Math.cos(deg2rad(gloo.angle));
                    gloo.dy = Math.sin(deg2rad(gloo.angle));
                }
                break;
            default:
                debugger;
                break;
        }
    }
    gloo.ctx.stroke();
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
    debugger;
    // paper { color | r,g,b }
    // go { x, y | home }
    // move w, h
    // face angle
}

function deg2rad(deg) {
    return (deg * Math.PI) / 180;
}
