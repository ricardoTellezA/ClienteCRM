import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidosContext from "../../context/pedidos/PedidosContext";

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtnerClientesVendedor {
      id
      nombre
      apellido
      email
      empresa
    }
  }
`;

const AsignarCliente = () => {
  const [cliente, setCliente] = useState([]);
  //context de pedidos
  const pedidosContext = useContext(PedidosContext);

  const {agregarCliente} = pedidosContext;
  //consultar base de datos
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);


  useEffect(() => {
    agregarCliente(cliente);
  }, [cliente]);

  const Seleccionarcliente = (cliente) => {
    setCliente(cliente);
  };
  //resultados de la consulta

  if (loading) return null;
  const { obtnerClientesVendedor } = data;
  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        1.- Asigna un cliente al pedido
      </p>
      <Select
        className="mt-3"
        options={obtnerClientesVendedor}
        // isMulti={true}
        onChange={(opcion) => Seleccionarcliente(opcion)}
        getOptionValue={(opcion) => opcion.id}
        getOptionLabel={(opcion) => opcion.nombre}
        placeholder="Buscar Clientes"
        noOptionsMessage={() => "No hay opciones"}
      />
    </>
  );
};

export default AsignarCliente;
