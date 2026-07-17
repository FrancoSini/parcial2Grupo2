import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

import { UsuarioModel } from "./usuario.model";
import { CategoriaModel } from "./categoria.model";
import { TransaccionModel } from "./transaccion.model";

import "./cardinalidades.model";

export { UsuarioModel, CategoriaModel, TransaccionModel };
