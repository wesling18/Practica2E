import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner, Alert, Pagination } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import ModalRegistroCategoria from "../components/categorias/ModalResgistroCategoria";
import NotificacionOperacion from "../components/NotificacionOperaciones";
import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TargetaCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import CuadroBusquedas from "../components/busquedas/cuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import ModalEnvioCorreoCategorias from "../components/categorias/ModalEnvioCorreoCategorias";
import emailjs from '@emailjs/browser';



const Categorias = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);

  const [categorias, setCategorias] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  
  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  
  const [cargando, setCargando] = useState(true);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

  const [categoriaEditar, setCategoriaEditar] = useState({
    id_categoria: "",
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar({
      id_categoria: categoria.id_categoria,
      nombre_categoria: categoria.nombre_categoria,
      descripcion_categoria: categoria.descripcion_categoria,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  const generarPDFCategoria = (categoria) => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text("Reporte de Categoría", 14, 20);

    // Línea decorativa
    doc.line(14, 25, 195, 25);

    // Información de la categoría
    doc.setFontSize(12);

    autoTable(doc, {
      startY: 35,
      head: [["Campo", "Valor"]],
      body: [
        ["ID", categoria.id_categoria],
        ["Nombre", categoria.nombre_categoria],
        ["Descripción", categoria.descripcion_categoria],
      ],
    });

    // Descargar PDF
    doc.save(`categoria_${categoria.id_categoria}.pdf`);
  };

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });

      if (error) {
        console.error("Error al cargar categorías:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar categorías.",
          tipo: "error",
        });
        return;
      }
      setCategorias(data || []);
    } catch (err) {
      console.error("Excepción al cargar categorías:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar categorías.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setCategoriasFiltradas(categorias);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtradas = categorias.filter(
        (cat) =>
          cat.nombre_categoria.toLowerCase().includes(textoLower) ||
          (cat.descripcion_categoria &&
            cat.descripcion_categoria.toLowerCase().includes(textoLower))
      );
      setCategoriasFiltradas(filtradas);
      setPaginaActual(1); // Reiniciar a la primera página al buscar
    }
  }, [textoBusqueda, categorias]);

  // Lógica de paginación
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const categoriasPaginadas = categoriasFiltradas.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(categoriasFiltradas.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  const agregarCategoria = async () => {
    try {
      if (
        !nuevaCategoria.nombre_categoria.trim() ||
        !nuevaCategoria.descripcion_categoria.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("categorias").insert([
        {
          nombre_categoria: nuevaCategoria.nombre_categoria,
          descripcion_categoria: nuevaCategoria.descripcion_categoria,
        },
      ]);

      if (error) {
        console.error("Error al agregar categoría:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al registrar categoría.",
          tipo: "error",
        });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: `Categoría "${nuevaCategoria.nombre_categoria}" registrada exitosamente.`,
        tipo: "exito",
      });

      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModal(false);
      await cargarCategorias();
    } catch (err) {
      console.error("Excepción al agregar categoría:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al registrar categoría.",
        tipo: "error",
      });
    }
  };

  const manejoCambioInputEdicion = (e) => {
  const { name, value } = e.target;
  setCategoriaEditar((prev) => ({
    ...prev,
    [name]: value,
  }));
};



const actualizarCategoria = async () => {
  try {
    if (
      !categoriaEditar.nombre_categoria.trim() ||
      !categoriaEditar.descripcion_categoria.trim()
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
      .from("categorias")
      .update({
        nombre_categoria: categoriaEditar.nombre_categoria,
        descripcion_categoria: categoriaEditar.descripcion_categoria,
      })
      .eq("id_categoria", categoriaEditar.id_categoria);

    if (error) {
      console.error("Error al actualizar categoría:", error.message);
      setToast({
        mostrar: true,
        mensaje: `Error al actualizar la categoría ${categoriaEditar.nombre_categoria}.`,
        tipo: "error",
      });
      return;
    }

    await cargarCategorias();
    setToast({
      mostrar: true,
      mensaje: `Categoría ${categoriaEditar.nombre_categoria} actualizada exitosamente.`,
      tipo: "exito",
    });
  } catch (err) {
    setToast({
      mostrar: true,
      mensaje: "Error inesperado al actualizar categoría.",
      tipo: "error",
    });
    console.error("Excepción al actualizar categoría:", err.message);
  }
};


const eliminarCategoria = async () => {
    if (!categoriaAEliminar) return;
    try {
      setMostrarModalEliminacion(false);

      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id_categoria", categoriaAEliminar.id_categoria);

      if (error) {
        console.error("Error al eliminar categoría:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar la categoría ${categoriaAEliminar.nombre_categoria}.`,
          tipo: "error",
        });
        return;
      }

      await cargarCategorias();
      setToast({
        mostrar: true,
        mensaje: `Categoría ${categoriaAEliminar.nombre_categoria} eliminada exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al eliminar categoría.",
        tipo: "error",
      });
      console.error("Excepción al eliminar categoría:", err.message);
    }
  };

  // Inicializar EmailJS
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const abrirModalCorreo = () => {
    setEmailDestino("");
    setMostrarModalCorreo(true);
  };

  const formatearCategoriasParaCorreo = () => {
    if (categorias.length === 0) return "No hay categorías registradas.";

    let texto = `LISTADO DE CATEGORÍAS\n\n`;
    texto += `Fecha: ${new Date().toLocaleDateString("es-NI")}\n`;
    texto += `Total de categorías: ${categorias.length}\n\n`;

    categorias.forEach((cat, index) => {
      texto += `${index + 1}. ${cat.nombre_categoria}\n`;
      if (cat.descripcion_categoria) {
        texto += `   Descripción: ${cat.descripcion_categoria}\n`;
      }
      texto += `\n`;
    });

    return texto;
  };

  const enviarCorreoCategorias = () => {
    if (!emailDestino.trim()) {
      setToast({
        mostrar: true,
        mensaje: "Por favor ingresa un correo destino.",
        tipo: "advertencia",
      });
      return;
    }

    setEnviandoCorreo(true);

    const mensaje = formatearCategoriasParaCorreo();

    const templateParams = {
      to_name: "Administrador",
      user_email: emailDestino,
      message: mensaje,
      fecha_envio: new Date().toLocaleDateString("es-NI")
    };

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    )
      .then(() => {
        setToast({
          mostrar: true,
          mensaje: "Correo enviado correctamente.",
          tipo: "exito",
        });
        setMostrarModalCorreo(false);
        setEmailDestino("");
      })
      .catch((error) => {
        console.error("Error EmailJS:", error);
        setToast({
          mostrar: true,
          mensaje: "Error al enviar el correo.",
          tipo: "error",
        });
      })
      .finally(() => {
        setEnviandoCorreo(false);
      });
  };

  return (
    <Container className="mt-3">
      {/* Título y botones */}
      <Row className="align-items-center mb-3">
        <Col xs={8} sm={8} md={8} lg={8} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi-bookmark-plus-fill me-2"></i> Categorías
          </h3>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} className="text-end">
          <Button variant="primary" onClick={abrirModalCorreo} size="md">
            <i className="bi bi-envelope"></i>
            <span className="d-none d-lg-inline ms-2">Enviar por Correo</span>
          </Button>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} className="text-end">
          <Button
            onClick={() => setMostrarModal(true)}
            size="md"
          >
            <i className="bi-plus-lg"></i>
            <span className="d-none d-lg-inline ms-2">Nueva Categoría</span>
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
            placeholder="Buscar por nombre o descripción..."
          />
        </Col>
      </Row>

      {/* Mensaje de no coincidencias solo cuando hay búsqueda y no hay resultados */}
      {!cargando && textoBusqueda.trim() && categoriasFiltradas.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron categorías que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {/* Paginación */}
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

      {/* Spinner mientras se cargan las categorías */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando categorías...</p>
          </Col>
        </Row>
      )}

      {/* Lista de categorías filtradas */}
      {!cargando && categoriasFiltradas.length > 0 && (
        <Row>
          <Col xs={12} sm={12} md={12} className="d-lg-none">
            <TarjetaCategoria
              categorias={categoriasPaginadas}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
              generarPDFCategoria={generarPDFCategoria}
            />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaCategorias
              categorias={categoriasPaginadas}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
              generarPDFCategoria={generarPDFCategoria}
            />
          </Col>
        </Row>
      )}

      {/* Paginación personalizada (si se desea usar en lugar de la de Bootstrap) */}
      {!cargando && categoriasFiltradas.length > 0 && (
        <Row className="mt-3">
          <Col>
            <Paginacion
              registrosPorPagina={itemsPorPagina}
              totalRegistros={categoriasFiltradas.length}
              paginaActual={paginaActual}
              establecerPaginaActual={setPaginaActual}
              establecerRegistrosPorPagina={setItemsPorPagina}
            />
          </Col>
        </Row>
      )}

      {/* Modal de Registro */}
      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={manejoCambioInput}
        agregarCategoria={agregarCategoria}
      />

      <ModalEdicionCategoria
      mostrarModalEdicion={mostrarModalEdicion}
      setMostrarModalEdicion={setMostrarModalEdicion}
       categoriaEditar={categoriaEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
       actualizarCategoria={actualizarCategoria}
     />

     <ModalEliminacionCategoria
  mostrarModalEliminacion={mostrarModalEliminacion}
  setMostrarModalEliminacion={setMostrarModalEliminacion}
  eliminarCategoria={eliminarCategoria}
  categoria={categoriaAEliminar}
/>

      <ModalEnvioCorreoCategorias
        mostrarModalCorreo={mostrarModalCorreo}
        setMostrarModalCorreo={setMostrarModalCorreo}
        emailDestino={emailDestino}
        setEmailDestino={setEmailDestino}
        enviandoCorreo={enviandoCorreo}
        enviarCorreoCategorias={enviarCorreoCategorias}
        totalCategorias={categorias.length}
      />

      {/* Notificación */}
      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Categorias;
