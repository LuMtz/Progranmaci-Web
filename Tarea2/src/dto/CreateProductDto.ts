export class CreateProductDto {
    private constructor(
        public name: string,
        public price: number,
        public stock: number,
        public description: string,
        public brand?: string,
        public img?: string
    ) {}

    public static create(obj: unknown) {
        if (!obj || typeof obj !== 'object') {
            throw new Error('El producto no puede estar vacío y debe ser un objeto');
        }

        const { name, price, stock, description, brand, img } = obj as Record<string, unknown>;

        if (!name || typeof name !== 'string' || !name.trim()) {
            throw new Error('El nombre es obligatorio');
        }
        if (price === undefined || typeof price !== 'number' || price <= 0) {
            throw new Error('El precio debe ser un número mayor a 0');
        }
        if (stock === undefined || typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
            throw new Error('El stock debe ser un entero positivo');
        }
        if (!description || typeof description !== 'string' || !description.trim()) {
            throw new Error('La descripción es obligatoria');
        }

        const validBrand = typeof brand === 'string' && brand.trim() ? brand : undefined;
        const validImg = typeof img === 'string' && img.trim() ? img : undefined;

        return new CreateProductDto(name, price, stock, description, validBrand, validImg);
    }
}