import { z } from "zod";

// This is a temporary contract for the profile data returned by the /profiles/me endpoint.
// This will change when we implement the actual profile features, but for now we just want to verify that authentication is working correctly and that we can retrieve the claims of the authenticated user.
export const profileContract = z.object({
	aud: z.string(),
	iss: z.string(),
	exp: z.string(),
	"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": z.string(),
	"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": z.string(),
	"http://schemas.microsoft.com/ws/2008/06/identity/claims/role": z.string(),
	iat: z.string(),
	nbf: z.string(),
});
