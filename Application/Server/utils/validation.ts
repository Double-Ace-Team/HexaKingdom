import { z } from "zod";

export const registerSchema = z.object({
    username: z.string({
        required_error: "Username is required!",
    }).min(3, {
        message: "Username must be greater then 3 characters"
    }),

    password: z.string({
        required_error: "Password is required!"
    }).min(6, {
        message: "Password must be 6 or more characters long!"
    }),

    confirmPassword: z.string({
        required_error: "Confirm password is required"
    }).min(6, {
        message: "Confirm password must be 6 or more characters long!"
    }),

    email: z.string({
        required_error: "Email is required!"
    }).email({
        message: "Email is in wrong format!"
    })

})
.refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirm"]
})

export const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required!"
    }).email({
        message: "Email is in wrong format!"
    }),
    
    password: z.string({
        required_error: "Password is required!"
    }).min(6, {
        message: "Password must be 6 or more characters long!"
    }),
})

export const updateUserSchema = z.object({
    password: z.string({
        required_error: "Password is required!"
    }).min(6, {
        message: "Password must be 6 or more characters long!"
    }).optional(),

    username: z.string({
        required_error: "Username is required!",
    }).min(3, {
        message: "Username must be greater then 3 characters"
    }).optional(),
}).strict();

export const postCreateSchema = z.object({
    userID: z.string({
        required_error: "User ID is required!"
    }),
    title: z.string({
        required_error: "Title is required!"
    }),
    text: z.string({
        required_error: "Text is required!"
    })
})

export const postUpdateSchema = z.object({
    title: z.string().optional(),
    text: z.string().optional()
}).strict();

export const communityCreateScheme = z.object({
    title: z.string({
        required_error: "Title is required!"
    }),
    description: z.string({
        required_error: "Description is required!"
    })
})

export const communityUpdateScheme = z.object({
    title: z.string().optional(),
    description: z.string().optional()
}).strict();

export const commentCreateSchema = z.object({
    text: z.string({
        required_error: "Text is required!"
    }),
    userID: z.string({
        required_error: "User ID is required!"
    }),
    postID: z.string({
        required_error: "Post ID is required!"
    })
    
})
