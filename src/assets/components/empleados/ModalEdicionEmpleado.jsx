import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionEmpleado = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  empleadoEditar,
  manejoCambioInputEdicion,
  actualizarEmpleado,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async () => {
    if (
      empleadoEditar.nombre.trim() === "" ||
      empleadoEditar.apellido.trim() === "" ||
      empleadoEditar.pin_acceso.trim() === "" ||
      empleadoEditar.tipo_empleado.trim() === ""
    ) {
      return;
    }
    setDeshabilitado(true);
    await actualizarEmpleado();
    setDeshabilitado(false);
  };

  const esInvalido =
    !empleadoEditar.nombre ||
    empleadoEditar.nombre.trim() === "" ||
    !empleadoEditar.apellido ||
    empleadoEditar.apellido.trim() === "" ||
    !empleadoEditar.pin_acceso ||
    empleadoEditar.pin_acceso.trim() === "" ||
    !empleadoEditar.tipo_empleado ||
    empleadoEditar.tipo_empleado.trim() === "";

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Empleado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={empleadoEditar.nombre || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el nombre"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={empleadoEditar.apellido || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el apellido"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>PIN de Acceso</Form.Label>
            <Form.Control
              type="password"
              name="pin_acceso"
              value={empleadoEditar.pin_acceso || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el nuevo PIN de acceso"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Empleado</Form.Label>
            <Form.Select
              name="tipo_empleado"
              value={empleadoEditar.tipo_empleado || ""}
              onChange={manejoCambioInputEdicion}
              required
            >
              <option value="">Selecciona un tipo...</option>
              <option value="administrador">Administrador</option>
              <option value="cajero">Cajero</option>
              <option value="mesero">Mesero</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleActualizar}
          disabled={esInvalido || deshabilitado}
        >
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionEmpleado;
