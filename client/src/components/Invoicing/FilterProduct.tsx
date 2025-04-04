import React, { useEffect, useState } from "react";
import { GetMyProducts } from "../../Controllers/Product.controllers";
import { Product as PTable } from "../Products/Product-table";
import { Product } from "./Invoicing";
import { Code } from "lucide-react";

type FilterProductProps = {
  searchTerm: string;
  Ref: React.RefObject<HTMLInputElement>;
  setCode: React.Dispatch<React.SetStateAction<Product>>;
};

function FilterProduct({ searchTerm, Ref, setCode}: FilterProductProps) {
  const [products, setProducts] = useState<PTable[]>([]);
  const [OnFocus, setOnFocus] = useState(false);
  useEffect(() => {
    if (searchTerm.length > 0 && OnFocus) {
      GetMyProducts({ cantidad: 50, skip: 0, filterProduct: searchTerm })
        .then((response) => {
          setProducts(response.data.data);
        })
        .catch((err) => console.log(err));
    }
  }, [searchTerm]);

  useEffect(() => {
    if(!Ref.current) return;

    Ref.current.addEventListener("focus", (e) => {
      setOnFocus(true);
    })

    Ref.current.addEventListener("blur", (e) => {
      setTimeout(( ) => {
        setOnFocus(false);
      }, 100)
    })
  }, [])
  

  if (OnFocus && searchTerm.length > 0) {
    return (
      <div>
        <div className="flex flex-col gap-2 absolute bg-blue-500 px-2 py-2 rounded-md w-80 text-white z-10 mt-2 h-40 overflow-y-scroll">
          {products.map((product, i) => (
            <div
              key={i}
              onClick={() => {
                setCode((prev) => ({...prev, code: product.codigoBarra}));
                console.log(product);
              }}
              className="flex flex-row gap-2 border hover:bg-blue-600 p-2 rounded-md cursor-pointer"
            >
              <div className="flex flex-col" >
                <span>{product.nombre}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else return null;
}

export default FilterProduct;
