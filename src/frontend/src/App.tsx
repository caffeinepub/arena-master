import { useCallback, useEffect, useState } from "react";

// ============ TYPES ============
type TabName = "home" | "tournaments" | "leaderboard" | "wallet" | "profile";
type TournamentStatus = "upcoming" | "live" | "completed";
type TransactionType = "deposit" | "withdraw" | "prize" | "entry";
type NotifType = "match" | "result" | "reward" | "system";

interface Tournament {
  id: number;
  name: string;
  mode: string;
  prize: number;
  entry: number;
  slots: number;
  filled: number;
  status: TournamentStatus;
  map: string;
  startTime: number;
  joined?: boolean;
  rules?: string;
}

interface Player {
  id: number;
  name: string;
  coins: number;
  wins: number;
  kills: number;
  rank: string;
  banned?: boolean;
}

interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: number;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotifType;
  read: boolean;
  timestamp: number;
}

// ============ MOCK DATA ============
const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 1,
    name: "INFERNO CUP",
    mode: "Solo",
    prize: 10000,
    entry: 100,
    slots: 100,
    filled: 73,
    status: "live",
    map: "Bermuda",
    startTime: Date.now() + 3600000,
    rules:
      "Top 3 players win prizes. Kill points: 10 each. Survival bonus: 50 per minute.",
  },
  {
    id: 2,
    name: "SQUAD WARS",
    mode: "Squad",
    prize: 25000,
    entry: 250,
    slots: 50,
    filled: 32,
    status: "upcoming",
    map: "Kalahari",
    startTime: Date.now() + 7200000,
    rules:
      "4-player squads. Top squad wins 15,000 coins. 2nd place: 6,000. 3rd place: 4,000.",
  },
  {
    id: 3,
    name: "DEATH MATCH",
    mode: "Solo",
    prize: 5000,
    entry: 50,
    slots: 200,
    filled: 200,
    status: "completed",
    map: "Purgatory",
    startTime: Date.now() - 86400000,
    rules: "100 kills challenge. Fastest to 100 kills wins.",
  },
  {
    id: 4,
    name: "BLAZE ROYALE",
    mode: "Squad",
    prize: 50000,
    entry: 500,
    slots: 80,
    filled: 45,
    status: "upcoming",
    map: "Alpine",
    startTime: Date.now() + 14400000,
    rules:
      "Elite tournament. Top 5 squads rewarded. Grand prize: 30,000 coins.",
  },
  {
    id: 5,
    name: "NIGHT RAIDERS",
    mode: "Solo",
    prize: 8000,
    entry: 80,
    slots: 150,
    filled: 150,
    status: "completed",
    map: "Bermuda",
    startTime: Date.now() - 172800000,
    rules: "Night mode exclusive. Thermal vision allowed.",
  },
];

const INITIAL_PLAYERS: Player[] = [
  {
    id: 1,
    name: "FireStorm99",
    coins: 2500,
    wins: 47,
    kills: 312,
    rank: "Gold III",
  },
  {
    id: 2,
    name: "BladeKing",
    coins: 8900,
    wins: 89,
    kills: 621,
    rank: "Diamond I",
  },
  {
    id: 3,
    name: "ShadowX",
    coins: 6200,
    wins: 64,
    kills: 445,
    rank: "Platinum II",
  },
  {
    id: 4,
    name: "NightWolf",
    coins: 5100,
    wins: 52,
    kills: 380,
    rank: "Platinum III",
  },
  {
    id: 5,
    name: "ThunderBolt",
    coins: 4800,
    wins: 48,
    kills: 355,
    rank: "Gold I",
  },
  {
    id: 6,
    name: "PhoenixRise",
    coins: 4200,
    wins: 43,
    kills: 290,
    rank: "Gold II",
  },
  {
    id: 7,
    name: "IronFist",
    coins: 3800,
    wins: 38,
    kills: 267,
    rank: "Gold III",
  },
  {
    id: 8,
    name: "StealthOps",
    coins: 3100,
    wins: 31,
    kills: 212,
    rank: "Silver I",
  },
  {
    id: 9,
    name: "CyberWolf",
    coins: 2900,
    wins: 29,
    kills: 195,
    rank: "Silver II",
  },
  {
    id: 10,
    name: "FireStorm99",
    coins: 2500,
    wins: 47,
    kills: 312,
    rank: "Gold III",
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    type: "prize",
    amount: 500,
    description: "Prize: INFERNO CUP 3rd place",
    timestamp: Date.now() - 3600000,
  },
  {
    id: 2,
    type: "entry",
    amount: -100,
    description: "Entry: INFERNO CUP",
    timestamp: Date.now() - 7200000,
  },
  {
    id: 3,
    type: "deposit",
    amount: 1000,
    description: "Demo deposit",
    timestamp: Date.now() - 86400000,
  },
  {
    id: 4,
    type: "prize",
    amount: 250,
    description: "Prize: Kill bonus NIGHT RAIDERS",
    timestamp: Date.now() - 172800000,
  },
  {
    id: 5,
    type: "entry",
    amount: -80,
    description: "Entry: NIGHT RAIDERS",
    timestamp: Date.now() - 176400000,
  },
];

const INITIAL_NOTIFS: Notification[] = [
  {
    id: 1,
    title: "Match Starting Soon!",
    message: "INFERNO CUP starts in 30 minutes. Get ready!",
    type: "match",
    read: false,
    timestamp: Date.now() - 1800000,
  },
  {
    id: 2,
    title: "Reward Earned!",
    message: "You earned 500 coins for finishing 3rd in INFERNO CUP.",
    type: "reward",
    read: false,
    timestamp: Date.now() - 3600000,
  },
  {
    id: 3,
    title: "New Tournament!",
    message: "BLAZE ROYALE is now open for registration. Prize: 50,000 coins!",
    type: "system",
    read: false,
    timestamp: Date.now() - 7200000,
  },
  {
    id: 4,
    title: "Match Result",
    message: "You finished 3rd in NIGHT RAIDERS. Well played!",
    type: "result",
    read: true,
    timestamp: Date.now() - 172800000,
  },
  {
    id: 5,
    title: "Welcome to Arena Master",
    message: "Your account is verified. Start competing now!",
    type: "system",
    read: true,
    timestamp: Date.now() - 604800000,
  },
];

// ============ HELPERS ============
function formatCoins(n: number) {
  return n.toLocaleString();
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function getTimeUntil(ts: number) {
  const diff = ts - Date.now();
  if (diff <= 0) return "Started";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}

const statusColors: Record<TournamentStatus, string> = {
  live: "#FF1744",
  upcoming: "#FF9A2E",
  completed: "#666",
};

const notifColors: Record<NotifType, string> = {
  match: "#FF4A1A",
  result: "#00E676",
  reward: "#FFD700",
  system: "#448AFF",
};

// ============ ICONS ============
const HomeIcon = ({ active }: { active?: boolean }) => (
  <svg
    aria-hidden="true"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill={active ? "#FF4A1A" : "none"}
    stroke={active ? "#FF4A1A" : "#666"}
    strokeWidth="2"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const TrophyIcon = ({
  active,
  size = 22,
}: { active?: boolean; size?: number }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={active ? "#FF4A1A" : "none"}
    stroke={active ? "#FF4A1A" : "#666"}
    strokeWidth="2"
  >
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0012 0V2z" />
  </svg>
);

const CrownIcon = ({
  active,
  size = 22,
}: { active?: boolean; size?: number }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={active ? "#FF4A1A" : "none"}
    stroke={active ? "#FF4A1A" : "#666"}
    strokeWidth="2"
  >
    <path d="M2 19l3-9 5 5 2-9 2 9 5-5 3 9H2z" />
  </svg>
);

const CoinIcon = ({
  active,
  size = 22,
  color,
}: { active?: boolean; size?: number; color?: string }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || (active ? "#FF4A1A" : "none")}
    stroke={color || (active ? "#FF4A1A" : "#666")}
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path
      d="M12 6v2m0 8v2M9 9.5h4.5a1.5 1.5 0 010 3H10.5a1.5 1.5 0 000 3H15"
      stroke={color || (active ? "#FF4A1A" : "#666")}
    />
  </svg>
);

const UserIcon = ({
  active,
  size = 22,
}: { active?: boolean; size?: number }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={active ? "#FF4A1A" : "none"}
    stroke={active ? "#FF4A1A" : "#666"}
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BellIcon = ({ count }: { count: number }) => (
  <div className="relative cursor-pointer">
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9AA3AD"
      strokeWidth="2"
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
    {count > 0 && (
      <span
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
        style={{ background: "#FF4A1A" }}
      >
        {count}
      </span>
    )}
  </div>
);

const BackIcon = () => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
  >
    <path d="M19 12H5M5 12l7 7M5 12l7-7" />
  </svg>
);

const FireIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#FF4A1A"
    stroke="none"
  >
    <path d="M12 2c0 0-6 5.686-6 10a6 6 0 0012 0C18 7.686 12 2 12 2zM9.5 13.5c-.828 0-1.5-.895-1.5-2 0-1.274 1.021-2.674 2-3.5-.5 1-.5 1.5 0 2 .5.5 1.5.5 1.5 1.5 0 1.105-.672 2-2 2z" />
  </svg>
);

const ShieldIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#FFD700"
    stroke="none"
  >
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" />
  </svg>
);

// ============ SPLASH SCREEN ============
function SplashScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center splash-fade"
      style={{
        background: "linear-gradient(180deg, #0B0D10 0%, #1a0a00 100%)",
      }}
    >
      {/* Ember particles */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <div
          key={`ember-${i}`}
          className="ember"
          style={
            {
              left: `${20 + Math.random() * 60}%`,
              bottom: "30%",
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 1.5}s`,
              background: i % 2 === 0 ? "#FF6A2A" : "#FFD700",
              width: `${3 + Math.random() * 4}px`,
              height: `${3 + Math.random() * 4}px`,
              "--tx": `${(Math.random() - 0.5) * 40}px`,
            } as React.CSSProperties
          }
        />
      ))}
      <div
        className="fire-glow rounded-full p-4 mb-6"
        style={{ background: "rgba(255,74,26,0.1)" }}
      >
        <img
          src="/assets/generated/gladiator-logo-transparent.dim_400x400.png"
          alt="Arena Master"
          className="w-32 h-32 object-contain"
        />
      </div>
      <h1
        className="heading-font text-5xl font-black tracking-widest uppercase"
        style={{
          background: "linear-gradient(135deg, #FF4A1A, #FFD700)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        ARENA
      </h1>
      <h1
        className="heading-font text-5xl font-black tracking-widest uppercase"
        style={{
          background: "linear-gradient(135deg, #FF9A2E, #FF4A1A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        MASTER
      </h1>
      <p
        className="mt-4 text-sm tracking-[0.3em] uppercase"
        style={{ color: "#9AA3AD" }}
      >
        DOMINATE THE ARENA
      </p>
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: "#FF4A1A",
              animation: `pulseOrange 1.2s ${i * 0.3}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ============ TOURNAMENT CARD ============
function TournamentCard({
  t,
  onJoin,
  onView,
}: {
  t: Tournament;
  onJoin: (t: Tournament) => void;
  onView: (t: Tournament) => void;
}) {
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    if (t.status !== "completed") {
      const interval = setInterval(() => forceUpdate((x) => x + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [t.status]);

  return (
    <div className="card-glow p-4 mb-3 fade-in-up">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="heading-font text-lg font-bold tracking-wide">
              {t.name}
            </span>
            {t.status === "live" && (
              <span className="live-badge text-[10px] font-bold px-2 py-0.5 rounded-full text-white uppercase">
                LIVE
              </span>
            )}
            {t.joined && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(0,230,118,0.15)",
                  color: "#00E676",
                  border: "1px solid rgba(0,230,118,0.3)",
                }}
              >
                JOINED
              </span>
            )}
          </div>
          <div className="flex gap-3 text-xs" style={{ color: "#9AA3AD" }}>
            <span>🗺 {t.map}</span>
            <span>👥 {t.mode}</span>
            <span style={{ color: statusColors[t.status] }}>
              {t.status.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div
            className="heading-font text-lg font-bold"
            style={{ color: "#FFD700" }}
          >
            🪙 {formatCoins(t.prize)}
          </div>
          <div className="text-xs" style={{ color: "#9AA3AD" }}>
            Prize Pool
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-xs">
          <div>
            <span style={{ color: "#9AA3AD" }}>Entry: </span>
            <span
              className="font-bold"
              style={{ color: t.entry === 0 ? "#00E676" : "#FF9A2E" }}
            >
              {t.entry === 0 ? "FREE" : `🪙 ${t.entry}`}
            </span>
          </div>
          <div>
            <span style={{ color: "#9AA3AD" }}>Slots: </span>
            <span className="font-bold">
              {t.filled}/{t.slots}
            </span>
          </div>
          {t.status !== "completed" && (
            <div>
              <span style={{ color: "#9AA3AD" }}>Starts: </span>
              <span className="font-bold" style={{ color: "#FF4A1A" }}>
                {getTimeUntil(t.startTime)}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onView(t)}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            Details
          </button>
          {t.status !== "completed" && !t.joined && (
            <button
              type="button"
              onClick={() => onJoin(t)}
              className="btn-primary text-xs px-3 py-1.5"
            >
              Join
            </button>
          )}
        </div>
      </div>
      {/* Slot bar */}
      <div
        className="mt-3 h-1 rounded-full"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="h-1 rounded-full transition-all"
          style={{
            width: `${(t.filled / t.slots) * 100}%`,
            background:
              t.filled === t.slots
                ? "#FF4A1A"
                : "linear-gradient(90deg, #FF4A1A, #FF9A2E)",
          }}
        />
      </div>
    </div>
  );
}

// ============ JOIN MODAL ============
function JoinModal({
  tournament,
  coins,
  onConfirm,
  onClose,
}: {
  tournament: Tournament;
  coins: number;
  onConfirm: (mode: string) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState("Solo");
  const canAfford = coins >= tournament.entry;
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center cursor-default"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClose();
      }}
      role="presentation"
      tabIndex={-1}
    >
      <div
        className="w-full max-w-[430px] p-6 rounded-t-3xl fade-in-up"
        style={{
          background: "#14181D",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <div
          className="w-12 h-1 rounded-full mx-auto mb-6"
          style={{ background: "rgba(255,255,255,0.2)" }}
        />
        <h2 className="heading-font text-2xl font-bold mb-1">
          JOIN {tournament.name}
        </h2>
        <p className="text-sm mb-4" style={{ color: "#9AA3AD" }}>
          Select your participation mode
        </p>
        <div className="flex gap-3 mb-6">
          {["Solo", "Squad"].map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
              style={{
                background:
                  mode === m
                    ? "linear-gradient(135deg, #FF4A1A, #FF9A2E)"
                    : "#1A1F25",
                border:
                  mode === m ? "none" : "1px solid rgba(255,255,255,0.15)",
                color: "white",
              }}
            >
              {m === "Solo" ? "⚔️ Solo" : "🛡️ Squad"}
            </button>
          ))}
        </div>
        <div className="card-glow p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: "#9AA3AD" }}>Entry Fee</span>
            <span
              className="font-bold"
              style={{ color: tournament.entry === 0 ? "#00E676" : "#FF9A2E" }}
            >
              {tournament.entry === 0 ? "FREE" : `🪙 ${tournament.entry}`}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: "#9AA3AD" }}>Your Balance</span>
            <span
              className="font-bold"
              style={{ color: canAfford ? "#fff" : "#FF4A1A" }}
            >
              🪙 {formatCoins(coins)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#9AA3AD" }}>After Entry</span>
            <span
              className="font-bold"
              style={{ color: canAfford ? "#00E676" : "#FF4A1A" }}
            >
              🪙 {formatCoins(coins - tournament.entry)}
            </span>
          </div>
        </div>
        {!canAfford && (
          <p className="text-center text-sm mb-4" style={{ color: "#FF4A1A" }}>
            Insufficient coins! Please deposit more.
          </p>
        )}
        <button
          type="button"
          onClick={() => canAfford && onConfirm(mode)}
          className="w-full py-4 rounded-xl font-black text-lg heading-font"
          style={{
            background: canAfford
              ? "linear-gradient(135deg, #FF4A1A, #FF9A2E)"
              : "#333",
            color: canAfford ? "white" : "#666",
            cursor: canAfford ? "pointer" : "not-allowed",
          }}
        >
          CONFIRM & JOIN
        </button>
      </div>
    </div>
  );
}

// ============ TOURNAMENT DETAIL ============
function TournamentDetail({
  t,
  onClose,
}: { t: Tournament; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-40 overflow-y-auto"
      style={{ background: "#0B0D10" }}
    >
      <div className="max-w-[430px] mx-auto">
        <div
          className="flex items-center gap-3 p-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl"
            style={{ background: "#1A1F25" }}
          >
            <BackIcon />
          </button>
          <h2 className="heading-font text-xl font-bold flex-1">{t.name}</h2>
          {t.status === "live" && (
            <span className="live-badge text-xs font-bold px-3 py-1 rounded-full text-white">
              LIVE
            </span>
          )}
        </div>
        <div className="p-4 space-y-4">
          <div className="card-glow p-4">
            <h3
              className="heading-font text-lg font-bold mb-3"
              style={{ color: "#FF4A1A" }}
            >
              PRIZE BREAKDOWN
            </h3>
            {[
              [1, Math.floor(t.prize * 0.5), "🥇"],
              [2, Math.floor(t.prize * 0.3), "🥈"],
              [3, Math.floor(t.prize * 0.2), "🥉"],
            ].map(([pos, amt, icon]) => (
              <div
                key={pos as number}
                className="flex justify-between py-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span>
                  {icon as string} {pos}
                  {pos === 1 ? "st" : pos === 2 ? "nd" : "rd"} Place
                </span>
                <span className="font-bold" style={{ color: "#FFD700" }}>
                  🪙 {formatCoins(amt as number)}
                </span>
              </div>
            ))}
          </div>
          <div className="card-glow p-4">
            <h3
              className="heading-font text-lg font-bold mb-3"
              style={{ color: "#FF4A1A" }}
            >
              TOURNAMENT INFO
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "#9AA3AD" }}>Map</span>
                <span>{t.map}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#9AA3AD" }}>Mode</span>
                <span>{t.mode}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#9AA3AD" }}>Slots</span>
                <span>
                  {t.filled}/{t.slots}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#9AA3AD" }}>Status</span>
                <span
                  style={{
                    color: statusColors[t.status],
                    textTransform: "uppercase",
                  }}
                >
                  {t.status}
                </span>
              </div>
            </div>
          </div>
          {t.rules && (
            <div className="card-glow p-4">
              <h3
                className="heading-font text-lg font-bold mb-3"
                style={{ color: "#FF4A1A" }}
              >
                RULES
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#C9CED6" }}
              >
                {t.rules}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ HOME TAB ============
function HomeTab({
  tournaments,
  coins,
  wins,
  kills,
  rank,
  onJoin,
}: {
  tournaments: Tournament[];
  coins: number;
  wins: number;
  kills: number;
  rank: string;
  onJoin: (t: Tournament) => void;
}) {
  const featured =
    tournaments.find((t) => t.status === "live") || tournaments[0];
  const active = tournaments
    .filter((t) => t.status !== "completed")
    .slice(0, 4);
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceUpdate((x) => x + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-y-auto pb-24">
      {/* Featured */}
      {featured && (
        <div
          className="mx-4 mb-4 rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a0800, #0d0d0d)",
            border: "1px solid rgba(255,74,26,0.3)",
            boxShadow: "0 0 30px rgba(255,74,26,0.15)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #FF4A1A, transparent)",
            }}
          />
          <div className="flex items-center gap-2 mb-2">
            {featured.status === "live" && (
              <span className="live-badge text-[10px] font-bold px-2 py-0.5 rounded-full text-white">
                ● LIVE
              </span>
            )}
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: "#9AA3AD" }}
            >
              Featured Tournament
            </span>
          </div>
          <h2 className="heading-font text-3xl font-black tracking-wide mb-1">
            {featured.name}
          </h2>
          <p className="text-xs mb-4" style={{ color: "#9AA3AD" }}>
            🗺 {featured.map} · {featured.mode}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <div
                className="heading-font text-2xl font-black"
                style={{ color: "#FFD700" }}
              >
                🪙 {formatCoins(featured.prize)}
              </div>
              <div className="text-xs" style={{ color: "#9AA3AD" }}>
                Total Prize Pool
              </div>
            </div>
            <div className="text-right">
              <div
                className="heading-font text-xl font-bold"
                style={{ color: "#FF4A1A" }}
              >
                {getTimeUntil(featured.startTime)}
              </div>
              <div className="text-xs" style={{ color: "#9AA3AD" }}>
                Until Match
              </div>
            </div>
          </div>
          <div
            className="mt-3 h-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <div
              className="h-1 rounded-full"
              style={{
                width: `${(featured.filled / featured.slots) * 100}%`,
                background: "linear-gradient(90deg, #FF4A1A, #FF9A2E)",
              }}
            />
          </div>
          <div
            className="flex justify-between text-xs mt-1"
            style={{ color: "#9AA3AD" }}
          >
            <span>{featured.filled} players joined</span>
            <span>{featured.slots - featured.filled} slots left</span>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mx-4 mb-4 grid grid-cols-4 gap-2">
        {[
          ["🪙", formatCoins(coins), "Coins"],
          ["🏆", wins, "Wins"],
          ["💀", kills, "Kills"],
          ["⚔️", rank, "Rank"],
        ].map(([icon, val, label]) => (
          <div key={label as string} className="card-glow p-3 text-center">
            <div className="text-lg mb-0.5">{icon}</div>
            <div
              className="heading-font text-sm font-bold truncate"
              style={{ color: "#FF9A2E" }}
            >
              {val}
            </div>
            <div className="text-[10px]" style={{ color: "#9AA3AD" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Active Tournaments */}
      <div className="mb-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="heading-font text-xl font-bold uppercase tracking-wide">
            Active Tournaments
          </h3>
          <span className="text-xs" style={{ color: "#FF4A1A" }}>
            See All
          </span>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2">
          {active.map((t) => (
            <div key={t.id} className="card-glow p-4 flex-shrink-0 w-52">
              <div className="flex items-center justify-between mb-2">
                <span className="heading-font text-sm font-bold">{t.name}</span>
                {t.status === "live" && (
                  <span className="live-badge text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white">
                    LIVE
                  </span>
                )}
              </div>
              <div
                className="heading-font text-lg font-bold mb-1"
                style={{ color: "#FFD700" }}
              >
                🪙 {formatCoins(t.prize)}
              </div>
              <div className="text-xs mb-3" style={{ color: "#9AA3AD" }}>
                {t.map} · {t.mode}
              </div>
              <button
                type="button"
                onClick={() => onJoin(t)}
                className="btn-primary w-full py-1.5 text-xs"
              >
                {t.joined ? "JOINED ✓" : "JOIN NOW"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement */}
      <div
        className="mx-4 rounded-2xl p-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,74,26,0.15), rgba(255,154,46,0.1))",
          border: "1px solid rgba(255,74,26,0.3)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span>📣</span>
          <span
            className="heading-font text-sm font-bold uppercase tracking-wider"
            style={{ color: "#FF4A1A" }}
          >
            Announcement
          </span>
        </div>
        <p className="text-sm" style={{ color: "#C9CED6" }}>
          BLAZE ROYALE is now open! 50,000 coin prize pool. Register before
          slots run out!
        </p>
      </div>
    </div>
  );
}

// ============ TOURNAMENTS TAB ============
function TournamentsTab({
  tournaments,
  coins,
  onJoinTournament,
}: {
  tournaments: Tournament[];
  coins: number;
  onJoinTournament: (t: Tournament) => void;
}) {
  const [filter, setFilter] = useState<"all" | TournamentStatus>("all");
  const [joinTarget, setJoinTarget] = useState<Tournament | null>(null);
  const [detailTarget, setDetailTarget] = useState<Tournament | null>(null);

  const filtered =
    filter === "all"
      ? tournaments
      : tournaments.filter((t) => t.status === filter);

  return (
    <div className="overflow-y-auto pb-24">
      <div
        className="sticky top-0 z-10 px-4 py-3"
        style={{
          background: "#0B0D10",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h2 className="heading-font text-2xl font-black mb-3 uppercase tracking-wide">
          Tournaments
        </h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(["all", "live", "upcoming", "completed"] as const).map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFilter(f)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all"
              style={{
                background:
                  filter === f
                    ? "linear-gradient(135deg, #FF4A1A, #FF9A2E)"
                    : "#14181D",
                color: filter === f ? "white" : "#9AA3AD",
                border:
                  filter === f ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12" style={{ color: "#9AA3AD" }}>
            <TrophyIcon size={40} />
            <p className="mt-3">No {filter} tournaments</p>
          </div>
        ) : (
          filtered.map((t) => (
            <TournamentCard
              key={t.id}
              t={t}
              onJoin={setJoinTarget}
              onView={setDetailTarget}
            />
          ))
        )}
      </div>
      {joinTarget && !joinTarget.joined && (
        <JoinModal
          tournament={joinTarget}
          coins={coins}
          onConfirm={() => {
            onJoinTournament(joinTarget);
            setJoinTarget(null);
          }}
          onClose={() => setJoinTarget(null)}
        />
      )}
      {detailTarget && (
        <TournamentDetail
          t={detailTarget}
          onClose={() => setDetailTarget(null)}
        />
      )}
    </div>
  );
}

// ============ LEADERBOARD TAB ============
function LeaderboardTab({ players }: { players: Player[] }) {
  const [tab, setTab] = useState<"global" | "local">("global");
  const sorted = [...players].sort((a, b) => b.coins - a.coins);
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podiumHeight = ["h-24", "h-32", "h-20"];
  const podiumBadge = ["🥈", "🥇", "🥉"];
  const podiumGradient = ["rank-silver", "rank-gold", "rank-bronze"];
  const podiumRank = [2, 1, 3];

  return (
    <div className="overflow-y-auto pb-24">
      <div
        className="sticky top-0 z-10 px-4 py-3"
        style={{
          background: "#0B0D10",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h2 className="heading-font text-2xl font-black mb-3 uppercase tracking-wide">
          Leaderboard
        </h2>
        <div className="flex gap-2">
          {(["global", "local"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-all"
              style={{
                background:
                  tab === t
                    ? "linear-gradient(135deg, #FF4A1A, #FF9A2E)"
                    : "#14181D",
                color: tab === t ? "white" : "#9AA3AD",
                border: tab === t ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="px-4 py-6">
        <div className="flex items-end justify-center gap-3">
          {podiumOrder.map(
            (player, idx) =>
              player && (
                <div
                  key={`podium-${player.id}`}
                  className="flex flex-col items-center"
                  style={{ width: "30%" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg mb-2"
                    style={{
                      background: `linear-gradient(135deg, ${idx === 1 ? "#FF4A1A" : idx === 0 ? "#888" : "#8B4513"}, ${idx === 1 ? "#FF9A2E" : idx === 0 ? "#aaa" : "#A0522D"})`,
                    }}
                  >
                    {player.name[0]}
                  </div>
                  <div
                    className="text-[11px] font-bold mb-1 text-center truncate w-full"
                    style={{ color: idx === 1 ? "#FFD700" : "#fff" }}
                  >
                    {player.name}
                  </div>
                  <div
                    className="text-[10px] mb-2"
                    style={{ color: "#9AA3AD" }}
                  >
                    🪙 {formatCoins(player.coins)}
                  </div>
                  <div
                    className={`w-full rounded-t-xl flex items-start justify-center pt-2 font-black text-xl ${podiumGradient[idx]} ${podiumHeight[idx]}`}
                  >
                    {podiumBadge[idx]}
                  </div>
                  <div
                    className="w-full py-1 text-center text-xs font-bold"
                    style={{
                      background: "#14181D",
                      borderRadius: "0 0 8px 8px",
                      color: "#9AA3AD",
                    }}
                  >
                    #{podiumRank[idx]}
                  </div>
                </div>
              ),
          )}
        </div>
      </div>

      {/* Rest of list */}
      <div className="px-4 space-y-2">
        {rest.map((player, idx) => (
          <div
            key={`rank-${player.id}-${idx}`}
            className="card-glow p-3 flex items-center gap-3"
          >
            <div
              className="heading-font text-lg font-black w-6 text-center"
              style={{ color: "#9AA3AD" }}
            >
              #{idx + 4}
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #1A1F25, #2A2F35)",
              }}
            >
              {player.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{player.name}</div>
              <div className="text-xs" style={{ color: "#9AA3AD" }}>
                {player.rank} · {player.wins}W · {player.kills}K
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold" style={{ color: "#FFD700" }}>
                🪙 {formatCoins(player.coins)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ WALLET TAB ============
function WalletTab({
  coins,
  transactions,
  onDeposit,
  onWithdraw,
}: {
  coins: number;
  transactions: Transaction[];
  onDeposit: () => void;
  onWithdraw: (amt: number) => void;
}) {
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const txIcon: Record<TransactionType, string> = {
    deposit: "⬆️",
    withdraw: "⬇️",
    prize: "🏆",
    entry: "🎮",
  };
  const txColor: Record<TransactionType, string> = {
    deposit: "#00E676",
    withdraw: "#FF4A1A",
    prize: "#FFD700",
    entry: "#FF4A1A",
  };

  return (
    <div className="overflow-y-auto pb-24">
      {toast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-sm font-bold"
          style={{
            background: "#14181D",
            border: "1px solid rgba(255,74,26,0.5)",
            color: "white",
            minWidth: "200px",
            textAlign: "center",
          }}
        >
          {toast}
        </div>
      )}

      <div className="p-4">
        {/* Balance Card */}
        <div
          className="fire-glow rounded-2xl p-6 mb-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a0800, #0d0d0d)",
            border: "1px solid rgba(255,74,26,0.4)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #FF4A1A, transparent)",
            }}
          />
          <div className="flex items-center gap-2 mb-1">
            <FireIcon size={16} />
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: "#9AA3AD" }}
            >
              Arena Coins Balance
            </span>
          </div>
          <div
            className="heading-font text-5xl font-black mb-1"
            style={{ color: "#FFD700" }}
          >
            🪙 {formatCoins(coins)}
          </div>
          <div className="text-xs" style={{ color: "#9AA3AD" }}>
            Simulated virtual currency
          </div>
        </div>

        {/* Add Coins */}
        <div className="card-glow p-4 mb-4">
          <h3 className="heading-font text-lg font-bold mb-3 uppercase">
            Add Coins
          </h3>
          <button
            type="button"
            onClick={onDeposit}
            className="btn-primary w-full py-3 text-sm mb-3"
          >
            + ADD 500 COINS (DEMO)
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => showToast("Easypaisa integration coming soon!")}
              className="py-3 rounded-xl font-bold text-sm relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #00A651, #007A3D)",
                color: "white",
              }}
            >
              <div>Easypaisa</div>
              <div className="text-[10px] opacity-70">Coming Soon</div>
            </button>
            <button
              type="button"
              onClick={() => showToast("JazzCash integration coming soon!")}
              className="py-3 rounded-xl font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, #E31837, #A01127)",
                color: "white",
              }}
            >
              <div>JazzCash</div>
              <div className="text-[10px] opacity-70">Coming Soon</div>
            </button>
          </div>
        </div>

        {/* Withdraw */}
        <div className="card-glow p-4 mb-4">
          <h3 className="heading-font text-lg font-bold mb-3 uppercase">
            Withdraw Coins
          </h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmt}
              onChange={(e) => setWithdrawAmt(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "#1A1F25",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
              }}
            />
            <button
              type="button"
              onClick={() => {
                const amt = Number.parseInt(withdrawAmt);
                if (!amt || amt <= 0) {
                  showToast("Enter a valid amount");
                  return;
                }
                if (amt > coins) {
                  showToast("Insufficient coins!");
                  return;
                }
                onWithdraw(amt);
                setWithdrawAmt("");
                showToast(`Withdrew 🪙 ${amt} coins!`);
              }}
              className="btn-primary px-5 py-3 text-sm"
            >
              Withdraw
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: "#9AA3AD" }}>
            Withdrawals simulated. Real payouts via Easypaisa/JazzCash coming
            soon.
          </p>
        </div>

        {/* Transactions */}
        <div>
          <h3 className="heading-font text-lg font-bold mb-3 uppercase">
            Transaction History
          </h3>
          {transactions.length === 0 ? (
            <p className="text-center py-6" style={{ color: "#9AA3AD" }}>
              No transactions yet
            </p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="card-glow p-3 mb-2 flex items-center gap-3"
              >
                <span className="text-xl">{txIcon[tx.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {tx.description}
                  </div>
                  <div className="text-xs" style={{ color: "#9AA3AD" }}>
                    {timeAgo(tx.timestamp)}
                  </div>
                </div>
                <div
                  className="font-bold text-sm"
                  style={{ color: txColor[tx.type] }}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {formatCoins(tx.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ============ PROFILE TAB ============
function ProfileTab({
  player,
  tournaments,
  onAdminOpen,
}: { player: Player; tournaments: Tournament[]; onAdminOpen: () => void }) {
  const badges = [
    { name: "First Blood", icon: "🩸", unlocked: true },
    { name: "Top 10", icon: "🏅", unlocked: true },
    { name: "50 Wins", icon: "🏆", unlocked: player.wins >= 50 },
    { name: "300 Kills", icon: "💀", unlocked: player.kills >= 300 },
    { name: "Legend", icon: "⭐", unlocked: false },
  ];
  const history = tournaments
    .filter((t) => t.status === "completed")
    .slice(0, 3);

  return (
    <div className="overflow-y-auto pb-24">
      <div className="p-4">
        {/* Profile Header */}
        <div className="card-glow p-6 mb-4 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl mx-auto mb-3 fire-glow"
            style={{ background: "linear-gradient(135deg, #FF4A1A, #FF9A2E)" }}
          >
            {player.name[0]}
          </div>
          <div className="heading-font text-2xl font-black mb-1">
            {player.name}
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldIcon size={14} />
            <span className="text-sm font-bold" style={{ color: "#FFD700" }}>
              {player.rank}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            ["🏆", player.wins, "Wins"],
            ["💔", 12, "Losses"],
            ["💀", player.kills, "Kills"],
            ["🎮", 23, "Tournaments"],
          ].map(([icon, val, label]) => (
            <div key={label as string} className="card-glow p-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div
                className="heading-font text-2xl font-black"
                style={{ color: "#FF9A2E" }}
              >
                {val}
              </div>
              <div className="text-xs" style={{ color: "#9AA3AD" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="card-glow p-4 mb-4">
          <h3 className="heading-font text-lg font-bold mb-3 uppercase">
            Achievements
          </h3>
          <div className="flex gap-3 flex-wrap">
            {badges.map((b) => (
              <div
                key={b.name}
                className="flex flex-col items-center"
                style={{ opacity: b.unlocked ? 1 : 0.3 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{
                    background: b.unlocked ? "rgba(255,74,26,0.2)" : "#1A1F25",
                    border: `1px solid ${b.unlocked ? "#FF4A1A" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  {b.icon}
                </div>
                <span
                  className="text-[9px] mt-1 text-center"
                  style={{ color: b.unlocked ? "#FF9A2E" : "#666" }}
                >
                  {b.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament History */}
        <div className="card-glow p-4 mb-4">
          <h3 className="heading-font text-lg font-bold mb-3 uppercase">
            Recent Tournaments
          </h3>
          {history.length === 0 ? (
            <p className="text-sm" style={{ color: "#9AA3AD" }}>
              No completed tournaments
            </p>
          ) : (
            history.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div>
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-xs" style={{ color: "#9AA3AD" }}>
                    {t.map} · {t.mode}
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(100,100,100,0.3)",
                    color: "#9AA3AD",
                  }}
                >
                  COMPLETED
                </span>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <button
          type="button"
          onClick={onAdminOpen}
          className="btn-primary w-full py-3 mb-3 text-sm"
        >
          ⚙️ ADMIN PANEL
        </button>
        <button type="button" className="btn-secondary w-full py-3 text-sm">
          ⚙️ SETTINGS
        </button>
      </div>
    </div>
  );
}

// ============ ADMIN PANEL ============
function AdminPanel({
  tournaments,
  players,
  onClose,
  onCreateTournament,
  onAwardCoins,
  onBanPlayer,
  onBroadcast,
}: {
  tournaments: Tournament[];
  players: Player[];
  onClose: () => void;
  onCreateTournament: (t: Omit<Tournament, "id" | "filled" | "joined">) => void;
  onAwardCoins: (playerId: number, amount: number) => void;
  onBanPlayer: (playerId: number) => void;
  onBroadcast: (title: string, message: string) => void;
}) {
  const [tab, setTab] = useState<
    "tournaments" | "players" | "stats" | "notifications"
  >("tournaments");
  const [form, setForm] = useState({
    name: "",
    mode: "Solo",
    prize: "",
    entry: "",
    slots: "",
    map: "",
    rules: "",
  });
  const [awardInput, setAwardInput] = useState<Record<number, string>>({});
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "#0B0D10" }}
    >
      {toast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-sm font-bold"
          style={{
            background: "#14181D",
            border: "1px solid rgba(255,74,26,0.5)",
            color: "white",
            minWidth: "200px",
            textAlign: "center",
          }}
        >
          {toast}
        </div>
      )}
      <div className="max-w-[430px] mx-auto">
        <div
          className="flex items-center gap-3 p-4 sticky top-0"
          style={{
            background: "#0B0D10",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            zIndex: 10,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl"
            style={{ background: "#1A1F25" }}
          >
            <BackIcon />
          </button>
          <h2 className="heading-font text-xl font-black uppercase tracking-wide flex-1">
            Admin Panel
          </h2>
          <span
            className="text-xs px-2 py-1 rounded-full font-bold"
            style={{ background: "rgba(255,74,26,0.2)", color: "#FF4A1A" }}
          >
            ADMIN
          </span>
        </div>

        <div className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-hide">
          {(["tournaments", "players", "stats", "notifications"] as const).map(
            (t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTab(t)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase"
                style={{
                  background:
                    tab === t
                      ? "linear-gradient(135deg, #FF4A1A, #FF9A2E)"
                      : "#14181D",
                  color: tab === t ? "white" : "#9AA3AD",
                  border:
                    tab === t ? "none" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {t}
              </button>
            ),
          )}
        </div>

        <div className="p-4">
          {tab === "tournaments" && (
            <div>
              <h3 className="heading-font text-lg font-bold mb-3 uppercase">
                Create Tournament
              </h3>
              <div className="space-y-3">
                {(["name", "map", "rules"] as const).map((field) => (
                  <input
                    key={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [field]: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl text-sm"
                    style={{
                      background: "#14181D",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                    }}
                  />
                ))}
                <div className="flex gap-3">
                  {(["prize", "entry", "slots"] as const).map((field) => (
                    <input
                      key={field}
                      type="number"
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={form[field]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [field]: e.target.value }))
                      }
                      className="flex-1 px-3 py-3 rounded-xl text-sm"
                      style={{
                        background: "#14181D",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "white",
                      }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  {["Solo", "Squad"].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setForm((p) => ({ ...p, mode: m }))}
                      className="flex-1 py-2 rounded-xl text-sm font-bold"
                      style={{
                        background:
                          form.mode === m
                            ? "linear-gradient(135deg, #FF4A1A, #FF9A2E)"
                            : "#14181D",
                        color: "white",
                        border:
                          form.mode === m
                            ? "none"
                            : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!form.name || !form.prize || !form.slots) {
                      showToast("Fill all required fields");
                      return;
                    }
                    onCreateTournament({
                      name: form.name,
                      mode: form.mode,
                      prize: Number.parseInt(form.prize),
                      entry: Number.parseInt(form.entry) || 0,
                      slots: Number.parseInt(form.slots),
                      map: form.map || "Bermuda",
                      status: "upcoming",
                      startTime: Date.now() + 86400000,
                      rules: form.rules,
                    });
                    setForm({
                      name: "",
                      mode: "Solo",
                      prize: "",
                      entry: "",
                      slots: "",
                      map: "",
                      rules: "",
                    });
                    showToast("Tournament created!");
                  }}
                  className="btn-primary w-full py-3 text-sm"
                >
                  CREATE TOURNAMENT
                </button>
              </div>

              <h3 className="heading-font text-lg font-bold mt-6 mb-3 uppercase">
                All Tournaments ({tournaments.length})
              </h3>
              {tournaments.map((t) => (
                <div
                  key={t.id}
                  className="card-glow p-3 mb-2 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div
                      className="text-xs"
                      style={{ color: statusColors[t.status] }}
                    >
                      {t.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: "#FFD700" }}>
                    🪙 {formatCoins(t.prize)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "players" && (
            <div>
              <h3 className="heading-font text-lg font-bold mb-3 uppercase">
                Manage Players ({players.length})
              </h3>
              {players.map((p) => (
                <div key={p.id} className="card-glow p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, #FF4A1A, #FF9A2E)",
                        }}
                      >
                        {p.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{p.name}</div>
                        <div className="text-xs" style={{ color: "#9AA3AD" }}>
                          {p.rank} · {p.wins}W
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onBanPlayer(p.id);
                        showToast(
                          p.banned ? `${p.name} unbanned` : `${p.name} banned`,
                        );
                      }}
                      className="text-xs px-3 py-1 rounded-full font-bold"
                      style={{
                        background: p.banned
                          ? "rgba(0,230,118,0.15)"
                          : "rgba(255,23,68,0.15)",
                        color: p.banned ? "#00E676" : "#FF1744",
                        border: `1px solid ${p.banned ? "rgba(0,230,118,0.3)" : "rgba(255,23,68,0.3)"}`,
                      }}
                    >
                      {p.banned ? "Unban" : "Ban"}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Award coins"
                      value={awardInput[p.id] || ""}
                      onChange={(e) =>
                        setAwardInput((prev) => ({
                          ...prev,
                          [p.id]: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 rounded-lg text-xs"
                      style={{
                        background: "#1A1F25",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "white",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const amt = Number.parseInt(awardInput[p.id] || "0");
                        if (!amt) return;
                        onAwardCoins(p.id, amt);
                        setAwardInput((prev) => ({ ...prev, [p.id]: "" }));
                        showToast(`Awarded 🪙 ${amt} to ${p.name}`);
                      }}
                      className="btn-primary px-3 py-2 text-xs"
                    >
                      Award
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "stats" && (
            <div>
              <h3 className="heading-font text-lg font-bold mb-3 uppercase">
                Platform Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["👥", players.length, "Total Players"],
                  [
                    "⚔️",
                    tournaments.filter((t) => t.status !== "completed").length,
                    "Active Tournaments",
                  ],
                  ["🏆", tournaments.length, "All Tournaments"],
                  [
                    "🪙",
                    formatCoins(tournaments.reduce((s, t) => s + t.prize, 0)),
                    "Total Prize Pool",
                  ],
                ].map(([icon, val, label]) => (
                  <div
                    key={label as string}
                    className="card-glow p-4 text-center"
                  >
                    <div className="text-2xl mb-1">{icon}</div>
                    <div
                      className="heading-font text-2xl font-black"
                      style={{ color: "#FF9A2E" }}
                    >
                      {val}
                    </div>
                    <div className="text-xs" style={{ color: "#9AA3AD" }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div>
              <h3 className="heading-font text-lg font-bold mb-3 uppercase">
                Broadcast Notification
              </h3>
              <div className="space-y-3">
                <input
                  placeholder="Title"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{
                    background: "#14181D",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                />
                <textarea
                  placeholder="Message"
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{
                    background: "#14181D",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!broadcastTitle || !broadcastMsg) {
                      showToast("Fill title and message");
                      return;
                    }
                    onBroadcast(broadcastTitle, broadcastMsg);
                    setBroadcastTitle("");
                    setBroadcastMsg("");
                    showToast("Notification broadcast!");
                  }}
                  className="btn-primary w-full py-3 text-sm"
                >
                  📣 BROADCAST TO ALL PLAYERS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ NOTIFICATIONS DRAWER ============
function NotificationsDrawer({
  notifications,
  onRead,
  onReadAll,
  onClose,
}: {
  notifications: Notification[];
  onRead: (id: number) => void;
  onReadAll: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-40"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
    >
      <div
        className="absolute right-0 top-0 bottom-0 w-80 notification-slide overflow-y-auto"
        style={{
          background: "#0D1014",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h3 className="heading-font text-lg font-bold uppercase">
            Notifications
          </h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReadAll}
              className="text-xs"
              style={{ color: "#FF4A1A" }}
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1"
              style={{ color: "#9AA3AD" }}
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-3">
          {notifications.map((n) => (
            <button
              type="button"
              key={n.id}
              onClick={() => onRead(n.id)}
              className="w-full text-left p-3 mb-2 rounded-xl cursor-pointer transition-all"
              style={{
                background: n.read
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(255,74,26,0.08)",
                border: `1px solid ${n.read ? "rgba(255,255,255,0.06)" : "rgba(255,74,26,0.2)"}`,
              }}
            >
              <div className="flex items-start gap-2">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{
                    background: n.read ? "transparent" : notifColors[n.type],
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-bold uppercase"
                      style={{ color: notifColors[n.type] }}
                    >
                      {n.type}
                    </span>
                    <span className="text-[10px]" style={{ color: "#666" }}>
                      {timeAgo(n.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm font-bold mb-0.5">{n.title}</div>
                  <div className="text-xs" style={{ color: "#9AA3AD" }}>
                    {n.message}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const [tournaments, setTournaments] =
    useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [coins, setCoins] = useState(2500);
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] =
    useState<Notification[]>(INITIAL_NOTIFS);

  const currentPlayer = { ...players[0], coins };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  const addTransaction = useCallback(
    (type: TransactionType, amount: number, description: string) => {
      setTransactions((prev) => [
        { id: Date.now(), type, amount, description, timestamp: Date.now() },
        ...prev,
      ]);
    },
    [],
  );

  const handleJoinTournament = useCallback(
    (t: Tournament) => {
      setCoins((prev) => prev - t.entry);
      setTournaments((prev) =>
        prev.map((x) =>
          x.id === t.id ? { ...x, filled: x.filled + 1, joined: true } : x,
        ),
      );
      if (t.entry > 0) addTransaction("entry", -t.entry, `Entry: ${t.name}`);
      setNotifications((prev) => [
        {
          id: Date.now(),
          title: "Tournament Joined!",
          message: `You've joined ${t.name}. Good luck!`,
          type: "match",
          read: false,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    },
    [addTransaction],
  );

  const handleDeposit = useCallback(() => {
    setCoins((prev) => prev + 500);
    addTransaction("deposit", 500, "Demo deposit");
  }, [addTransaction]);

  const handleWithdraw = useCallback(
    (amt: number) => {
      setCoins((prev) => prev - amt);
      addTransaction("withdraw", -amt, `Withdrawal of ${amt} coins`);
    },
    [addTransaction],
  );

  const handleCreateTournament = useCallback(
    (t: Omit<Tournament, "id" | "filled" | "joined">) => {
      setTournaments((prev) => [...prev, { ...t, id: Date.now(), filled: 0 }]);
    },
    [],
  );

  const handleAwardCoins = useCallback(
    (playerId: number, amount: number) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === playerId ? { ...p, coins: p.coins + amount } : p,
        ),
      );
      if (playerId === 1) {
        setCoins((prev) => prev + amount);
        addTransaction("prize", amount, "Admin award");
      }
    },
    [addTransaction],
  );

  const handleBanPlayer = useCallback((playerId: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, banned: !p.banned } : p)),
    );
  }, []);

  const handleBroadcast = useCallback((title: string, message: string) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        title,
        message,
        type: "system",
        read: false,
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const handleReadNotif = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const handleReadAllNotifs = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabs: {
    id: TabName;
    label: string;
    icon: (active: boolean) => React.ReactNode;
  }[] = [
    { id: "home", label: "Home", icon: (a) => <HomeIcon active={a} /> },
    {
      id: "tournaments",
      label: "Tournaments",
      icon: (a) => <TrophyIcon active={a} />,
    },
    {
      id: "leaderboard",
      label: "Ranks",
      icon: (a) => <CrownIcon active={a} />,
    },
    { id: "wallet", label: "Wallet", icon: (a) => <CoinIcon active={a} /> },
    { id: "profile", label: "Profile", icon: (a) => <UserIcon active={a} /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0B0D10" }}>
      {showSplash && <SplashScreen />}

      <div
        className="max-w-[430px] mx-auto min-h-screen flex flex-col relative"
        style={{ background: "#0B0D10" }}
      >
        {/* Top Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{
            background: "#0D1014",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/gladiator-logo-transparent.dim_400x400.png"
              alt=""
              className="w-8 h-8 object-contain"
            />
            <div>
              <div
                className="heading-font text-sm font-black tracking-widest uppercase"
                style={{
                  background: "linear-gradient(135deg, #FF4A1A, #FFD700)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1,
                }}
              >
                ARENA
              </div>
              <div
                className="heading-font text-[10px] font-black tracking-widest uppercase"
                style={{ color: "#9AA3AD", lineHeight: 1 }}
              >
                MASTER
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255,215,0,0.1)",
                border: "1px solid rgba(255,215,0,0.2)",
              }}
            >
              <span className="text-xs">🪙</span>
              <span className="text-xs font-bold" style={{ color: "#FFD700" }}>
                {formatCoins(coins)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowNotifs(true)}
              className="p-0 bg-transparent border-none cursor-pointer"
            >
              <BellIcon count={unreadCount} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "home" && (
            <HomeTab
              tournaments={tournaments}
              coins={coins}
              wins={currentPlayer.wins}
              kills={currentPlayer.kills}
              rank={currentPlayer.rank}
              onJoin={handleJoinTournament}
            />
          )}
          {activeTab === "tournaments" && (
            <TournamentsTab
              tournaments={tournaments}
              coins={coins}
              onJoinTournament={handleJoinTournament}
            />
          )}
          {activeTab === "leaderboard" && <LeaderboardTab players={players} />}
          {activeTab === "wallet" && (
            <WalletTab
              coins={coins}
              transactions={transactions}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
            />
          )}
          {activeTab === "profile" && (
            <ProfileTab
              player={currentPlayer}
              tournaments={tournaments}
              onAdminOpen={() => setShowAdmin(true)}
            />
          )}
        </div>

        {/* Bottom Nav */}
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex"
          style={{
            background: "#0D1014",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            zIndex: 30,
          }}
        >
          {tabs.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`bottom-nav-item ${activeTab === t.id ? "active" : ""}`}
            >
              {t.icon(activeTab === t.id)}
              <span
                className="text-[10px] font-medium"
                style={{ color: activeTab === t.id ? "#FF4A1A" : "#666" }}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {showNotifs && (
        <NotificationsDrawer
          notifications={notifications}
          onRead={handleReadNotif}
          onReadAll={handleReadAllNotifs}
          onClose={() => setShowNotifs(false)}
        />
      )}
      {showAdmin && (
        <AdminPanel
          tournaments={tournaments}
          players={players}
          onClose={() => setShowAdmin(false)}
          onCreateTournament={handleCreateTournament}
          onAwardCoins={handleAwardCoins}
          onBanPlayer={handleBanPlayer}
          onBroadcast={handleBroadcast}
        />
      )}
    </div>
  );
}
