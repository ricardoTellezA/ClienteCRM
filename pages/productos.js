import React from "react";
import Layout from "../components/Layout";
import { useQuery, gql } from "@apollo/client";
import Producto from "../components/Producto";
import Link from "next/link";

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

const Productos = () => {
  //OBTENER PRODUCTOS
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  if (loading) return "Cargando...";
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
      <Link href="/nuevoProducto">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nuevo Producto</a>
        </Link>

      <table className="table-auto shadow-md mt-10 w-full w-lg">
        <thead className="bg-gray-800">
          <tr key="" className="text-white">
            <th className="w-1/5 py-2">Nombre</th>
            <th className="w-1/5 py-2">Precio</th>
            <th className="w-1/5 py-2">Existencia</th>
             <th className="w-1/5 py-2">Eliminar</th>
          <th className="w-1/5 py-2">Editar</th> 
          </tr>
        </thead>

        <tbody className="bg-white">
          {data.obtenerProductos.map(producto => (
            <Producto key={producto.id} producto={producto} />
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Productos;
