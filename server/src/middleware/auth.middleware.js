import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
  // Extract token from the "Authorization: Bearer <token>" header
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using your secret key from the .env file
    // e.g., JWT_SECRET=your_super_secret_key_here
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    
    // Attach the admin data (like admin id) to the request object
    req.admin = decoded; 
    
    // Move to the next function (the controller)
    next(); 
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};