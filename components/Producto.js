import React from "react";
import { useMutation, gql } from "@apollo/client";
import Swal from "sweetalert2";
import Router from "next/router";
const ELIMINAR_PRODUCTO = gql`
  mutation eliminarProducto($id: ID!) {
    eliminarProducto(id: $id)
  }
`;
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
const Producto = ({ producto }) => {
  //MIUTACION PARA ELIMINAR PRODUCTOS
  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    update(cache) {
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });
      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: obtenerProductos.filter(
            (p) => p.id !== producto.id
          ),
        },
      });
    },
  });
  const { nombre, precio, existencia, id } = producto;

  const confirmarEliminarProducto = () => {
    Swal.fire({
      title: "¿Estás seguro que decea eleminar este producto?",
      text: "Una vez eliminado no se podra recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          //eliminar por id
          const { data } = await eliminarProducto({
            variables: {
              id,
            },
          });

          console.log(data);

          //mensaje de exito
          Swal.fire(
            "Eliminado",
            "El producto se elimino correctamente",
            "success"
          );
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarProducto = () => {
    Router.push({
      pathname: "/editarproducto/[id]",
      query: {id}
    });
  }
  return (
    <tr>
      <td className="border px-4 py-2">{nombre}</td>
      <td className="border px-4 py-2">$ {precio}</td>
      <td className="border px-4 py-2">{existencia}</td>
      <td>
        <button
          type="button"
          onClick={() => confirmarEliminarProducto()}
          className="flex justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 w-full text-xs uppercase  rounded focus:outline-none focus:shadow-outline"
        >
          Eliminar
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </button>
      </td>

      <td>
        <button
          type="button"
          onClick={() => editarProducto()}
          className="flex justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 w-full text-xs uppercase  rounded focus:outline-none focus:shadow-outline"
        >
          Editar
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default Producto;
