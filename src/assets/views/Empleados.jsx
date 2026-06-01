import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner, Alert, Pagination } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import NotificacionOperacion from "../components/NotificacionOperaciones";
import TablaEmpleados from "../components/empleados/TablaEmpleados";
import TarjetaEmpleado from "../components/empleados/TarjetaEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import ModalEliminacionEmpleado from "../components/empleados/ModalEliminacionEmpleado";
import CuadroBusquedas from "../components/busquedas/cuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Empleados = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);

  const [empleados, setEmpleados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  
  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  
  const [cargando, setCargando] = useState(true);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [empleadoEditar, setEmpleadoEditar] = useState({
    id_empleado: "",
    nombre: "",
    apellido: "",
    pin_acceso: "",
    tipo_empleado: "",
  });

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    apellido: "",
    pin_acceso: "",
    tipo_empleado: "",
  });

  const abrirModalEdicion = (empleado) => {
    setEmpleadoEditar({
      id_empleado: empleado.id_empleado,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      pin_acceso: empleado.pin_acceso,
      tipo_empleado: empleado.tipo_empleado,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (empleado) => {
    setEmpleadoAEliminar(empleado);
    setMostrarModalEliminacion(true);
  };

  const cargarEmpleados = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("empleados")
        .select("*")
        .order("id_empleado", { ascending: true });

      if (error) {
        console.error("Error al cargar empleados:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar empleados.",
          tipo: "error",
        });
        return;
      }
      setEmpleados(data || []);
    } catch (err) {
      console.error("Excepción al cargar empleados:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar empleados.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setEmpleadosFiltrados(empleados);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = empleados.filter(
        (emp) =>
          emp.nombre.toLowerCase().includes(textoLower) ||
          emp.apellido.toLowerCase().includes(textoLower) ||
          emp.tipo_empleado.toLowerCase().includes(textoLower)
      );
      setEmpleadosFiltrados(filtrados);
      setPaginaActual(1); // Reiniciar a la primera página al buscar
    }
  }, [textoBusqueda, empleados]);

  // Lógica de paginación
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const empleadosPaginados = empleadosFiltrados.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(empleadosFiltrados.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  const agregarEmpleado = async () => {
    try {
      if (
        !nuevoEmpleado.nombre.trim() ||
        !nuevoEmpleado.apellido.trim() ||
        !nuevoEmpleado.pin_acceso.trim() ||
        !nuevoEmpleado.tipo_empleado.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("empleados").insert([
        {
          nombre: nuevoEmpleado.nombre,
          apellido: nuevoEmpleado.apellido,
          pin_acceso: nuevoEmpleado.pin_acceso,
          tipo_empleado: nuevoEmpleado.tipo_empleado,
        },
      ]);

      if (error) {
        console.error("Error al agregar empleado:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al registrar empleado.",
          tipo: "error",
        });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: `Empleado "${nuevoEmpleado.nombre} ${nuevoEmpleado.apellido}" registrado exitosamente.`,
        tipo: "exito",
      });

      setNuevoEmpleado({ nombre: "", apellido: "", pin_acceso: "", tipo_empleado: "" });
      setMostrarModal(false);
      await cargarEmpleados();
    } catch (err) {
      console.error("Excepción al agregar empleado:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al registrar empleado.",
        tipo: "error",
      });
    }
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setEmpleadoEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const actualizarEmpleado = async () => {
    try {
      if (
        !empleadoEditar.nombre.trim() ||
        !empleadoEditar.apellido.trim() ||
        !empleadoEditar.pin_acceso.trim() ||
        !empleadoEditar.tipo_empleado.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModalEdicion(false);

      const { error } = await supabase
        .from("empleados")
        .update({
          nombre: empleadoEditar.nombre,
          apellido: empleadoEditar.apellido,
          pin_acceso: empleadoEditar.pin_acceso,
          tipo_empleado: empleadoEditar.tipo_empleado,
        })
        .eq("id_empleado", empleadoEditar.id_empleado);

      if (error) {
        console.error("Error al actualizar empleado:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al actualizar el empleado ${empleadoEditar.nombre}.`,
          tipo: "error",
        });
        return;
      }

      await cargarEmpleados();
      setToast({
        mostrar: true,
        mensaje: `Empleado ${empleadoEditar.nombre} actualizado exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al actualizar empleado.",
        tipo: "error",
      });
      console.error("Excepción al actualizar empleado:", err.message);
    }
  };

  const eliminarEmpleado = async () => {
    if (!empleadoAEliminar) return;
    try {
      setMostrarModalEliminacion(false);

      const { error } = await supabase
        .from("empleados")
        .delete()
        .eq("id_empleado", empleadoAEliminar.id_empleado);

      if (error) {
        console.error("Error al eliminar empleado:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar el empleado ${empleadoAEliminar.nombre}.`,
          tipo: "error",
        });
        return;
      }

      await cargarEmpleados();
      setToast({
        mostrar: true,
        mensaje: `Empleado ${empleadoAEliminar.nombre} eliminado exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al eliminar empleado.",
        tipo: "error",
      });
      console.error("Excepción al eliminar empleado:", err.message);
    }
  };

  return (
    <Container className="mt-3">
      {/* Título y botón Nuevo Empleado */}
      <Row className="align-items-center mb-3">
        <Col xs={9} sm={7} md={7} lg={7} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi-people-fill me-2"></i> Empleados
          </h3>
        </Col>
        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nuevo Empleado</span>
          </Button>
        </Col>
      </Row>

      <hr />

      {/* Cuadro de búsqueda debajo de la línea divisoria */}
      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por nombre, apellido o tipo..."
          />
        </Col>
      </Row>

      {/* Mensaje de no coincidencias solo cuando hay búsqueda y no hay resultados */}
      {!cargando && textoBusqueda.trim() && empleadosFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron empleados que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {/* Paginación estándar */}
      {!cargando && totalPaginas > 1 && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First onClick={() => cambiarPagina(1)} disabled={paginaActual === 1} />
              <Pagination.Prev onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} />
              {[...Array(totalPaginas)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === paginaActual}
                  onClick={() => cambiarPagina(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
              <Pagination.Last onClick={() => cambiarPagina(totalPaginas)} disabled={paginaActual === totalPaginas} />
            </Pagination>
          </Col>
        </Row>
      )}

      {/* Spinner mientras se cargan los empleados */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando empleados...</p>
          </Col>
        </Row>
      )}

      {/* Lista de empleados filtrada */}
      {!cargando && empleadosFiltrados.length > 0 && (
        <Row>
          <Col xs={12} sm={12} md={12} className="d-lg-none">
            <TarjetaEmpleado
              empleados={empleadosPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaEmpleados
              empleados={empleadosPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* Selector de paginación personalizada */}
      {!cargando && empleadosFiltrados.length > 0 && (
        <Row className="mt-3">
          <Col>
            <Paginacion
              registrosPorPagina={itemsPorPagina}
              totalRegistros={empleadosFiltrados.length}
              paginaActual={paginaActual}
              establecerPaginaActual={setPaginaActual}
              establecerRegistrosPorPagina={setItemsPorPagina}
            />
          </Col>
        </Row>
      )}

      {/* Modal de Registro */}
      <ModalRegistroEmpleado
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoEmpleado={nuevoEmpleado}
        manejoCambioInput={manejoCambioInput}
        agregarEmpleado={agregarEmpleado}
      />

      {/* Modal de Edición */}
      <ModalEdicionEmpleado
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        empleadoEditar={empleadoEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarEmpleado={actualizarEmpleado}
      />

      {/* Modal de Eliminación */}
      <ModalEliminacionEmpleado
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarEmpleado={eliminarEmpleado}
        empleado={empleadoAEliminar}
      />

      {/* Notificación Toast */}
      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Empleados;
