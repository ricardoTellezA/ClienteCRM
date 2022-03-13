import React, { useContext } from "react";
import PedidosContext from "../../context/pedidos/PedidosContext";
import ProductoResumen from "../pedidos/ProductoResumen";



const ResumenPedido = () => {
  //utilizar context y utlizar el state
  const pedidoContext = useContext(PedidosContext);
  const { productos } = pedidoContext;
  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        3.- Resumen del pedido
      </p>

      {productos.length > 0 ? (
        <>
         {productos.map((producto) => (
            <ProductoResumen
            key={producto.id}
            producto={producto}
            />
         ))}
        </>
      ) : (
        <p className="mt-5 text-sm">Aún no hay productos</p>
      )}
    </>
  );
};

export default ResumenPedido;
