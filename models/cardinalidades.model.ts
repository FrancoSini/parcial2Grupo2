import { UsuarioModel } from "./usuario.model";
import { CategoriaModel } from "./categoria.model";
import { TransaccionModel } from "./transaccion.model";

UsuarioModel.hasMany(TransaccionModel, { foreignKey: "usuario_id" });
TransaccionModel.belongsTo(UsuarioModel, { foreignKey: "usuario_id" });

CategoriaModel.hasMany(TransaccionModel, { foreignKey: "categoria_id" });
TransaccionModel.belongsTo(CategoriaModel, { foreignKey: "categoria_id" });

export { UsuarioModel, CategoriaModel, TransaccionModel };
