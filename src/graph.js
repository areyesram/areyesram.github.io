const fs = require("fs");

function main() {
    const json = fs.readFileSync("../api/courses.json").toString();
    const data = JSON.parse(json);
    console.log(data.map((o, i) => i + " " + o.Code).join("\n"));
    console.log("#");
    console.log(
        data
            .flatMap((o, i) => {
                if (!o.PreReq) return undefined;
                return o.PreReq.map(req => {
                    const x = o;
                    const j = data.findIndex(p => p.Code == req);
                    if (req == "Web-CSS") debugger;
                    return `${i} ${j}`;
                });
            })
            .filter(o => o)
            .join("\n")
    );
}

main();
