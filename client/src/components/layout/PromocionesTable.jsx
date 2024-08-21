// librerias
import DataTable from "react-data-table-component";
import { PointIcon } from "../common/icons/PointIcon";

// Icons
import { BallpenIcon } from "../common/icons/BallpenIcon";

export const PromocionesTable = ({
  records,
  onSelectedRowsChange,
  setShowEdit,
  handleGetById,
  setSelectedTipo,
}) => {

    // funcion
    const handleEditClick = async (promotion_id) => {
      setShowEdit(true);
      await handleGetById(promotion_id);
    }

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Tipo",
      selector: (row) => row.tipo,
      sortable: true,
      cell: (row) => (
        <span
          className={`typeContent ${
            row.tipo === "compra_x_paga_y"
              ? "typeCompra_x_paga_y"
              : row.tipo === "porcentaje_descuento"
              ? "typePorcentaje_descuento"
              : row.tipo === "por_cada_x_te_descontamos_y" 
              ? "typePor_cada_x_te_descontamos_y"
              : ""
          }`}
        >
          <PointIcon /> {row.tipo}
        </span>
      ),
    },
    {
      name: "Descuento",
      selector: (row) => row.descuento,
      sortable: true,
      cell: (row) => (
        <span>{ !row.descuento ? "No aplica" : `${row.descuento}%` }</span>
      ),
    },
    {
      name: "Por cada X cantidad",
      selector: (row) => row.por_cada,
      sortable: true,
      cell: (row) => (
        <span>{ !row.por_cada ? "No aplica" : row.por_cada }</span>
      ),
    },
    {
      name: "Comprar X cantidad",
      selector: (row) => row.comprar_cantidad,
      sortable: true,
      cell: (row) => (
        <span>{ !row.comprar_cantidad ? "No aplica" : row.comprar_cantidad }</span>
      ),
    },
    {
      name: "Paga Y cantidad",
      selector: (row) => row.pagar_cantidad,
      sortable: true,
      cell: (row) => (
        <span>{ !row.pagar_cantidad ? "No aplica" : row.pagar_cantidad }</span>
      ),
    },
    {
      name: "Fecha de Inicio",
      selector: (row) => row.fecha_inicio,
      sortable: true,
    },
    {
      name: "Fecha de Fin",
      selector: (row) => row.fecha_fin,
      sortable: true,
    },
    {
      name: "",
      cell: (row) => (
        <div className="container-icons">
          <span onClick={() => handleEditClick(row.promocion_Id)}>
            <BallpenIcon />
          </span>
        </div>
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
