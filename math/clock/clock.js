function drawClock(date) {
    const canvas = document.getElementById("clock");
    const ctx = canvas.getContext("2d");
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(radius, radius, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill();
    for (let i = 1; i <= 12; i++) {
        const angle = ((i - 3) * (Math.PI * 2)) / 12;
        const x = radius + radius * 0.8 * Math.cos(angle);
        const y = radius + radius * 0.8 * Math.sin(angle);
        ctx.font = "8em Serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(i, x, y);
    }
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    drawHand(radius * 0.5, (hours + minutes / 60) * 30, 8);
    drawHand(radius * 0.7, (minutes + seconds / 60) * 6, 4);

    function drawHand(length, angle, width) {
        const x = radius + length * Math.cos((angle - 90) * (Math.PI / 180));
        const y = radius + length * Math.sin((angle - 90) * (Math.PI / 180));
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.lineTo(x, y);
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
        ctx.stroke();
    }
}
