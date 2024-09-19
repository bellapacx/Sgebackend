import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

const secretKey = '9f8c6d8b2a5e3b1f4e9d7a9b3c2a7d6e4f8b1c0d6e7f8a9b0c1d2e3f4g5h6i7j'; // Replace with your actual secret key

// Middleware to authenticate JWT tokens
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (token == null) return res.sendStatus(401); // No token, unauthorized

    jwt.verify(token, secretKey, (err: VerifyErrors | null, decoded: JwtPayload | undefined | string) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.sendStatus(403); // Forbidden
        }

        // @ts-ignore
        req.user = decoded; // Attach the decoded user information to the request object
        next(); // Proceed to next middleware or route handler
    });
};

export default authenticateToken;
