import jsPDF from "jspdf";
import "jspdf-autotable";

// Función para exportar a PDF
export const ExportDataPDF = (records) => {
  const doc = new jsPDF();
  
  const tableColumn = [
    "Cliente", "Tipo de Cliente", "Email", "Producto/Servicio", "Unidades Vendidas", 
    "Monto total", "Método de pago", "Fecha", "Factura"
  ];

  const tableRows = [];

  records.forEach(record => {
    const rowData = [
      record.venta.usuario ? record.venta.usuario.nombre : record.venta.afiliado.nombre_persona,
      record.venta.afiliado ? "Afiliado" : "Publico",
      record.venta.usuario ? record.venta.usuario.correo : record.venta.afiliado.email,
      record.producto.categoria.nombre,
      record.cantidad,
      record.venta.total,
      record.metodo,
      record.venta.fecha,
      record.venta.facturado ? "Solicitada" : "No Solicitada"
    ];
    tableRows.push(rowData);
  });

  doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
  doc.text("Historial de Ventas", 14, 15);
  doc.save("historial_ventas.pdf");
};
