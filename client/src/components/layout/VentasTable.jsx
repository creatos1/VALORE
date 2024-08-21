// librerias
import DataTable from "react-data-table-component";

// Icons
import { PointIcon } from "../common/icons/PointIcon";

export const VentasTable = ({ records, onSelectedRowsChange }) => {
  const columns = [
    {
      name: "Cliente",
      selector: (row) =>
        row.venta.usuario ? row.venta.usuario.nombre : row.venta.afiliado.nombre_persona,
      sortable: true,
    },
    {
      name: "Tipo de Cliente",
      selector: (row) => (row.venta.afiliado ? "Afiliado" : "Publico"),
      sortable: true,
      cell: (row) => (
        <span
          className={`typeContent ${
            row.venta.afiliado ? "typeAfiliado" : "typePublico"
          }`}
        >
          <PointIcon /> {row.venta.afiliado ? "Afiliado" : "Publico"}
        </span>
      ),
    },
    {
      name: "Email",
      selector: (row) => 
        row.venta.usuario ? row.venta.usuario.correo : row.venta.afiliado.email,
      sortable: true,
    },
    // {
    //   name: "Producto/Servicio",
    //   selector: (row) => row.tipoVenta,
    //   sortable: true,
    //   cell: (row) => (
    //     <span
    //       className={`typeContent ${
    //         row.tipoVenta === "Producto"
    //           ? "typeProducto"
    //           : row.tipoVenta === "Servicio"
    //           ? "typeServicio"
    //           : ""
    //       }`}
    //     >
    //       <PointIcon /> {row.tipoVenta}
    //     </span>
    //   ),
    // },
    {
      name: "Unidades Vendidas",
      selector: (row) => row.cantidad,
      sortable: true,
    },
    {
      name: "Monto total",
      selector: (row) => row.venta.total,
      sortable: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.venta.fecha,
      sortable: true,
    },
    {
      name: "Factura",
      selector: (row) => (row.venta.facturado ? "Solicitada" : "No Solicitada"),
      sortable: true,
      cell: (row) => (
        <span
          className={`typeContent ${
            row.venta.facturado ? "typeSolicitada" : "typeNoSolicitada"
          }`}
        >
          <PointIcon /> {row.venta.facturado ? "Solicitada" : "No Solicitada"}
        </span>
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
