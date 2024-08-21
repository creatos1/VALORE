// librerias
import DataTable from "react-data-table-component";

// Icons
import { BallpenIcon } from "../common/icons/BallpenIcon";



export const AfiliadosTable = ({records, onSelectedRowsChange, setShowEdit, handleGetById}) => {

  // funcion
  const handleEditClick = async (afiliado_Id) => {
    setShowEdit(true);
    await handleGetById(afiliado_Id);
  }
  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre_persona,
      sortable: true,
    },
    {
        name: "Fecha de Nacimiento",
        selector: (row) => row.birthday,
        sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Direccion",
      selector: (row) => row.direccion,
      sortable: true,
    },
    {
      name: "Numero de telefono",
      selector: (row) => row.telefono,
      sortable: true,
    },
    {
      name: "Empresa",
      selector: (row) => row.nombre_empresa,
      sortable: true,
    },
    
    {
      name: "Descuento Personalizado",
      selector: (row) => row.descuento_porcentaje,
      sortable: true,
      cell: (row) => <> {row.descuento_porcentaje}% </>,
    },
    {
      name: "",
      cell: (row) => (
        <div className="container-icons">
          <span onClick={() => handleEditClick(row.afiliado_Id)} >
            <BallpenIcon />
          </span>
        </div>
      )
    }
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
