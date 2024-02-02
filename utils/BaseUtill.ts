export class BaseUtil {
    
    public static isObjectEmpty(obj: object): boolean {
        return Object.keys(obj).length === 0;
    }
}