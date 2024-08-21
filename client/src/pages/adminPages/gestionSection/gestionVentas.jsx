import { MotionHoc } from "../../../features/MotionHoc";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Componentes
import { Title } from "../../../components/common/Title";
import { Search } from "../../../components/common/Search";
import { HeaderTable } from "../../../components/common/HeaderTable";
import { VentasTable } from "../../../components/layout/VentasTable";

// Icons
import { DownloadIcon } from "../../../components/common/icons/DownloadIcon";
import { XboxXIcon } from "../../../components/common/icons/XboxXIcon";

// Funciones
import { ExportDataPDF } from "../../../features/ExportDataPDF";
import { ExportDataCSV } from "../../../features/ExportDataCSV";
import { useDeleteDetalleVentaMutation, useGetAllDetallesQuery } from "../../../features/employees/detalleVentasApiSlice";
import Swal from 'sweetalert2'

export const GestionVentas = () => {

  const { data: detallesVenta, error, isLoading, refetch } = useGetAllDetallesQuery()
  const [ deleteDetalleVenta ] = useDeleteDetalleVentaMutation()
  const [SelectedDventaIds, setSelectedDventaIds] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState(records);
  const [showFilters, setShowFilters] = useState(false);
  const [showExports, setShowExports] = useState(false);

  useEffect(() => {
    setFilteredRecords(records);
  }, [records]);

  useEffect(() => {
    if (detallesVenta) {
      setRecords(detallesVenta);
    }
    console.log(detallesVenta)
  }, [detallesVenta]);

  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    if (selectedRows.length > 0) {
      const DventasIds = selectedRows.map(row => row.detallesVenta_Id);
      setSelectedDventaIds(DventasIds);
    } else {
      console.log('No rows selected');
      setSelectedDventaIds([])
    }
  };

  const handleDelete = async () => {
    if (SelectedDventaIds.length > 0) {
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
          await deleteDetalleVenta({ ids: SelectedDventaIds }).unwrap();
          setRecords(records.filter(record => !SelectedDventaIds.includes(record.detallesVenta_Id)));
          setSelectedDventaIds([]);
          Swal.fire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error('Failed to delete detalles venta: ', error);
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

  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    unitMin: "",
    unitMax: "",
    tipoCliente: "",
    tipoItem: "",
    metodoPago: "",
    factura: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    const {
      priceMin,
      priceMax,
      unitMin,
      unitMax,
      tipoCliente,
      tipoItem,
      metodoPago,
      factura,
    } = filters;

    let filteredData = records;

    if (priceMin) {
      filteredData = filteredData.filter((item) => item.venta.total >= priceMin);
    }

    if (priceMax) {
      filteredData = filteredData.filter((item) => item.venta.total <= priceMax);
    }

    if (unitMin) {
      filteredData = filteredData.filter(
        (item) => item.unidades !== "No aplica" && item.cantidad >= unitMin
      );
    }

    if (unitMax) {
      filteredData = filteredData.filter(
        (item) => item.unidades !== "No aplica" && item.cantidad <= unitMax
      );
    }

    if (tipoCliente) {
      filteredData = filteredData.filter((item) => {
        const esAfiliado = item.venta.afiliado !== null;
        return (tipoCliente === "Afiliado" && esAfiliado) ||
               (tipoCliente === "Publico" && !esAfiliado);
      });
    }

    if (tipoItem) {
      filteredData = filteredData.filter(
        (item) => item.tipoVenta === tipoItem
      );
    }

    if (metodoPago) {
      filteredData = filteredData.filter((item) => item.metodo === metodoPago);
    }

    if (factura) {
      filteredData = filteredData.filter(
        (item) => String(item.venta.facturado) === factura
      );
    }

    console.log(factura)

    setFilteredRecords(filteredData);
  };

  

  const resetFilters = () => {
    setFilters({
      priceMin: "",
      priceMax: "",
      unitMin: "",
      unitMax: "",
      tipoCliente: "",
      tipoItem: "",
      metodoPago: "",
      factura: "",
    });
    setFilteredRecords(records);
  };


  // Filtro por nombre
  const handleChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = records.filter((record) =>
      record.venta?.usuario?.nombre?.toLowerCase().includes(searchTerm) || record.venta?.afiliado?.nombre_persona?.toLowerCase().includes(searchTerm)
    );
    setFilteredRecords(filtered);
  };

  return (
    <>
      <Title text="Historial de Ventas" />

      <div className="section-column">
        <Search text={"Buscar Venta"} filter={handleChange} />

        <div className="section-box box">
          <HeaderTable
            title={"Ventas"}
            btn3Color={"btn-yellow"}
            btn3Text={"Exportar Datos"}
            btn3Icon={<DownloadIcon />}
            btn3Funcion={setShowExports}
            btn2Funcion={setShowFilters}
            onDelete={handleDelete}
          />
          <div className="container-table">
            <VentasTable
              records={filteredRecords}
              onSelectedRowsChange={handleSelectedRowsChange}
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
                  <div className="filter-section">
                    <label>Rango de Precio:</label>
                    <div className="divFiltros">
                      <input
                        className="inputPantalla"
                        type="number"
                        placeholder="Min"
                        name="priceMin"
                        onChange={handleFilterChange}
                        value={filters.priceMin}
                      />
                      <input
                        className="inputPantalla"
                        type="number"
                        placeholder="Max"
                        name="priceMax"
                        onChange={handleFilterChange}
                        value={filters.priceMax}
                      />
                    </div>
                  </div>
                  <div className="filter-section">
                    <label>Rango de Unidades:</label>
                    <div className="divFiltros">
                      <input
                        className="inputPantalla"
                        type="number"
                        name="unitMin"
                        placeholder="Min"
                        onChange={handleFilterChange}
                        value={filters.unitMin}
                      />
                      <input
                        className="inputPantalla"
                        type="number"
                        placeholder="Max"
                        name="unitMax"
                        onChange={handleFilterChange}
                        value={filters.unitMax}
                      />
                    </div>
                  </div>
                  <div className="filter-section">
                    <label>Tipo de Cliente:</label>
                    <select
                      className="inputPantalla"
                      name="tipoCliente"
                      onChange={handleFilterChange}
                      value={filters.tipoCliente}
                    >
                      <option value="">Todos</option>
                      <option value="Afiliado">Afiliado</option>
                      <option value="Publico">Publico</option>
                    </select>
                  </div>
                  <div className="filter-section">
                    <label>Tipo de Venta:</label>
                    <select
                      className="inputPantalla"
                      onChange={handleFilterChange}
                      name="tipoItem"
                      value={filters.tipoItem}
                    >
                      <option value="">Todos</option>
                      <option value="Producto">Producto</option>
                      <option value="Servicio">Servicio</option>
                    </select>
                  </div>
                  <div className="filter-section">
                    <label>Método de Pago:</label>
                    <select
                      className="inputPantalla"
                      onChange={handleFilterChange}
                      name="metodoPago"
                      value={filters.metodoPago}
                    >
                      <option value="">Todos</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                    </select>
                  </div>
                  <div className="filter-section">
                    <label>Factura:</label>
                    <select
                      className="inputPantalla"
                      onChange={handleFilterChange}
                      name="factura"
                      value={filters.factura}
                    >
                      <option value="">Todos</option>
                      <option value='true'>Solicitada</option>
                      <option value='false'>No Solicitada</option>
                    </select>
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

          {showExports && (
            <motion.div
              className="box-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="box-content">
                <button
                  className="close-button"
                  onClick={() => setShowExports(false)}
                >
                  <XboxXIcon />
                </button>
                <div className="contentBox export-buttons">
                  <ExportDataCSV records={filteredRecords} />
                  <button
                    className="btn-red-icon"
                    onClick={() => ExportDataPDF(filteredRecords)}
                  >
                    <DownloadIcon /> Exportar a PDF
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showFilters && (
        <div className="overlay" onClick={() => setShowFilters(false)} />
      )}

      {showExports && (
        <div className="overlay" onClick={() => setShowExports(false)} />
      )}
    </>
  );
};

export const GestionVentasMotion = MotionHoc(GestionVentas);
