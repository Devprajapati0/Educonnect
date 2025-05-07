import {z} from 'zod';

export const createGroupSchema = z.object({
    name: z.string().min(1, { message: "Group name is required" }),
    description: z.string().optional().nullable(),
    members: z.array(z.object({
        _id: z.string().min(1, { message: "Member ID is required" }),
        role: z.string().min(1, { message: "Member role is required" }),
        name: z.string().min(1, { message: "Member name is required" }),
    })).nonempty({ message: "At least one member is required" }),
    addmembersallowed: z.boolean().default(false),
    sendmessageallowed: z.boolean().default(false),
    groupchat: z.boolean().default(false),
    avatar: z.string().optional().nullable(),
    subdomain: z.string().min(1, { message: "Subdomain is required" }),
    role: z.string().min(1, { message: "Role is required" }).optional(),
})