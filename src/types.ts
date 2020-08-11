export type KV<T = any> = { [key: string]: T };

export type KVU<U = {}, T = any> = { [key: string]: T } & U;

export type Mapping<T> = { [P in keyof T]: T[P] }

export type Nullable<T> = T | null | undefined;
