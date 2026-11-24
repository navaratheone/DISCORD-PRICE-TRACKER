"use client";

import {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  Bell,
  ChevronDown,
  ExternalLink,
  Hash,
  Headphones,
  Inbox,
  LineChart,
  Menu,
  MessageCircle,
  Mic,
  Pause,
  Pin,
  Play,
  Plus,
  Search,
  Settings,
  Smile,
  Sticker,
  Users,
  Volume2,
} from "lucide-react";

/* Illustrative conversation; every frame is derived from one clock. */

const DESIGN_W = 1040;
const DESIGN_H = 540;
const PHONE = "(max-width: 768px)";

const URL_TEXT = "amazon.com/dp/B0C33XXL";

const T = {
  move: 600,
  click: 1350,
  slash: 1650,
  t1: 1820,
  t2: 1960,
  pick: 2350,
  urlStart: 2650,
  charMs: 52,
  enter: 4150,
  reply: 5450,
  away: 5900,
  typing1: 6500,
  jules: 8100,
  alert: 9700,
  react1: 10500,
  toFire: 11000,
  clickFire: 11800,
  eyes: 12300,
  typing2: 12900,
  copped: 14500,
  fade: 18000,
  loop: 18600,
};

type Cursor = "rest" | "composer" | "parked" | "aside" | "fire";

type Frame = {
  cursor: Cursor;
  down: boolean;
  focused: boolean;
  text: string;
  popup: "all" | "track" | null;
  command: boolean;
  url: string;
  live: number;
  thinking: boolean;
  typing: boolean;
  fire: number;
  mine: boolean;
  eyes: number;
  fading: boolean;
};

function frameAt(t: number): Frame {
  const between = (a: number, b: number) => t >= a && t < b;
  const cursor: Cursor =
    t < T.move
      ? "rest"
      : t < T.click + 380
        ? "composer"
        : t < T.away
          ? "parked"
          : t < T.toFire
            ? "aside"
            : t < T.fade
              ? "fire"
              : "aside";
  const typed = Math.max(0, Math.min(URL_TEXT.length, Math.floor((t - T.urlStart) / T.charMs)));
  return {
    cursor,
    down: between(T.click, T.click + 160) || between(T.clickFire, T.clickFire + 160),
    focused: t >= T.click,
    text: t < T.slash ? "" : t < T.t1 ? "/" : t < T.t2 ? "/t" : t < T.pick ? "/tr" : "",
    popup: between(T.slash, T.t1) ? "all" : between(T.t1, T.pick) ? "track" : null,
    command: between(T.pick, T.enter),
    url: between(T.pick, T.enter) ? URL_TEXT.slice(0, typed) : "",
    live: t >= T.copped ? 4 : t >= T.alert ? 3 : t >= T.jules ? 2 : t >= T.enter ? 1 : 0,
    thinking: between(T.enter, T.reply),
    typing: between(T.typing1, T.jules) || between(T.typing2, T.copped),
    fire: t >= T.clickFire + 90 ? 2 : t >= T.react1 ? 1 : 0,
    mine: t >= T.clickFire + 90,
    eyes: t >= T.eyes ? 1 : 0,
    fading: t >= T.fade || t < 320,
  };
}

const FINISHED: Frame = { ...frameAt(T.fade - 1), cursor: "aside", focused: false, typing: false };

const keyOf = (f: Frame) =>
  [f.cursor, f.down, f.focused, f.text, f.popup, f.command, f.url, f.live, f.thinking, f.typing, f.fire, f.mine, f.eyes, f.fading].join("|");

function subscribeToMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

const PEOPLE = {
  jules: { name: "jules", initials: "J", avatar: "#2f6f5b", role: "#7be0b4" },
  mara: { name: "mara", initials: "M", avatar: "#5b4a8a", role: "#c7a6ff" },
  plummet: { name: "Plummet", initials: "P", avatar: "#8a221c", role: "#e9ff7a" },
  rin: { name: "rin", initials: "R", avatar: "#7a4a2f", role: "#ff9f7a" },
  kai: { name: "kai", initials: "K", avatar: "#2f4a6f", role: "#8fd3ff" },
  noor: { name: "noor", initials: "N", avatar: "#4a5a2f", role: "#8fd3ff" },
};

type Person = keyof typeof PEOPLE;

function Avatar({ who, size = 36 }: { who: Person; size?: number }) {
  const p = PEOPLE[who];
  return (
    <span
      className="dc-avatar"
      style={{ width: size, height: size, background: p.avatar, fontSize: size * 0.42 } as CSSProperties}
    >
      {p.initials}
    </span>
  );
}

function Author({ who, time, app }: { who: Person; time: string; app?: boolean }) {
  return (
    <p className="dc-author">
      <b style={{ color: PEOPLE[who].role }}>{PEOPLE[who].name}</b>
      {app ? <span className="dc-app">App</span> : null}
      <time>Today at {time}</time>
    </p>
  );
}

function Message({
  who,
  time,
  children,
  app,
  above,
  mention,
}: {
  who: Person;
  time: string;
  children: ReactNode;
  app?: boolean;
  above?: ReactNode;
  mention?: boolean;
}) {
  return (
    <div className="dc-msg" data-mention={mention || undefined}>
      {above}
      <div className="dc-msg-row">
        <Avatar who={who} />
        <div className="dc-msg-body">
          <Author who={who} time={time} app={app} />
          {children}
        </div>
      </div>
    </div>
  );
}

function Embed({ tone, children }: { tone: "yellow" | "sky"; children: ReactNode }) {
  return (
    <div className="dc-embed" data-tone={tone}>
      {children}
    </div>
  );
}

function Fields({ items }: { items: [string, string, boolean?][] }) {
  return (
    <dl className="dc-fields">
      {items.map(([name, value, accent]) => (
        <div key={name}>
          <dt>{name}</dt>
          <dd data-accent={accent || undefined}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

const CHANNELS: { group: string; items: { name: string; voice?: boolean; unread?: boolean; active?: boolean }[] }[] = [
  { group: "Information", items: [{ name: "rules" }, { name: "announcements" }] },
  {
    group: "Deals",
    items: [{ name: "deal-alerts", active: true }, { name: "price-drops", unread: true }, { name: "restocks" }, { name: "general" }],
  },
  { group: "Voice", items: [{ name: "Lounge", voice: true }] },
];

const ServerChrome = memo(function ServerChrome() {
  return (
    <>
      <nav className="dc-rail">
        <span className="dc-guild dc-guild--home">
          <MessageCircle strokeWidth={2} />
        </span>
        <span className="dc-rail-rule" />
        <span className="dc-guild" data-active>
          DH
        </span>
        <span className="dc-guild">PC</span>
        <span className="dc-guild" data-badge="2">
          SW
        </span>
        <span className="dc-guild">GG</span>
        <span className="dc-guild dc-guild--add">
          <Plus strokeWidth={2} />
        </span>
      </nav>

      <aside className="dc-side">
        <header className="dc-side-head">
          <span>Deal Hunters HQ</span>
          <ChevronDown strokeWidth={2} />
        </header>
        <div className="dc-side-list">
          {CHANNELS.map((group) => (
            <div key={group.group} className="dc-group">
              <p className="dc-group-name">
                <ChevronDown strokeWidth={2.5} />
                {group.group}
              </p>
              {group.items.map((c) => (
                <p
                  key={c.name}
                  className="dc-channel"
                  data-active={c.active || undefined}
                  data-unread={c.unread || undefined}
                >
                  {c.voice ? <Volume2 strokeWidth={2} /> : <Hash strokeWidth={2} />}
                  {c.name}
                </p>
              ))}
              {group.group === "Voice" ? (
                <div className="dc-voice">
                  <p>
                    <Avatar who="jules" size={18} /> jules
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <footer className="dc-me">
          <span className="dc-me-avatar">
            <Avatar who="mara" size={30} />
            <i />
          </span>
          <span className="dc-me-name">
            <b>mara</b>
            <span>Online</span>
          </span>
          <span className="dc-me-tools">
            <Mic strokeWidth={2} />
            <Headphones strokeWidth={2} />
            <Settings strokeWidth={2} />
          </span>
        </footer>
      </aside>
    </>
  );
});

const ChannelHead = memo(function ChannelHead() {
  return (
    <header className="dc-chat-head">
      <span className="dc-chat-menu">
        <Menu strokeWidth={2} />
      </span>
      <Hash strokeWidth={2} className="dc-chat-hash" />
      <b>deal-alerts</b>
      <span className="dc-chat-topic">Drops and restocks, posted by Plummet</span>
      <span className="dc-chat-tools">
        <Bell strokeWidth={2} />
        <Pin strokeWidth={2} />
        <Users strokeWidth={2} />
        <span className="dc-search">
          Search
          <Search strokeWidth={2} />
        </span>
        <Inbox strokeWidth={2} />
      </span>
    </header>
  );
});

const MEMBERS: { title: string; people: { who: Person; note?: string; away?: boolean }[] }[] = [
  {
    title: "Online — 4",
    people: [{ who: "plummet", note: "Watching 12 products" }, { who: "rin" }, { who: "mara" }, { who: "jules", note: "In Lounge" }],
  },
  { title: "Offline — 2", people: [{ who: "kai", away: true }, { who: "noor", away: true }] },
];

const Members = memo(function Members() {
  return (
    <aside className="dc-members">
      {MEMBERS.map((group) => (
        <div key={group.title}>
          <p className="dc-members-title">{group.title}</p>
          {group.people.map(({ who, note, away }) => (
            <p key={who} className="dc-member" data-away={away || undefined}>
              <span className="dc-member-avatar">
                <Avatar who={who} size={32} />
                {away ? null : <i />}
              </span>
              <span className="dc-member-name">
                <span>
                  <b style={{ color: PEOPLE[who].role }}>{PEOPLE[who].name}</b>
                  {who === "plummet" ? <span className="dc-app">App</span> : null}
                </span>
                {note ? <small>{note}</small> : null}
              </span>
            </p>
          ))}
        </div>
      ))}
    </aside>
  );
});

const History = memo(function History() {
  return (
    <>
      <p className="dc-day">
        <span>October 25, 2026</span>
      </p>

      <Message who="jules" time="9:12 AM">
        <p className="dc-text">anyone watching the XM5s? amazon keeps running flash sales on them</p>
      </Message>

      <Message who="plummet" time="9:30 AM" app>
        <Embed tone="sky">
          <p className="dc-embed-kicker">Back in stock</p>
          <p className="dc-embed-title">PS5 Slim Bundle</p>
          <Fields items={[["Price", "$449.00"], ["Store", "Walmart"], ["Stock", "In stock"]]} />
        </Embed>
      </Message>
    </>
  );
});

export function DiscordDemo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const fireRef = useRef<HTMLButtonElement>(null);
  const listHeight = useRef(0);

  const [frame, setFrame] = useState<Frame>(FINISHED);
  const [scale, setScale] = useState(1);
  const [compact, setCompact] = useState(false);
  const [cursorAt, setCursorAt] = useState({ x: DESIGN_W - 60, y: DESIGN_H - 40 });
  const [onScreen, setOnScreen] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const pageShown = useSyncExternalStore(subscribeToVisibility, () => document.visibilityState === "visible", () => true);
  const playing = onScreen && pageShown && !paused && !reduced;
  const clock = useRef(T.fade - 1);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const phone = window.matchMedia(PHONE);
    const measure = () => {
      setCompact(phone.matches);
      setScale(phone.matches ? 1 : wrap.clientWidth / DESIGN_W);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    phone.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      phone.removeEventListener("change", measure);
    };
  }, []);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node || reduced) return;
    let frameId = 0;
    const apply = () => {
      frameId = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.55)));
      node.style.setProperty("--dc-tilt", `${(1 - p) * (compact ? 6 : 13)}deg`);
    };
    const onScroll = () => {
      if (!frameId) frameId = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frameId);
    };
  }, [reduced, compact]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    let key = "";
    if (clock.current === T.fade - 1) clock.current = T.fade;
    const tick = (now: number) => {
      clock.current += now - last;
      last = now;
      if (clock.current >= T.loop) clock.current = 0;
      const next = frameAt(clock.current);
      const k = keyOf(next);
      if (k !== key) {
        key = k;
        setFrame(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const box = stage.getBoundingClientRect();
    const s = compact ? 1 : scale;
    const at = (el: Element | null, fx: number, fy: number) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: (r.left - box.left + r.width * fx) / s, y: (r.top - box.top + r.height * fy) / s };
    };
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const spot =
      frame.cursor === "composer"
        ? at(composerRef.current, 0.16, 0.55)
        : frame.cursor === "parked"
          ? at(composerRef.current, 0.72, -1.6)
        : frame.cursor === "fire"
          ? at(fireRef.current, 0.55, 0.6)
          : frame.cursor === "aside"
            ? { x: w * 0.84, y: h * 0.42 }
            : { x: w * 0.92, y: h * 0.9 };
    if (spot) setCursorAt(spot);
  }, [frame.cursor, frame.live, frame.fire, scale, compact]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const next = list.offsetHeight;
    const grew = listHeight.current ? next - listHeight.current : 0;
    listHeight.current = next;
    if (grew <= 0 || reduced) return;
    list.animate([{ transform: `translateY(${grew}px)` }, { transform: "translateY(0)" }], {
      duration: 420,
      easing: "cubic-bezier(.2,.8,.2,1)",
      composite: "add",
    });
  }, [frame.live, frame.thinking, frame.fire, frame.eyes, reduced]);

  const f = frame;

  return (
    <figure className="dc-wrap" ref={wrapRef} data-compact={compact || undefined}>
      <figcaption className="sr-only">
        Illustrative recording: in the Deal Hunters HQ server, mara runs /track with an Amazon link, Plummet starts
        watching the Sony WH-1000XM5 at $349.99, and later posts a price-drop alert to #deal-alerts at $278.00.
      </figcaption>

      <div
        className="dc-window"
        data-fading={f.fading || undefined}
        style={{ "--dc-s": compact ? 1 : scale } as CSSProperties}
      >
        <div
          ref={stageRef}
          className="dc-stage"
          aria-hidden
          style={
            compact
              ? undefined
              : // zoom lays the client out at its scaled size, so its text rasterizes sharp inside the tilted window
                ({ width: DESIGN_W, height: DESIGN_H, zoom: scale } as CSSProperties)
          }
        >
          <div className="dc-titlebar">
            <span className="dc-lights">
              <i />
              <i />
              <i />
            </span>
            <span className="dc-title">Discord</span>
          </div>

          <div className="dc-app-body">
            <ServerChrome />

            <section className="dc-chat">
              <ChannelHead />

              <div className="dc-scroll">
                <div ref={listRef} className="dc-list">
                  <History />

                  {f.live >= 1 ? (
                    <Message
                      who="plummet"
                      time="9:41 AM"
                      app
                      above={
                        <p className="dc-used">
                          <span className="dc-used-curve" />
                          <Avatar who="mara" size={16} />
                          <b style={{ color: PEOPLE.mara.role }}>mara</b> used <span className="dc-used-cmd">/track</span>
                        </p>
                      }
                    >
                      {f.thinking ? (
                        <p className="dc-thinking">
                          Plummet is thinking
                          <span className="dc-dots">
                            <i />
                            <i />
                            <i />
                          </span>
                        </p>
                      ) : (
                        <div className="dc-landed">
                          <Embed tone="yellow">
                            <p className="dc-embed-kicker">Now tracking</p>
                            <p className="dc-embed-title">Sony WH-1000XM5 Wireless</p>
                            <Fields
                              items={[
                                ["Price", "$349.99"],
                                ["Stock", "In stock"],
                                ["Alerts", "drop · restock", true],
                              ]}
                            />
                            <p className="dc-embed-foot">Watch u7X2B3C · Amazon US</p>
                          </Embed>
                          <div className="dc-buttons">
                            <span className="dc-button">Set target</span>
                            <span className="dc-button">
                              <LineChart strokeWidth={2} />
                              Price history
                            </span>
                          </div>
                        </div>
                      )}
                    </Message>
                  ) : null}

                  {f.live >= 2 ? (
                    <Message who="jules" time="9:42 AM">
                      <p className="dc-text dc-landed">nice. ping us if it drops under $300</p>
                    </Message>
                  ) : null}

                  {f.live >= 3 ? (
                    <Message who="plummet" time="11:08 AM" app mention>
                      <div className="dc-landed">
                        <p className="dc-text">
                          <span className="dc-mention">@deal-hunters</span> price drop on a watched item
                        </p>
                        <Embed tone="yellow">
                          <p className="dc-embed-kicker">Price drop · Amazon</p>
                          <p className="dc-embed-title">Sony WH-1000XM5 Wireless</p>
                          <Fields
                            items={[
                              ["Was", "$349.99"],
                              ["Now", "$278.00", true],
                              ["Change", "−20%", true],
                            ]}
                          />
                        </Embed>
                        <div className="dc-buttons">
                          <span className="dc-button">
                            View deal
                            <ExternalLink strokeWidth={2} />
                          </span>
                          <span className="dc-button">Mute watch</span>
                        </div>
                        {f.fire > 0 ? (
                          <div className="dc-reactions">
                            <button ref={fireRef} type="button" tabIndex={-1} className="dc-reaction" data-mine={f.mine || undefined}>
                              <span>🔥</span>
                              <b>{f.fire}</b>
                            </button>
                            {f.eyes > 0 ? (
                              <span className="dc-reaction">
                                <span>👀</span>
                                <b>{f.eyes}</b>
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </Message>
                  ) : null}

                  {f.live >= 4 ? (
                    <Message who="jules" time="11:09 AM">
                      <p className="dc-text dc-landed">copped one 🎧 thanks plummet</p>
                    </Message>
                  ) : null}
                </div>
              </div>

              <div className="dc-compose">
                {f.popup ? (
                  <div className="dc-popup">
                    <p className="dc-popup-head">
                      <Avatar who="plummet" size={16} />
                      Plummet
                    </p>
                    <p className="dc-popup-row" data-on>
                      <b>/track</b>
                      <span>url</span>
                      <em>Start watching a product&apos;s price</em>
                    </p>
                    {f.popup === "all" ? (
                      <>
                        <p className="dc-popup-row">
                          <b>/watch</b>
                          <span>id</span>
                          <em>Tune a watch: target, alerts, channel</em>
                        </p>
                        <p className="dc-popup-row">
                          <b>/list</b>
                          <em>Your active watches</em>
                        </p>
                      </>
                    ) : null}
                  </div>
                ) : null}

                {f.command ? (
                  <p className="dc-hint">
                    <b>url</b> The product link to watch
                  </p>
                ) : null}

                <div ref={composerRef} className="dc-input" data-focused={f.focused || undefined}>
                  <Plus strokeWidth={2.2} className="dc-input-plus" />
                  <span className="dc-input-text">
                    {f.command ? (
                      <>
                        <span className="dc-cmd">/track</span>
                        <span className="dc-opt">url</span>
                        <span>{f.url}</span>
                      </>
                    ) : f.text ? (
                      <span>{f.text}</span>
                    ) : f.focused ? null : (
                      <span className="dc-placeholder">Message #deal-alerts</span>
                    )}
                    {f.focused && !f.fading ? <i className="dc-caret" /> : null}
                  </span>
                  <span className="dc-input-tools">
                    <Sticker strokeWidth={2} />
                    <Smile strokeWidth={2} />
                  </span>
                </div>

                <p className="dc-typing" data-on={f.typing || undefined}>
                  <span className="dc-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <b>jules</b> is typing…
                </p>
              </div>
            </section>

            <Members />
          </div>

          {reduced ? null : (
            <span
              className="dc-cursor"
              data-down={f.down || undefined}
              style={{ transform: `translate(${cursorAt.x}px, ${cursorAt.y}px)` } as CSSProperties}
            >
              <svg viewBox="0 0 16 22" width="16" height="22">
                <path
                  d="M1 1v17.2l4.3-4.1 2.8 6.6 2.9-1.2-2.8-6.5H14z"
                  fill="#000"
                  stroke="#fff"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>

        {reduced ? null : (
          <button
            type="button"
            className="dc-toggle"
            aria-label={paused ? "Play the demo recording" : "Pause the demo recording"}
            aria-pressed={paused}
            onClick={() => setPaused((v) => !v)}
          >
            {paused ? <Play strokeWidth={2} /> : <Pause strokeWidth={2} />}
          </button>
        )}
      </div>
    </figure>
  );
}
