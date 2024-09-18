// src/types/session.d.ts
import 'express-session';

declare module 'express-session' {
    interface SessionData {
        user?: {
            username: string;
            role: string;
            store_id: string;
        };
    }
}
