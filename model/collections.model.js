import mongoose from "mongoose";

// schema is used to define the structure of the Collection (table)

const collectionsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nomorRegistrasi: {
    type: String,
    required: true,
  },
  nomorInventaris: {
    type: String,
    required: true
  },
  jenisKoleksi: {
    type: String,
    required: true
  },
  namaKoleksi: {
    type: String,
    required: true
  },
  pembuatan: {
    asalPembuatan: { type: String },
    tanggalPembuatan: { type: String }
  }, 
  perolehan: {
    asalPerolehan: { type: String },
    tanggalPerolehan: { type: String }
  },
  caraPerolehan: {
    type: String 
  }, 
  ukuran: {
    panjang: { type: String },
    lebar: { type: String },
    tinggi: { type: String },
    diameter: { type: String },
    tebal: { type: String },
  }, 
  bahan: {
    type: String
  }, 
  warna: {
    type: String
  }, 
  kondisi: {
    type: String
  }, 
  uraianSingkat: {
    type: String
  }, 
  tempatPenyimpanan: {
    type: String
  }, 
  fotoName: {
    type: String
  },
  fotoUrl: {
    type: String
  }, 
  dateInput: {
    type: Date
  }
});

export default mongoose.model("Collections", collectionsSchema)