import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  X,
  DollarSign,
  Percent,
  Package,
  Hash,
  Save,
} from "lucide-react";
import { ProductByCode } from "../../Controllers/Product.controllers";
import SaveInvoiceModal from "./SaveInvoiceModal";
import { SaveInvoice } from "../../Controllers/Invoice.controllers";
import { GetSellers } from "../../Controllers/Seller.controllers";
import { Seller, Vendedor } from "../Users/SellerManagment";
import FilterProduct from "./FilterProduct";

import { Product } from "../Products/Product-table";

export interface ProductExtend extends Product {
  discount: number;
  realName: string;
  quantity: number;
};

interface RecentProducts {
  _id: string;
  nombre: string;
  // descripcion?: string;
  precioDeCosto: number;
  precioDeVenta: number;
  stock: number;
  codigoBarra: string;
  proveedorNombre: string;
  creadoEn: string;
  actualizadoEn: string;
  usuariocontenedor: string;
}

const Invoicing: React.FC = () => {
  const [formData, setFormData] = useState<ProductExtend>({
    _id: "",
    codigoBarra: "",
    nombre: "",
    precioDeVenta: 0,
    precioDeCosto: 0,
    discount: 0,
    quantity: 1,
    stock: 0,
    realName: "",
    proveedorNombre: "",
    creadoEn: "",
    actualizadoEn: "",
  });
  const [IndividualSeller, setIndividualSeller] = useState("");
  const [products, setProducts] = useState<ProductExtend[]>([]);
  const [RecentProducts, setRecentProducts] = useState<Array<RecentProducts>>(
    []
  );
  // States for the modal
  const [OnClose, setOnClose] = useState(true);
  const [IsOpen, setIsOpen] = useState(false);
  const [Total, setTotal] = useState(0);
  const [Sellers, setSellers] = useState<Array<Seller>>([]);
  const InputRefProductName = useRef<HTMLInputElement>(null);

  // Refs
  const InputRefCode = useRef<HTMLInputElement>(null);
  useEffect(() => {
    GetSellers()
      .then((data) => setSellers(data.data.map((e: Vendedor) => e.vendedor)))
      .catch((err) => console.log(err));
  }, []);

  // Save the invoice
  const onSave = async (paymentData: {
    amountPaid: number;
    change: number;
    paymentMethod: string;
  }) => {
    const tosend = {
      products,
      paymentData: { ...paymentData, seller: IndividualSeller },
    };

    //Send data to server
    await SaveInvoice(tosend);
    console.log(tosend);
    setIsOpen(false);
    setOnClose(true);
    setProducts([]);
  };

  const onClose = async () => {
    setIsOpen(false);
    setOnClose(true);
    return;
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "precioDeVenta" || name === "discount" || name === "quantity"
          ? Number.parseInt(value)
          : value,
    }));
  };

  const handleChangeCode = async (value: string) => {
    //const { value } = e.target;
    setFormData((prev) => ({ ...prev, code: value.toUpperCase() }));
    try {
      const isOnArray = RecentProducts.find((p) => p.codigoBarra === value);
      if (isOnArray) {
        setFormData((prev) => ({
          ...prev,
          codigoBarra: isOnArray.codigoBarra,
          quantity: 1,
          _id: isOnArray._id,
          nombre: isOnArray.nombre,
          realName: isOnArray.nombre,
          precioDeVenta: isOnArray.precioDeVenta,
          stock: isOnArray.stock,
          precioDeCosto: isOnArray.precioDeCosto,
        }));
      } else {
        const response = await ProductByCode(value);
        const {
          codigoBarra,
          nombre,
          precioDeVenta,
          stock,
          _id,
          precioDeCosto,
        } = response.data.data;
        setRecentProducts([...RecentProducts, response.data.data]);
        setFormData((prev) => ({
          ...prev,
          codigoBarra,
          quantity: 1,
           _id,
          nombre,
          realName: nombre,
          precioDeVenta: parseInt(precioDeVenta),
          stock,
          precioDeCosto: precioDeCosto,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
      if(formData.codigoBarra.length > 0) {
        handleChangeCode(formData.codigoBarra);
      }

  }, [formData.codigoBarra])
  

  useEffect(() => {
    if (products) {
      const TotalSell = products.reduce((total, product) => {
        const discountedPrice = product.precioDeVenta * (1 - product.discount / 100);
        return total + discountedPrice * product.quantity;
      }, 0);
      setTotal(TotalSell);
    }
  }, [products]);


  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.codigoBarra &&
      formData.nombre &&
      formData.precioDeVenta > 0 &&
      formData.quantity > 0
    ) {
      const IsOnList = products.find((p) => p.codigoBarra === formData.codigoBarra);
      if (IsOnList) {
        const ChangeQuantity = products.filter((product: ProductExtend) => {
          if (product.codigoBarra === formData.codigoBarra) {
            product.quantity = product.quantity + formData.quantity;
            product.discount = formData.discount;
          }
          return product;
        });
        setProducts(ChangeQuantity);
      } else setProducts((prev) => [...prev, { ...formData }]);

      const ChangeProductStock = RecentProducts.filter((p) => {
        if (p._id === formData._id) {
          p.stock = p.stock - formData.quantity;
        }
        return p;
      });

      setRecentProducts(ChangeProductStock);
      setFormData({
        _id: "",
        codigoBarra: "",
        nombre: "",
        precioDeVenta: 0,
        discount: 0,
        quantity: 1,
        stock: 0,
        realName: "",
        precioDeCosto: 0,
        proveedorNombre: "",
        creadoEn: "",
        actualizadoEn: "",
      });
    }
  };

  const removeProduct = (code: string) => {
    const updatedProducts =
      products.find((product) => product.codigoBarra == code)?.quantity || 0;
    console.log(updatedProducts);
    const UpdatePrev = RecentProducts.filter((p) => {
      if (p.codigoBarra === code) {
        p.stock = p.stock + updatedProducts;
      }
      return p;
    });
    setRecentProducts(UpdatePrev);

    setProducts((prev) => prev.filter((product) => product.codigoBarra !== code));
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Nueva Venta
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Agregar Producto
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Seleccionar vendedor
                </label>
                <div className="relative">
                  <select
                    name="vendedores"
                    id=""
                    onChange={(e) => {
                      setIndividualSeller(e.target.value);
                    }}
                  >
                    <option value="local">Local</option>
                    {Sellers.map((seller) => (
                      <option key={seller._id} value={seller._id}>
                        {seller.firstName} {seller.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Código
                </label>
                <div className="relative">
                  <Hash
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="code"
                    ref={InputRefCode}
                    name="codigoBarra"
                    value={formData.codigoBarra}
                    onChange={(e) => setFormData((prev) => ({ ...prev, codigoBarra: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Código del producto"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre del Producto
                </label>
                <div className="relative">
                  <Package
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="name"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    ref={InputRefProductName}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del producto"
                    required
                  />
                </div>
                <FilterProduct searchTerm={formData.nombre} Ref={InputRefProductName} setCode={setFormData}/>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Precio de Venta
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="number"
                    id="price"
                    name="precioDeVenta"
                    value={formData.precioDeVenta}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Precio de venta"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="discount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descuento (%)
                </label>
                <div className="relative">
                  <Percent
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descuento"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cantidad
                </label>
                <div className="relative">
                  <Package
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cantidad"
                    min="1"
                    required
                    max={formData.stock}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                <Plus size={18} className="mr-2" />
                Agregar Producto
              </button>
            </form>
          </div>

          {/* Lista de Productos */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Productos Agregados
            </h2>
            <div className="max-h-96 overflow-y-auto mb-4">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay productos agregados
                </p>
              ) : (
                <ul className="space-y-3">
                  {products.map((product) => (
                    <li
                      key={product._id}
                      className="bg-gray-50 rounded-lg p-3 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium">{product.realName}</h3>
                        <p className="text-sm text-gray-500">
                          Código: {product.codigoBarra} | Cantidad: {product.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Precio: ${product.precioDeVenta.toLocaleString("es-co")} |
                          Descuento: {product.discount}%
                        </p>
                      </div>
                      <button
                        onClick={() => removeProduct(product.codigoBarra)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700">
                Total de la Venta
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ${Total.toLocaleString("es-co")}
              </p>
              <button
                onClick={handleOpenModal}
                disabled={products.length === 0}
                className={`w-full ${
                  products.length > 0
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-300 cursor-not-allowed"
                } text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center`}
              >
                <Save size={18} className="mr-2" />
                Guardar Factura
              </button>
            </div>
          </div>
        </div>
      </div>
      <SaveInvoiceModal
        isOpen={IsOpen}
        onClose={onClose}
        totalAmount={Total}
        onSave={onSave}
      />
    </div>
  );
};

export default Invoicing;
