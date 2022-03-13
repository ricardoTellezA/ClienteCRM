import React, { useReducer } from "react";
import PedidosContext from "./PedidosContext";
import PedidosReducer from "./PedidosReducer";

import {
  SELECCIONAR_CLIENTE,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTO,
  ACTUALIZAR_TOTAL
} from "../../types";

const PedidosState = ({ children }) => {
  //STATE DE PEDIDOS
  const initialState = {
    cliente: {},
    productos: [],
    total: 0,
  };

  const [state, dispatch] = useReducer(PedidosReducer, initialState);

  //MODIFICA EL CLIENTE
  const agregarCliente = (cliente) => {
    dispatch({
      type: SELECCIONAR_CLIENTE,
      payload: cliente,
    });
  };

  //MODIFICA EL PRODUCTO
  const agregarProducto = (productosSeleccionados) => {
    let nuevoState;
    if (state.productos.length > 0) {
      //TOMAR DEL SEGUNDO ARREGLO, UNA COPIA PARA ASIGNAR AL PRIMERO
      nuevoState = productosSeleccionados.map((producto) => {
        let nuevoObjeto = state.productos.find(
          (productoState) => productoState.id === producto.id
        );
        return {...producto, ...nuevoObjeto};
      });
    } else {
      nuevoState = productosSeleccionados;
    }
    dispatch({
      type: SELECCIONAR_PRODUCTO,
      payload: nuevoState,
    });
  };

  //MODIFICA LA CANTIDAD DEL PRODUCTO
  const cantidadProducto = (nuevoProducto) => {
    dispatch({
      type: CANTIDAD_PRODUCTO,
      payload: nuevoProducto,
    });
  };

  const actualizarTotal = () => {
    dispatch({
      type: ACTUALIZAR_TOTAL,
    });
  }

  return (
    <PedidosContext.Provider
      value={{
        productos: state.productos,
        total: state.total,
        cliente: state.cliente,
        agregarCliente,
        agregarProducto,
        cantidadProducto,
        actualizarTotal
      }}
    >
      {children}
    </PedidosContext.Provider>
  );
};

export default PedidosState;
