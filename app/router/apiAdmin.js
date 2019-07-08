// const { Client } = require('pg');
// const express = require('express');
//const Router = require('express-promise-router');
//const db = require('../data/index')
const cors = require('cors');
const { Client } = require('pg');
const express = require('express');
const router = express.Router();
const plugins = require('../plugins');
const config = require('../config');

router.use(cors());
router.use(express.urlencoded());
router.use(express.json());

const POSTGRES_URI = config.db_uri;

router.get("/apiadmin/", (req, res) => {
    console.log(`\n-> GET ${req.path}`);
    res.send({ express: `Hello user admin` });
});

router.get('/apiadmin/:id', async(req, res) => {
    console.log(`\n-> GET ${req.path}`);
    const { id } = 11111111;
    const { ids } = req.params.id;
    const { rows } = await db.query('SELECT * FROM solicitud_ingreso WHERE id_usuario = $1', [id])
    console.log('-->' + rows + '-->' + ids);
    res.send('oe')
})

router.delete("/apiadmin/delete:id", (req, res) => {
    console.log(`\n-> GET ${req.path}`);

    /*const deleteQuery = 'DELETE FROM solicitud_ingreso WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }*/

    res.send({ express: `ayuda:-> ${MAIL_USER}` });
});

router.get('/apiadmin/todos', (req, res, next) => {
    console.log(`-> GET ${req.path}`);
    const client = new Client({
        connectionString: POSTGRES_URI,
        ssl: true,
    })
    const queryText = 'SELECT * FROM solicitud_ingreso';

    client.connect((err, done) => {
        if (err) {
            done();
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ success: false, data: err });
        }
        client.query(queryText)
            .then(response => {
                if (response.rows.length < 1) {
                    client.end()
                    res.status(404).send({
                        status: 'Failed',
                        message: 'No requests information found',
                    });
                } else {
                    client.end()
                    res.status(200).send({
                        ok: true,
                        data: response.rows
                    });
                }
            })
            .catch(err => {
                client.end()
                return res.status(400).json({ success: false, data: 'error en query ' + queryText + ' -> ' + err });
            });
    });
});

module.exports = router;