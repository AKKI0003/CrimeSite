// Deterministic SVG "face" generated purely from a suspect's id, so every
// suspect who doesn't have a real portrait still reads as a distinct person
// instead of a generic placeholder. Same id always produces the same face —
// no randomness, no external art, no network request.

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt) % arr.length];
}

interface SuspectAvatarProps {
  id: string;
  size?: number;
  className?: string;
  /** subtle color shift while an interrogation is "active" */
  agitated?: boolean;
}

const SKIN_TONES = ["#d8a479", "#e3b98f", "#c48a5f", "#f0c9a0", "#a9714b"];
const HAIR_COLORS = ["#1c1a17", "#2e2620", "#4a3826", "#111111", "#3b332b"];
const BG_TONES = ["#2a2622", "#232019", "#2c241d", "#221f1b", "#282320"];

export function SuspectAvatar({ id, size = 64, className, agitated = false }: SuspectAvatarProps) {
  const seed = hashString(id);

  const skin = pick(SKIN_TONES, seed, 1);
  const hair = pick(HAIR_COLORS, seed, 2);
  const bg = pick(BG_TONES, seed, 3);

  const eyeSpacing = 12 + (seed % 5); // 12-16
  const browAngle = ((seed >> 2) % 5) - 2; // -2..2 degrees, subtle expression variance
  const faceWidth = 34 + (seed % 6); // 34-39
  const jawDrop = 6 + ((seed >> 3) % 4); // jaw shape variance
  const hairStyle = seed % 3; // 0 short, 1 side part, 2 slicked back
  const hasStubble = seed % 2 === 0;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Suspect likeness"
    >
      <rect width="100" height="100" fill={bg} />

      {/* neck / shoulders */}
      <path d="M35 78 Q50 68 65 78 L68 100 L32 100 Z" fill={skin} opacity={0.9} />

      {/* face */}
      <ellipse cx="50" cy="46" rx={faceWidth / 2} ry="26" fill={skin} />

      {/* jaw shadow */}
      <path
        d={`M${50 - faceWidth / 2} 50 Q50 ${64 + jawDrop} ${50 + faceWidth / 2} 50`}
        fill={skin}
      />

      {/* stubble / shading */}
      {hasStubble && (
        <path
          d={`M${50 - faceWidth / 2 + 3} 52 Q50 ${62 + jawDrop} ${50 + faceWidth / 2 - 3} 52`}
          fill="none"
          stroke="#000"
          strokeOpacity="0.12"
          strokeWidth="6"
        />
      )}

      {/* hair */}
      {hairStyle === 0 && (
        <path d={`M${50 - faceWidth / 2 - 2} 34 Q50 12 ${50 + faceWidth / 2 + 2} 34 Q50 22 50 22 Q50 22 ${50 - faceWidth / 2 - 2} 34`} fill={hair} />
      )}
      {hairStyle === 1 && (
        <path d={`M${50 - faceWidth / 2 - 3} 36 Q35 10 55 18 Q${50 + faceWidth / 2 + 4} 22 ${50 + faceWidth / 2 + 2} 36 Z`} fill={hair} />
      )}
      {hairStyle === 2 && (
        <path d={`M${50 - faceWidth / 2 - 2} 32 Q50 14 ${50 + faceWidth / 2 + 2} 32 Q50 20 50 24 Q50 20 ${50 - faceWidth / 2 - 2} 32`} fill={hair} />
      )}

      {/* eyebrows */}
      <rect
        x={50 - eyeSpacing - 7}
        y="40"
        width="10"
        height="2.4"
        rx="1"
        fill={hair}
        transform={`rotate(${browAngle} ${50 - eyeSpacing} 41)`}
      />
      <rect
        x={50 + eyeSpacing - 3}
        y="40"
        width="10"
        height="2.4"
        rx="1"
        fill={hair}
        transform={`rotate(${-browAngle} ${50 + eyeSpacing} 41)`}
      />

      {/* eyes */}
      <ellipse cx={50 - eyeSpacing} cy="46" rx="2.6" ry={agitated ? 1.6 : 2.1} fill="#241a12" />
      <ellipse cx={50 + eyeSpacing} cy="46" rx="2.6" ry={agitated ? 1.6 : 2.1} fill="#241a12" />

      {/* nose */}
      <path d="M50 46 L47 56 Q50 58 53 56 Z" fill="#000" opacity="0.08" />

      {/* mouth — slight variance, tighter line if "agitated" */}
      <path
        d={agitated ? "M43 63 Q50 61 57 63" : "M43 62 Q50 66 57 62"}
        stroke="#3a1f16"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />

      {/* vignette for interrogation-room mood */}
      <rect width="100" height="100" fill="url(#avatarVignette)" opacity="0.35" />
      <defs>
        <radialGradient id="avatarVignette" cx="50%" cy="40%" r="70%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>
    </svg>
  );
}
