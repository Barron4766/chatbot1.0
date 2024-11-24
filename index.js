const express = require('express');

const app = express();
const port = 3000;

const { Client } = require("pg");

const client = new Client("postgresql://jesus_a_barron_mota:PNQ6uKDy0jnNE2HD428JqA@test-chatbot-3291.jxf.gcp-us-west2.cockroachlabs.cloud:26257/chatbot1?sslmode=verify-full");

(async () => {
  await client.connect();
})();

   // Ruta para obtener información de una persona
   app.get('/:nombre/:tipo', async (req, res) => {
       const { nombre, tipo } = req.params;

       // Verifica que se hayan proporcionado ambos parámetros
       if (!nombre || !tipo) {
           return res.status(400).json({ error: 'Se requieren nombre y tipo como parámetros.' });
       }

       // Mapeo de tipos a columnas de la tabla
       const columnas = {
           certificaciones: 'certificaciones',
           experiencia: 'experiencia',
           habilidades: 'habilidades_tecnicas',
           proyectos: 'proyectos'
       };

       const columna = columnas[tipo];

       if (!columna) {
           return res.status(400).json({ error: 'Tipo no válido. Debe ser certificaciones, experiencia, habilidades o proyectos.' });
       }

       try {
           const result = await client.query(`SELECT ${columna} FROM personas WHERE nombre = $1`, [nombre]);

           if (result.rows.length === 0) {
               return res.status(404).json({ error: 'Persona no encontrada.' });
           }

           res.json(result.rows[0]);
       } catch (err) {
           console.error(err);
           res.status(500).json({ error: 'Error en la consulta a la base de datos.' });
       }
   });

   app.listen(port, () => {
       console.log(`Servidor escuchando en http://localhost:${port}`);
   });