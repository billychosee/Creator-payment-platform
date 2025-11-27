"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeGenerator = ({
  value,
  size = 128,
  className = "",
}: QRCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateQRCode = async () => {
    if (!canvasRef.current || !value) {
      console.log("QR Code generation skipped:", { hasCanvas: !!canvasRef.current, hasValue: !!value });
      return;
    }

    console.log("Starting QR code generation for:", value);

    setIsLoading(true);
    setError(null);

    try {
      // Clear the canvas first
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      // Generate the QR code
      await QRCode.toCanvas(canvas, value, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: 'M'
      });
      
      console.log("QR code generated successfully");
      setIsLoading(false);
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError(err instanceof Error ? err.message : "Failed to generate QR code");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Force regeneration when value or size changes
    const timer = setTimeout(() => {
      generateQRCode();
    }, 100);

    return () => clearTimeout(timer);
  }, [value, size]);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-dashed border-red-200 dark:border-red-800 p-4 ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          <div className="text-xs text-red-600 dark:text-red-400 mb-1">QR Error</div>
          <div className="text-xs text-red-500 dark:text-red-400 break-words">{error}</div>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              generateQRCode();
            }}
            className="text-xs text-red-600 dark:text-red-400 hover:underline mt-1"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-lg border-2 border-dashed border-border ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <div className="text-xs text-muted-foreground">Generating QR...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <canvas
        ref={canvasRef}
        className="rounded-lg border border-border"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default QRCodeGenerator;
