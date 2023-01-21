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
let timer;

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
                    const card = deck[idx];
                    $("#carta img").attr("src", images[card].src);
                    sounds[card].play();
                    idx++;
                }
            }, 5000);
            $("#play").val("Pausa");
            break;
        case "running":
            $("#play").val("Sigue");
            stage = "paused";
            break;
        case "paused":
            $("#play").val("Pausa");
            stage = "running";
            break;
    }
}

function stop() {
    if (stage == "ready") return;
    if (confirm("¿Seguro?")) {
        clearInterval(timer);
        $("#carta img").attr("src", `images/0.jpg`);
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
