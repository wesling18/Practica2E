import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaEmpleados = ({
  empleados,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empleados && empleados.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [empleados]);

  return (
    <>
      {loading ? (
        <div className="text-center">
          <h4>Cargando empleados...</h4>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th className="d-none d-md-table-cell">PIN de Acceso</th>
              <th>Tipo</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado, index) => (
              <tr key={empleado.id_empleado}>
                <td>{index + 1}</td>
                <td>{empleado.nombre}</td>
                <td>{empleado.apellido}</td>
                <td className="d-none d-md-table-cell">••••</td>
                <td>{empleado.tipo_empleado}</td>
                <td className="text-center">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="m-1"
                    onClick={() => abrirModalEdicion(empleado)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(empleado)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TablaEmpleados;
