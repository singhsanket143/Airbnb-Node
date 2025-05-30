import { AsyncLocalStorage } from "async_hooks";

type AsyncLocalStorageType = {
    correlationId: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<AsyncLocalStorageType>(); // Created an instance of AsyncLocalStorage


export const getCorrelationId = () => {
    const asyncStore = asyncLocalStorage.getStore();
    return asyncStore?.correlationId || 'unknown-error-while-creating-correlation-id'; // Default value if not found 
}
