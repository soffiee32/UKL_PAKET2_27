import { PrismaClient } from "@prisma/client";
import md5 from "md5";

const prisma = new PrismaClient();

export const getAllBarang = async (req, res) => {
  try {
    const result = await prisma.barang.findMany();
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
export const getBarangById = async (req, res) => {
  try {
    const result = await prisma.barang.findUnique({
      where: {
        id_barang: Number(req.params.id),
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
export const addBarang = async (req, res) => {
  try {
    const { nama_barang, kategori, lokasi, kuantitas } = req.body;

    const itemCheck = await prisma.barang.findFirst({
      where: {
        nama_barang: nama_barang,
      },
    });
    if (itemCheck) {
      res.status(401).json({
        msg: "barang sudah ada",
      });
    } else {
      const result = await prisma.barang.create({
        data: {
          nama_barang: nama_barang,
          category: kategori,
          location: lokasi,
          quantity: kuantitas,
        },
      });
      res.status(201).json({
        success: true,
        message: "Barang berhasil ditambah",
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
export const updateBarang = async (req, res) => {
  try {
    const { nama_barang, kategori, lokasi, kuantitas } = req.body;

    const dataCheck = await prisma.barang.findUnique({
      where: {
        id_barang: Number(req.params.id),
      },
    });
    if (!dataCheck) {
      res.status(401).json({
        msg: "data tidak ditemukan",
      });
    } else {
      const result = await prisma.barang.update({
        where: {
          id_barang: Number(req.params.id),
        },
        data: {
          nama_barang: nama_barang,
          category: kategori,
          location: lokasi,
          quantity: kuantitas,
        },
      });
      res.json({
        success: true,
        message: "Barang berhasil diubah",
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

//fungsi untuk menghapus
export const deleteBarang = async (req, res) => {
  try {

    //pertama dia cari barang nya dulu  dapatnya dari mana?
    // ada req.params.id =  1


    // kemudian dicari barangnya pakai 
    //prisma.barang.findUnique ddalamnya ada where id_barang
    const dataCheck = await prisma.barang.findUnique({
      where: {
        id_barang: Number(req.params.id),// 1
      },
    });

    //nah klo ada id barang 1 dia maka langjut ke yang else
    if (!dataCheck) {
      //klo id_barang 1 ndak ada maka return message/pesan data tidak ditemukan
      res.status(401).json({
        msg: "data tidak ditemukan",
      });
    } else {

      //ini

      //kemudian dihapus pakai fungsi barang.delete yang didalamnya ada where lagi yaitu id_barang yang isinya 1 tadi
      const result = await prisma.barang.delete({
        where: {
          id_barang: Number(req.params.id),//1
        },
      });

      //trus keluarin pesan message data berhasil dihapus
      res.json({
        success: true,
        message: "Data Barang berhasil dihapus",
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
