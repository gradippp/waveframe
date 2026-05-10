# Handling Local Files

Waveframe is designed with a **Blob-first** architecture. This means it can natively play and analyze local audio files (e.g., from an `<input type="file">`) without needing to upload them to a server first.

## Working with Blobs and Files

Both the `media` and `artwork` props accept a `Blob` or `File` object in addition to standard URL strings.

```tsx
import React, { useState } from 'react';
import { WaveframePlayer } from 'waveframe';

const UploadPlayer = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAudioFile(file);
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={onAudioChange} />
      <input type="file" accept="image/*" onChange={onImageChange} />

      {audioFile && (
        <WaveframePlayer
          media={audioFile}
          artwork={imageFile || undefined}
          title={audioFile.name}
        />
      )}
    </div>
  );
};
```

## Internal Lifecycle Management

When you provide a `Blob` to Waveframe:

1. **Object URLs**: Waveframe automatically creates temporary Object URLs (`blob:...`) for playback and image rendering.
2. **Automatic Analysis**: For audio Blobs, Waveframe reads the `ArrayBuffer` directly from memory, making analysis extremely fast.
3. **Automatic Cleanup**: Waveframe manages the lifecycle of these Object URLs. When the component unmounts or the media/artwork changes, it automatically calls `URL.revokeObjectURL()` to prevent memory leaks.
