function loadSounds() {
    for (let o of _snd) {
        const audio = $("<audio>").append(
            $("<source>").attr("src", `file/${o}.m4a`)
        );
        const button = $("<button>")
            .append(audio)
            .append($("<img>").attr("src", `file/${o}.jpg`));
        button.on("click", () => audio[0].play());
        $("#container").append(button);
    }
}

const _snd = [
    "rewind",
    "wow",
    "omg",
    "cutg",
    "hehe",
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
    "fckd",
    "nani",
    "wrong",
    "curb"
];
