export class UpdatePriceDto{
    private constructor(public price: number){}
    public static create(obj:unknown){
        if(!obj || typeof obj !== 'object'){
            throw new Error('Los datos deben ser un objeto');
        }
        const { price} = obj as Record<string, unknown>;
        if(price === undefined || typeof price !== 'number' || price <=0){
            throw new Error('El precio debe ser un número mayor a 0');
        }
        return new UpdatePriceDto(price);
    }
}