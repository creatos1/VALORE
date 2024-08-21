import { getAllPP, getOnePP, createPP, updatePP, deletePP } from "../services/producto_promocion.service.js"

/**
 * @module producto_promocion
 * @memberof module:Controllers
 */

/**
 * Controlador para manejar la solicitud de obtener todos los registros de `producto_promocion`
 * @function
 * @async
 * @param {Object} req Objeto de la solicitud HTTP
 * @param {Object} res Objeto de la respuesta HTTP
 * @returns {Promise<void>} Retorna el resultado de la llamada al servicio `getAllPP` si todo sale bien y si falla 
 * muestra el error en la consola y retorna un mensaje de error.
 */
export const getPPs = async (req, res) => {
    try {
        const allPP = await getAllPP();
        return res.json(allPP);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "There was an internal server error." });
    }
}

/**
 * Controlador para manejar la solicitud de obtener un registro de `producto_promocion`.
 * @function
 * @async
 * @param {Object} req Objeto de la solicitud HTTP
 * @param {Object} res Objeto de la respuesta HTTP
 * @returns {Promise<void>} Retorna el resultado de la llamada al servicio `getOnePP` si todo sale bien y si falla
 * muestra el error en la consola y retorna un mensaje de error.
 */
export const getPP = async (req, res) => {
    const id = req.params.producoPromo_Id;
    try {
        const pp = await getOnePP(id);
        if (!pp) {
            return res.status(404).json({ error: "This record does not exist." })
        }
        return res.json(pp);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "There was an internal server error." });
    }
}

/**
 * Controlador para manejar la solicitud de crear un nuevo registro de `producto_promocion`.
 * @function
 * @async
 * @param {Object} req Objeto de la solicitud HTTP
 * @param {Object} res Objeto de la respuesta HTTP
 * @returns {Promise<void>} Retorna el resultado de la llamada al servicio `createPP` si todo sale bie, y si falla 
 * muestra el error en la consola y retorna un mensaje de error.
 */
export const addPP = async (req, res) => {
    try {
        const newPP = await createPP(req.body);
        return res.json(newPP);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "There was an internal server error." });
    }
}

/**
 * Controlador para manejar la solicitud de actualizar un registro de `producto_promocion`
 * @function
 * @async
 * @param {Object} req Objeto de la solicitud HTTP
 * @param {Object} res Obejeto de la respuesta HTTP
 * @returns {Promise<void>} Retorna un mensaje de éxito si todo sale bien, y si falla muestra el error en la consola
 * y retorna un mensaje de error.
 */
export const upPP = async (req, res) => {
    const id = req.params.producoPromo_Id;
    try {
        const updatedPP = await updatePP(id, req.body);
        if (!updatedPP) {
            return res.status(404).json({ error: "This record does not exist." })
        }
        return res.json({ message: `Producto promocion con el id ${id} actualizado.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "There was an internal server error." });
    }
}

/**
 * Controlador para manejar la solicitud de eliminar registros de `producto_promocion`
 * @function
 * @async
 * @param {Object} req Objeto de la solicitud HTTP
 * @param {Object} res Objeto de la respuesta HTTP
 * @returns {Promise<void>} Retorna un mensaje de éxito si todo sale bien, y si falla muestra el error en la consola
 * y retorna un mensaje de error.
 */
export const delPP = async (req, res) => {
    const { ids } = req.body;
    try {
        await deletePP(ids);
        return res.json({ mesage: `Producto promcion  eliminado.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "There was an internal server error." });
    }
}