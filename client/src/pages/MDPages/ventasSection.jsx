import { useState } from "react";
import { MotionHoc } from "../../features/MotionHoc";
import { Title } from "../../components/common/Title";

export const VentasSection = () => {
  const [cliente, setCliente] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");
  const [numeroCliente, setNumeroCliente] = useState("");
  const [email, setEmail] = useState("");
  const [tipoVenta, setTipoVenta] = useState("");
  const [productos, setProductos] = useState([{ nombre: "", unidades: 1 }]);
  const [servicio, setServicio] = useState("");
  const [metodo, setMetodo] = useState("");
  const [factura, setFactura] = useState("");

  const handleProductoChange = (index, event) => {
    const newProductos = productos.map((producto, i) => {
      if (i !== index) return producto;
      return { ...producto, [event.target.name]: event.target.value };
    });
    setProductos(newProductos);
  };

  const agregarProducto = () => {
    setProductos([...productos, { nombre: "", unidades: 1 }]);
  };

  const eliminarProducto = (index) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      cliente,
      numeroCliente,
      tipoCliente,
      email,
      tipoVenta,
      productos: tipoVenta === "Producto" ? productos : [],
      servicio: tipoVenta === "Servicio" ? servicio : "",
      metodo,
      factura,
    };
    console.log(data);
    // Resetear el formulario después de enviar los datos
    setCliente("");
    setNumeroCliente("");
    setTipoCliente("");
    setEmail("");
    setTipoVenta("");
    setProductos([{ nombre: "", unidades: 1 }]);
    setServicio("");
    setMetodo("");
    setFactura("");
  };

  return (
    <>
      <Title text="Registrar Venta" />
      <div className="sectionVenta">
      <form onSubmit={handleSubmit} className="venta-form box">
        <div className="form-group">
          <label>Tipo de Cliente:</label>
          <select
            value={tipoCliente}
            onChange={(e) => setTipoCliente(e.target.value)}
            required
            className="input"
          >
            <option value="" disabled>Selecciona un tipo</option>
            <option value="Afiliado">Afiliado</option>
            <option value="Publico">Publico</option>
          </select>
        </div>
        <div className="form-group">
          <label>Cliente:</label>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
            placeholder="Nombre del Cliente"
            className="input"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="Email del Cliente"
          />
        </div>
        <div className="form-group">
          <label>Número Telefónico:</label>
          <input
            type="tel"
            value={numeroCliente}
            onChange={(e) => setNumeroCliente(e.target.value)}
            required
            className="input"
            placeholder="Número del Cliente"
          />
        </div>
        <div className="form-group">
          <label>Tipo de Venta:</label>
          <select
            value={tipoVenta}
            onChange={(e) => setTipoVenta(e.target.value)}
            required
            className="input"
          >
            <option value="" disabled>Selecciona un tipo</option>
            <option value="Producto">Producto</option>
            <option value="Servicio">Servicio</option>
          </select>
        </div>

        {tipoVenta === "Producto" && (
          <>
            {productos.map((producto, index) => (
              <div key={index} className="form-group">
                <label>Producto:</label>
                <input
                  type="text"
                  name="nombre"
                  value={producto.nombre}
                  onChange={(e) => handleProductoChange(index, e)}
                  required
                  placeholder="Nombre del Producto"
                  className="input"
                />
                <label>Unidades:</label>
                <input
                  type="number"
                  name="unidades"
                  value={producto.unidades}
                  onChange={(e) => handleProductoChange(index, e)}
                  required
                  className="input"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => eliminarProducto(index)}
                  className="btn-red"
                >
                  Eliminar Producto
                </button>
              </div>
            ))}
            <button type="button" onClick={agregarProducto} className="btn-blue">
              Agregar Producto
            </button>
          </>
        )}

        {tipoVenta === "Servicio" && (
          <div className="form-group">
            <label>Servicio:</label>
            <input
              type="text"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              required
              placeholder="Nombre del Servicio"
              className="input"
            />
          </div>
        )}

        <div className="form-group">
          <label>Método de Pago:</label>
          <select
            value={metodo}
            onChange={(e) => setMetodo(e.target.value)}
            required
            className="input"
          >
            <option value="" disabled >Selecciona un método</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>
        </div>
        <div className="form-group">
          <label>Factura:</label>
          <select
            value={factura}
            onChange={(e) => setFactura(e.target.value)}
            required
            className="input"
          >
            <option value="" disabled>Selecciona una opción</option>
            <option value="Solicitada">Solicitada</option>
            <option value="No Solicitada">No Solicitada</option>
          </select>
        </div>
        <button type="submit" className="btn-green">
          Registrar Venta
        </button>
      </form>

      {/* navInfo */}
      <nav className="navInfoPrice box">
        <p>Monto total sin descuento:</p>
        <span className="montoTotalBruto">$4500</span>

        <p>Monto total con descuentos aplicados:</p>
        <span className="montoTotalNeto">$2250</span>

        <p>Descuentos Aplicados:</p>
        <section className="cartPromocion">
          <p className="nombrePromocion">Nombre de la promoción</p>
          <p className="tipoPromocion">tipo de promoción</p>
        </section>
      </nav>
      </div>
    </>
  );
};

export const VentasSectionMotion = MotionHoc(VentasSection);
