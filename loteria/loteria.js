$("#play").on("click", deal);
$("#stop").on("click", stop);
$("#list").on("click", () => {
    alert(
        deck
            .filter((_, i) => i < idx)
            .map(o => card_names[o - 1])
            .join(", ")
    );
});

let interval = 5;

$("#fast").on("click", () => {
    if (interval > 1) {
        interval--;
        updateInterval();
    }
});
$("#slow").on("click", evt => {
    if (interval < 9) {
        interval++;
        updateInterval();
    }
});
function updateInterval() {
    $("#speed").attr("class", `bi bi-${10 - interval}-circle`);
}

const sounds = new Array(1 + 54)
    .fill()
    .map((_, i) => new Audio(`sounds/${i}.mp3`));
const images = new Array(1 + 54).fill().map((_, i) => {
    const image = new Image();
    image.src = `images/${i}.jpg`;
    return image;
});

let stage = "ready";
let idx, deck;
let timer, tick;

function deal() {
    switch (stage) {
        case "ready":
            deck = new Array(54)
                .fill()
                .map((_, i) => i + 1)
                .sort((_a, _b) => Math.random() - 0.5);
            sounds[0].play();
            idx = 0;
            stage = "running";
            timer = setInterval(() => {
                if (stage == "running") {
                    document.title = tick.toString();
                    if (++tick < interval) return;
                    const card = deck[idx];
                    $("#carta img").attr("src", images[card].src);
                    sounds[card].play();
                    idx++;
                    tick = 0;
                }
            }, 1000);
            tick = 0;
            $("#play").html('<i class="bi bi-play"></i>Pausa');
            break;
        case "running":
            $("#play").html('<i class="bi bi-play"></i>Sigue');
            stage = "paused";
            break;
        case "paused":
            $("#play").html('<i class="bi bi-play"></i>Pausa');
            stage = "running";
            break;
    }
}

function stop() {
    if (stage == "ready") return;
    if (confirm("¿Seguro?")) {
        clearInterval(timer);
        $("#carta img").attr("src", `images/0.jpg`);
        $("#play").html('<i class="bi bi-play"></i>Corre');
        stage = "ready";
    }
}

const card_names = [
    "El gallo",
    "El diablito",
    "La dama",
    "El catrín",
    "El paraguas",
    "La sirena",
    "La escalera",
    "La botella",
    "El barril",
    "El árbol",
    "El melón",
    "El valiente",
    "El gorrito",
    "La muerte",
    "La pera",
    "La bandera",
    "El bandolón",
    "El violoncello",
    "La garza",
    "El pájaro",
    "La mano",
    "La bota",
    "La luna",
    "El cotorro",
    "El borracho",
    "El negrito",
    "El corazón",
    "La sandía",
    "El tambor",
    "El camarón",
    "Las jaras",
    "El músico",
    "La araña",
    "El soldado",
    "La estrella",
    "El cazo",
    "El mundo",
    "El apache",
    "El nopal",
    "El alacrán",
    "La rosa",
    "La calavera",
    "La campana",
    "El cantarito",
    "El venado",
    "El sol",
    "La corona",
    "La chalupa",
    "El pino",
    "El pescado",
    "La palma",
    "La maceta",
    "El arpa",
    "La rana"
];
