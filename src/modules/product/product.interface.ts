import type { CreateProductDTO, UpdateProductDTO } from "./product.validation.js";

export interface IProductRepository {
  create(data: CreateProductDTO): Promise<unknown>;
  findAll(): Promise<unknown[]>;
  findById(id: string): Promise<unknown>;
  update(id: string, data: UpdateProductDTO): Promise<unknown>;
  delete(id: string): Promise<unknown>;
}
