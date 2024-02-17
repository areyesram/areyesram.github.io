let correctanswer = undefined;

function makeProblem() {
    const hour = rand(12);
    const minute = rand(60 / 5) * 5;
    const date = new Date(2000, 0, 1, hour, minute, 0, 0);
    drawClock(date);
    const answers = [
        { text: hourText(hour, minute), correct: true },
        { text: hourText(Math.round(minute / 5), hour * 5) },
        { text: hourText(hour, Math.floor(minute / 5)) }
    ];
    shuffle(answers);
    for (let i = 0; i < answers.length; i++) {
        const button = document.getElementById("a" + i);
        button.value = answers[i].text;
        if (answers[i].correct) correctanswer = i;
    }
}

const rand = n => Math.floor(Math.random() * n);

const previousHour = hour => (hour > 1 ? hour - 1 : 12);

const nextHour = hour => (hour < 12 ? hour + 1 : 1);

function hourText(hour, minute) {
    if (hour == 0) hour = 12;
    const pl1 = hour == 1 ? "" : "s";
    const pl2 = nextHour(hour) == 1 ? "" : "s";
    if (minute == 0 && Math.random() < 0.5) return `La${pl1} ${hour} en punto.`;
    if (minute == 15 && Math.random() < 0.5) return `La${pl1} ${hour} y cuarto.`;
    if (minute == 30 && Math.random() < 0.5) return `La${pl1} ${hour} y media.`;
    if (minute == 45 && Math.random() < 0.5) return `Cuarto a la${pl2} ${nextHour(hour)}.`;
    if (minute == 50 && Math.random() < 0.5) return `10 a la${pl2} ${nextHour(hour)}.`;
    if (minute == 55 && Math.random() < 0.5) return `5 a la${pl2} ${nextHour(hour)}.`;
    return `La${pl1} ${hour} con ${minute} minutos.`;
}

function shuffle(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        const j = i + Math.floor(Math.random() * (arr.length - i));
        if (j != i) {
            const temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }
    }
}

function grade(answer) {
    const buttons = [...document.getElementsByTagName("input")];
    buttons.forEach((o, i) => {
        if (i == answer) {
            o.className = answer == correctanswer ? "right" : "wrong";
        } else {
            o.disabled = true;
        }
    });
    setTimeout(() => {
        buttons.forEach(o => {
            o.className = undefined;
            o.disabled = false;
        });
        makeProblem();
    }, 2000);
}
