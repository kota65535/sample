import {Prisma, PrismaClient} from "@sample/db/prisma-client";

const prisma = new PrismaClient()


export async function getTodo(id: string) {
    return prisma.todo.findFirst({
        where: {
            id,
        },
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getTodos() {
    return prisma.todo.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function createTodo(data: Prisma.TodoCreateInput) {
    return prisma.todo.create({data});
}

export async function updateTodo(id: string, data: Prisma.TodoUpdateInput) {
    return prisma.todo.update({
        where: {
            id,
        },
        data,
    })
}

export async function deleteTodo(id: string) {
    return prisma.todo.delete({
        where: {
            id,
        },
    })
}
