import { MotionHoc } from "../../features/MotionHoc";
import { Title } from "../../components/common/Title";
import { Search } from "../../components/common/Search";
import { UserTable } from "../../components/layout/UserTable";
import { HeaderTable } from "../../components/common/HeaderTable";
import { PlusIcon } from "../../components/common/icons/PlusIcon";
import { useCreateEmployeeMutation, useGetAllEmployeesQuery, useDeleteEmployeeMutation } from "../../features/employees/employeeApiSlice.js";
import imagen from "../../assets/img/no.png"
import { useGetAllRolesQuery } from "../../features/employees/rolApiSlice.js";

// librerias
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { XboxXIcon } from "../../components/common/icons/XboxXIcon";

// Hooks
import React, { useState, useEffect } from "react";

import Swal from 'sweetalert2'

export const UsuariosSection = () => {
  // Datos
  const { data: usuarios, error, isLoading, refetch } = useGetAllEmployeesQuery();
  const [deleteUser, { isLoading: loading }] = useDeleteEmployeeMutation();
  const [createUser, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [SelectedUserIds, setSelectedUserIds] = useState([]);

  const { data: roles } = useGetAllRolesQuery()

  console.log("roles", roles)

  const [records, setRecords] = useState([]);
  // hook para mostrar y cerrar la ventana de filtros
  const [showFilters, setShowFilters] = useState(false);
  // hook para mostrar y cerrar la ventana de añadir nuevo usuario
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  // hook para mostrar y cerrar una img de usuario
  const [showImg, setShowImg] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  // Hook para eliminar las filas seleccionadas
  const [selectedRows, setSelectedRows] = useState([]);

  const [filteredRecords, setFilteredRecords] = useState(records);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol_Id: null,
    imagen: 'null',
  });

  useEffect(() => {
    setFilteredRecords(records);
  }, [records]);

  useEffect(() => {
    if (usuarios) {
      setRecords(usuarios);
    }
    console.log(usuarios)
  }, [usuarios]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      await createUser(formData).unwrap();
      refetch()
      setFormData({
        nombre: '',
        correo: '',
        password: '',
        rol_Id: null,
        imagen: 'null',
      });
      console.log('Usuario creado:', formData);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    if (selectedRows.length > 0) {
      const userIds = selectedRows.map(row => row.empleado_Id);
      setSelectedUserIds(userIds);
    } else {
      console.log('No rows selected');
      setSelectedUserIds([])
    }
  };

  const handleDelete = async () => {
    if (SelectedUserIds.length > 0) {
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
          await deleteUser({ ids: SelectedUserIds }).unwrap();
          setRecords(records.filter(record => !SelectedUserIds.includes(record.empleado_Id)));
          setSelectedUserIds([]);
          Swal.fire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error('Failed to delete users: ', error);
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

  // Estados iniciales de los filtros
  const [role, setRole] = useState("");

  // Filtro por nombre
  const handleChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = records.filter((record) =>
      record.nombre.toLowerCase().includes(searchTerm)
    );
    setFilteredRecords(filtered);
  };

    // Funciones para aplicar los filtros
    const handleTypeChange = (e) => setRole(e.target.value);
  
  // Función general que aplica todos los filtros
  const filterRecords = (roleFilter) => {
    const filteredData = records.filter((record) =>
      record.role.rol.includes(roleFilter)
    );
    setFilteredRecords(filteredData);
  };

  const applyFilters = () => {
    filterRecords(role);
  };

  const resetFilters = () => {
    filterRecords("");
  };

  const getFormattedImageUrl = (relativePath) => {
    if (!relativePath) return imagen;
  
    // devolver la ruta completa
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
  
    // formatearla para que sea una URL completa
    if (relativePath.includes('uploads')) {
      const cleanedPath = relativePath.replace(/\\+/g, '/'); // Reemplaza todas las barras invertidas con barras normales
      return `http://localhost:3000/${cleanedPath}`;
    }
      return imagen;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Title text="Empleados" />

      <div className="section-column">
        <Search text={"Buscar Empleado"} filter={handleChange} />
        <div className="section-box box">
          <HeaderTable
            title={"Empleados"}
            btn3Color={"btn-green"}
            btn3Text={"Nuevo Empleado"}
            btn3Icon={<PlusIcon />}
            btn2Funcion={setShowFilters}
            btn3Funcion={setShowNewUserForm}
            onDelete={handleDelete}
          />
          <div className="container-table">
            <UserTable
              records={filteredRecords}
              selectableRows
              onSelectedRowsChange={handleSelectedRowsChange}
              showImg={showImg}
              setShowImg={setShowImg}
              selectedImg={selectedImg}
              setSelectedImg={setSelectedImg}
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
                <div className="contentBox">
                  <div className="filter-section">
                    <label>Tipo:</label>
                    <select onChange={handleTypeChange} value={role} className="inputPantalla">
                      <option value="">Todos</option>
                      <option value="director">Director</option>
                      <option value="admin">Administrador</option>
                      <option value="marketing">M&D</option>
                    </select>
                  </div>
                  <div className="filter-buttons">
                    <button onClick={applyFilters} className="btn-green">Aplicar Filtros</button>
                    <button onClick={resetFilters} className="btn-yellow">Resetear Filtros</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Ventana para agregar nuevo usuario */}
          {showNewUserForm && (
            <motion.div
              className="box-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="box-content">
                <button className="close-button" 
                onClick={() => {
                  setShowNewUserForm(false)
                  }}>
                  <XboxXIcon />
                </button>
                <div className="contentBox">
                  {/* Aquí va el contenido del formulario */}
                  <form onSubmit={handleSubmit}>
                    <div className="form-section" >
                      <input type="text" name="nombre" id="nombre" placeholder="Nombre" className="inputPantalla" onChange={handleInputChange}/>
                      <input type="text" name="correo" id="correo" placeholder="Correo" className="inputPantalla" onChange={handleInputChange}/>
                      <input type="text" name="password" id="password" placeholder="Contraseña" className="inputPantalla" onChange={handleInputChange}/>
                    </div>

                    <div className="form-section">
                      <label>Tipo:</label>
                      <select  className="inputPantalla" name="rol_Id" onChange={handleInputChange}>
                      <option value="">seleccione un rol</option>
                        {roles.map(rol => (
                          <option key={rol.rol_Id} value={rol.rol_Id}>
                            {rol.rol}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-section">
                      <input
                          className="inputPantalla"
                          accept="image/*"
                          type="file"
                          name="imagen"
                          onChange={handleFileChange}
                        />
                    </div>

                    <button type="submit" className="btn-green" disabled={isCreating} onClick={() => setShowNewUserForm(false)}>
                      {isCreating ? 'Creating...' : 'Agregar Empleado'}
                    </button>
                  </form>
                  
                </div>
              </div>
            </motion.div>
          )}

          {/* Mostrar imagen de usuario */}
          {showImg && selectedImg && (
            <motion.div
              className="box-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="box-content">
                <button className="close-button" onClick={() => setShowImg(false)}>
                  <XboxXIcon />
                </button>
                <div className="contentBox">
                  <img src={getFormattedImageUrl(selectedImg)} alt="Profile" className="expanded-img" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showFilters && <div className="overlay" onClick={() => setShowFilters(false)} />}
      {showNewUserForm && <div className="overlay" onClick={() => setShowNewUserForm(false)} />}
      {showImg && <div className="overlay" onClick={() => setShowImg(false)} />}
    </>
  );
};

export const UsuariosSectionMotion = MotionHoc(UsuariosSection);
