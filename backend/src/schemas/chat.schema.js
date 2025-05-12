import {z} from 'zod';

export const createGroupSchema = z.object({
    name: z.string().min(1, { message: "Group name is required" }),
    description: z.string().optional().nullable(),
    members: z.array(z.object({
        _id: z.string().min(1, { message: "Member ID is required" }),
        role: z.string().min(1, { message: "Member role is required" }),
        name: z.string().min(1, { message: "Member name is required" }),
        avatar: z.string().nullable().optional(),
        publicKey: z.string().optional(),
    })).nonempty({ message: "At least one member is required" }),
    addmembersallowed: z.boolean().default(false),
    sendmessageallowed: z.boolean().default(false),
    groupchat: z.boolean().default(false),
    avatar: z.string().nullable().optional(),
    subdomain: z.string().min(1, { message: "Subdomain is required" }),
    role: z.string().min(1, { message: "Role is required" }).optional(),
})

export const updatechatSchema = z.object({
    chatId: z.string().min(1, { message: "Chat ID is required" }),
    name: z.string().optional(),
    description: z.string().optional(),
    avatar: z.string().optional().nullable(),
    members: z.array(z.object({
        _id: z.string().min(1, { message: "Member ID is required" }),
        role: z.string().min(1, { message: "Member role is required" }),
        name: z.string().min(1, { message: "Member name is required" }),
        avatar: z.string().nullable().optional(),
        publicKey: z.string().optional(),
    })).optional(),
    addmembersallowed: z.boolean().optional(),
    sendmessageallowed: z.boolean().optional(),
    isAdmin: z.array(z.string()).optional(),
    
})