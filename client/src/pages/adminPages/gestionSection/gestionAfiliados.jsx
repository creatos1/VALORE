import { MotionHoc } from "../../../features/MotionHoc";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

// Componentes
import { Title } from "../../../components/common/Title";
import { HeaderTable } from "../../../components/common/HeaderTable";
import { Search } from "../../../components/common/Search";
import { AfiliadosTable } from "../../../components/layout/AfiliadosTable";

// Icons
import { XboxXIcon } from "../../../components/common/icons/XboxXIcon";
import { PlusIcon } from "../../../components/common/icons/PlusIcon";

// GestionAfiliados.jsx
import {
  useGetAllAffiliatesQuery,
  useGetAffiliateByIdQuery,
  useCreateAffiliateMutation,
  useUpdateAffiliateMutation,
  useDeleteAffiliateMutation,
} from "../../../features/affiliates/affiliateApiSlice";

import Swal from 'sweetalert2'

export const GestionAfiliados = () => {
  // Datos
  const { data: affiliates, error, isLoading } = useGetAllAffiliatesQuery();
  const [affiliateId, setAffiliateId] = useState([]);
  const {
    data: affiliate,
    refetch: refetchAffiliate
  } = useGetAffiliateByIdQuery(affiliateId, {
    skip: !affiliateId, // No realizar la consulta si no hay un ID de afiliado
  });
  const [createAffiliate, { isLoading: isCreating }] =
    useCreateAffiliateMutation();
  const [updateAffiliate, { isLoading: isUpdating }] =
    useUpdateAffiliateMutation();
  const [deleteAffiliate, { isLoading: isDeleting }] =
    useDeleteAffiliateMutation();
  const [SelectedAffiliateIds, setSelectedAffiliateIds] = useState([]);
  const { data: recordws = [], refetch } = useGetAllAffiliatesQuery();

  const [records, setRecords] = useState(affiliates || []);
  // Hook para ver los filtros
  const [showFilters, setShowFilters] = useState(false);
  // Hook para ver la parte para añadir nuevos afiliados
  const [showNewAfiliado, setShowNewAfiliado] = useState(false);
  // Hook para eliminar las filas seleccionadas
  const [selectedRows, setSelectedRows] = useState([]);
  // Hook para mostrar la ventana para editar a detalle la fila
  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    nombre_empresa: "",
    nombre_persona: "",
    email: "",
    telefono: "",
    direccion: "",
    birthday: "",
    descuento_porcentaje: 0,
  });

  useEffect(() => {
    if (affiliates) {
      setRecords(affiliates);
    }
  }, [affiliates]);

  useEffect(() => {
    if (affiliate) {
      setFormData({
        nombre_empresa: affiliate.nombre_empresa || "",
        nombre_persona: affiliate.nombre_persona || "",
        email: affiliate.email || "",
        telefono: affiliate.telefono || "",
        direccion: affiliate.direccion || "",
        birthday: affiliate.birthday || "",
        descuento_porcentaje: affiliate.descuento_porcentaje || 0,
      });
    }
  }, [affiliate]);

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
      await createAffiliate(formData).unwrap();
      refetch();
      setFormData({
        nombre_empresa: "",
        nombre_persona: "",
        email: "",
        telefono: "",
        direccion: "",
        birthday: "",
        descuento_porcentaje: 0,
      });
      console.log("Usuario creado:", formData);
    } catch (error) {
      console.error("Error al crear afiliado:", error);
    }
  };

  const handleGetById = async (afiliado_Id) => {
    try {
      setAffiliateId(afiliado_Id); // Establece el ID de afiliado para realizar la consulta
      await refetchAffiliate();
    } catch (error) {
      console.error("Error al obtener afiliado:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData, afiliado_Id: affiliateId }; // Asegúrate de que estás utilizando 'afiliado_id' que es lo que espera el servidor
      console.log(updateData);
      await updateAffiliate(updateData).unwrap();

      // Refetch data
      refetch();
    } catch (error) {
      console.error("Error al actualizar afiliado:", error);
    }
  };

  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    if (selectedRows.length > 0) {
      const affiliateIds = selectedRows.map((row) => row.afiliado_Id);
      setSelectedAffiliateIds(affiliateIds);
    } else {
      console.log("No rows selected");
      setSelectedAffiliateIds([])
    }
  };

  const handleDelete = async () => {
    if (SelectedAffiliateIds.length > 0) {
      const result = await Swal.fire({
        title: '¿Está seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, elimínalo!',
      });
      if (result.isConfirmed) {
        try {
          await deleteAffiliate({ ids: SelectedAffiliateIds }).unwrap();
          setRecords(
            records.filter(
              (record) => !SelectedAffiliateIds.includes(record.afiliado_Id)
            )
          );
          Swal.fire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
          setSelectedAffiliateIds([]);
        } catch (error) {
          Swal.fire(
            'Error',
            'Hubo un problema al intentar eliminar los usuarios.',
            'error'
          );
        }
      }
    } else {
      Swal.fire(
        'No hay filas seleccionadas',
        'Selecciona al menos una fila para eliminar.',
        'info'
      );
    }
  };

  // Fin de las funciones CRUD

  // useState para los filtros
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [empresaFilter, setEmpresaFilter] = useState("");

  // Filtro por nombre
  const handleNameChange = (e) => {
    setNameFilter(e.target.value);
  };

  // Filtro por nombre
  const handleChange = (e) => {
    const filteredRecords = affiliates.filter((record) =>
      record.nombre_persona.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setRecords(filteredRecords);
  };

  // Filtro por email
  const handleEmailChange = (e) => {
    setEmailFilter(e.target.value);
  };

  // Filtro por empresa
  const handleEmpresaChange = (e) => {
    setEmpresaFilter(e.target.value);
  };

  // Función general que aplica todos los filtros
  const applyFilters = () => {
    let filteredData = affiliates;

    if (nameFilter) {
      filteredData = filteredData.filter((item) =>
        item.nombre_persona.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (emailFilter) {
      filteredData = filteredData.filter((item) =>
        item.email.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }

    if (empresaFilter) {
      filteredData = filteredData.filter((item) =>
        item.nombre_empresa.toLowerCase().includes(empresaFilter.toLowerCase())
      );
    }

    setRecords(filteredData);
  };

  // Función para resetear los filtros
  const resetFilters = () => {
    setNameFilter("");
    setEmailFilter("");
    setEmpresaFilter("");
    setRecords(affiliates);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Title text="Gestión de Afiliados" />

      <div className="section-column">
        <Search text={"Buscar Afiliado"} filter={handleChange} />

        <div className="section-box box">
          <HeaderTable
            title={"Afiliados"}
            btn3Color={"btn-green"}
            btn3Text={"Añadir Afiliado"}
            btn3Icon={<PlusIcon />}
            btn2Funcion={setShowFilters}
            btn3Funcion={setShowNewAfiliado}
            onDelete={handleDelete}
          />
          <div className="container-table">
            <AfiliadosTable
              records={records}
              onSelectedRowsChange={handleSelectedRowsChange}
              setShowEdit={setShowEdit}
              handleGetById={handleGetById}
            />
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
                  {/* Aquí van los filtros */}
                  <div className="filter-section">
                    <label>Nombre:</label>
                    <input
                      className="inputPantalla"
                      type="text"
                      placeholder="Nombre"
                      onChange={handleNameChange}
                      value={nameFilter}
                    />
                  </div>
                  <div className="filter-section">
                    <label>Email:</label>
                    <input
                      className="inputPantalla"
                      type="text"
                      placeholder="Email"
                      onChange={handleEmailChange}
                      value={emailFilter}
                    />
                  </div>
                  <div className="filter-section">
                    <label>Empresa:</label>
                    <input
                      className="inputPantalla"
                      type="text"
                      placeholder="Empresa"
                      onChange={handleEmpresaChange}
                      value={empresaFilter}
                    />
                  </div>
                  <div className="filter-buttons">
                    <button className="btn-green" onClick={applyFilters}>
                      Aplicar Filtros
                    </button>
                    <button className="btn-yellow" onClick={resetFilters}>
                      Resetear Filtros
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Contenido a mostrar al dar click en el botón "añadir afiliado" */}
          {showNewAfiliado && (
            <motion.div
              className="box-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="box-content">
                <button
                  className="close-button"
                  onClick={() => setShowNewAfiliado(false)}
                >
                  <XboxXIcon />
                </button>
                <div className="contentBox">
                  <form onSubmit={handleSubmit}>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="text"
                        name="nombre_persona"
                        id="nombre_persona"
                        onChange={handleInputChange}
                        placeholder="Nombre"
                      />
                    </div>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="date"
                        name="birthday"
                        id="birthday"
                        onChange={handleInputChange}
                        placeholder="Fecha de Nacimiento"
                      />
                    </div>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="email"
                        name="email"
                        id="email"
                        onChange={handleInputChange}
                        placeholder="Email"
                      />
                    </div>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="text"
                        name="direccion"
                        id="direccion"
                        onChange={handleInputChange}
                        placeholder="Dirección"
                      />
                    </div>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="text"
                        name="telefono"
                        id="telefono"
                        onChange={handleInputChange}
                        placeholder="Teléfono"
                      />
                    </div>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="text"
                        name="nombre_empresa"
                        id="nombre_empresa"
                        onChange={handleInputChange}
                        placeholder="Empresa"
                      />
                    </div>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="number"
                        name="descuento_porcentaje"
                        id="descuento_porcentaje"
                        onChange={handleInputChange}
                        placeholder="Descuento"
                      />
                    </div>
                    <button
                      className="btn-green-icon"
                      type="submit"
                      disabled={isCreating}
                      onClick={() => setShowNewAfiliado(false)}
                    >
                      <PlusIcon /> Añadir
                    </button>
                  </form>
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
                        name="nombre_persona"
                        id="nombre_persona"
                        value={formData.nombre_persona}
                        onChange={handleInputChange}
                        placeholder="Nombre"
                      />
                    </div>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="date"
                        name="birthday"
                        id="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        placeholder="Fecha de Nacimiento"
                      />
                    </div>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                      />
                    </div>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="text"
                        name="direccion"
                        id="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        placeholder="Dirección"
                      />
                    </div>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="text"
                        name="telefono"
                        id="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="Teléfono"
                      />
                    </div>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="text"
                        name="nombre_empresa"
                        id="nombre_empresa"
                        value={formData.nombre_empresa}
                        onChange={handleInputChange}
                        placeholder="Empresa"
                      />
                    </div>
                    <div className="form-section">
                      <input
                        className="inputPantalla"
                        type="number"
                        name="descuento_porcentaje"
                        id="descuento_porcentaje"
                        value={formData.descuento_porcentaje}
                        onChange={handleInputChange}
                        placeholder="Descuento"
                      />
                    </div>
                    <button
                      className="btn-green"
                      type="submit"
                      disabled={isUpdating}
                      onClick={() => setShowEdit(false)}
                    >
                      Editar
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logica para mostrar el difuminado y cerrar la ventana al dar clic fuera de esta*/}
      {showFilters && (
        <div className="overlay" onClick={() => setShowFilters(false)} />
      )}

      {/* Logica para mostrar el difuminado y cerrar la ventana al dar clic fuera de esta*/}
      {showEdit && (
        <div className="overlay" onClick={() => setShowEdit(false)} />
      )}

      {/* Logica para mostrar el difuminado y cerrar la ventana al dar clic fuera de esta*/}
      {showNewAfiliado && (
        <div className="overlay" onClick={() => setShowNewAfiliado(false)} />
      )}
    </>
  );
};

export const GestionAfiliadosMotion = MotionHoc(GestionAfiliados);
