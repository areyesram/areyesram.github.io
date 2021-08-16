function fillCourses() {
    $.ajax({
        url: "api/courses.json",
        success: function (courses) {
            var t = $("#grid");
            var b = t.find("tbody");
            for (var i = 0; i < courses.length; i++) {
                var o = courses[i];
                var title = $("<td>").append(
                    $("<a>")
                        .attr("href", "course.html#" + o.Code)
                        .attr("target", "_blank")
                        .text(o.Title)
                );
                var topic = getTopicCode(o.Code);
                b.append(
                    $("<tr>")
                        .append($("<td>").text(o.Code))
                        .append(
                            $("<td>").append(
                                $("<a>")
                                    .attr("href", "courses-" + topic + ".html")
                                    .attr("target", "_blank")
                                    .text(getTopic(o.Code))
                            )
                        )
                        .append(title)
                        .append($("<td>").text(o.PreReq))
                );
            }
            t.DataTable({
                language: {
                    url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
                }
            });
        }
    });
}

function fillCalendar() {
    $.ajax({
        url: "api/courses.json",
        success: function (courses) {
            $.ajax({
                url: "api/calendar.json",
                success: function (calendar) {
                    var t = $("#grid");
                    var b = t.find("tbody");
                    for (var i = 0; i < calendar.length; i++) {
                        var o = calendar[i];
                        var p = courses.find(function (q) {
                            return o.Code == q.Code;
                        });
                        var title = $("<td>").append(
                            $("<a>")
                                .attr("href", "course.html#" + o.Code)
                                .attr("target", "_blank")
                                .text(p.Title)
                        );
                        b.append(
                            $("<tr>")
                                .append(
                                    $("<td>").text(
                                        moment(o.Date * 1000).format(
                                            "YYYY-MM-DD"
                                        )
                                    )
                                )
                                .append($("<td>").text(o.Code))
                                .append($("<td>").text(getTopic(o.Code)))
                                .append(title)
                                .append($("<td>").text(p.PreReq))
                        );
                    }
                    t.DataTable({
                        language: {
                            url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
                        }
                    });
                }
            });
        }
    });
}

function loadCurso() {
    var code = window.location.hash;
    if (code.startsWith("#")) code = code.replace("#", "");
    else window.location.replace("404.html");
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
                                link = $("<a>")
                                    .attr("href", course.Session)
                                    .attr("target", "_blank")
                                    .text(label);
                            else link = label;
                            ul.append(
                                $("<li>")
                                    .addClass(
                                        date.toDate() > new Date()
                                            ? "fut"
                                            : course.Session
                                            ? "rec"
                                            : "norec"
                                    )
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
