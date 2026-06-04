import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import TablaPermisos from "../components/permisos/TablaPermisos";
import TarjetaPermisos from "../components/permisos/TarjetaPermisos";
import ModalEdicionPermisos from "../components/permisos/ModalEdicionPermisos";
import NotificacionOperacion from "../components/NotificacionOperaciones";

const Permisos = () => {
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const cargarRoles = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("permisos")
        .select("*")
        .order("id_permiso", { ascending: true });

      if (error) {
        console.error("Error al cargar roles:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar los roles de permisos.",
          tipo: "error",
        });
        return;
      }
      setRoles(data || []);
    } catch (err) {
      console.error("Excepción al cargar roles:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar los roles.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  const abrirModalEdicion = (rol) => {
    setRolSeleccionado(rol);
    setMostrarModal(true);
  };

  const guardarCambios = async (rolEditado) => {
    try {
      const { error } = await supabase
        .from("permisos")
        .update({
          descripcion: rolEditado.descripcion,
          permisos: rolEditado.permisos,
        })
        .eq("id_permiso", rolEditado.id_permiso);

      if (error) {
        console.error("Error al actualizar permisos:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al actualizar los permisos de ${rolEditado.rol}.`,
          tipo: "error",
        });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: `Permisos del rol "${rolEditado.rol}" actualizados con éxito.`,
        tipo: "exito",
      });

      setMostrarModal(false);
      await cargarRoles();
    } catch (err) {
      console.error("Excepción al actualizar permisos:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al guardar los cambios.",
        tipo: "error",
      });
    }
  };

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col>
          <h3 className="mb-0">
            <i className="bi-shield-lock-fill me-2"></i> Gestión de Permisos por Rol
          </h3>
        </Col>
      </Row>

      <hr />

      {cargando ? (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando roles y permisos...</p>
          </Col>
        </Row>
      ) : roles.length === 0 ? (
        <Alert variant="info" className="text-center">
          No hay roles de permisos definidos en el sistema.
        </Alert>
      ) : (
        <Row>
          {/* Vista móvil */}
          <Col xs={12} className="d-lg-none">
            <TarjetaPermisos roles={roles} abrirModalEdicion={abrirModalEdicion} />
          </Col>
          
          {/* Vista desktop */}
          <Col lg={12} className="d-none d-lg-block">
            <TablaPermisos roles={roles} abrirModalEdicion={abrirModalEdicion} />
          </Col>
        </Row>
      )}

      {/* Modal de Edición de Permisos */}
      <ModalEdicionPermisos
        mostrar={mostrarModal}
        setMostrar={setMostrarModal}
        rol={rolSeleccionado}
        alGuardar={guardarCambios}
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

export default Permisos;
