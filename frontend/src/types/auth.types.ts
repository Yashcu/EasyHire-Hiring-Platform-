export interface DecodedToken {
    sub: string;
    role: "CANDIDATE" | "RECRUITER";
    exp: number;
}