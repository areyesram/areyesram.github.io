const fs = require("fs");
const sql = require("./sql");

async function main() {
    const courses = JSON.parse(fs.readFileSync("../api/courses.json").toString());
    for (let course of courses) {
        const courseId = await sql.query("CALL CourseSave(?,?)", [course.Code, course.Title]);
        console.log(courseId);
    }
    console.log("");
}

main();
