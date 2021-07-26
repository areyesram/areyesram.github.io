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
                        .text(o.Title)
                );
                b.append(
                    $("<tr>")
                        .append($("<td>").text(o.Code))
                        .append($("<td>").text(getTopic(o.Code)))
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
                                .text(p.Title)
                        );
                        b.append(
                            $("<tr>")
                                .append($("<td>").text(moment(o.Date * 1000).format("YYYY-MM-DD")))
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
    }[code.split("-")[0]];
}
