import React from "react";
import { Row, Col } from "react-bootstrap";
import TarjetaCatalogo from "./TarjetaCatalogo";

const TarjetasCatalogo = ({ productos, categorias }) => {
  const obtenerNombreCategoria = (id_categoria) => {
    const categoria = categorias.find((cat) => cat.id_categoria === id_categoria);
    return categoria ? categoria.nombre_categoria : "Sin categoría";
  };

  return (
    <Row className="g-3">
      {productos.map((producto) => (
        <Col xs={6} sm={6} md={4} lg={3} key={producto.id_producto}>
          <TarjetaCatalogo
            producto={producto}
            categoriaNombre={obtenerNombreCategoria(producto.categoria_producto)}
          />
        </Col>
      ))}
    </Row>
  );
};

export default TarjetasCatalogo;
