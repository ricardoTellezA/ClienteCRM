import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const OBTENER_PRODUCTO = gql`
  query obtenerProducto($id: ID!) {
    obtenerProducto(id: $id) {
      nombre
      precio
      existencia
    }
  }
`;

const ACTUALIZAR_PRODUCTO = gql`
  mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
      id
      nombre
      existencia
      precio
    }
  }
`;
const EditarProducto = () => {
  const [productoInfo, guardarProductoInfo] = useState({});
  const router = useRouter();
  const { query: pid } = router;

  //Consulta para obtener el producto
  const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
    variables: {
      id: pid.pid,
    },
  });

  //Mutation para actualizar el producto
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

  //SHEMA DE VALIDACION
  const schemaValidation = Yup.object({
    nombre: Yup.string().required("El nombre del cliente es obligatorio"),
    precio: Yup.number()
      .positive("No se aceptan números negativos")
      .required("El precio es obligatorio"),
    existencia: Yup.number()
      .positive("No se aceptan números negativos")
      .required("La existencia es obligatoria"),
  });
  useEffect(() => {
    if (!loading && data) {
      guardarProductoInfo(data);
    }
  }, [data, loading]);

  const actualzarInfoProducto = async (valores) => {
    const { nombre, precio, existencia } = valores;
    try {
      const { data } = await actualizarProducto({
        variables: {
          id: pid.pid,
          input: {
            nombre,
            precio,
            existencia,
          },
        },
      });

      //redireccionar
      router.push("/productos");
      //alerta
      Swal.fire(
        "Correcto",
        "El producto se actualizó correctamente",
        "success"
      );
    } catch (error) {
      console.log(error);
    }
  };
  const { obtenerProducto } = productoInfo;

  if (loading) return "Cargando...";
  if(!data){
    return "No existe el producto";
  }
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>

      {!loading && obtenerProducto && (
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            <Formik
              enableReinitialize
              initialValues={obtenerProducto}
              validationSchema={schemaValidation}
              onSubmit={(valores) => {
                actualzarInfoProducto(valores);
              }}
            >
              {(props) => {
                return (
                  <form
                    onSubmit={props.handleSubmit}
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
                        value={props ? props.values.nombre : ""}
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                      />
                    </div>

                    {props.touched.nombre && props.errors.nombre && (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                        <p className="font-bold">Error</p>
                        <p>{props.errors.nombre}</p>
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
                        value={props ? props.values.precio : ""}
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                      />
                    </div>

                    {props.touched.precio && props.errors.precio && (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                        <p className="font-bold">Error</p>
                        <p>{props.errors.precio}</p>
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
                        value={props ? props.values.existencia : ""}
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                      />
                    </div>

                    {props.touched.existencia && props.errors.existencia && (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                        <p className="font-bold">Error</p>
                        <p>{props.errors.existencia}</p>
                      </div>
                    )}

                    <input
                      type="submit"
                      value="Editar Producto"
                      className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                    />
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EditarProducto;
