export interface VirtualBackgroundOptions {
  type: 'image' | 'blur' | 'none';
  backgroundImage?: string;
  blurAmount?: number;
}

// Simple utility for virtual backgrounds using Agora's built-in capabilities
export class VirtualBackgroundProcessor {
  private isInitialized = false;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  async initialize(): Promise<void> {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.isInitialized = true;
  }

  isSupported(): boolean {
    return this.isInitialized;
  }

  async processFrame(
    videoElement: HTMLVideoElement,
    options: VirtualBackgroundOptions
  ): Promise<HTMLCanvasElement | null> {
    if (!this.canvas || !this.ctx || !this.isInitialized) {
      return null;
    }

    const { videoWidth, videoHeight } = videoElement;
    if (videoWidth === 0 || videoHeight === 0) {
      return null;
    }

    // Set canvas dimensions to match video
    this.canvas.width = videoWidth;
    this.canvas.height = videoHeight;

    // Draw the original video frame
    this.ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

    // Apply effects based on options
    switch (options.type) {
      case 'blur':
        this.ctx.filter = `blur(${options.blurAmount || 10}px)`;
        this.ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);
        this.ctx.filter = 'none';
        break;
      
      case 'image':
        if (options.backgroundImage) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = options.backgroundImage!;
            });
            
            // Draw background image
            this.ctx.drawImage(img, 0, 0, videoWidth, videoHeight);
            
            // For now, just overlay the video with reduced opacity
            // In a full implementation, this would use body segmentation
            this.ctx.globalAlpha = 0.8;
            this.ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);
            this.ctx.globalAlpha = 1.0;
          } catch (error) {
            console.warn('Failed to load background image:', error);
            // Fallback to original video
            this.ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);
          }
        }
        break;
      
      case 'none':
      default:
        // Just return the original video frame
        this.ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);
        break;
    }

    return this.canvas;
  }

  cleanup(): void {
    this.canvas = null;
    this.ctx = null;
    this.isInitialized = false;
  }
}

// Helper function to create solid color backgrounds
const createColorBackground = (color1: string, color2: string, width = 640, height = 480): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};

// Predefined background images with fallback data URLs
export const PREDEFINED_BACKGROUNDS = [
  {
    id: 'office',
    name: 'Office',
    url: '/images/backgrounds/office.jpeg',
    thumbnail: '/images/backgrounds/office-thumb.jpg'
  },
  {
    id: 'living-room',
    name: 'Living Room',
    url: createColorBackground('#FFF8E1', '#FFE082'), // Warm yellow gradient
    thumbnail: createColorBackground('#FFF8E1', '#FFE082', 120, 80)
  },
  {
    id: 'nature',
    name: 'Nature',
    url: createColorBackground('#E8F5E8', '#A5D6A7'), // Green gradient
    thumbnail: createColorBackground('#E8F5E8', '#A5D6A7', 120, 80)
  },
  {
    id: 'abstract',
    name: 'Abstract',
    url: createColorBackground('#F3E5F5', '#CE93D8'), // Purple gradient
    thumbnail: createColorBackground('#F3E5F5', '#CE93D8', 120, 80)
  }
];
