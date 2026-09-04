import { prisma } from "../../lib/prisma.js";
import type { IProductRepository } from "./product.interface.js";
import type { CreateProductDTO, UpdateProductDTO } from "./product.validation.js";

const productRepository: IProductRepository = {
  async create(data: CreateProductDTO) {
    return prisma.product.create({
      data,
    });
  },
  async findAll() {
    return prisma.product.findMany();
  },
  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
    });
  },
  async update(id: string, data: UpdateProductDTO) {
    return prisma.product.update({
      where: { id },
      data,
    });
  },
  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  },
};

export { productRepository };
