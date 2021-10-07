async function fillCourses() {
    var t = $("#grid").DataTable({
        columns: [
            { data: "Code" },
            {
                data: "Code",
                render: code => `<a href="courses-${getTopicCode(code)}">${getTopic(code)}</a>`
            },
            {
                data: "Title",
                render: (data, _, row) => `<a href="course?c=${row.Code}">${data}</a>`
            },
            {
                data: "PreReq",
                render: data => (data || []).join(", ")
            }
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });
    const data = await dac.course.list();
    t.rows.add(data);
    t.draw();
}

async function fillCalendar() {
    _courses = await dac.course.list();
    const getCourseSync = code => {
        return _courses.find(o => o.Code == code);
    };
    var t = $("#grid").DataTable({
        columns: [
            {
                data: "Date",
                type: "date",
                render: date => moment(date * 1000).format("YYYY-MM-DD")
            },
            { data: "Code" },
            {
                data: "Code",
                render: code => `<a href="courses-${getTopicCode(code)}">${getTopic(code)}</a>`
            },
            {
                data: "Code",
                render: code => `<a href="course?c=${code}">${getCourseSync(code).Title}</a>`
            },
            {
                data: "Code",
                render: code => (getCourseSync(code).PreReq || []).join(", ")
            },
            {
                data: "Code",
                render: (code, _, row) => {
                    var res = "";
                    var o = getCourseSync(code);
                    if (o.Slides)
                        res += `<a href="${o.Slides}" target="_blank"><img src="../images/slides.svg" /></a>`;
                    if (row.Session)
                        res += `<a href="${row.Session}" target="_blank"><img src="../images/youtube.svg" /></a>`;
                    return res;
                }
            }
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });
    var search = new URLSearchParams(window.location.search);
    var q = Object.fromEntries(search.entries());
    var w = parseInt(q.w) || 1;
    var now = moment(new Date()).startOf("day").valueOf() / 1000;
    const calendar = (await dac.calendar.list()).filter(
        o => ((w & 1) != 0 && o.Date >= now) || ((w & 2) != 0 && o.Date < now)
    );
    t.rows.add(calendar);
    t.draw();
    $("[name=when").each((_, o) => {
        return (o.checked = parseInt(o.value) == w);
    });
    $("[name=when").on("change", evt => (window.location.href = "calendar?w=" + evt.target.value));
}

async function loadCurso() {
    const code = window.location.search.replace(/\?c=(\w+-\w+)/, "$1");
    const course = (await dac.course.list()).find(o => o.Code == code);

    $("#title").text(course.Title);

    $("#code").text("[" + course.Code + "]");
    let ul = $("#topics").find("ul");
    if (course.Topics && course.Topics.length) {
        $.each(course.Topics, (idx, o) {
            ul.append($("<li>").text(o));
        });
    } else {
        ul.append($("<li>").text("T.B.D."));
    }

    ul = $("#prereq").find("ul");
    if (course.PreReq && course.PreReq.length) {
        for (let code of course.PreReq) {
            const title = (await dac.course.find(code)).Title;
            var link = $("<a>")
                .attr("href", `course?c=${code}`)
                .text(`[${code}] ${title}`);
            ul.append($("<li>").append(link));
        }
    } else {
        ul.append($("<li>").text("Ninguno."));
    }

    const calendar = await dac.calendar.list();
    var sessions = calendar.filter(o => o.Code == code);
    ul = $("#sessions").find("ul");
    if (sessions && sessions.length) {
        $.each(sessions, (_idx, o) => {
            const date = moment(o.Date * 1000);
            const label = date.format("DD [de] MMMM [de] YYYY");
            const link = o.Session
                ? $("<a>").attr("href", o.Session).attr("target", "_blank").text(label)
                : label;
            ul.append(
                $("<li>")
                    .addClass(
                        date.toDate() > new Date() ? "fut" : o.Session ? "rec" : "norec"
                    )
                    .append(link)
            );
        });
    } else {
        ul.parent().hide();
    }
}

const _cache = {};

const dac = {
    course: {
        list: async () =>
            new Promise((res, rej) => {
                if (_cache.courses) {
                    res(_cache.courses);
                } else
                    $.ajax({
                        url: "api/courses.json" + _version,
                        cache: false,
                        success: async data => {
                            _cache.courses = data;
                            return res(data);
                        },
                        error: (a, b, c) => rej(a)
                    });
            }),
        find: async code => (await dac.course.list()).find(o => o.Code == code)
    },
    calendar: {
        list: async () =>
            new Promise((res, rej) => {
                $.ajax({
                    url: "api/calendar.json" + _version,
                    cache: false,
                    success: async data => {
                        for (let o of data) o.Course = await dac.course.find(o.Code);
                        return res(data);
                    },
                    error: (a, b, c) => rej(a)
                });
            })
    }
};

var _topics = ["CB", "ES", "Lnx", "NET", "Node", "PnP", "Py", "SQL", "Web"];

function getTopic(code) {
    return {
        CB: "Computación básica",
        ES: "Elastic Stack",
        Lnx: "Linux",
        NET: ".NET",
        Node: "Node.js",
        PnP: "Best practices",
        Py: "Python",
        SQL: "SQL Server",
        Web: "Web Dev"
    }[getTopicCode(code)];
}

function getTopicCode(code) {
    return code.split("-")[0];
}

var _version;

function getVersion(fn) {
    $.ajax({
        url: "/api/version.json?r=" + Math.floor(new Date().valueOf() / 1000 / 60),
        cache: false,
        success: data => {
            if (data.version != 1630683570338)
                alert("Nueva versión. Favor de limpiar el cache del navegador.");
            _version = "?v=" + data.version;
            fn();
        },
        error: (a, b, c) => {
            debugger;
        }
    });
}

$.ajax({
    url: "/menu.html",
    cache: false,
    success: data => $(document.body).prepend(data)
});
