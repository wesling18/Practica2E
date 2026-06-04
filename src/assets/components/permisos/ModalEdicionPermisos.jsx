import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ModalEdicionPermisos = ({ mostrar, setMostrar, rol, alGuardar }) => {
  const [rolEditar, setRolEditar] = useState({ rol: "", descripcion: "", permisos: {} });

  useEffect(() => {
    if (rol) {
      setRolEditar({
        id_permiso: rol.id_permiso,
        rol: rol.rol,
        descripcion: rol.descripcion || "",
        permisos: { ...rol.permisos }
      });
    }
  }, [rol]);

  const actualizarSwitch = (key, valor) => {
    setRolEditar((prev) => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [key]: valor
      }
    }));
  };

  const guardarCambios = () => {
    alGuardar(rolEditar);
  };

  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Permisos - {rolEditar.rol}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Descripción del Rol</Form.Label>
          <Form.Control
            type="text"
            value={rolEditar.descripcion}
            onChange={(e) => setRolEditar({ ...rolEditar, descripcion: e.target.value })}
            placeholder="Ingresa la descripción del rol"
          />
        </Form.Group>

        <h5>Permisos Asociados:</h5>
        <hr />
        <Row>
          {Object.keys(rolEditar.permisos || {}).sort().map((key) => (
            <Col md={6} key={key} className="mb-2">
              <Form.Check
                type="switch"
                id={`switch-${key}`}
                label={key.replace(/_/g, " ")}
                checked={!!rolEditar.permisos[key]}
                onChange={(e) => actualizarSwitch(key, e.target.checked)}
              />
            </Col>
          ))}
        </Row>

        {Object.keys(rolEditar.permisos || {}).length === 0 && (
          <p className="text-center text-muted">No hay permisos definidos para este rol.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button variant="success" onClick={guardarCambios}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionPermisos;
