"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onUploaded: (url: string) => void;
  currentUrl?: string;
}

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Only compress images > 200KB
    if (file.size < 200 * 1024) return resolve(file);

    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      // Max width 800px
      if (w > 800) { h = (h * 800) / w; w = 800; }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("压缩失败"));
      }, "image/jpeg", 0.8);
    };
    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = URL.createObjectURL(file);
  });
}

export default function ImageUpload({ onUploaded, currentUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("仅支持 JPEG / PNG / WebP 格式");
      return;
    }
    // Validate size
    if (file.size > 5 * 1024 * 1024) {
      alert("图片不能超过 5MB");
      return;
    }

    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const ext = "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage.from("covers").upload(filename, compressed, {
        contentType: "image/jpeg",
        upsert: true,
      });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from("covers").getPublicUrl(filename);
      const url = urlData.publicUrl;
      setPreview(url);
      onUploaded(url);
    } catch (err: any) {
      alert("上传失败: " + (err.message || "未知错误"));
    }
    setUploading(false);
  };

  return (
    <div>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden bg-gray-800">
          <img src={preview} alt="" className="w-full h-36 object-cover" />
          <button onClick={() => { setPreview(""); onUploaded(""); }} className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-36 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/50 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-purple-500 hover:text-purple-400 transition-colors"
        >
          {uploading ? (
            <span className="text-sm">上传中...</span>
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span className="text-sm">点击上传封面图</span>
              <span className="text-[10px]">JPEG / PNG / WebP · 最大 5MB · 自动压缩</span>
            </>
          )}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />
    </div>
  );
}
