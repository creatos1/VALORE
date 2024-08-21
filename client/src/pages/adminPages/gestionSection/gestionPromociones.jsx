import { MotionHoc } from "../../../features/MotionHoc";
import {useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";


// Componentes
import { Title } from "../../../components/common/Title";
import { Search } from "../../../components/common/Search";
import { HeaderTable } from "../../../components/common/HeaderTable";
import { PromocionesTable } from "../../../components/layout/PromocionesTable";

// Icons
import { PlusIcon } from "../../../components/common/icons/PlusIcon";
import { XboxXIcon } from "../../../components/common/icons/XboxXIcon";

// ApiSlice
import {
  useGetAllPromotionsQuery,
  useGetPromotionByIdQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} from "../../../features/promotions/promotionsApiSlice";

export const GestionPromociones = () => {
  // Define el estado para selectdTipo formulario dinamico para agregar una promoción
  const [selectedTipo, setSelectedTipo] = useState("");

  


  // Exportar data
  const { data: promotions, error, isLoading } = useGetAllPromotionsQuery();
  const [promotionId, setPromotionId] = useState(null);
  const { 
    data: promotion,
    refetch: refetchPromotion
  } = useGetPromotionByIdQuery(promotionId, {
    skip: !promotionId, // Traer datos solo cuando promotionId esté establecido
  });

  const [createPromotion, { isLoading: isCreating }] =
    useCreatePromotionMutation();
  const [updatePromotion, { isLoading: isUpdating }] =
    useUpdatePromotionMutation();
  const [deletePromotion, { isLoading: isDeleting }] =
    useDeletePromotionMutation();
  const [SelectedPromotionIds, setSelectedPromotionIds] = useState([]);
  const { data: recordws = [], refetch } = useGetAllPromotionsQuery();

  const [records, setRecords] = useState(promotions || []);
  // Hook para ver los filtros
  const [showFilters, setShowFilters] = useState(false);
  // Hook para ver la parte para añidir nuevos productos
  const [showNewPromocion, setShowNewPromocion] = useState(false);
  // Hook para eliminar las filas seleccionadas
  const [selectedRows, setSelectedRows] = useState([]);
  // Hook para mostrar la ventana para editar a detalle la fila
  const [showEdit, setShowEdit] = useState(false);
  

  // Monitoreo de la información
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    descuento: "",
    comprar_cantidad: "",
    pagar_cantidad: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  useEffect(() => {
    if (showEdit) {
      setSelectedTipo(formData.tipo)
    }
  }, [showEdit, formData])

  useEffect(() => {
    if (promotions) {
      setRecords(promotions);
    }
  }, [promotions]);

  useEffect(() => {
    if (promotion) {
      setFormData({
        nombre: promotion.nombre || "",
        tipo: promotion.tipo || "",
        descuento: promotion.descuento || "",
        comprar_cantidad: promotion.comprar_cantidad || "",
        pagar_cantidad: promotion.pagar_cantidad || "",
        por_cada: promotion.por_cada || "",
        fecha_inicio: promotion.fecha_inicio || "",
        fecha_fin: promotion.fecha_fin || "",
      });
    }
  }, [promotion]); // Esperar a que los datos de promotion se traigan



  // Funciones CRUD

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      await createPromotion(formData).unwrap();
      refetch();
      setFormData({
        nombre: "",
        tipo: "",
        descuento: "",
        comprar_cantidad: "",
        pagar_cantidad: "",
        por_cada: "",
        fecha_inicio: "",
        fecha_fin: "",
      });
    } catch (error) {
      console.error("Error al crear la promoción:", error);
    }
  };

  const handleGetById = async (promocion_Id) => {
    if (!promocion_Id) {
      console.error("No se proporcionó un ID de promoción");
      return;
    }
    try {
      console.log(promocion_Id)
      setPromotionId(promocion_Id);
      await refetchPromotion(); // Volver a traer datos cuando promotionId cambia
    } catch (error) {
      console.error("Error al obtener promocion:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData, promocion_Id: promotionId };
      console.log('Updateeeeeeeee')
      console.log(updateData);
      console.log(promotionId);

      await updatePromotion(updateData).unwrap();

      // Refetch data
      refetch();
    } catch (error) {
      console.error("Error al actualizar promoción:", error);
    }
  };

  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    if (selectedRows.length > 0) {
      const promotionIds = selectedRows.map((row) => row.promocion_Id);
      setSelectedPromotionIds(promotionIds);
    } else {
      console.log("No rows selected");
    }
  };

  const handleDelete = async () => {
    if (SelectedPromotionIds.length > 0) {
      const confirmDelete = window.confirm(
        "¿Está seguro de que desea eliminar los elementos seleccionados?"
      );
      if (confirmDelete) {
        try {
          await deletePromotion({ ids: SelectedPromotionIds }).unwrap();
          setRecords(
            records.filter(
              (record) => !SelectedPromotionIds.includes(record.promocion_Id)
            )
          );
          setSelectedPromotionIds([]);
        } catch (error) {
          console.error("Failed to delete promotions: ", error);
        }
      }
    } else {
      alert("No hay filas seleccionadas para eliminar.");
    }
  };
  // Fin de las funciones CRUD

  // Estados para filtros
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  // Estados para filtros adicionales
  const [descuentoFilter, setDescuentoFilter] = useState("");
  const [comprarCantidadFilter, setComprarCantidadFilter] = useState("");
  const [pagarCantidadFilter, setPagarCantidadFilter] = useState("");
  const [porCadaFilter, setPorCadaFilter] = useState("");

  // Filtro por nombre (barra de busqueda)
  const handleChange = (e) => {
    const filteredRecords = promotions.filter((record) =>
      record.nombre.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setRecords(filteredRecords);
  };

  // Función general que aplica todos los filtros
  const applyFilters = () => {
    let filteredData = promotions;

    if (nameFilter) {
      filteredData = filteredData.filter((item) =>
        item.nombre.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (typeFilter) {
      filteredData = filteredData.filter((item) =>
        item.tipo.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }
    if (descuentoFilter) {
      filteredData = filteredData.filter(
        (item) => item.descuento === Number(descuentoFilter)
      );
    }
    if (comprarCantidadFilter) {
      filteredData = filteredData.filter(
        (item) => item.comprar_cantidad === Number(comprarCantidadFilter)
      );
    }
    if (pagarCantidadFilter) {
      filteredData = filteredData.filter(
        (item) => item.pagar_cantidad === Number(pagarCantidadFilter)
      );
    }
    if (porCadaFilter) {
      filteredData = filteredData.filter(
        (item) => item.por_cada === Number(porCadaFilter)
      );
    }

    setRecords(filteredData);
  };

  // Función para resetear los filtros
  const resetFilters = () => {
    setNameFilter("");
    setTypeFilter("");
    setRecords(promotions);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Title text="Promociones" />

      <div className="section-column">
        <Search text={"Buscar Producto/Servicio"} filter={handleChange} />
        <div className="section-box box" id="promocionesTable">
          <HeaderTable
            title={"Promociones"}
            btn3Color={"btn-green"}
            btn3Text={"Añadir Nueva Promoción"}
            btn3Icon={<PlusIcon />}
            btn2Funcion={setShowFilters}
            btn3Funcion={setShowNewPromocion}
            onDelete={handleDelete}
          />
          <div className="container-table ">
            <PromocionesTable
              records={records}
              onSelectedRowsChange={handleSelectedRowsChange}
              setShowEdit={setShowEdit}
              handleGetById={handleGetById}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="box-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="box-content">
              <button
                className="close-button"
                onClick={() => setShowFilters(false)}
              >
                <XboxXIcon />
              </button>
              <div className="contentFiltros">
                <div className="form-section">
                  <label>Tipo:</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="inputPantalla"
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="porcentaje_descuento">
                      Porcentaje de descuento
                    </option>
                    <option value="compra_x_paga_y">Compra X paga Y</option>
                    <option value="por_cada_x_te_descontamos_y">
                      Por cada X te descontamos Y
                    </option>
                  </select>
                </div>
                <div className="form-section">
                  <label>Descuento:</label>
                  <input
                    className="inputPantalla"
                    type="number"
                    value={descuentoFilter}
                    onChange={(e) => setDescuentoFilter(e.target.value)}
                  />
                </div>
                <div className="form-section">
                  <label>Comprar Cantidad:</label>
                  <input
                    className="inputPantalla"
                    type="number"
                    value={comprarCantidadFilter}
                    onChange={(e) => setComprarCantidadFilter(e.target.value)}
                  />
                </div>
                <div className="form-section">
                  <label>Pagar Cantidad:</label>
                  <input
                    className="inputPantalla"
                    type="number"
                    value={pagarCantidadFilter}
                    onChange={(e) => setPagarCantidadFilter(e.target.value)}
                  />
                </div>
                <div className="form-section">
                  <label>Por Cada:</label>
                  <input
                    className="inputPantalla"
                    type="number"
                    value={porCadaFilter}
                    onChange={(e) => setPorCadaFilter(e.target.value)}
                  />
                </div>
                <div className="filter-buttons">
                  <button onClick={applyFilters} className="btn-green">
                    Aplicar Filtros
                  </button>
                  <button onClick={resetFilters} className="btn-yellow">
                    Resetear Filtros
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showEdit && (
         
          <motion.div
            className="box-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            
            <div className="box-content">
              <button
                className="close-button"
                onClick={() => setShowEdit(false)}
              >
                <XboxXIcon />
              </button>
              <div className="contentBox">
              <form onSubmit={handleUpdate}>
                  <div className="form-section">
                    <input
                      className="inputPantalla"
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Nombre"
                      
                     
                    />
                    <label>Tipo:</label>
                    <select
                      className="inputPantalla"
                      name="tipo"
                      id="tipo"
                      value={formData.tipo}
                      onChange={(e) => {
                        handleInputChange(e);
                        setSelectedTipo(e.target.value);
                      }}
                    >
                      <option value="">Seleccione un tipo</option>
                      <option value="porcentaje_descuento">
                        Porcentaje de descuento
                      </option>
                      <option value="compra_x_paga_y">Compra X paga Y</option>
                      <option value="por_cada_x_te_descontamos_y">
                        Por cada X te descontamos Y
                      </option>
                    </select>

                    {selectedTipo === "porcentaje_descuento" && (
                      <input
                        className="inputPantalla"
                        type="number"
                        name="descuento"
                        id="descuento"
                        value={formData.descuento}
                        onChange={handleInputChange}
                        placeholder="Descuento (%)"
                      />
                    )}

                    {selectedTipo === "compra_x_paga_y" && (
                      <>
                        <input
                          className="inputPantalla"
                          type="number"
                          name="comprar_cantidad"
                          value={formData.comprar_cantidad}
                          id="comprar_cantidad"
                          onChange={handleInputChange}
                          placeholder="Comprar X cantidad"
                        />
                        <input
                          className="inputPantalla"
                          type="number"
                          name="pagar_cantidad"
                          id="pagar_cantidad"
                          value={formData.pagar_cantidad}
                          onChange={handleInputChange}
                          placeholder="Pagar Y cantidad"
                        />
                      </>
                    )}

                    {selectedTipo === "por_cada_x_te_descontamos_y" && (
                      <>
                        <input
                          className="inputPantalla"
                          type="number"
                          name="por_cada"
                          id="por_cada"
                          value={formData.por_cada}
                          onChange={handleInputChange}
                          placeholder="Por cada X cantidad"
                        />
                        <input
                          className="inputPantalla"
                          type="number"
                          name="descuento"
                          id="descuento"
                          value={formData.descuento}
                          onChange={handleInputChange}
                          placeholder="Descuento"
                        />
                      </>
                    )}

                    <label htmlFor="fecha_inicio">Fecha de Inicio</label>
                    <input
                      className="inputPantalla"
                      type="date"
                      name="fecha_inicio"
                      id="fecha_inicio"
                      value={formData.fecha_inicio}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="fecha_fin">Fecha de Fin</label>
                    <input
                      className="inputPantalla"
                      type="date"
                      name="fecha_fin"
                      id="fecha_fin"
                      value={formData.fecha_fin}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-section">
                  <button
                    className="btn-yellow"
                    type="submit"
                    disabled={isUpdating}
                    onClick={() => setShowEdit(false)}
                  >
                    Editar
                  </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {showNewPromocion && (
          <motion.div
            className="box-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="box-content">
              <button
                className="close-button"
                onClick={() => setShowNewPromocion(false)}
              >
                <XboxXIcon />
              </button>
              <div className="contentBox">
                <form onSubmit={handleSubmit}>
                  <div className="form-section">
                    <input
                      className="inputPantalla"
                      type="text"
                      name="nombre"
                      id="nombre"
                      onChange={handleInputChange}
                      placeholder="Nombre"
                    />
                    <label>Tipo:</label>
                    <select
                      className="inputPantalla"
                      name="tipo"
                      id="tipo"
                      onChange={(e) => {
                        handleInputChange(e);
                        setSelectedTipo(e.target.value);
                      }}
                    >
                      <option value="">Seleccione un tipo</option>
                      <option value="porcentaje_descuento">
                        Porcentaje de descuento
                      </option>
                      <option value="compra_x_paga_y">Compra X paga Y</option>
                      <option value="por_cada_x_te_descontamos_y">
                        Por cada X te descontamos Y
                      </option>
                    </select>

                    {selectedTipo === "porcentaje_descuento" && (
                      <input
                        className="inputPantalla"
                        type="number"
                        name="descuento"
                        id="descuento"
                        onChange={handleInputChange}
                        placeholder="Descuento (%)"
                      />
                    )}

                    {selectedTipo === "compra_x_paga_y" && (
                      <>
                        <input
                          className="inputPantalla"
                          type="number"
                          name="comprar_cantidad"
                          id="comprar_cantidad"
                          onChange={handleInputChange}
                          placeholder="Comprar X cantidad"
                        />
                        <input
                          className="inputPantalla"
                          type="number"
                          name="pagar_cantidad"
                          id="pagar_cantidad"
                          onChange={handleInputChange}
                          placeholder="Pagar Y cantidad"
                        />
                      </>
                    )}

                    {selectedTipo === "por_cada_x_te_descontamos_y" && (
                      <>
                        <input
                          className="inputPantalla"
                          type="number"
                          name="por_cada"
                          id="por_cada"
                          onChange={handleInputChange}
                          placeholder="Por cada X cantidad"
                        />
                        <input
                          className="inputPantalla"
                          type="number"
                          name="descuento"
                          id="descuento"
                          onChange={handleInputChange}
                          placeholder="Descuento"
                        />
                      </>
                    )}

                    <label htmlFor="fecha_inicio">Fecha de Inicio</label>
                    <input
                      className="inputPantalla"
                      type="date"
                      name="fecha_inicio"
                      id="fecha_inicio"
                      onChange={handleInputChange}
                    />
                    <label htmlFor="fecha_fin">Fecha de Fin</label>
                    <input
                      className="inputPantalla"
                      type="date"
                      name="fecha_fin"
                      id="fecha_fin"
                      onChange={handleInputChange}
                    />
                  </div>

                  <button
                    className="btn-green-icon"
                    type="submit"
                    disabled={isCreating}
                    onClick={() => setShowNewPromocion(false)}
                  >
                    <PlusIcon /> Añadir
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logica para mostrar el difuminado y cerrar la ventana al dar clic fuera de esta*/}
      {showFilters && (
        <div className="overlay" onClick={() => setShowFilters(false)} />
      )}

      {showNewPromocion && (
        <div className="overlay" onClick={() => setShowNewPromocion(false)} />
      )}

      {showEdit && (
        <div className="overlay" onClick={() => setShowEdit(false)} />
      )}
    </>
  );
};

export const GestionPromocionesMotion = MotionHoc(GestionPromociones);
