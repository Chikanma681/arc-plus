import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const passRouter = createTRPCRouter({
  generatePass: protectedProcedure
    .input(z.object({
      cardNumber: z.string(),
      userName: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await fetch(process.env.PASSKIT_API_ENDPOINT!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PASSKIT_API_KEY!}`
          },
          body: JSON.stringify({
            template: process.env.PASSKIT_TEMPLATE_NAME!,
            data: {
              serialNumber: `PASS-${Date.now()}`,
              name: input.userName,
              qrCode: `ARCPLUS-${input.cardNumber}`,
              cardNumber: input.cardNumber,
              issuedDate: new Date().toISOString(),
              // Add any other fields your template expects
            }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to generate pass');
        }

        const passData = await response.blob();
        const base64Pass = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(passData);
        });

        return {
          passUrl: base64Pass as string,
          fileName: 'arcplus-transit-pass.pkpass'
        };
      } catch (error) {
        console.error('Error generating pass:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate pass. Please try again.',
        });
      }
    }),
});
