import type React from "react";
import { useEffect, useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Plus,
} from "lucide-react";
import {
  DeleteProduct,
  GetMyProducts,
  RegisterNewProducts,
  UpdateProduct,
} from "../../Controllers/Product.controllers";
import ErrorToast from "../toast/ErrorToast";
import { Errorhandle, Succeshandle } from "../toast/ToastFunctions/ErrorHandle";
import EditProductModal from "./EditProductModal";
import SuccessToast from "../toast/SuccesToast";
import ProductRegistrationModal from "./ProductRegistrationModal";

// Tipo para un producto
export type Product = {
  _id: string;
  nombre: string;
  precioDeCosto: number;
  precioDeVenta: number;
  stock: number;
  codigoBarra: string;
  proveedorNombre: string;
  creadoEn: string;
  actualizadoEn: string;
};

export type IsOpenType = "none" | "editsingle" | "editmultiple";
// Datos de ejemplo

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Product | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [Error, setError] = useState("");
  const [ProductQuantity, setProductQuantity] = useState(0);
  const [Calls, setCalls] = useState(0);
  const [OnClose, setOnClose] = useState(true);
  const [IsOpen, setIsOpen] = useState<IsOpenType>("none");
  const [Success, setSuccess] = useState("");

  const [ProductToEdit, setProductToEdit] = useState<Product | null>(null);
  // Función para manejar la búsqueda
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCalls(0);
  };

  // Función para manejar el ordenamiento
  const handleSort = (column: keyof Product) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Obtener productos
  useEffect(() => {
    GetMyProducts({ cantidad: 50, skip: Calls, filterProduct: searchTerm })
      .then((response) => {
        setProducts(response.data.data);
        setProductQuantity(response.data.length);
      })
      .catch(() => Errorhandle("Algo fallo en el servidor", setError));
  }, [Calls, searchTerm]);

  const onSave = async (product: Product) => {
    await UpdateProduct(product)
      .then((res) => Succeshandle(res.data.msg, setSuccess))
      .catch((err) => Errorhandle("Algo fallo en el servidor", setError));
    const newProductsTable = products.map((p) =>
      p._id === product._id ? product : p
    );
    setProducts(newProductsTable);
    onCloseSingle(product);
  };

  const onCloseSingle = async (product: Product) => {
    setProductToEdit(product);
    setIsOpen("none");
    setOnClose(true);
    return;
  };

  const onCloseMultiple = async () => {
    setIsOpen("none");
    setOnClose(true);
    return;
  };

  const OnsaveMultiple = async (products: Product[]) => {
    RegisterNewProducts(products)
      .then((res) => {
        Succeshandle(res.data.msg, setSuccess)
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => console.log(err));
    setIsOpen("none");
  };

  return (
    <div className="min-h-screen h-screen bg-gradient-to-b z-10 from-blue-50 to-white p-6 ">
      <ErrorToast error={Error} />
      <SuccessToast success={Success} />
      <ProductRegistrationModal
        isOpen={IsOpen === "editmultiple" ? true : false}
        onClose={onCloseMultiple}
        onSave={OnsaveMultiple}
      />
      <EditProductModal
        onSave={onSave}
        isOpen={IsOpen === "editsingle" ? true : false}
        onClose={onCloseSingle}
        product={!ProductToEdit ? null : ProductToEdit}
      />

      <div className="max-w-7xl mx-auto   h-[90%] ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 ">
            Tabla de Productos
          </h1>

          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setIsOpen("editmultiple")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Registrar Productos
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            className="w-full p-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto h-[80%]  rounded-xl shadow-sm  overflow-y-scroll">
          <ErrorToast error={Error} />
          <table className="min-w-full divide-y  divide-gray-200  ">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Código",
                  "Nombre",
                  "Precio Costo",
                  "Precio Venta",
                  "Proveedor",
                  "Stock",
                  "Última Actualización",
                  "Acciones",
                ].map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() =>
                      handleSort(
                        header.toLowerCase().replace(" ", "") as keyof Product
                      )
                    }
                  >
                    <div className="flex items-center">
                      {header}
                      {sortColumn === header.toLowerCase().replace(" ", "") &&
                        (sortDirection === "asc" ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.codigoBarra}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.precioDeCosto.toLocaleString("es-co")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.precioDeVenta.toLocaleString("es-co")}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.proveedorNombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock.toString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.actualizadoEn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => {
                        setProductToEdit(product);
                        setIsOpen("editsingle");
                      }}
                    >
                      <Edit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2
                        size={18}
                        onClick={async () => {
                          // Eliminar producto
                          await DeleteProduct({ ProductId: product._id })
                            .then(() => {
                              const NewProductsSet = products.filter(
                                (p) => p._id !== product._id
                              );
                              setProducts(NewProductsSet);
                              setProductQuantity(ProductQuantity - 1);
                            })
                            .catch(() =>
                              Errorhandle("Algo fallo en el servidor", setError)
                            );
                        }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
          <div className="flex-1 text-sm text-gray-700 mb-2 sm:mb-0">
            <span className="font-medium text-blue-600">{Calls + 1}</span>
            {" - "}
            <span className="font-medium text-blue-600">
              {Calls + 50 > ProductQuantity ? ProductQuantity : Calls + 50}
            </span>
            {" de "}
            <span className="font-medium text-blue-600">{ProductQuantity}</span>
            {" productos"}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (Calls === 0) return;
                setCalls(Calls - 50);
              }}
              disabled={Calls === 0}
              className={`
            flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
            ${
              Calls === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            }
          `}
              aria-label="Página anterior"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => {
                if (Calls + 50 >= ProductQuantity) return;
                setCalls(Calls + 50);
              }}
              disabled={Calls + 50 >= ProductQuantity}
              className={`
            flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
            ${
              Calls + 50 >= ProductQuantity
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            }
          `}
              aria-label="Página siguiente"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
