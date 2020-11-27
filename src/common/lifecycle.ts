export interface IDisposable<T = void> {
    dispose(...params: any[]): T;
}

export interface IInital<T = void> {
    initial(...params: any[]): T;
}
