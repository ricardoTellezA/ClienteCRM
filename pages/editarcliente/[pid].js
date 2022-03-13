import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useQuery, gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Formik } from "formik";
import * as Yup from "yup";

const OBTENER_CLIENTE = gql`
  query obtenerCliente($id: ID!) {
    obtenerCliente(id: $id) {
      nombre
      apellido
      email
      telefono
      empresa
    }
  }
`;

const ACTUALIZAR_CLIENTE = gql`
  mutation actualizarCliente($id: ID!, $input: ClienteInput) {
    actualizarCliente(id: $id, input: $input) {
      nombre
      empresa
    }
  }
`;

const EditarCliente = () => {
  const [clienteInfo, setClienteInfo] = useState({});
  //OBTENER ID ACTUAL
  const router = useRouter();
  const { query: pid } = router;
  //   console.log(pid.pid)

  //OBTENER CLIENTE
  const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
    variables: {
      id: pid.pid,
    },
  });

  //ACTUALIZAR CLIENTE
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

  //SHEMA DE VALIDACION

  const shemaValidation = Yup.object({
    nombre: Yup.string().required("El nombre del cliente es obligatorio"),
    apellido: Yup.string().required("El apellido del cliente es obligatorio"),
    empresa: Yup.string().required("La empresa es obligatoria"),
    email: Yup.string()
      .email("El email no es válido")
      .required("El email es obligatorio"),
  });

  //   console.log(data.obtenerCliente);

  //MODIFICAR CLIENTE
  const actualizarDatos = async (valores) => {
    const { nombre, apellido, empresa, email, telefono } = valores;
    try {
      const { data } = await actualizarCliente({
        variables: {
          id: pid.pid,
          input: {
            nombre,
            apellido,
            empresa,
            email,
            telefono,
          },
        },
      });

      //Mostrar alerta

      Swal.fire(
        "Actualizado!",
        "El cliente se actualizó correctamente",
        "success"
      );

      //REDIRECCIONAR

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if ((!loading, data)) {
      setClienteInfo(data);
    }
  }, [data, loading]);

  const { obtenerCliente } = clienteInfo;
  console.log(obtenerCliente);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>
        {obtenerCliente && (
          
      <div className="flex justify-center mt-5">
      <div className="w-full max-w-lg">
        <Formik
          validationSchema={shemaValidation}
          enableReinitialize
          initialValues={obtenerCliente}
          onSubmit={(valores) => {
            //   console.log("enviando");
            actualizarDatos(valores);
          }}
        >
          {(props) => {
            return (
              clienteInfo && (
                <form
                  onSubmit={props.handleSubmit}
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nombre"
                    >
                      Nombre
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 
              text-gray-700 leading-tight  focus:shadow-outline"
                      placeholder="Nombre Cliente"
                      onChange={props.handleChange}
                      value={props.values.nombre}
                      onBlur={props.handleBlur}
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
                      htmlFor="apellido"
                    >
                      Apellido
                    </label>
                    <input
                      id="apellido"
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 
              text-gray-700 leading-tight  focus:shadow-outline"
                      placeholder="Apellido Cliente"
                      onChange={props.handleChange}
                      value={props.values.apellido}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.apellido && props.errors.apellido && (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.apellido}</p>
                    </div>
                  )}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="empresa"
                    >
                      Empresa
                    </label>
                    <input
                      id="empresa"
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 
              text-gray-700 leading-tight  focus:shadow-outline"
                      placeholder="Empresa Cliente"
                      onChange={props.handleChange}
                      value={props.values.empresa}
                      onBlur={props.handleBlur}
                    />
                  </div>

                  {props.touched.empresa && props.errors.empresa && (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.empresa}</p>
                    </div>
                  )}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 
              text-gray-700 leading-tight  focus:shadow-outline"
                      placeholder="Email"
                      onChange={props.handleChange}
                      value={props.values.email}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.email && props.errors.email && (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.email}</p>
                    </div>
                  )}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="telefono"
                    >
                      Telefono
                    </label>
                    <input
                      id="telefono"
                      type="tel"
                      className="shadow appearance-none border rounded w-full py-2 px-3 
              text-gray-700 leading-tight  focus:shadow-outline"
                      placeholder="Teléfono  Cliente"
                      onChange={props.handleChange}
                      value={props.values.telefono}
                      onBlur={props.handleBlur}
                    />
                  </div>

                  <input
                    type="submit"
                    value="Editar Cliente"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                  />
                </form>
              )
            );
          }}
        </Formik>
      </div>
    </div>
        )}
    </Layout>
  );
};

export default EditarCliente;
