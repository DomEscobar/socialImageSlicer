export class Object
{
    public static deepClone<T>(obj: any): T | null
    {
        if (obj == null)
        {
            return null;
        }

        return <T>JSON.parse(JSON.stringify(obj));
    }
}