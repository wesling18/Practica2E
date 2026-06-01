import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroEmpleado = ({
  mostrarModal,
  setMostrarModal,
  nuevoEmpleado,
  manejoCambioInput,
  agregarEmpleado,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async () => {
    if (
      nuevoEmpleado.nombre.trim() === "" ||
      nuevoEmpleado.apellido.trim() === "" ||
      nuevoEmpleado.pin_acceso.trim() === "" ||
      nuevoEmpleado.tipo_empleado.trim() === ""
    ) {
      return;
    }
    setDeshabilitado(true);
    await agregarEmpleado();
    setDeshabilitado(false);
  };

  const esInvalido =
    nuevoEmpleado.nombre.trim() === "" ||
    nuevoEmpleado.apellido.trim() === "" ||
    nuevoEmpleado.pin_acceso.trim() === "" ||
    nuevoEmpleado.tipo_empleado.trim() === "";

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Empleado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nuevoEmpleado.nombre}
              onChange={manejoCambioInput}
              placeholder="Ingresa el nombre"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={nuevoEmpleado.apellido}
              onChange={manejoCambioInput}
              placeholder="Ingresa el apellido"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>PIN de Acceso</Form.Label>
            <Form.Control
              type="password"
              name="pin_acceso"
              value={nuevoEmpleado.pin_acceso}
              onChange={manejoCambioInput}
              placeholder="Ingresa el PIN de acceso"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Empleado</Form.Label>
            <Form.Control
              type="text"
              name="tipo_empleado"
              value={nuevoEmpleado.tipo_empleado}
              onChange={manejoCambioInput}
              placeholder="Ej. Administrador, Vendedor, Cajero"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleRegistrar}
          disabled={esInvalido || deshabilitado}
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroEmpleado;
