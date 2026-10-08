import nodeUtil = require("node:util");
import type { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../conf/dbConnection.ts";
import { CreateProductDto } from "../dto/CreateProductDto.ts";
import { UpdatePriceDto } from "../dto/UpdatePriceDto.ts";

export class ProductController{
    async getAll(_req: Request, res: Response){
        try{
            const [result, _]= await pool.execute('SELECT * FROM products WHERE active = TRUE');
            res.status(200).json(result);
        }catch(err){
            console.error(err);
            res.status(500).json({message: "internal server error"});
        }
    }
    async getById(req: Request, res: Response){
        try{ 
            const id = Number(req.params.id);
            if(Number.isNaN(id)){
                res.status(400).json({ message: "id must be a number"});
                return;
            }
            const [result] = await pool.execute<RowDataPacket[]>('SELECT * FROM products WHERE id = ? AND active = TRUE', [id]);

            if(result.length === 0){
                res.status(404).json({ message: "product not found"});
                return;
            }
            res.json(result[0]);
        }catch(err){
            console.error(err);
            res.status(500).json({message: "internal server error"});
        }
    }

    async create (req: Request, res: Response){
        console.log("Body recibido en el backend:", req.body);
        try{
            const dto = CreateProductDto.create(req.body);
            const query = `
                INSERT INTO products (name, price, stock, description, brand, img, active)
                VALUES (?, ?, ?, ?, ?, ?, TRUE)`;
            const [result] = await pool.execute<ResultSetHeader>(query, [
                dto.name,
                dto.price,
                dto.stock,
                dto.description,
                dto.brand || null,
                dto.img || null
            ]);
            res.status(201).json({ message : "product created", id: result.insertId});
        }catch (err){
            if(err instanceof Error){
                res.status(400).json({ message: err.message});
            }else{
                res.status(500).json({ message: "internal server error"});
            }
        }
    }
    async update (req: Request, res: Response){
        try{
            const id= Number (req.params.id);
            if(Number.isNaN(id)){
                res.status(400).json({message: "id must be a number"});
                return;
            }

            const dto= CreateProductDto.create(req.body);
            const query= 'UPDATE products SET name =?, price =?, stock =?, description =?, brand =?, img =? WHERE id =? AND active = TRUE';
            const [result] = await pool.execute<ResultSetHeader>(query, [
                dto.name, dto.price, dto.stock, dto.description, dto.brand || null, dto.img || null, id
            ]);

            if(result.affectedRows > 0){
                res.json({message: "product updated"});
                return;
            }
            res.status(404).json({message: "product not found"});
        }catch(err){
            if(err instanceof Error){
                res.status(400).json({ message: err.message});
            }else{
                res.status(500).json({ message: "internal server error"});
            }
        }
    }

    async softDelete(req: Request, res: Response){
        try{
            const id = Number(req.params.id);
            if (Number.isNaN(id)){
                res.status(400).json({message: "id must be a number"});
                return;
            }

            const [result] = await pool.execute<ResultSetHeader>('UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE', [id]);
            if (result.affectedRows > 0){
                res.status(200).json({ message: `product with id ${id} deleted`});
                return;
            }
            res.status(404).json({message: "product not found"});
        }catch (err){
            res.status(500).json({message: "internal server error"});
        }
    }

    async changePrice (req: Request, res:Response){
        try{
            const id= Number(req.params.id);
            if(Number.isNaN(id)){
                res.status(400).json({message: "id must be a number"});
                return;
            }

            const dto= UpdatePriceDto.create(req.body);
            const [result] = await pool.execute<ResultSetHeader>('UPDATE products SET price =? WHERE id =? AND active = TRUE', [dto.price, id]);

            if (result.affectedRows >0){
                res.json({message: "price updated"});
                return;
            }
            res.status(404).json({message: "product not found"});
        }catch (err){
            if (err instanceof Error){
                res.status(400).json({ message: err.message})
            }else{
                res.status(500).json({message: "internal server error"});
            }
            
        }
    }
}