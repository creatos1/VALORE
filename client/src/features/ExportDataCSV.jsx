import { CSVLink } from "react-csv";
import { DownloadIcon } from "../components/common/icons/DownloadIcon";

export const ExportDataCSV = ({ records }) => {
  const headers = [
    { label: "Cliente", key: "cliente" },
    { label: "Tipo de Cliente", key: "tipoCliente" },
    { label: "Email", key: "email" },
    { label: "Producto/Servicio", key: "tipoVenta" },
    { label: "Unidades Vendidas", key: "unidades" },
    { label: "Monto total", key: "total" },
    { label: "Método de pago", key: "metodo" },
    { label: "Fecha", key: "fecha" },
    { label: "Factura", key: "factura" },
  ];

  // Convertir records al formato necesario
  const csvData = records.map((record) => ({
    cliente: record.venta.usuario ? record.venta.usuario.nombre : record.venta.afiliado.nombre_persona,
    tipoCliente: record.venta.afiliado ? "Afiliado" : "Publico",
    email: record.venta.usuario ? record.venta.usuario.correo : record.venta.afiliado.email,
    tipoVenta: record.producto.categoria.nombre,
    unidades: record.cantidad,
    total: record.venta.total,
    metodo: record.metodo,
    fecha: record.venta.fecha,
    factura: record.venta.facturado ? "Solicitada" : "No Solicitada",
  }));

  return (
    <CSVLink data={csvData} headers={headers} filename="historial_ventas.csv">
      <button className="btn-green-icon">
        <DownloadIcon /> Exportar a CSV
      </button>
    </CSVLink>
  );
};
