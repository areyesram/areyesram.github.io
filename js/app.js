function fillCourses() {
    var t = $("#grid").DataTable({
        columns: [
            { data: "Code" },
            {
                data: "Code",
                render: code => `<a href="courses-${getTopicCode(code)}.html">${getTopic(code)}</a>`
            },
            {
                data: "Code",
                render: code => `<a href="course.html?c=${code}">${getCourse(code).Title}</a>`
            },
            {
                data: "Code",
                render: code => (getCourse(code).PreReq || []).join(", ")
            }
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });
    $.ajax({
        url: "api/courses.json",
        success: function (courses) {
            _courses = courses;
            $.ajax({
                url: "api/calendar.json",
                success: function (data) {
                    t.rows.add(data);
                    t.draw();
                }
            });
        }
    });
}

function fillCalendar() {
    var t = $("#grid").DataTable({
        columns: [
            {
                data: "Date",
                render: date => moment(date * 1000).format("YYYY-MMM-DD")
            },
            { data: "Code" },
            {
                data: "Code",
                render: code => `<a href="courses-${getTopicCode(code)}.html">${getTopic(code)}</a>`
            },
            {
                data: "Code",
                render: code => `<a href="course.html?c=${code}">${getCourse(code).Title}</a>`
            },
            {
                data: "Code",
                render: code => (getCourse(code).PreReq || []).join(", ")
            }
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });
    $.ajax({
        url: "api/courses.json",
        success: function (data) {
            t.rows.add(data);
            t.draw();
        }
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
        url: "api/courses.json",
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
                url: "api/calendar.json",
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
