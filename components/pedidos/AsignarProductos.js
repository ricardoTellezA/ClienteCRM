import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidosContext from "../../context/pedidos/PedidosContext";

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
      creado
    }
  }
`;

const AsignarProductos = () => {
  //state local del componente
  const [productos, setProductos] = useState([]);

  //context de pedidos
  const pedidoContext = useContext(PedidosContext);
  const { agregarProducto } = pedidoContext;
  //consultar a la base de datos
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  useEffect(() => {
    //TODO: Funcion para pasar pedidoState.js
    agregarProducto(productos);
  }, [productos]);

  const seleccionarProducto = (producto) => {
    setProductos(producto);
  };

  if (loading) return "Cargando...";

  const { obtenerProductos } = data;
  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        2.- Selecciona o busca los productos
      </p>
      <Select
        className="mt-3"
        options={obtenerProductos}
        // isMulti={true}
        onChange={(opcion) => seleccionarProducto(opcion)}
        getOptionValue={(opcion) => opcion.id}
        isMulti={true}
        getOptionLabel={(opcion) =>
          `${opcion.nombre} - ${opcion.existencia} Disponibles`
        }
        placeholder="Selecciona o busca los productos"
        noOptionsMessage={() => "No hay opciones"}
      />
    </>
  );
};

export default AsignarProductos;
