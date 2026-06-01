import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCliente = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  clienteEditar,
  manejoCambioInputEdicion,
  actualizarCliente,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async () => {
    if (
      clienteEditar.nombre.trim() === "" ||
      clienteEditar.apellido.trim() === "" ||
      clienteEditar.celular.trim() === ""
    ) {
      return;
    }
    setDeshabilitado(true);
    await actualizarCliente();
    setDeshabilitado(false);
  };

  const esInvalido =
    !clienteEditar.nombre ||
    clienteEditar.nombre.trim() === "" ||
    !clienteEditar.apellido ||
    clienteEditar.apellido.trim() === "" ||
    !clienteEditar.celular ||
    clienteEditar.celular.trim() === "";

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={clienteEditar.nombre || ""}
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
              value={clienteEditar.apellido || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el apellido"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Celular</Form.Label>
            <Form.Control
              type="text"
              name="celular"
              value={clienteEditar.celular || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el celular"
              required
            />
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

export default ModalEdicionCliente;
