
import { MotionHoc } from "../../../features/MotionHoc"
import { Title } from "../../../components/common/Title"
import { OpcionesGestion } from "../../../components/layout/OpcionesGestion";
import { ShoppingBagCheckIcon } from "../../../components/common/icons/ShoppingBagCheckIcon";
import { BtnBlue } from "../../../components/common/buttons/BtnBlue";
import { BtnYellow } from "../../../components/common/buttons/BtnYellow";
import { ReceiptTaxIcon } from "../../../components/common/icons/ReceiptTaxIcon";
import { BtnGreen } from "../../../components/common/buttons/BtnGreen";
import { BusinessPlanIcon } from "../../../components/common/icons/BusinessPlanIcon";
import { UserStarIcon } from "../../../components/common/icons/UserStarIcon";
import SimplePieCharts from "../../../components/layout/charts/SimplePieChart";
import { SimpleBarCharts } from "../../../components/layout/charts/SimpleBarChart";
import StackedAreaCharts from "../../../components/layout/charts/StackedAreaChart";
import { useGetAllDetallesQuery } from "../../../features/employees/detalleVentasApiSlice";

export const Gestion = () => {
  const { data: detalles, isLoading, error } = useGetAllDetallesQuery();

  if (isLoading) return <div>Cargando datos...</div>;
  if (error) return <div>Error al cargar datos</div>;

  // Obtener la cantidad total de productos y servicios vendidos.
  const productosServiciosData = [
    { name: "Producto", value: detalles.filter(d => d.producto.categoria.nombre === "Producto").length },
    { name: "Servicio", value: detalles.filter(d => d.producto.categoria.nombre === "Servicio").length },
  ];

  // Ordenar las ventas por fecha
  const ventasOrdenadas = [...detalles].sort((a, b) => new Date(b.venta.fecha) - new Date(a.venta.fecha));
  
  // filtrar las últimas cinco ventas
  const ultimasCuatroVentas = ventasOrdenadas.slice(0, 5).map((detalle, index) => ({
    name: detalle.venta.fecha,
    ventas: detalle.venta.total
  }));

  // Mapear todos los detalles de ventas con sus totales.
  const finanzasData = detalles.map((d, index) => ({
    name: `Venta ${index + 1}`,
    ventas: d.venta.total
  }));

  // Agrupar y sumar las cantidades de productos vendidos por nombre
  const productosAgrupados = detalles
  .filter(d => d.producto.categoria.nombre === "Producto")
  .reduce((acc, detalle) => {
      const nombreProducto = detalle.producto.nombre;
      if (!acc[nombreProducto]) {
          acc[nombreProducto] = 0;
      }
      acc[nombreProducto] += detalle.cantidad;
      return acc;
  }, {});

// Convertir productosAgrupados en un array de objetos con `name` y `value`
  const productosData = Object.entries(productosAgrupados).map(([name, value]) => ({
      name,
      value,
  }));

  // Agrupar y sumar las cantidades de servicios contratados por nombre
  const serviciosAgrupados = detalles
        .filter(d => d.producto.categoria.nombre === "Servicio")
        .reduce((acc, detalle) => {
            const nombreServicio = detalle.producto.nombre;
            if (!acc[nombreServicio]) {
                acc[nombreServicio] = 0;
            }
            acc[nombreServicio] += detalle.cantidad;
            return acc;
        }, {});

    // Convertir los datos en un array de objetos con `name` y `value`
    const serviciosData = Object.entries(serviciosAgrupados).map(([nombre, value]) => ({
        name: nombre,
        value: value,
    }));


    return (
      <>
        <Title text="Gestion" />
        <div className="mainGestion">
          <section className="opcionsGestion">
              <OpcionesGestion 
                title={'$22,880.50'} 
                subTitle={'Corte Diario'} 
                icon={<ShoppingBagCheckIcon />} 
                colorIcon={'opcionBlue'}  
                button={<BtnBlue direccion={'/descarga'} texto={'Descargar'}/>} 
              />

              <OpcionesGestion 
                title={'Promociones'} 
                subTitle={'Crear o eliminar promociones'} 
                icon={<ReceiptTaxIcon />} 
                colorIcon={'opcionYellow'}  
                button={<BtnYellow direccion={'/promociones'} texto={'Entrar'}/>} 
              />

              <OpcionesGestion 
                title={'Ventas'} 
                subTitle={'Historial de Vetas'} 
                icon={<BusinessPlanIcon />} 
                colorIcon={'opcionGreen'}  
                button={<BtnGreen direccion={'/gestionVetas'} texto={'Entrar'}/>} 
              />

              <OpcionesGestion 
                title={'Afiliados'} 
                subTitle={'Agregar o eliminar afiliados'} 
                icon={<UserStarIcon />} 
                colorIcon={'opcionBlue'}  
                button={<BtnBlue direccion={'/afiliados'} texto={'Entrar'}/>} 
              />


          </section>
          <section className="chartsGestion">
            <SimplePieCharts title={"Distribución de ventas"} description={"Proporción entre productos y servicios vendidos."} data={productosServiciosData} />
            <SimpleBarCharts title={"Ventas reciente"} description={"Totales de las últimas cuatro ventas"} data={ultimasCuatroVentas}/>
            <StackedAreaCharts title={"Ventas"} description={"Transacciónes realizadas"} data={finanzasData} />
          </section>

          <section className="chartsGestion">
              <SimplePieCharts title={"Productos vendidos"} description={"descripcion"} data={productosData}/>
              <SimplePieCharts title={"Servicios contratados"} description={"descripcion"} data={serviciosData}/>
            </section>
        </div>
      </>
    )
  }

export const GestionMotion = MotionHoc(Gestion);