export type ObjOf<T = unknown> = Record<string, T>

export const toJson = <R>(data: string) => JSON.parse(data) as R;
export const toText = <T extends ObjOf<T[keyof T]>>(data: T) => JSON.stringify(data);
