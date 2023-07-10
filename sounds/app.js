function loadSounds() {
    for (let o of _snd) {
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
        $("#container").append(button);
    }
}

const _snd = [
    "rewind",
    "violin",
    "piano",
    "upsad",
    "evil",
    "bob",
    "mad",
    "happen",
    "ameno",
    "gangsta",
    "tss",
    "wah",
    "cheer",
    "wow",
    "wassup",
    "omg",
    "cutg",
    "letme",
    "hehe",
    "dialup",
    "winxperr",
    "quack",
    "nope",
    "buzzer",
    "mariojump",
    "punch",
    "robloxoof",
    "eat",
    "huh",
    "bruh",
    "aaah",
    "ausemer",
    "ausvote",
    "taco",
    "laword",
    "dun",
    "bad",
    "illuminati",
    "batman",
    "scream",
    "nomine",
    "gta",
    "paloma",
    "fckd",
    "nani",
    "niños",
    "wrong",
    "cena",
    "fitness",
    "curb"
];
