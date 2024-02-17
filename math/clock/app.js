let correctanswer = undefined;

function makeProblem() {
    const hour = rand(12);
    const minute = rand(60 / 5) * 5;
    const date = new Date(2000, 0, 1, hour, minute, 0, 0);
    const hourGood = hour == 0 ? 12 : hour;
    const hourBad = minute == 0 ? 12 : minute / 5;
    const hourRand = rand(12) + 1;
    const minuteRand = rand(60 / 5) * 5;
    drawClock(date);
    const answers = [
        {
            text:
                minute == 0 && Math.random() < 0.5
                    ? `La${hourGood == 1 ? "" : "s"} ${hourGood} en punto.`
                    : minute == 15 && Math.random() < 0.5
                    ? `La${hourGood == 1 ? "" : "s"} ${hourGood} y cuarto.`
                    : minute == 30 && Math.random() < 0.5
                    ? `La${hourGood == 1 ? "" : "s"} ${hourGood} y media.`
                    : minute == 45 && Math.random() < 0.5
                    ? `Cuarto a la${nextHour(hourGood) == 1 ? "" : "s"} ${nextHour(hourGood)}.`
                    : `La${hourGood == 1 ? "" : "s"} ${hourGood} con ${minute} minutos.`,
            correct: true
        },
        {
            text:
                Math.random() < 0.1
                    ? `La${hourBad == 1 ? "" : "s"} ${hourBad} y media`
                    : Math.random() < 0.2
                    ? `La${hourBad == 1 ? "" : "s"} ${hourBad} y cuarto`
                    : Math.random() < 0.3
                    ? `Cuarto a la${hourBad == 1 ? "" : "s"} ${hourBad}`
                    : hourGood == 12 && Math.random() < 0.5
                    ? `La${hourBad == 1 ? "" : "s"} ${hourBad} en punto.`
                    : `La${hourBad == 1 ? "" : "s"} ${hourBad} con ${hourGood} minutos.`
        },
        {
            text:
                Math.random() < 0.1
                    ? `La${hourRand == 1 ? "" : "s"} ${hourRand} y media`
                    : Math.random() < 0.2
                    ? `La${hourRand == 1 ? "" : "s"} ${hourRand} y cuarto`
                    : Math.random() < 0.3
                    ? `Cuarto a la${hourRand == 1 ? "" : "s"} ${hourRand}`
                    : Math.random() < 0.4
                    ? `La${hourRand == 1 ? "" : "s"} ${hourRand} en punto.`
                    : `La${hourRand == 1 ? "" : "s"} ${hourRand} con ${minuteRand} minutos.`
        }
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
