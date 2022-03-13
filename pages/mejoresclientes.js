import React from "react";
import Layout from "../components/Layout";
import { useQuery, gql } from "@apollo/client";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const MEJORES_VENDEDORES = gql`
  query mejoresClientes {
    mejoresClientes {
      cliente {
        nombre
        empresa
      }
      total
    }
  }
`;
const mejoresclientes = () => {
  //LLAMANDO QUERY
  const { loading, error, data } = useQuery(MEJORES_VENDEDORES);
  if (loading) return "Cargando...";
  console.log(data);
  const { mejoresClientes } = data;
  const clientesGrafica = [];
  mejoresClientes.map((cliente, index) => {
    clientesGrafica[index] = {
      ...cliente.cliente[0],
      total: cliente.total,
    };
  });
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Mejores clientes</h1>
      <BarChart
        className="mt-10"
        width={600}
        height={500}
        data={clientesGrafica}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nombre" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#3182ce" />
      </BarChart>
    </Layout>
  );
};

export default mejoresclientes;
