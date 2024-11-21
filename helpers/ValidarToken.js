import jwt from "jsonwebtoken";
import { TOKEN_SECRETO } from "../initial/config.js";

export const ValidarTokenParaPeticion = async (TokenDeAcceso) => {
  return new Promise((resolve, reject) => {
    jwt.verify(TokenDeAcceso, TOKEN_SECRETO, (err) => {
      if (err) {
        return resolve(false);
      }
      return resolve(true);
    });
  });
};
