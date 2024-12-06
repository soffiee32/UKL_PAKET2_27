import { PrismaClient } from "@prisma/client";
import md5 from "md5";

const prisma = new PrismaClient();

export const getAllUser = async (req, res) => {
  try {
    const result = await prisma.user.findMany();
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      msg: error,
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id_user: Number(req.params.id),
      },
    });
    if (result) {
      res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "data not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error,
    });
  }
};
export const addUser = async (req, res) => {
  try {
    const { nama_user, username, password, role } = req.body;

    const usernameCheck = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    if (usernameCheck) {
      res.status(401).json({
        msg: "username sudah ada",
      });
    } else {
      const result = await prisma.user.create({
        data: {
          nama_user: nama_user,
          username: username,
          password: md5(password),
          role: role,
        },
      });
      res.status(201).json({
        success: true,
        message: "Pengguna berhasil ditambah",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      msg: error,
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { nama_user, username, password, role } = req.body;

    // Cari data pengguna berdasarkan ID
    const dataCheck = await prisma.user.findUnique({
      where: {
        id_user: Number(req.params.id),
      },
    });

    if (!dataCheck) {
      // Jika pengguna tidak ditemukan
      return res.status(404).json({
        msg: "Data tidak ditemukan",
      });
    }

    // Tentukan password yang akan digunakan
    const updatedPassword = password ? md5(password) : dataCheck.password;

    // Update data pengguna
    const result = await prisma.user.update({
      where: {
        id_user: Number(req.params.id),
      },
      data: {
        nama_user: nama_user,
        username: username,
        password: updatedPassword,
        role: role,
      },
    });

    // Berhasil mengupdate
    res.json({
      success: true,
      message: "Pengguna berhasil diubah",
      data: result,
    });
  } catch (error) {
    // Tangani error
    console.error(error);
    res.status(500).json({
      msg: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const dataCheck = await prisma.user.findUnique({
      where: {
        id_user: Number(req.params.id),
      },
    });
    if (!dataCheck) {
      res.status(401).json({
        msg: "data tidak ditemukan",
      });
    } else {
      const result = await prisma.user.delete({
        where: {
          id_user: Number(req.params.id),
        },
      });
      res.json({
        success: true,
        message: "Data berhasil dihapus",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      msg: error,
    });
  }
};
