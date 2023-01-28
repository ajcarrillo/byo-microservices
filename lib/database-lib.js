import mysql from 'mysql'

import logger from '../logger/index.js'

const { createConnection} = mysql

/**
 * Creates a MySQL database connection
 * @return {mysql.Connection} The database connection object
 */
const connect = () => {
  const connection = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  return connection
}

/**
 * Perfroms a database select statement
 * @param {string} sql An SQL statement
 * @return {Promise}
 */
const select = (sql) => {
  return new Promise((resolve, reject) => {
    const returnObj = {
      error: null,
      results: [],
      fields: [],
    }

    const connection = connect()

    if (connection) {
      connection.query({
        sql,
        timeout: 20000,
      }, (error, results, fields) => {
        if (!error) {
          returnObj.results = results
          returnObj.fields = fields
        } else {
          returnObj.error = error
          logger.warn(`database-lib: SQL select query failed: ${error}`)
        }
        connection.end()
        resolve(returnObj)
      })
    } else {
      logger.error(`database-lib: SQL connection failed in select method: ${resultObj.error}`)
      reject(new Error('CONNECTION_FAILED'))
    }
  })
}

// update(name, sql) {
//   return new Promise((resolve, reject) => {
//     var returnObj = {
//       error: null,
//       changedRows: 0
//     };

//     this.getConnection(name, (err, connection) => {
//       if (err) {
//         returnObj.error = err;
//         reject(returnObj);
//       } else {
//         connection.query({
//           sql: sql,
//           timeout: 20000 // 20s
//         }, (error, result) => {
//           if (!error) {
//             returnObj.changedRows = result.changedRows;
//           } else {
//             returnObj.error = error;
//           }
//           connection.release();
//           resolve(returnObj);
//         });
//       }
//     });
//   });
// }

// delete(name, sql) {
//   return new Promise((resolve, reject) => {
//     var returnObj = {
//       error: null,
//       affectedRows: 0
//     };

//     this.getConnection(name, (err, connection) => {
//       if (err) {
//         returnObj.error = err;
//         reject(returnObj);
//       } else {
//         connection.query({
//           sql: sql,
//           timeout: 20000 // 20s
//         }, (error, result) => {
//           if (!error) {
//             returnObj.affectedRows = result.affectedRows;
//           } else {
//             returnObj.error = error;
//           }
//           connection.release();
//           resolve(returnObj);
//         });
//       }
//     });
//   });
// }

// insert(name, sql) {
//   return new Promise((resolve, reject) => {
//     var returnObj = {
//       error: null,
//       insertID: null
//     };

//     this.getConnection(name, (err, connection) => {
//       if (err) {
//         returnObj.error = err;
//         reject(returnObj);
//       } else {
//         connection.query({
//           sql: sql,
//           timeout: 20000 // 20s
//         }, (error, result) => {
//           if (!error) {
//             returnObj.insertID = result.insertId;
//           } else {
//             returnObj.error = error;
//           }
//           resolve(returnObj);
//           connection.release();
//         });
//       }
//     });
//   });
// }

/**
 * Escapes characters in a string for MySQL statements
 * @param {string} str The string to escape
 * @return {string} The escaped string
 */
const mysqlRealEscapeString = (str) => {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
    case '\0':
      return '\\0'
    case '\x08':
      return '\\b'
    case '\x09':
      return '\\t'
    case '\x1a':
      return '\\z'
    case '\n':
      return '\\n'
    case '\r':
      return '\\r'
    case '"':
    case "'":
    case '\\':
      return '\\' + char
    case '%':
      return encodeURIComponent('%')
    }
  })
}

export {
  mysqlRealEscapeString,
  select,
}
