import Layout from "../components/Layout";
import Cliente from "../components/Cliente";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";

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

const Index = () => {
  const router = useRouter();
  //consulta  de apollo
  const { data, loading, client } = useQuery(OBTENER_CLIENTES_USUARIO);
  console.log();
  if (loading) return "Cargando...";
  if (!data.obtnerClientesVendedor) {
    client.clearStore();
    router.push("/login");
    return "Loading...";
  }
  return (
    data && (
      <div>
        <Layout>
          <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
          <Link href="/nuevoCliente">
            <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto">
              Nuevo Cliente
            </a>
          </Link>

          <div className="overflow-x-scroll">
            <table className="table-auto shadow-md mt-10 w-full w-lg">
              <thead className="bg-gray-800">
                <tr key="" className="text-white">
                  <th className="w-1/5 py-2">Nombre</th>
                  <th className="w-1/5 py-2">Empresa</th>
                  <th className="w-1/5 py-2">Email</th>
                  <th className="w-1/5 py-2">Eliminar</th>
                  <th className="w-1/5 py-2">Editar</th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {data.obtnerClientesVendedor.map((cliente) => (
                  <Cliente key={cliente.id} cliente={cliente} />
                ))}
              </tbody>
            </table>
          </div>
        </Layout>
      </div>
    )
  );
};

export default Index;
