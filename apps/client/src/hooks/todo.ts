import useSWR, {mutate} from "swr";
import {useApiClient} from "../apis/hook";
import {InferRequestType, InferResponseType} from "hono/client";
import useSWRMutation from "swr/mutation";
import {ServerApiClientType} from "../apis/types";

export type GetTodosResponse = InferResponseType<ServerApiClientType["todos"]["$get"]>

export const useGetTodos = () => {
    const client = useApiClient("server")
    const cacheKey = "todos"
    const fetcher = async () => {
        const res = await client.todos.$get()
        return await res.json()
    }
    return useSWR<GetTodosResponse>(cacheKey, fetcher);
}

export type GetTodoResponse = InferResponseType<ServerApiClientType["todos"][":id"]["$get"]>

export const useGetTodo = (id: string) => {
    const client = useApiClient("server")
    const cacheKey = `todos/${id}`
    const fetcher = async () => {
        const res = await client.todos[":id"].$get({param: {id}});
        return await res.json()
    }
    return useSWR<GetTodoResponse>(cacheKey, fetcher);
}

type CreateTodoRequest = InferRequestType<ServerApiClientType["todos"]["$post"]>["json"]

export const useCreateTodo = () => {
    const client = useApiClient("server")
    const cacheKey = `todos`
    const fetcher = async (_key: string, {arg}: { arg: CreateTodoRequest }) => {
        const res = await client.todos.$post({json: arg})
        return await res.json();
    }
    return useSWRMutation(cacheKey, fetcher, {
        onSuccess: data => {
            mutate(`todos/${data.id}`, data, false)
            mutate<GetTodoResponse[], GetTodoResponse>(`todos`, data, {
                populateCache: (todo, todos) => {
                    return [...(todos ?? []), todo]
                }
            });
        }
    });
}

type UpdateTodoRequest = InferRequestType<ServerApiClientType["todos"][":id"]["$put"]>["json"]
type UpdateTodoResponse = InferResponseType<ServerApiClientType["todos"][":id"]["$put"]>

export const useUpdateTodo = () => {
    const client = useApiClient("server")
    const fetcher = async (_key: string, {arg}: { arg: {id: string, json: UpdateTodoRequest} }) => {
        const res = await client.todos[":id"].$put({param: {id: arg.id}, json: arg.json})
        return await res.json();
    }
    return useSWRMutation("todos", fetcher, {
        onSuccess: data => {
            mutate(`todos/${data.id}`, data, false)
            mutate<GetTodoResponse[], UpdateTodoResponse>(`todos`, data, {
                populateCache: (todo, todos) => {
                    return [...(todos ?? []), todo]
                }
            });
        }
    })
}

export const useDeleteTodo = () => {
    const client = useApiClient("server")
    const fetcher = async (_key: string, {arg}: { arg: { id: string } }) => {
        await client.todos[":id"].$delete({param: {id: arg.id}});
    }
    return useSWRMutation("todos", fetcher, {
        onSuccess: (_, key) => {
            mutate(`todos/${key}`, undefined, false)
        }
    })
}
