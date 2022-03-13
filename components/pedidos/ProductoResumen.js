import React, { useContext, useState, useEffect } from "react";
import PedidosContext from "../../context/pedidos/PedidosContext";

const ProductoResumen = ({ producto }) => {
  const [cantidad, setCantidad] = useState(0);
  const pedidoContext = useContext(PedidosContext);
  const { cantidadProducto, actualizarTotal} = pedidoContext;

  useEffect(() => {
    actualizarCantidad();
    actualizarTotal();
  }, [cantidad]);

  const actualizarCantidad = (e) => {
    const nuevoProducto = { ...producto, cantidad: Number(cantidad) };
   cantidadProducto(nuevoProducto);
  };

  const { nombre, precio, subtotal } = producto;

  return (
    <div className="md:flex md:justify-between md:items-center mt-5">
      <div className="md:w-2/4 mb-2 md:mb-0">
        <p className="text-sm">{nombre}</p>
        <p> ${precio}</p>
      </div>
      <input
        type="number"
        placeholder="Cantiad"
        onChange={(e) => setCantidad(e.target.value)}
        className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
      />
    </div>
  );
};

export default ProductoResumen;
