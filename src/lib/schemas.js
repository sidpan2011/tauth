import z from "zod"

export const emailSchema = z.string().min(1, "Email is required").email("Invalid email format")

export const passwordSchema = z.string().min(8, "Password must be at least 8 characters")

export const authSchema = () => {
    return {
        email: emailSchema,
        password: passwordSchema,
    }
}