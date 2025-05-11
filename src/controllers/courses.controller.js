import pool from '../db.js';
function formatDateToDDMMYYYY(date) {
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
}
const renameKeys = (data) => {
    return data.map(item => ({
      id: item.id,
      title: item.titulo,
      description: item.descripcion,
      category: item.categoria,
      level: item.nivel,
      image: item.imagen_url,
      language: item.idioma,
      price: item.precio,
      isFree: item.es_gratis,
      subscription: item.requiere_suscripcion,
      duration: item.duracion_horas,
      qualification: item.calificacion_promedio,
      reviews: item.total_calificaciones,
      dateCreated: formatDateToDDMMYYYY(item.fecha_creacion),
      dateUpdated: formatDateToDDMMYYYY(item.fecha_actualizacion),
      status: item.estado
    }));
  };
export const get = async (req, res) => {
    try {
        let result = await pool.query("SELECT * FROM cursos");
        result = result.rows;
        const courses = renameKeys(result);
        // const resultt = result.filter((product) => product.activo !== 0);
        // resultt.sort((a, b) => {
        //   if (a.titulo.toLowerCase() < b.nombre.toLowerCase()) return -1;
        //   if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return 1;
        //   return 0;
        // });
        res.json({success: true, courses, message: "Cursos Enviados"});
      } catch (err) {
        console.error("Error al realizar la consulta de productos: ", err);
      }
}