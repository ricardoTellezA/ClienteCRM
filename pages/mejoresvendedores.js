import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MEJORES_VENDEDORES = gql`
  query mejoresVendedores {
    mejoresVendedores {
      vendedor {
        nombre
        email
      }
      total
    }
  }
`;

const mejoresvendedores = () => {
  //LLAMANDO QUERY
  const { data, loading, error, startPolling, stopPolling } =
    useQuery(MEJORES_VENDEDORES);

  useEffect(() => {
    startPolling(1000);
    return () => {
      startPolling(0);
    };
  }, [startPolling, stopPolling]);

  if (loading) return "Cargando...";
  console.log(data.mejoresVendedores);

  const { mejoresVendedores } = data;
  const venderGrafica = [];
  mejoresVendedores.map((vendedor, index) => {
    venderGrafica[index] = {
      ...vendedor.vendedor[0],
      total: vendedor.total,
    };
  });
  console.log(venderGrafica);
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Mejores vendedores</h1>
      <ResponsiveContainer
       width={'99%'}
       height={550}
      >
        <BarChart
          className="mt-10"
          width={600}
          height={500}
          data={venderGrafica}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#3182ce" />
        </BarChart>
      </ResponsiveContainer>
    </Layout>
  );
};

export default mejoresvendedores;
