import { useMemo } from 'react';
import { z } from 'zod';

export function useRegisterFormSchema() {
    return useMemo(() => {
        return z.object({
            firstName: z.string().nonempty('required'),
            lastName: z.string().nonempty('required'),
            email: z.string().nonempty('required'),
            password: z.string().nonempty('required')
        });
    }, []);
}

export type RegisterFormData = z.infer<ReturnType<typeof useRegisterFormSchema>>;
