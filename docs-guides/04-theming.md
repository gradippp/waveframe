# Custom Theming

Waveframe is highly customizable, allowing you to align its aesthetic with your application's brand.

## Using the Theme Object

The `theme` prop is the primary way to customize colors. It takes a `WaveframeTheme` object.

```tsx
import { WaveframePlayer } from 'waveframe';

const myTheme = {
  bg: '#0f172a',      // Dark slate background
  primary: '#22d3ee', // Cyan accent
  text: '#f8fafc',    // Off-white text
  border: '#1e293b'   // Muted slate border
};

<WaveframePlayer
  media="track.mp3"
  theme={myTheme}
/>
```

## CSS Variables

For even more granular control or for overriding styles globally via CSS, Waveframe exposes several CSS variables.

| Variable | Description |
| :--- | :--- |
| `--wf-bg-color` | The background color of the player card. |
| `--wf-border-color` | The color of borders and dividers. |
| `--wf-title-color` | The color of the track title. |
| `--wf-artist-color` | The color of the artist name. |
| `--wf-time-color` | The color of the duration/current time text. |
| `--wf-play-btn-bg` | The background color of the play button. |
| `--wf-rounded` | The border-radius of the player container. |

### Overriding via CSS

```css
/* Apply a global style to all Waveframe players */
:root {
  --wf-rounded: 0.5rem;
  --wf-play-btn-bg: #ef4444;
}
```

## Layout Customization

You can also customize the waveform's geometry using props:

- **`height`**: Waveform height in pixels.
- **`barWidth`**: Width of each bar in pixels.
- **`barGap`**: Spacing between bars in pixels.
- **`resolution`**: Total number of bars (use `'auto'` for responsive scaling).
