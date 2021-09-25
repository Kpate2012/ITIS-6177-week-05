const express = require('express');
const app = express();
const port = 3000;

const mariadb = require('mariadb');
const pool = mariadb.createPool({
        host:'localhost',
        user:'root',
        password:'root',
        database:'sample',
        port:3306,
        connectionLimit:5
});

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const bodyParser = require('body-parser');
const options = {
    swaggerDefinition: {
        info: {
            title: 'Assignment 8 API',
            version: '1.0.0',
            description: 'Assignment 8 API swagger documentation'
        },
        host: '192.241.134.99:3000',
        basepath: '/',
    },
    apis: ['./server.js'],
};
const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

/**
 * @swagger
 * definitions:
 *  foods:
 *   type: object
 *   properties:
 *    ITEM_ID:
 *     type: string
 *     example: '8'
 *    ITEM_NAME:
 *     type: string
 *     example: 'Chocolate cookies'
 *    ITEM_UNIT:
 *     type: string
 *     example: 'Pcs'
 *    COMPANY_ID:
 *     type: string
 *     example: '15\r'
 */

/**
* @swagger
* /api/v1/companies:
*    get:
*     description: Returns all companies
*     produces:
*      -application/json
*     responses:
*      200:
*       description:Object companies containing array of companies details
*/


app.get('/api/v1/companies', async (req,res)=>{

    const conn = await pool.getConnection();
    try{
            const result= await pool.query("select * from company");
            res.send(result);
    } catch(err){
    res.send(err);
            }
    });

    
    /**
    * @swagger
    * /api/v1/foods:
    *    get:
    *     description: Returns all food item
    *     produces:
    *      -application/json
    *     responses:
    *      200:
    *       description:Object food containing array of food item details
    */

     app.get('/api/v1/foods',async (req,res)=>{const conn = await pool.getConnection();
        try{
                const result = await pool.query("select * from foods");
                res.send(result);
        }catch(err){
        res.send(err);}
        });
    
        /**
         * @swagger
         * /api/v1/foods?id=:
         *  get:
         *   summary: "Get food item by ID"
         *   description: "For valid response try integer IDs with positive integer value."
         *   produces:
         *   - "application/json"
         *   parameters:
         *   - name: id
         *     in: query
         *     description: "ID of the food item that needs to be searched"
         *     required: true
         *     type: "integer"
         *     example: 8
         *   responses:
         *     "200":
         *       description:"Food item displayed successfully"
         *     "400":
         *       description: "Invalid ID supplied"
         *     "404":
         *       description: "Food Item not found"
         */

         app.get('/api/v1/foods', async(req,res)=>{
            const conn = await pool.getConnection();
        
            try{
            let id = req.query.id;
            const result = await pool.query("SELECT * FROM foods WHERE ITEM_ID = ?",[id]);
                    res.send(result);
            }catch(i){res.send(i);}
            });
        
        /**
        * @swagger
        * /api/v1/customers:
        *    get:
        *     description: Returns all customers
        *     produces:
        *      -application/json
        *     responses:
        *      200:
        *       description:Object customers containing array of customers details
        */
        
        
        app.get('/api/v1/customers', async (req,res)=>{
            const conn = await pool.getConnection();
            try{
                    const result=await pool.query("select * from customer");
                    res.send(result);
            }catch(e){
            res.send(e);
            }
            });

            

    /**
     * @swagger
     * /api/v1/foods:
     *  post:
     *   summary: Adds new food item
     *   description: Adds new food item
     *   consumes:
     *    - application/json
     *   produces:
     *    - application/json
     *   parameters:
     *    - in: body
     *      name: Request body
     *      required: true
     *      description: Request body object
     *      schema:
     *       $ref: '#/definitions/foods'
     *   requestBody:
     *    content:
     *     application/json:
     *      schema:
     *       $ref: '#/definitions/foods'
     *   responses:
     *    200:
     *     description: successfully added new food item
     *    400:
     *     description: Bad request
     *     content:
     *      application/json:
     *       schema:
     *        $ref: '#/definitions/foods'
    */


    app.post('/api/v1/foods',async (req,res)=>{
        let food = req.body;
        const conn = await pool.getConnection();
        try{
                const result = await pool.query("INSERT INTO foods(ITEM_ID,ITEM_NAME,ITEM_UNIT,COMPANY_ID) VALUES(?,?,?,?)",[food.ITEM_ID,food.ITEM_NAME,food.ITEM_UNIT, food.COMPANY_ID]);
    
                res.send(result);
        }catch(e){
        res.status(400).send(e);
        }
        });

        
    /**
 * @swagger
 * /api/v1/foods?id=:
 *  put:
 *   summary: update food item
 *   description: update food item
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: query
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: food item id
 *      example: '8'
 *    - in: body
 *      name: body
 *      required: true
 *      description: Request body object
 *      schema:
 *       $ref: '#/definitions/foods'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/foods'
 *   responses:
 *    200:
 *     description: successfully updated
 *    400:
 *     description: Bad request
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/foods'
*/


app.put('/api/v1/foods',async (req,res)=>{
    const conn = await pool.getConnection();
    let food = req.body;
    let id = parseInt(req.query.id);
    try{
            const result = await pool.query("UPDATE foods SET ITEM_NAME=?,ITEM_UNIT=?,COMPANY_ID=? WHERE ITEM_ID=?",[food.ITEM_NAME,food.ITEM_UNIT, food.COMPANY_ID,id]);
            res.send(result);
    }catch(e){
    res.send(e);
    }
    });

    

/**
 * @swagger
 * /api/v1/foods?id=:
 *  patch:
 *   summary: update food item
 *   description: update food item
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: query
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: food item id
 *      example: '8'
 *    - in: body
 *      name: body
 *      required: true
 *      description: Request body object
 *      schema:
 *       $ref: '#/definitions/foods'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/foods'
 *   responses:
 *    200:
 *     description: successfully updated
 *    400:
 *     description: Bad request
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/foods'
*/

app.patch('/api/v1/foods',async (req,res)=>{
    const conn = await pool.getConnection();
    let food = req.body;
    let id = parseInt(req.query.id);
    try{
             const result = await pool.query("UPDATE foods SET ITEM_NAME=?,ITEM_UNIT=?,COMPANY_ID=? WHERE ITEM_ID=?",[food.ITEM_NAME,food.ITEM_UNIT, food.COMPANY_ID,id]);
            res.send(result);
    }catch(e){
    res.send(e);
    }
    });

    

/**
 * @swagger
 * /api/v1/foods?id=:
 *  delete:
 *   summary: "Delete food item by ID"
 *   description: "For valid response try integer IDs with positive integer value."
 *   produces:
 *   - "application/json"
 *   parameters:
 *   - name: id
 *     in: query
 *     description: "ID of the food item that needs to be deleted"
 *     required: true
 *     type: "integer"
 *     example: 8
 *   responses:
 *     "200":
 *       description:"Food item deleted successfully"
 *     "400":
 *       description: "Invalid ID supplied"
 *     "404":
 *       description: "Order not found"
 */

 app.delete('/api/v1/foods', async(req,res)=>{
    const conn = await pool.getConnection();

    try{
    let id = parseInt(req.query.id);
    const result = await pool.query("DELETE FROM foods WHERE ITEM_ID = ?",[id]);
            res.send(result);
    }catch(i){res.send(i);}
    });

    app.listen(port,()=>{
      console.log('App running at http://localhost: ',port);
    });
