function loadSounds() {
    let i = 0;
    const N = _snd.length;
    const w = Math.floor(100 / N) + "%";
    for (let g of _snd) {
        const smenu = $("<button>")
            .attr("data-g", i)
            .css("width", w)
            .append($("<img>").attr("src", `file/${i}.jpg`).css("width", "100%"));
        $("#menu").append(smenu);
        for (let o of g) {
            const audio = $("<audio>").append($("<source>").attr("src", `file/${o}.m4a`));
            audio.on("play", evt => {});
            audio.on("ended", evt => {
                const o = evt.currentTarget;
                const p = $(o).parent();
                p.find(".progress").css("width", "0");
                p.css("border-color", "");
            });
            audio.on("timeupdate", evt => {
                const o = evt.currentTarget;
                $(o)
                    .parent()
                    .find(".progress")
                    .css("width", (o.currentTime / o.duration) * 100 + "%");
            });
            const button = $("<button>")
                .attr("data-g", i)
                .append(audio)
                .append($("<img>").attr("src", `file/${o}.jpg`))
                .append($("<div>").addClass("progress"));
            button.on("click", () => {
                const o = audio[0];
                if (o.paused) {
                    o.play();
                    audio.parent().css("border-color", "lime");
                } else {
                    o.pause();
                    o.currentTime = 0;
                    audio.parent().css("border-color", "");
                }
            });
            $("#buttons").append(button);
        }
        i++;
    }
    $("#menu button").on("click", evt => {
        const g = $(evt.currentTarget).data().g;
        $("#buttons button").each((i, o) => {
            if ($(o).data().g == g) {
                $(o).show();
            } else {
                $(o).hide();
            }
        });
    });
    $("#buttons button").hide();
}

const _snd = [
    [
        "cuppycake",
        "violin",
        "piano",
        "upsad",
        "evil",
        "bob",
        "mad",
        "titanic",
        "happen",
        "ameno",
        "illuminati",
        "gangsta",
        "bad",
        "curb"
    ],
    [
        "laugh",
        "serious",
        "cheer",
        "wow",
        "wassup",
        "omg",
        "cutg",
        "letme",
        "hehe",
        "scream",
        "mariojump",
        "punch",
        "nope",
        "robloxoof",
        "eat",
        "huh",
        "bruh",
        "aaah"
    ],
    [
        "buzzer",
        "ausemer",
        "ausvote",
        "taco",
        "laword",
        "batman",
        "dun",
        "bomb",
        "tss",
        "wah",
        "rewind",
        "dialup",
        "winxperr",
        "quack"
    ],
    ["gta", "paloma", "fckd", "nani", "niños", "wrong", "nomine", "cena", "fitness"]
];
