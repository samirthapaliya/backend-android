const { createPool } = require("mysql2/promise");

module.exports = connect = async () => {
  const connection = await createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "productshop",
    connectionLimit: 10,
    port: 3307,
  });

  return connection;
};
