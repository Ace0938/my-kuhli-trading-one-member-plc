// Cloud Object Storage Abstraction for MY KUHLI
// Ready to bind to Google Cloud Storage (GCS), AWS S3, or Supabase Storage

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

export class StorageService {
  private static instance: StorageService;

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public async uploadFile(
    fileBuffer: Buffer | ArrayBuffer,
    fileName: string,
    mimeType: string,
    folder: 'documents' | 'certificates' | 'products' | 'receipts' = 'documents'
  ): Promise<UploadResult> {
    const key = `${folder}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const url = `/storage/${key}`;

    return {
      url,
      key,
      size: typeof fileBuffer === 'object' && 'byteLength' in fileBuffer ? fileBuffer.byteLength : 1024,
      mimeType
    };
  }

  public getSignedDownloadUrl(fileKey: string): string {
    return `/storage/${fileKey}`;
  }
}

export const storageService = StorageService.getInstance();
