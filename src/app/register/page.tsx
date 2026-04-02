"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { UploadCloud, CheckCircle2, ArrowRight, X, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { API_URL } from "@/lib/api";
import { uploadToCloudinary, CloudinaryUploadError } from "@/lib/cloudinary";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    nim: "",
    phoneNumber: "",
    semester: "",
    division: "",
    motivation: "",
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Cloudinary upload state
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentProof) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(paymentProof);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [paymentProof]);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/batch/active`);
        if (res.ok) {
          setIsRegistrationOpen(true);
        } else {
          setIsRegistrationOpen(false);
        }
      } catch (err) {
        setIsRegistrationOpen(false);
      }
    };
    checkRegistrationStatus();
  }, []);

  // Upload file to Cloudinary when user selects a file
  const handleFileSelect = async (file: File | null) => {
    // Reset states
    setUploadError(null);
    setCloudinaryUrl(null);
    setUploadProgress(0);

    if (!file) {
      setPaymentProof(null);
      setUploadStatus("idle");
      return;
    }

    setPaymentProof(file);
    setUploadStatus("uploading");

    try {
      const result = await uploadToCloudinary(file, (percent) => {
        setUploadProgress(percent);
      });

      setCloudinaryUrl(result.secure_url);
      setUploadStatus("success");
    } catch (error) {
      setUploadStatus("error");
      if (error instanceof CloudinaryUploadError) {
        setUploadError(error.message);
      } else {
        setUploadError("Failed to upload file. Please try again.");
      }
    }
  };

  const handleRemoveFile = () => {
    setPaymentProof(null);
    setCloudinaryUrl(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    if (!cloudinaryUrl) {
      setErrorMsg("Please upload your payment proof and wait for it to finish.");
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("full_name", formData.fullName);
      submitData.append("nim", formData.nim);
      submitData.append("phone_number", formData.phoneNumber);
      submitData.append("semester", formData.semester);
      submitData.append("devision", formData.division);
      submitData.append("motivation", formData.motivation);

      // Send the Cloudinary URL instead of the raw file
      submitData.append("payment", cloudinaryUrl);

      const response = await fetch(`${API_URL}/api/v1/member/register`, {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));

        let errorMessage = errData.message || "Registration failed. Please try again.";
        if (errData.errors) {
          const details = Object.values(errData.errors).join(", ");
          if (details) {
            errorMessage += ` (${details})`;
          }
        }
        throw new Error(errorMessage);
      }

      setSubmitted(true);
    } catch (error: any) {
      console.error("Submission error:", error);
      setErrorMsg(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistrationOpen === null) {
    return (
      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-16 flex items-center justify-center">
        <Navbar />
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          {/* <p className="text-gray-400">Loading registration status...</p> */}
          <p className="text-gray-400">Memuat status pendaftaran...</p>
        </div>
      </main>
    );
  }

  if (isRegistrationOpen === false) {
    return (
      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-16 flex items-center justify-center">
        <Navbar />
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full glass-card p-10 rounded-3xl border border-red-500/20 text-center relative overflow-hidden bg-[#0A0A0A]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400" />
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Masa pendaftaran sudah habis.</h2>
            <p className="text-gray-400 mb-8">
              Pendaftaran anggota baru saat ini sedang ditutup atau belum ada gelombang pendaftaran yang aktif.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors font-bold w-full justify-center">
              Kembali ke Beranda
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#050505] text-white pt-24 pb-16 flex items-center justify-center">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card p-10 rounded-3xl border border-white/10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-500 to-white" />
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          {/* <h2 className="text-3xl font-bold mb-4">Application Received!</h2> */}
          <h2 className="text-3xl font-bold mb-4">Formulir Diterima!</h2>
          {/* <p className="text-gray-400 mb-8">
            Thank you for applying to OrionUnhaz. We have received your data and will email you with further instructions once verification is complete.
          </p> */}
          <p className="text-gray-400 mb-8">
            Terima kasih telah mendaftar ke OrionUnhaz. Kami telah menerima data Anda dan akan mengirimkan email berisi instruksi lebih lanjut setelah verifikasi selesai.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors font-medium">
            {/* Return to Home */}
            Kembali ke Beranda
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-16">
      <Navbar />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">Registration Form</h1>
          {/* <h1 className="text-4xl font-bold tracking-tight mb-4">Formulir Pendaftaran</h1> */}
          {/* <p className="text-gray-400">Please fill out all fields accurately.</p> */}
          <p className="text-gray-400">Harap isi semua bidang dengan akurat.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-6 md:p-10 border border-white/10 relative"
        >
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {/* <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label> */}
                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-400/50 transition-colors"
                  placeholder="Budi Santoso"
                />
              </div>
              <div>
                {/* <label className="block text-sm font-medium text-gray-300 mb-2">NIM (Student ID)</label> */}
                <label className="block text-sm font-medium text-gray-300 mb-2">NIM (Nomor Induk Mahasiswa)</label>
                <input
                  type="text"
                  required
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-400/50 transition-colors"
                  placeholder="220603920"
                />
              </div>
            </div>

            <div>
              {/* <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label> */}
              <label className="block text-sm font-medium text-gray-300 mb-2">Nomor Telepon (WhatsApp)</label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-400/50 transition-colors"
                placeholder="0879999999"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {/* <label className="block text-sm font-medium text-gray-300 mb-2">Current Semester</label> */}
                <label className="block text-sm font-medium text-gray-300 mb-2">Semester Saat Ini</label>
                <select
                  required
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gray-400/50 transition-colors appearance-none"
                >
                  {/* <option value="" disabled hidden>Select Semester</option> */}
                  <option value="" disabled hidden>Pilih Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7].map(sem => (
                    <option key={sem} value={sem} className="bg-[#0f0f0f]">Semester {sem}</option>
                  ))}
                </select>
              </div>
              <div>
                {/* <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Division</label> */}
                <label className="block text-sm font-medium text-gray-300 mb-2">Pilihan Divisi</label>
                <select
                  required
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gray-400/50 transition-colors appearance-none"
                >
                  {/* <option value="" disabled hidden>Select Division</option> */}
                  <option value="" disabled hidden>Pilih Divisi</option>
                  <option value="PROGRAMMING" className="bg-[#0f0f0f]">Programming</option>
                  <option value="ELECTRONICS" className="bg-[#0f0f0f]">Electronic</option>
                  <option value="MECHANICAL" className="bg-[#0f0f0f]">Mechanic</option>
                  {/* <option value="PROGRAMMING" className="bg-[#0f0f0f]">Pemrograman</option>
                  <option value="ELECTRONICS" className="bg-[#0f0f0f]">Elektronik</option>
                  <option value="MECHANICAL" className="bg-[#0f0f0f]">Mekanik</option> */}
                </select>
              </div>
            </div>

            <div>
              {/* <label className="block text-sm font-medium text-gray-300 mb-2">Motivation Letter</label> */}
              <label className="block text-sm font-medium text-gray-300 mb-2">Surat Motivasi</label>
              <textarea
                required
                rows={4}
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-400/50 transition-colors resize-none"
                // placeholder="Why do you want to join OrionUnhaz and this specific division?"
                placeholder="Mengapa Anda ingin bergabung dengan OrionUnhaz dan divisi spesifik ini?"
              />
            </div>

            {/* Payment Proof Upload with Cloudinary */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-300 mb-2">Payment Proof (JPG/PNG)</label> */}
              <label className="block text-sm font-medium text-gray-300 mb-2">Bukti Pembayaran (JPG/PNG)</label>

              <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm leading-relaxed">
                <strong className="text-white font-semibold flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Note:
                </strong>
                <span suppressHydrationWarning>Pembayaran dapat dilakukan melalui DANA (085338833744) atas nama Muhammad Farid Hidayat</span>
              </div>

              <AnimatePresence mode="wait">
                {uploadStatus === "idle" && (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="w-full border-2 border-dashed border-white/10 rounded-xl p-8 hover:bg-white/5 hover:border-white/20 transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-400 group relative overflow-hidden"
                  >
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <UploadCloud className="w-8 h-8 mb-3 group-hover:text-blue-400 transition-colors" />
                    {/* <span className="text-sm text-center">Click to upload or drag and drop</span>
                    <span className="text-xs text-gray-600 mt-1">Max file size: 5MB</span> */}
                    <span className="text-sm text-center">Klik untuk mengunggah atau seret dan lepas</span>
                    <span className="text-xs text-gray-600 mt-1">Ukuran file maksimal: 5MB</span>
                  </motion.div>
                )}

                {uploadStatus === "uploading" && (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="w-full border border-blue-500/30 bg-blue-500/5 rounded-xl p-6 flex flex-col items-center justify-center"
                  >
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
                    {/* <span className="text-sm text-blue-300 font-medium mb-3">Uploading to cloud...</span> */}
                    <span className="text-sm text-blue-300 font-medium mb-3">Mengunggah ke cloud...</span>

                    {/* Progress bar */}
                    <div className="w-full max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                    {/* <span className="text-xs text-gray-500 mt-2">{uploadProgress}% complete</span> */}
                    <span className="text-xs text-gray-500 mt-2">{uploadProgress}% selesai</span>
                    {paymentProof && (
                      <span className="text-xs text-gray-600 mt-1 truncate max-w-[250px]">{paymentProof.name}</span>
                    )}
                  </motion.div>
                )}

                {uploadStatus === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="w-full border border-green-500/30 bg-green-500/5 rounded-xl p-6 relative"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors z-20"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col items-center">
                      {/* Image preview */}
                      {previewUrl && paymentProof?.type.startsWith("image/") && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={previewUrl}
                          alt="Payment Proof Preview"
                          className="max-h-48 object-contain rounded-lg mb-4 shadow-lg border border-white/10"
                        />
                      )}

                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        {/* <span className="text-sm font-medium text-green-300">Upload successful</span> */}
                        <span className="text-sm font-medium text-green-300">Unggah berhasil</span>
                      </div>
                      <span className="text-xs text-gray-500 truncate max-w-[250px]">
                        {paymentProof?.name}
                      </span>
                    </div>
                  </motion.div>
                )}

                {uploadStatus === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="w-full border border-red-500/30 bg-red-500/5 rounded-xl p-6"
                  >
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
                      {/* <span className="text-sm font-medium text-red-300 mb-1">Upload failed</span> */}
                      <span className="text-sm font-medium text-red-300 mb-1">Unggah gagal</span>
                      <span className="text-xs text-red-400/80 text-center mb-4">{uploadError}</span>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm text-gray-300 transition-colors"
                      >
                        {/* Try again */}
                        Coba lagi
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-6">
              <button
                id="submitBtn"
                type="submit"
                disabled={isLoading || uploadStatus === "uploading" || uploadStatus === "error"}
                className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 focus:ring-4 focus:ring-white/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {/* Submitting... */}
                    Mengirim...
                  </span>
                ) : (
                  <>
                    {/* Submit Application <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> */}
                    Kirim Formulir <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
