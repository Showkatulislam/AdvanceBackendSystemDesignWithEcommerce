import z from "zod";

export const createProductSchema = z.object({
  body: z.object({
    productName: z.string().min(2, "Product name must required."),
    description: z.string().min(10, "Product description must be at least 10 charecters."),
    price: z.number().positive("Price must be greater than 0"),
    categoryId: z.string().min(1, "Category Id is required."),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    productName: z.string().min(2, "Product name must required.").optional(),
    description: z
      .string()
      .min(10, "Product description must be at least 10 charecters.")
      .optional(),
    price: z.number().positive("Price must be greater than 0").optional(),
    categoryId: z.string().min(1, "Category Id is required.").optional(),
  }),
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product Id is required."),
  }),
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
