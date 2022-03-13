import React, { useContext, useState } from "react";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

//context de pedidos
import PedidosContext from "../context/pedidos/PedidosContext";


const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        id
        cantidad
        nombre
      }
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor
      total
      estado
    }
  }
`;
const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
    }
  }
`;

const nuevopedido = () => {
  const router = useRouter();
  const [mensaje, setMensaje] = useState(null);
  //utilizar context y utlizar el state
  const pedidoContext = useContext(PedidosContext);
  const { cliente, productos, total } = pedidoContext;
  // const { id } = cliente;

  //mutation para crear nuevo pedido
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache) {
      //obtener el objeto de cache
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });
      //reescribir el cache
      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido],
        },
      });
    }
  });

  const validarPedido = () => {
    return !productos.every((producto) => producto.cantidad > 0) ||
      total === 0 ||
      cliente.length === 0
      ? "opacity-50 cursor-not-allowed"
      : "";
  };

  const crearNuevoPedido = async () => {
    const { id } = cliente;
    //remover lo no deceado de productos
    const pedido = productos.map(
      ({ existencia, creado, __typename, ...producto }) => producto
    );
    // console.log(pedido);

    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            total,
            pedido,
          },
        },
      });

      //REDIRECCIONAR
      router.push("/pedidos");
      //MOSTTRAR ALERTA
      Swal.fire("Correcto", "Se creo correctamente el pedido", "success");
    } catch (error) {
      setMensaje(error.message.replace("GraphQL error: ", ""));

      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    }
  };

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  };

  return (
    <>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Crear Pedido</h1>
        {mensaje && mostrarMensaje()}
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            <AsignarCliente />
            <AsignarProductos />
            <ResumenPedido />
            <Total />

            <button
              className={`bg-gray-800 w-full text-white uppercase py-2 px-4 mt-5 font-bold hover:bg-gray-900 ${validarPedido()}
              }`}
              type="button"
              onClick={() => crearNuevoPedido()}
            >
              Mandar pedido
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default nuevopedido;
