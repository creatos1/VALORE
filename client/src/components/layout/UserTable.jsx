import DataTable from 'react-data-table-component';
import { PointIcon } from '../common/icons/PointIcon'; // Asegúrate de poner la ruta correcta
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import imagen from "../../assets/img/no.png"

export const UserTable = ({ records, onSelectedRowsChange, setShowImg , setSelectedImg }) => {

  const handleImageClick = (img) => {
    setSelectedImg(img);
    setShowImg(true);
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

  const columns = [
    {
      name: 'Nombre',
      selector: row => row.nombre,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.correo,
      sortable: true,
    },
    {
      name: 'Fecha de Registro',
      selector: row => row.fecha_registro,
      sortable: true,
    },
    {
      name: 'Rol de usuario',
      selector: row => row.role.rol,
      sortable: true,
      cell: row => (
        <span className={`roleContent ${row.role.rol === 'Administrador' ? 'roleAdmin' : (row.role.rol === 'M&D' ? 'roleMD' : 'roleDirector')}`}>
          <PointIcon /> {row.role.rol}
        </span>
      ),
    },
    {
      name: 'Imagen',
      selector: row => row.imagen,
      sortable: true,
      cell: row => (
        <button className='edit-button'>
            <img
              src={getFormattedImageUrl(row.imagen)}
              alt="Profile"
              className="img-profile"
              onClick={() => handleImageClick(row.imagen)}
              style={{ cursor: 'pointer' }}
            />
        </button>
      ),
    },
  ];

  return (
    <DataTable
      className="data-table"
      columns={columns}
      data={records}
      selectableRows
      onSelectedRowsChange={onSelectedRowsChange}
      pagination
      paginationPerPage={10}
      fixedHeader
      noDataComponent="No hay datos disponibles"
    />
  );
};
