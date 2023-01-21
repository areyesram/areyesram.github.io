/** @module */

const config = require("config");
const mysql = require("mysql");

/**
 * Pool de conexiones de MySQL.
 * Las configuraciones en config/default.json:mysql sobrescriben las dadas aquí.
 * Los compos tipo BIT y JSON reciben tratamiento especial.
 */
const pool = mysql.createPool(
    Object.assign(
        {
            connectionLimit: 100,
            multipleStatements: true,
            typeCast: function castField(field, useDefaultTypeCasting) {
                if (field.type === "BIT" && field.length === 1) {
                    const bytes = field.buffer();
                    return bytes[0] === 1;
                }
                //HACK: asume que un BLOB es JSON.
                //TODO: determinar si es JSON o binario (ej.: imagen)
                if (field.type === "BLOB" && field.length > 0) {
                    const bytes = field.buffer();
                    try {
                        if (!bytes) return null;
                        if (bytes.some(o => o < " " || o > "~")) {
                            return bytes;
                        } else {
                            return JSON.parse(bytes.toString());
                        }
                    } catch (err) {
                        return bytes;
                    }
                }
                return useDefaultTypeCasting();
            }
        },
        config.has("mysql") ? config.get("mysql") : {}
    )
);

/**
 * Ejecuta una consulta de MySQL.
 * @param {string} sql
 * @param {any[]} params
 */
exports.query = async (sql, params = null) => {
    console.log("SQL: " + sql);
    return await new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                reject(err);
            }
            connection.
            query(sql, params, function (err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    reject(err);
                }
                if (result && result[0]) resolve(JSON.parse(JSON.stringify(result[0])));
                else resolve(null);
            });
        });
    });
};

exports.end = async () => {
    pool.end();
};
