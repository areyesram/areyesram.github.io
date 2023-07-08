function loadSounds() {
    for (let o of _snd) {
        const audio = $("<audio>").append(
            $("<source>").attr("src", `file/${o}.m4a`)
        );
        audio.on("play", evt => {});
        audio.on("ended", evt => {
            const o = evt.currentTarget;
            $(o).parent().find(".progress").css("width", "0");
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
            } else {
                o.pause();
                o.currentTime = 0;
            }
        });
        $("#container").append(button);
    }
}

const _snd = [
    "rewind",
    "bob",
    "tss",
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
    "batman",
    "scream",
    "gta",
    "fckd",
    "nani",
    "wrong",
    "curb"
];
