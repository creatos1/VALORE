// librerias
import DataTable from 'react-data-table-component';

// Icons
import { CameraIcon } from '../common/icons/CameraIcon';
import { PointIcon } from '../common/icons/PointIcon';
import { BallpenIcon } from '../common/icons/BallpenIcon';



export const CatalogoTable = ({records, onSelectedRowsChange, setShowImg , setShowEdit, setSelectedImg, handleEditClick}) => {
  
  const handleImageClick = (img) => {
    setSelectedImg(img);
    setShowImg(true);
  };
  
  const columns = [
    {
      name: 'ID',
      selector: row => row.producto_Id,
      sortable: true,
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,
      sortable: true,
    },
    {
      name: 'Descripcion',
      selector: row => row.descripcion,
      sortable: true,
    },
    {
      name: 'Categoria',
      selector: row => row.categoria.nombre,
      sortable: true,
      cell: row => (
        <span className={`typeContent ${row.categoria.nombre === 'Producto' ? 'typeProducto' : (row.categoria.nombre === 'Servicio' ? 'typeServicio' : '')}`}>
          <PointIcon /> {row.categoria.nombre}
        </span>
      ),
    },
    {
      name: 'Fecha de Registro',
      selector: row => row.createdAt,
      sortable: true,
    },
    {
      name: 'Unidades',
      selector: row => row.stock,
      sortable: true,
    },
    {
      name: 'Precio',
      selector: row => row.precio,
      sortable: true,
    },
    {
      name: '',
      cell: row => (
        <div className="container-icons">
          <span onClick={() => handleImageClick(row.imagen)}> <CameraIcon/></span>
          <span onClick={() => handleEditClick(row)}> <BallpenIcon /> </span>
        </div>
      ),
    },
  ];

  return (
    <DataTable className="data-table"
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
