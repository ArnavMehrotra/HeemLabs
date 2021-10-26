declare global {
    namespace NodeJS{
        interface ProcessEnv{
            MONGOSTRING: string;
            PORT: number;
        }
    }
}

export {}