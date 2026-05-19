/* eslint-disable @typescript-eslint/no-explicit-any */
export interface JwtPayload {
	userId: string;
	[key: string]: any;
}
