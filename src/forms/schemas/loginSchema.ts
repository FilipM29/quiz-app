
import { useMemo } from 'react';
import { z } from 'zod';


export function useLoginFormSchema() {

  return useMemo(() => {
    return z.object({
        email: z.string().nonempty('required'),
        password: z.string().nonempty('required'),
    });
  }, []);
}

export type LoginFormData = z.infer<
  ReturnType<typeof useLoginFormSchema>
>;
