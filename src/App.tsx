import React, { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { Upload, Trash2, Image as ImageIcon, Download } from "lucide-react";
import * as htmlToImage from "html-to-image";

interface BoardImage {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export default function App() {
  const [images, setImages] = useState<BoardImage[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: BoardImage[] = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file as File);
      return {
        id: Math.random().toString(36).substring(2, 9),
        url,
        x: Math.random() * 100 + 50,
        y: Math.random() * 100 + 50,
        width: 250,
        height: 250,
        zIndex: maxZIndex + 1,
      };
    });

    setImages((prev) => [...prev, ...newImages]);
    setMaxZIndex((prev) => prev + 1);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const bringToFront = (id: string) => {
    setMaxZIndex((prev) => prev + 1);
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, zIndex: maxZIndex + 1 } : img,
      ),
    );
  };

  const updateImage = (id: string, updates: Partial<BoardImage>) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...updates } : img)),
    );
  };

  const deleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSaveImage = async () => {
    const canvasElement = document.getElementById("canvas-area");
    if (!canvasElement) return;

    try {
      const dataUrl = await htmlToImage.toPng(canvasElement, {
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = "ideal-type-board.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to save image", error);
      alert("이미지 저장에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* Header / Toolbar */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between shadow-sm z-50 relative">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-semibold text-neutral-800">
            이상형 보드 (Ideal Type Board)
          </h1>
        </div>

        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveImage}
              className="flex items-center gap-2 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              저장하기
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              사진 업로드
            </button>
          </div>
        </div>
      </header>

      {/* Canvas Area */}
      <main
        className="flex-1 relative bg-white overflow-hidden"
        id="canvas-area"
      >
        {images.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 pointer-events-none">
            <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">
              사진을 업로드하여 보드를 꾸며보세요!
            </p>
            <p className="text-sm mt-2">
              상단의 '사진 업로드' 버튼을 클릭하세요.
            </p>
          </div>
        )}

        {images.map((img) => (
          <Rnd
            key={img.id}
            size={{ width: img.width, height: img.height }}
            position={{ x: img.x, y: img.y }}
            onDragStart={() => bringToFront(img.id)}
            onDragStop={(e, d) => updateImage(img.id, { x: d.x, y: d.y })}
            onResizeStart={() => bringToFront(img.id)}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateImage(img.id, {
                width: parseInt(ref.style.width, 10),
                height: parseInt(ref.style.height, 10),
                ...position,
              });
            }}
            bounds="parent"
            style={{ zIndex: img.zIndex }}
            className="group relative"
            lockAspectRatio={true}
          >
            <div
              className="w-full h-full relative"
              onMouseDown={() => bringToFront(img.id)}
              onTouchStart={() => bringToFront(img.id)}
            >
              <img
                src={img.url}
                alt="Board item"
                className="w-full h-full object-cover rounded-md shadow-md pointer-events-none"
                draggable={false}
              />
              {/* Delete button appears on hover */}
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  deleteImage(img.id);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  deleteImage(img.id);
                }}
                className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 cursor-pointer z-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Resize handles visual hint */}
              <div className="absolute inset-0 border-2 border-indigo-500 opacity-0 group-hover:opacity-100 pointer-events-none rounded-md transition-opacity"></div>
            </div>
          </Rnd>
        ))}
      </main>
    </div>
  );
}
