import express from 'express';
import jwt from 'jsonwebtoken';
import {
   getAllPeminjaman,
   getPeminjamanById,
   addPeminjaman,
   pengembalianBarang,
   getUsageAnalysis,
   analyzeItems
} from '../controllers/transaksi_controllers.js';

import {authorize} from '../controllers/auth_controllers.js';
import {IsMember, IsAdmin} from '../middleware/role_validation.js';

const app = express();

// Middleware untuk mengecek JWT dan role
const memberOrAdminAuthorize = (req, res, next) => {
   const token = req.headers['authorization'];
   if (!token) {
      return res.status(401).json({
         success: false,
         auth: false,
         message: "No token provided", 
      });
   }

   try {
      const decoded = jwt.verify(token.split(' ')[1], "moklet");
      const role = decoded.role;

      if (role === 'member') {
         return next(); // Member diizinkan
      } else if (role !== 'admin') {
         return res.status(403).json({
            success: false,
            auth: false,
            message: "You are not admin",
         });
      }

      next(); // Admin diizinkan
   } catch (err) {
      return res.status(401).json({
         success: false,
         auth: false,
         message: "Invalid token",
      });
   }
};

app.get('/borrow', memberOrAdminAuthorize, getAllPeminjaman);
app.get('/borrow/:id', memberOrAdminAuthorize, getPeminjamanById);
app.post('/borrow', authorize, [IsMember], addPeminjaman);
app.post('/return', authorize, [IsMember], pengembalianBarang);
app.post('/getusage', getUsageAnalysis)
app.post('/getanalyz', analyzeItems)

export default app;
