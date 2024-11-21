import mysql from "mysql";

export const CONEXION = mysql.createConnection({
  port: 3307,
  host: "localhost",
  user: "root",
  password: "",
  database: "db_transito",
});

// PARA PRODUCCIÓN
// export const CONEXION = mysql.createConnection({
//   port: ,
//   host: "",
//   user: "",
//   password: "",
//   database: "",
// });

export const CONECTAR_DB = () => {
  CONEXION.connect((error) => {
    if (error) {
      console.log("ERROR AL CONECTARSE: " + error);
      return;
    }
    console.log("CONEXIÓN EXITOSA A LA BASE DE DATOS");
  });
};
