function fillCourses() {
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
    $.ajax({
        url: "api/courses.json" + _version,
        success: function (data) {
            t.rows.add(data);
            t.draw();
        }
    });
}

function fillCalendar() {
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
                render: code => `<a href="course?c=${code}">${getCourse(code).Title}</a>`
            },
            {
                data: "Code",
                render: code => (getCourse(code).PreReq || []).join(", ")
            },
            {
                data: "Session",
                render: session => (session ? `<a href="${session}"><img src="../images/youtube.png" /></a>` : "")
            }
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });
    var search = new URLSearchParams(window.location.search);
    var q = Object.fromEntries(search.entries());
    var w = parseInt(q.w) || 1;
    $.ajax({
        url: "api/courses.json" + _version,
        success: function (courses) {
            _courses = courses;
            $.ajax({
                url: "api/calendar.json" + _version,
                success: function (data) {
                    var now = moment(new Date()).startOf("day").valueOf() / 1000;
                    data = data.filter(o => ((w & 1) != 0 && o.Date >= now) || ((w & 2) != 0 && o.Date < now));
                    t.rows.add(data);
                    t.draw();
                }
            });
        }
    });
    $("[name=when").each(function () {
        this.checked = parseInt(this.value) == w;
    });
    $("[name=when").on("change", function () {
        window.location.href = "calendar?w=" + this.value;
    });
}

function getCourse(code) {
    return _courses.find(function (o) {
        return o.Code == code;
    });
}

function loadCurso() {
    var code = window.location.search.replace(/\?c=(\w+-\w+)/, "$1");
    $.ajax({
        url: "api/courses.json" + _version,
        success: function (data) {
            var c = data.find(function (o) {
                return o.Code == code;
            });
            $("#title").text(c.Title);
            $("#code").text("[" + c.Code + "]");
            var ul = $("#topics").find("ul");
            if (c.Topics && c.Topics.length) {
                $.each(c.Topics, function () {
                    var topic = this;
                    ul.append($("<li>").text(topic));
                });
            } else {
                ul.append($("<li>").text("T.B.D."));
            }
            ul = $("#prereq").find("ul");
            if (c.PreReq && c.PreReq.length) {
                $.each(c.PreReq, function () {
                    var prereq = this;
                    var link = $("<a>")
                        .attr("href", "#" + prereq)
                        .text(prereq);
                    link.on("click", function () {
                        window.location.replace("#" + prereq);
                        window.location.reload();
                    });
                    ul.append($("<li>").append(link));
                });
            } else {
                ul.append($("<li>").text("Ninguno."));
            }
            $.ajax({
                url: "api/calendar.json" + _version,
                success: function (calendar) {
                    var sessions = calendar.filter(function (o) {
                        return o.Code == code;
                    });
                    ul = $("#sessions").find("ul");
                    if (sessions && sessions.length) {
                        $.each(sessions, function () {
                            var course = this;
                            var date = moment(course.Date * 1000);
                            var label = date.format("DD [de] MMMM [de] YYYY");
                            var link;
                            if (course.Session)
                                link = $("<a>").attr("href", course.Session).attr("target", "_blank").text(label);
                            else link = label;
                            ul.append(
                                $("<li>")
                                    .addClass(date.toDate() > new Date() ? "fut" : course.Session ? "rec" : "norec")
                                    .append(link)
                            );
                        });
                    } else {
                        ul.parent().hide();
                    }
                }
            });
        }
    });
}

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
        success: function (data) {
            if (data.version != 27159298) alert("Nueva versión. Favor de limpiar el cache del navegador.");
            _version = "?v=" + data.version;
            fn();
        },
        error: function (a, b, c) {
            debugger;
        }
    });
}

$.ajax({
    url: "/menu.html",
    success: function (data) {
        $(document.body).prepend(data);
    }
});
