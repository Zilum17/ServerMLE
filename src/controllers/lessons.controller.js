import pool from '../db.js';
const renameKeys = (data) => {
    return data.map(item => ({
      id: item.id,
      courseId: item.curso_id,
      title: item.titulo,
      description: item.descripcion,
      order: item.orden,
      isFree: item.es_gratis,
      dateCreated: item.fecha_creacion,
      dateUpdated: item.fecha_actualizacion,
    }));
  };
export const get = async (req, res) => {
    try {
        let result = await pool.query("SELECT * FROM lecciones WHERE curso_id = " + req.body.idCourse);
        result = result.rows;
        const lessons = renameKeys(result);
        // const resultt = result.filter((product) => product.activo !== 0);
        lessons.sort((a, b) => {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
        res.json({success: true, lessons, message: "Lecciones Enviadas"});
      } catch (err) {
        console.error("Error al realizar la consulta de lecciones: ", err);
      }
}