import { useState, useCallback } from 'react';
import axios from 'axios';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface DirectUploadResult {
  publicUrl: string;
  filename: string;
}

interface UseDirectUploadReturn {
  upload: (
    file: File,
    folder?: string,
    token?: string,
    onProgress?: (loaded: number, total: number, percentage: number) => void
  ) => Promise<DirectUploadResult>;
  progress: UploadProgress | null;
  isUploading: boolean;
  error: string | null;
  reset: () => void;
}

export const useDirectUpload = (): UseDirectUploadReturn => {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setProgress(null);
    setIsUploading(false);
    setError(null);
  }, []);

  const upload = useCallback(async (
    file: File,
    folder: string = 'videos',
    token?: string,
    onProgress?: (loaded: number, total: number, percentage: number) => void
  ): Promise<DirectUploadResult> => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10);
      const extension = file.name.split('.').pop();
      const filename = `${folder}/${timestamp}_${randomString}.${extension}`;

      // Step 1: Get presigned URL from backend Cloudflare controller
      const baseUrl = process.env.API_BASE_URL || '';
      const presignedResponse = await axios.post(
        `${baseUrl}/cloudflare/upload/presigned-url`,
        {
          filename,
          contentType: file.type,
          expiresIn: 3600, // 1 hour
        },
        token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined
      );

      const { uploadUrl, publicUrl } = presignedResponse.data;

      // Step 2: Upload directly to Cloudflare R2 using presigned URL
      try {
        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (progressEvent) => {
            const loaded = progressEvent.loaded || 0;
            const total = progressEvent.total || file.size;
            const percentage = Math.round((loaded * 100) / total);

            setProgress({
              loaded,
              total,
              percentage,
            });
            if (onProgress) onProgress(loaded, total, percentage);
          },
        });

        setIsUploading(false);
        return { publicUrl, filename };
      } catch (networkErr: any) {
        // If DNS/network failure occurs (e.g., ERR_NAME_NOT_RESOLVED), fallback to backend proxy upload
        const message = networkErr?.message || '';
        const isNetworkFailure =
          message.includes('Network Error') ||
          message.includes('ERR_NAME_NOT_RESOLVED') ||
          message.includes('ERR_INTERNET_DISCONNECTED') ||
          message.includes('ERR_FAILED') ||
          message.includes('ENOTFOUND');

        if (!isNetworkFailure) {
          throw networkErr; // propagate non-network errors (e.g., 403 signature issues)
        }

        // Fallback: upload via backend proxy endpoint
        const form = new FormData();
        form.append('file', file);
        form.append('folder', folder);

        const proxyResp = await axios.post(
          `${baseUrl}/cloudflare/upload/document`,
          form,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              // Let browser set correct multipart boundary
            },
            onUploadProgress: (progressEvent) => {
              const loaded = progressEvent.loaded || 0;
              const total = progressEvent.total || file.size;
              const percentage = Math.round((loaded * 100) / total);
              setProgress({ loaded, total, percentage });
              if (onProgress) onProgress(loaded, total, percentage);
            },
          }
        );

        const proxyData = proxyResp.data;
        setIsUploading(false);
        return { publicUrl: proxyData?.url || publicUrl, filename: proxyData?.filename || filename };
      }

    } catch (err: any) {
      setIsUploading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    upload,
    progress,
    isUploading,
    error,
    reset,
  };
};
