// src/lib/cloudinaryUpload.ts
import axios from 'axios';
import imageCompression from 'browser-image-compression';

interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  tags?: string[];
  // ... other options
}

export async function uploadToCloudinary(
  file: File,
  authToken: string,
  uploadOptions: CloudinaryUploadOptions = {},
  onProgress?: (progressEvent: any) => void
): Promise<any> {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  let processedFile = file;
  if (file.type.startsWith('image/')) {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      processedFile = await imageCompression(file, options);
    } catch (error) {
      console.warn('Image compression failed, uploading original file:', error);
    }
  }

  // Determine backend endpoint based on file type
  let endpoint = '/cloudflare/upload/document';
  if (processedFile.type.startsWith('image/')) endpoint = '/cloudflare/upload/image';
  else if (processedFile.type.startsWith('video/')) endpoint = '/cloudflare/upload/video';

  // Prepare multipart form-data for backend
  const formData = new FormData();
  formData.append('file', processedFile);
  if (uploadOptions.folder) formData.append('folder', uploadOptions.folder);
  const finalPublicId = uploadOptions.public_id || `user_upload_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  formData.append('publicId', finalPublicId);
  if (uploadOptions.tags) uploadOptions.tags.forEach((t) => formData.append('tags', t));

  try {
    const res = await axios.post(
      `${process.env.API_BASE_URL}${endpoint}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress,
      }
    );

    // Normalize response to match previous Cloudinary shape expected by chat UI
    const data = res.data || {};
    const secureUrl = data.secure_url || data.url || data.variants?.original || data.location || '';
    const publicId = data.public_id || data.publicId || data.filename || finalPublicId;
    if (!secureUrl) {
      throw new Error('Upload succeeded but no URL was returned.');
    }
    return {
      ...data,
      secure_url: secureUrl,
      public_id: publicId,
    };
  } catch (error: any) {
    console.error('Error uploading to Cloudflare:', error?.response?.data || error?.message);
    throw new Error('Upload failed.');
  }
}

// New function to delete resources
export async function deleteCloudinaryResources(publicIds: string[], authToken: string): Promise<any> {
  if (!publicIds || publicIds.length === 0) {
    return { success: true, message: 'No public IDs to delete.' };
  }
  try {
    // Cloudflare deletion is by filename; iterate and delete each
    const results = await Promise.allSettled(
      publicIds.map((filename) =>
        axios.delete(`${process.env.API_BASE_URL}/cloudflare/file/${encodeURIComponent(filename)}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
      )
    );

    const summary = {
      success: results.every((r) => r.status === 'fulfilled' && r.value?.data?.success !== false),
      results: results.map((r) => (r.status === 'fulfilled' ? r.value.data : { success: false, error: (r as any).reason?.message })),
    };
    return summary;
  } catch (error: any) {
    console.error('Error deleting Cloudflare resources:', error?.response?.data || error?.message);
    throw new Error('Failed to delete resources.');
  }
}