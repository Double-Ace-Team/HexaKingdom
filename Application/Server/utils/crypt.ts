import bcrypt from "bcrypt"

export async function hashValue(value: string)
{
    return await bcrypt.hash(value, 10);
}

export async function compareValues(value: string, hashValue: string)
{
    return await bcrypt.compare(value, hashValue);
}