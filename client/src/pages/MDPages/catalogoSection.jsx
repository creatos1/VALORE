import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MotionHoc } from "../../features/MotionHoc";
import { Title } from "../../components/common/Title";
import { Search } from "../../components/common/Search";
import { HeaderTable } from "../../components/common/HeaderTable";
import { PlusIcon } from "../../components/common/icons/PlusIcon";
import { CatalogoTable } from "../../components/layout/CatalogoTable";
import { XboxXIcon } from "../../components/common/icons/XboxXIcon";
import imagen from "../../assets/img/no.png"
import { useGetAllProductsQuery, useDeleteProductsMutation, useCreateProductsMutation, useUpdateProductMutation } from "../../features/products/productApiSlice";
import { useGetAllCategoriasQuery } from "../../features/products/categoriaApiSlice";

import Swal from 'sweetalert2'

export const CatalogoSection = () => {
  const { data: products, error, isLoading, refetch } = useGetAllProductsQuery()
  const [deleteProduct, { isLoading: loading }] = useDeleteProductsMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateProductsMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { data: categorias } = useGetAllCategoriasQuery()

  const [SelectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [originalProduct, setOriginalProduct] = useState(null);

  const [records, setRecords] = useState([]);
  // Hook para ver los filtros
  const [showFilters, setShowFilters] = useState(false);
  // Hook para ver la parte para añidir nuevos productos
  const [showNewProduct, setShowNewProduct] = useState(false);
  // Hook para eliminar las filas seleccionadas
  const [selectedRows, setSelectedRows] = useState([]);
  // Hook para mostrar la img de los productos
  const [showImg, setShowImg] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  // Hook para mostrar la ventana para editar a detalle la fila
  const [showEdit, setShowEdit] = useState(false);

  const [filteredRecords, setFilteredRecords] = useState(records);
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    descripcion: '',
    precio: '',
    stock: null,
    imagen: 'null',
    categoria_Id: null
  });

  useEffect(() => {
    setFilteredRecords(records);
  }, [records]);

  useEffect(() => {
    if (products) {
      setRecords(products);
    }
    console.log(products)
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files[0],
    }));
  };
  
  const handleEditClick = (product) => {
    setFormData({
      producto_Id: product.producto_Id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      imagen: product.imagen,
      categoria_Id: product.categoria_Id,
    });
    setOriginalProduct(product); // Guardamos el producto original
    setSelectedProduct(product);
    setShowEdit(true);
  };

  const getModifiedData = (original, current) => {
    const modifiedData = {};
    for (const key in current) {
      if (current[key] !== original[key]) {
        modifiedData[key] = current[key];
      }
    }
    return modifiedData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        const modifiedData = getModifiedData(originalProduct, formData);
        modifiedData.producto_Id = formData.producto_Id;
        await updateProduct(modifiedData).unwrap();
      } else {
        await createProduct(formData).unwrap();
      }
      refetch()
      setFormData({
        id: null,
        nombre: '',
        descripcion: '',
        precio: '',
        stock: null,
        imagen: 'null',
        categoria_Id: null
      });
      console.log('Producto creado:', formData);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    console.log(selectedRows)
    if (selectedRows.length > 0) {
      const productsIds = selectedRows.map(row => row.producto_Id);
      setSelectedProductIds(productsIds);
      console.log(SelectedProductIds)
    } else {
      console.log('No rows selected');
      setSelectedProductIds([])
    }
  };

  const handleDelete = async () => {
    if (SelectedProductIds.length > 0) {
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
          await deleteProduct({ ids: SelectedProductIds }).unwrap();
          setRecords(records.filter(record => !SelectedProductIds.includes(record.producto_Id)));
          setSelectedProductIds([]);
          Swal.fire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error('Failed to delete users: ', error);
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

  // Filtro por nombre
  const handleChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = records.filter((record) =>
      record.nombre.toLowerCase().includes(searchTerm)
    );
    setFilteredRecords(filtered);
  };

  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    priceCondition: "greater",
    priceValue: "",
    unitMin: "",
    unitMax: "",
    unitCondition: "greater",
    unitValue: "",
    type: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Función general que aplica todos los filtros
  const applyFilters = () => {
    const {
      priceMin,
      priceMax,
      priceCondition,
      priceValue,
      unitMin,
      unitMax,
      unitCondition,
      unitValue,
      type,
    } = filters;

    let filteredData = records;

    if (priceMin) {
      filteredData = filteredData.filter((item) => item.precio >= priceMin);
    }

    if (priceMax) {
      filteredData = filteredData.filter((item) => item.precio <= priceMax);
    }

    if (priceValue) {
      filteredData = filteredData.filter((item) =>
        priceCondition === "greater"
          ? item.precio >= priceValue
          : item.precio <= priceValue
      );
    }

    if (unitMin) {
      filteredData = filteredData.filter(
        (item) => item.stock !== "No aplica" && item.stock >= unitMin
      );
    }

    if (unitMax) {
      filteredData = filteredData.filter(
        (item) => item.stock !== "No aplica" && item.stock <= unitMax
      );
    }

    if (unitValue) {
      filteredData = filteredData.filter(
        (item) =>
          item.stock !== "No aplica" &&
          (unitCondition === "greater"
            ? item.stock >= unitValue
            : item.stock <= unitValue)
      );
    }

    if (type) {
      filteredData = filteredData.filter((item) => item.type === type);
    }

    setFilteredRecords(filteredData);
  };

  // Función para resetear los filtros

  const resetFilters = () => {
    setFilters({
      priceMin: "",
      priceMax: "",
      priceCondition: "greater",
      priceValue: "",
      unitMin: "",
      unitMax: "",
      unitCondition: "greater",
      unitValue: "",
      type: "",
    });
    setFilteredRecords(records);
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

  // V

  return (
    <>
      <Title text="Catálogo" />

      <div className="section-column">
        <Search text={"Buscar Producto/Servicio"} filter={handleChange} />

        <div className="section-box box">
          <HeaderTable
            title={"Catálogo"}
            btn3Color={"btn-green"}
            btn3Text={"Añadir Producto/Servicio"}
            btn3Icon={<PlusIcon />}
            btn2Funcion={setShowFilters}
            btn3Funcion={setShowNewProduct}
            onDelete={handleDelete}
          />
          <div className="container-table">
            <CatalogoTable
              records={filteredRecords}
              onSelectedRowsChange={handleSelectedRowsChange}
              showImg={showImg}
              setShowImg={setShowImg}
              setShowEdit={setShowEdit}
              selectedImg={selectedImg}
              setSelectedImg={setSelectedImg}
              handleEditClick={handleEditClick}
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
            <button className="close-button" onClick={() => {
              setShowFilters(false)
            }}>
              <XboxXIcon />
            </button>
            <div className="contentFiltros">
              <div className="filter-section">
                <label>Rango de Precio:</label>
                <div className="divFiltros">
                  <input
                    className="inputPantalla"
                    type="number"
                    name="priceMin"
                    placeholder="Min"
                    onChange={handleFilterChange}
                    value={filters.priceMin}
                  />
                  <input
                    className="inputPantalla"
                    type="number"
                    name="priceMax"
                    placeholder="Max"
                    onChange={handleFilterChange}
                    value={filters.priceMax}
                  />
                </div>
              </div>
              <div className="filter-section">
                <label>Mayor/Menor que Precio:</label>
                <div className="divFiltros">
                  <select
                    className="inputPantalla"
                    name="priceCondition"
                    onChange={handleFilterChange}
                    value={filters.priceCondition}
                  >
                    <option value="greater">Mayor que</option>
                    <option value="less">Menor que</option>
                  </select>
                  <input
                    className="inputPantalla"
                    type="number"
                    name="priceValue"
                    onChange={handleFilterChange}
                    value={filters.priceValue}
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
                    name="unitMax"
                    placeholder="Max"
                    onChange={handleFilterChange}
                    value={filters.unitMax}
                  />
                </div>
              </div>
              <div className="filter-section">
                <label>Mayor/Menor que Unidad:</label>
                <div className="divFiltros">
                  <select
                    className="inputPantalla"
                    name="unitCondition"
                    onChange={handleFilterChange}
                    value={filters.unitCondition}
                  >
                    <option value="greater">Mayor que</option>
                    <option value="less">Menor que</option>
                  </select>
                  <input
                    type="number"
                    name="unitValue"
                    onChange={handleFilterChange}
                    value={filters.unitValue}
                    className="inputPantalla"
                  />
                </div>
              </div>
              <div className="filter-section">
                <div className="content-type">
                  <label>Tipo:</label>
                  <select
                    className="inputPantalla"
                    name="type"
                    onChange={handleFilterChange}
                    value={filters.type}
                  >
                    <option value="">Todos</option>
                    <option value="Producto">Producto</option>
                    <option value="Servicio">Servicio</option>
                  </select>
                </div>
              </div>
              <div className="filter-buttons">
                <button className="btn-green" onClick={applyFilters}>Aplicar Filtros</button>
                <button className="btn-yellow" onClick={resetFilters}>Resetear Filtros</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

          {/* Contenido a mostrar al dar click en el boton "añadir producto/servicio" */}
          {showNewProduct && (
            <motion.div
              className="box-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="box-content">
                <button
                  className="close-button"
                  onClick={() => {
                    setShowNewProduct(false)
                    setSelectedProduct(null)
                  }}
                >
                  <XboxXIcon />
                </button>
                <div className="contentBox">
                  {/* Aquí va el contenido del formulario */}
                  <form onSubmit={handleSubmit}>
                    <div className="form-section" >
                      <input type="text" name="nombre" id="nombre" placeholder="Nombre" className="inputPantalla" onChange={handleInputChange}/>
                      <input type="text" name="descripcion" id="descripcion" placeholder="Descripcion" className="inputPantalla" onChange={handleInputChange}/>
                      <input type="number" name="precio" id="precio" placeholder="Precio" className="inputPantalla" onChange={handleInputChange}/>
                      <input type="number" name="stock" id="stock" placeholder="Stock" className="inputPantalla" onChange={handleInputChange}/>
                    </div>

                    <div className="form-section">
                      <label>Categorias:</label>
                      <select  className="inputPantalla" name="categoria_Id" value={formData.categoria_Id} onChange={handleInputChange}>
                      <option value="">seleccione una categoria</option>
                        {categorias.map(categoria => (
                          <option key={categoria.categoria_Id} value={categoria.categoria_Id}>
                            {categoria.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-section">
                      <input
                          className="inputPantalla"
                          accept="image/*"
                          type="file"
                          name="imagen"
                          onChange={handleFileChange}
                        />
                    </div>

                    <button type="submit" className="btn-green" disabled={isCreating} onClick={() => setShowNewProduct(false)}>
                      {isCreating ? 'Creating...' : 'Agregar Producto'}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mostrar la img del producto */}
          {showImg && selectedImg && (
            <motion.div
              className="box-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="box-content">
                <button
                  className="close-button"
                  onClick={() => {
                    setShowEdit(false)
                    setSelectedProduct([])
                  }}
                >
                  <XboxXIcon />
                </button>

                <div className="contentBox">
                  <img src={getFormattedImageUrl(selectedImg)} alt="Profile" className="expanded-img" />
                </div>
              </div>
            </motion.div>
          )}


{showEdit && (
            <motion.div
              className="box-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="box-content">
                <button
                  className="close-button"
                  onClick={() => {
                    setShowEdit(false)
                    setSelectedProduct(null)
                  }}
                >
                  <XboxXIcon />
                </button>

                <div className="contentBox">
                {/* Aquí va el contenido del formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="form-section" >
                      <input type="text" name="nombre" id="nombre" placeholder="Nombre" className="inputPantalla" value={formData.nombre} onChange={handleInputChange}/>
                      <input type="text" name="descripcion" id="descripcion" placeholder="Descripcion" className="inputPantalla" value={formData.descripcion} onChange={handleInputChange}/>
                      <input type="number" name="precio" id="precio" placeholder="Precio" className="inputPantalla" value={formData.precio} onChange={handleInputChange}/>
                      <input type="number" name="stock" id="stock" placeholder="Stock" className="inputPantalla" value={formData.stock} onChange={handleInputChange}/>
                    </div>

                    <div className="form-section">
                      <label>Categorias:</label>
                      <select  className="inputPantalla" name="categoria_Id" value={formData.categoria_Id} onChange={handleInputChange}>
                      <option value="">seleccione una categoria</option>
                        {categorias.map(categoria => (
                          <option key={categoria.categoria_Id} value={categoria.categoria_Id}>
                            {categoria.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-section">
                      <input
                          className="inputPantalla"
                          accept="image/*"
                          type="file"
                          name="imagen"
                          onChange={handleFileChange}
                        />
                    </div>

                    <button type="submit" className="btn-green" disabled={isCreating} onClick={() => setShowEdit(false)}>
                      {isCreating ? 'Creating...' : 'Agregar Producto'}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logica para mostrar el difuminado y cerrar la ventana al dar clic fuera de esta*/}
      {showFilters && (
        <div className="overlay" onClick={() => setShowFilters(false)} />
      )}

      {showNewProduct && (
        <div className="overlay" onClick={() => {
          setShowNewProduct(false)
          
        }} />
      )}

      {showImg && <div className="overlay" onClick={() => setShowImg(false)} />}

      {showEdit && (
        <div className="overlay" onClick={() => {
          setShowEdit(false)
          setSelectedProduct(null)
        }} />
      )}
    </>
  );
};

export const CatalogoSectionMotion = MotionHoc(CatalogoSection);
