import React, { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";

const CREAR_PRODUCTO = gql`
  mutation nuevoProducto($input: ProductoInput) {
    nuevoProducto(input: $input) {
      id
      nombre
      existencia
      precio
      creado
    }
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

const nuevoProducto = () => {
  const [mensaje, setMensaje] = useState(null);
  //MUTACION PARA CREAR NUEVOS USUARIOS EN APOLLO
  const [nuevoProducto] = useMutation(CREAR_PRODUCTO, {
    update(cache, { data: { nuevoProducto } }) {
      //Obtener el objeto de cache
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });
      //reescribir el cache
      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: [...obtenerProductos, nuevoProducto],
        },
      });
    },
  });
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      nombre: "",
      precio: "",
      existencia: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre del cliente es obligatorio"),
      precio: Yup.number().positive('No se aceptan números negativos').required("El precio es obligatorio"),
      existencia: Yup.number().positive("No se aceptan números negativos").required("La existencia es obligatoria"),
    }),
    onSubmit: async (valores) => {
      const { nombre, precio, existencia } = valores;
      try {
        const { data } = await nuevoProducto({
          variables: {
            input: {
              nombre,
              precio,
              existencia,
            },
          },
        });

        //redireccionar a productos
        router.push("/productos");
      } catch (error) {
        setMensaje(error.message.replace("GraphQL error: ", ""));
        console.log(error)
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
      }
    },
  });

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  };
  
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Producto</h1>
      {mensaje && mostrarMensaje()}


      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nombre"
              >
                Nombre Producto
              </label>

              <input
                id="nombre"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 
                  text-gray-700 leading-tight  focus:shadow-outline"
                placeholder="Nombre Producto"
                onChange={formik.handleChange}
                value={formik.values.nombre}
                onBlur={formik.handleBlur}
              />
            </div>
         
            {formik.touched.nombre && formik.errors.nombre && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.nombre}</p>
              </div>
            )}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="precio"
              >
                Precio del Producto
              </label>

              <input
                id="precio"
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 
                  text-gray-700 leading-tight  focus:shadow-outline"
                placeholder="Precio"
                onChange={formik.handleChange}
                value={formik.values.precio}
                onBlur={formik.handleBlur}
              />
            </div>

            {formik.touched.precio && formik.errors.precio && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.precio}</p>
              </div>
            )}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="existencia"
              >
                Existencia
              </label>

              <input
                id="existencia"
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 
                  text-gray-700 leading-tight  focus:shadow-outline"
                placeholder="Existencia"
                onChange={formik.handleChange}
                value={formik.values.existencia}
                onBlur={formik.handleBlur}
              />
            </div>

            {formik.touched.existencia && formik.errors.existencia && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.existencia}</p>
              </div>
            )}

            <input
              type="submit"
              value="Agregar Producto"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default nuevoProducto;
