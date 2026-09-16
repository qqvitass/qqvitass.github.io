import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, Check, ChevronDown, Clock3, Copy, FileText, GraduationCap, Image as ImageIcon, Layers3, Mail, Menu, Phone, Play, Sparkles, X } from "lucide-react";

const works = {
  detail: { title: "鲜活水 Pro+ 详情页", type: "详情页设计", image: "/works/detail.webp", original: "/works/detail-original.jpg", process: "/works/process-detail.png" },
  daily: { title: "日常净水首页", type: "分会场首页", image: "/works/daily.webp", original: "/works/daily-original.png", process: "/works/process-daily.png" },
  campaign: { title: "双11净水分会场", type: "大促首页", image: "/works/campaign.webp", original: "/works/campaign-original.png", process: "/works/process-campaign.png" },
};

const gallery = [
  ["前置促销", "详情页关联", "/works/promo-1.webp"], ["前置促销", "鲜活水产品对比", "/works/promo-2.webp"],
  ["推广图", "自然水境", "/works/poster-1.webp"], ["推广图", "极光净水", "/works/poster-2.webp"],
  ["推广图", "高端家居", "/works/poster-3.webp"], ["推广图", "生活场景", "/works/poster-4.webp"],
  ["直播间", "618直播间", "/works/live-1.webp"], ["直播间", "开学季直播间", "/works/live-2.webp"], ["直播间", "年货节直播间", "/works/live-3.webp"],
  ["主图", "鲜活水净水器", "/works/main-1.webp"], ["主图", "台式饮水设备", "/works/main-2.webp"], ["主图", "前置过滤器", "/works/main-3.webp"], ["主图", "全屋净水套装", "/works/main-4.webp"],
].map(([category, title, image], index) => ({ id: index + 1, category, title, image }));

function FadingVideo({ src, className = "" }) {
  const videoRef = useRef(null), rafRef = useRef(0), timerRef = useRef(0), fadingOutRef = useRef(false);
  useEffect(() => {
    const video = videoRef.current, FADE_MS = 500, FADE_OUT_LEAD = .55;
    const fadeTo = (target, duration = FADE_MS) => {
      cancelAnimationFrame(rafRef.current);
      const from = Number.parseFloat(video.style.opacity) || 0, start = performance.now();
      const tick = now => { const p = Math.min((now - start) / duration, 1); video.style.opacity = String(from + (target - from) * p); if (p < 1) rafRef.current = requestAnimationFrame(tick); };
      rafRef.current = requestAnimationFrame(tick);
    };
    const play = () => video.play().catch(() => {});
    const loaded = () => { video.style.opacity = "0"; play(); fadeTo(1); };
    const update = () => { const remaining = video.duration - video.currentTime; if (!fadingOutRef.current && remaining <= FADE_OUT_LEAD && remaining > 0) { fadingOutRef.current = true; fadeTo(0); } };
    const ended = () => { video.style.opacity = "0"; timerRef.current = window.setTimeout(() => { video.currentTime = 0; play(); fadingOutRef.current = false; fadeTo(1); }, 100); };
    video.addEventListener("loadeddata", loaded); video.addEventListener("timeupdate", update); video.addEventListener("ended", ended); if (video.readyState >= 2) loaded();
    return () => { cancelAnimationFrame(rafRef.current); clearTimeout(timerRef.current); video.removeEventListener("loadeddata", loaded); video.removeEventListener("timeupdate", update); video.removeEventListener("ended", ended); };
  }, [src]);
  return <video ref={videoRef} className={`fading-video ${className}`} src={src} muted autoPlay playsInline preload="auto" style={{ opacity: 0 }} />;
}

function BlurText({ children, className = "", delay = 0 }) {
  const ref = useRef(null), inView = useInView(ref, { once: true, amount: .1 }), reduced = useReducedMotion();
  return <span ref={ref} className={`blur-text ${className}`} aria-label={children}>{Array.from(children).map((char, index) => <motion.span key={`${char}-${index}`} aria-hidden="true" initial={reduced ? false : { filter: "blur(10px)", opacity: 0, y: 50 }} animate={inView ? { filter: ["blur(10px)", "blur(5px)", "blur(0px)"], opacity: [0, .5, 1], y: [50, -5, 0] } : undefined} transition={{ duration: reduced ? 0 : .7, times: [0, .5, 1], delay: reduced ? 0 : delay + index * .045, ease: "easeOut" }}>{char === " " ? "\u00a0" : char}</motion.span>)}</span>;
}

function Reveal({ children, className = "", delay = 0, amount = .12 }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { filter: "blur(10px)", opacity: 0, y: 20 }} whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }} viewport={{ once: true, amount }} transition={{ duration: reduced ? 0 : .7, delay: reduced ? 0 : delay, ease: "easeOut" }}>{children}</motion.div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [["首页", "#home"], ["关于", "#about"], ["作品", "#works"], ["设计过程", "#process"], ["联系", "#contact"]];
  return <header className="site-header"><a className="monogram liquid-glass" href="#home" aria-label="返回首页">x</a><nav className="desktop-nav liquid-glass" aria-label="主要导航">{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}<a className="claim" href="#contact">联系我 <ArrowUpRight size={16} /></a></nav><span className="nav-balance" /><button className="mobile-menu liquid-glass" onClick={() => setOpen(!open)} aria-label={open ? "关闭导航" : "打开导航"} aria-expanded={open}>{open ? <X /> : <Menu />}</button>{open && <nav className="mobile-panel liquid-glass" aria-label="手机导航">{links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}</nav>}</header>;
}

function Hero() {
  return <section id="home" className="hero section-video"><FadingVideo src="/media/hero.mp4" className="hero-video" /><Header /><div className="hero-content"><Reveal delay={.35}><div className="badge liquid-glass"><span>徐德明</span><p>AI电商设计师 · AI E-commerce Designer</p></div></Reveal><h1><BlurText delay={.45}>让产品的价值</BlurText><br /><BlurText delay={.78}>被看见。</BlurText></h1><Reveal className="hero-copy" delay={.9}><p>从卖点梳理到视觉呈现，把商业需求转化为清晰、有吸引力的电商设计。</p></Reveal><Reveal className="hero-actions" delay={1.05}><a href="#works" className="primary liquid-glass-strong">查看精选作品 <ArrowUpRight size={19} /></a><a href="#process" className="text-action">了解设计过程 <Play size={14} fill="currentColor" /></a></Reveal><Reveal className="hero-stats" delay={1.2}><div className="stat liquid-glass"><Clock3 size={28} /><div><strong>9 年</strong><span>职场经验</span></div></div><div className="stat liquid-glass"><BriefcaseBusiness size={28} /><div><strong>4 年</strong><span>专注平面与电商视觉</span></div></div></Reveal></div><Reveal className="hero-footer" delay={1.35}><span className="liquid-glass">视觉策划 × AI视觉呈现 × 电商落地</span><div><i>Strategy</i><i>AI Visual</i><i>E-commerce</i><i>Brand</i></div></Reveal><a className="scroll-hint" href="#about" aria-label="向下查看个人介绍"><ChevronDown /></a></section>;
}

function WorkCard({ workKey, icon: Icon, tags, title, copy, onOpen }) {
  const work = works[workKey];
  return <article className="work-card liquid-glass" onClick={() => onOpen(workKey)} tabIndex="0" onKeyDown={e => e.key === "Enter" && onOpen(workKey)}><img src={work.image} alt={`${work.title}作品预览`} /><div className="card-top"><span className="card-icon liquid-glass"><Icon /></span><div className="tag-row">{tags.map(t => <span className="liquid-glass" key={t}>{t}</span>)}</div></div><div className="card-copy"><p>{work.type}</p><h3>{title}</h3><span>{copy}</span><button aria-label={`查看${title}`}>查看案例 <ArrowUpRight size={18} /></button></div></article>;
}

function Works({ onOpen }) {
  return <section id="works" className="works section-video"><FadingVideo src="/media/capabilities.mp4" /><div className="works-inner"><Reveal className="works-title"><p>// Selected Works</p><h2><BlurText>设计</BlurText><br /><BlurText delay={.15}>服务价值</BlurText></h2></Reveal><div className="work-grid"><WorkCard workKey="detail" icon={FileText} tags={["卖点梳理", "视觉叙事", "长页设计", "科技表达"]} title="净水科技表达" copy="把流量、过滤与使用体验，转化为容易理解的视觉内容。" onOpen={onOpen} /><WorkCard workKey="daily" icon={Layers3} tags={["品牌形象", "品类导航", "商品层级", "日常运营"]} title="日常净水首页" copy="组织品牌、权益、品类与主销商品，建立清楚的导购路径。" onOpen={onOpen} /><WorkCard workKey="campaign" icon={Sparkles} tags={["大促氛围", "优惠层级", "商品矩阵", "活动视觉"]} title="双11分会场" copy="在高密度促销信息中，保持活动氛围与阅读顺序。" onOpen={onOpen} /></div></div></section>;
}

const cases = [
  { key: "detail", no: "01", kicker: "Haier · Product Detail", heading: "把复杂的净水科技，转化为日常可理解的价值。", lead: "围绕出水速度、净化能力、使用成本和日常操作，将技术参数组织成用户容易理解的内容。", facts: ["3.67L/min 大流量", "进口生态膜", "80%以上产水率", "智慧屏显龙头"], flow: "首屏利益点 → 六大升级 → 流量与净化 → 家庭安全 → 使用体验 → 服务参数" },
  { key: "daily", no: "02", kicker: "Haier · Daily Homepage", heading: "从品牌印象到商品选择，建立清晰的日常导购路径。", lead: "用冰川水景建立净水联想，以权益和品类入口连接多种商品，让用户更快找到适合自己的产品。", facts: ["品牌主视觉", "购物权益", "六类品类导航", "主销商品"], flow: "认识海尔净水 → 了解购物权益 → 选择品类 → 比较主销商品" },
  { key: "campaign", no: "03", kicker: "Haier · 11.11 Campaign", heading: "用统一的活动视觉，组织高密度促销信息。", lead: "以红色活动主色、层叠展台和产品群组串联时间、优惠、分类和商品，形成连续浏览节奏。", facts: ["活动主题", "时间节奏", "优惠权益", "商品分层"], flow: "认识活动 → 看懂优惠 → 进入品类 → 查看主销商品 → 对比推荐" },
];

function CaseStudy({ item, onImage }) {
  const work = works[item.key]; const [showProcess, setShowProcess] = useState(false);
  return <article id={`case-${item.key}`} className="case-study"><Reveal className="case-heading"><span>{item.no}</span><div><p>{item.kicker}</p><h3>{item.heading}</h3><div className="case-lead">{item.lead}</div></div></Reveal><div className="case-layout"><Reveal className="case-visual"><button onClick={() => onImage(work.original, work.title)}><img src={work.image} alt={`${work.title}首屏`} /><span className="liquid-glass">查看完整作品 <ArrowUpRight size={17} /></span></button></Reveal><Reveal className="case-analysis" delay={.1}><p className="mini-title">内容拆解</p><div className="fact-grid">{item.facts.map((fact, i) => <span key={fact}><b>0{i + 1}</b>{fact}</span>)}</div><p className="mini-title">信息结构</p><p className="flow-copy">{item.flow}</p><button className="process-toggle liquid-glass-strong" onClick={() => setShowProcess(!showProcess)}>{showProcess ? "收起设计复盘" : "查看设计复盘"} <ArrowUpRight size={18} /></button></Reveal></div>{showProcess && <motion.div className="process-board" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}><div><span>设计复盘示意</span><p>根据最终成稿整理，用于说明信息结构与构图思路。</p></div><img src={work.process} alt={`${work.title}设计复盘示意`} onError={e => e.currentTarget.closest(".process-board").classList.add("process-missing")} /><div className="process-placeholder"><ImageIcon /><p>设计复盘图正在生成</p></div></motion.div>}</article>;
}

function ProcessAmbientBackground() {
  return <div className="case-ambient-background" aria-hidden="true"><div className="case-ambient-sticky"><span className="case-ambient-glow case-ambient-glow-one" /><span className="case-ambient-glow case-ambient-glow-two" /><span className="case-ambient-glow case-ambient-glow-three" /></div></div>;
}

function ProcessAndCases({ onImage }) { return <section id="process" className="case-section"><ProcessAmbientBackground /><div className="case-intro"><Reveal><p>// Case Study</p><h2>从问题出发<br /><em>走到画面</em></h2></Reveal><Reveal delay={.1}><p>以下分析基于真实成稿整理。过程图明确标注为“设计复盘示意”，用来说明信息结构与构图思路。</p></Reveal></div>{cases.map(item => <CaseStudy key={item.key} item={item} onImage={onImage} />)}</section>; }

function Gallery({ onImage }) {
  const [filter, setFilter] = useState("全部"), filters = ["全部", "前置促销", "推广图", "直播间", "主图"];
  const shown = useMemo(() => filter === "全部" ? gallery : gallery.filter(item => item.category === filter), [filter]);
  return <section className="gallery-section"><Reveal className="gallery-head"><div><p>// Visual Extension</p><h2>视觉延展</h2></div><div className="filters liquid-glass">{filters.map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></Reveal><motion.div layout className="gallery-grid">{shown.map(item => <motion.button layout key={item.id} onClick={() => onImage(item.image, item.title)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}><img src={item.image} alt={item.title} /><span><b>{item.title}</b><small>{item.category}</small></span></motion.button>)}</motion.div></section>;
}

function PortraitSpotlight() {
  const portraitRef = useRef(null);
  const handlePointerMove = event => {
    if (event.pointerType === "touch") return;
    const portrait = portraitRef.current;
    if (!portrait) return;
    const { left, top } = portrait.getBoundingClientRect();
    portrait.style.setProperty("--mouse-x", `${event.clientX - left}px`);
    portrait.style.setProperty("--mouse-y", `${event.clientY - top}px`);
  };
  return <div ref={portraitRef} className="about-portrait portrait-spotlight liquid-glass" onPointerMove={handlePointerMove}><img src="/media/xudeming-portrait.png" alt="徐德明个人自拍照" /></div>;
}

function ContactBorderGlow({ children }) {
  const cardRef = useRef(null);
  const handlePointerMove = event => {
    if (event.pointerType === "touch") return;
    const card = cardRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = event.clientX - left, y = event.clientY - top;
    const dx = x - width / 2, dy = y - height / 2;
    const kx = dx === 0 ? Infinity : width / 2 / Math.abs(dx);
    const ky = dy === 0 ? Infinity : height / 2 / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;
    card.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  };
  return <div id="contact" ref={cardRef} className="contact-card contact-border-glow" onPointerMove={handlePointerMove}><span className="contact-edge-light" aria-hidden="true" />{children}</div>;
}

function About() {
  const [copied, setCopied] = useState("");
  const copy = async (value, label) => {
    let success = false;
    try {
      await navigator.clipboard.writeText(value);
      success = true;
    } catch {
      const input = document.createElement("textarea");
      input.value = value;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      success = document.execCommand("copy");
      input.remove();
    }
    setCopied(success ? label : `${label}-error`);
    setTimeout(() => setCopied(""), 1600);
  };
  return <section id="about" className="about section-video"><FadingVideo src="/media/hero.mp4" /><div className="about-inner"><Reveal><p>// About Me</p><h2>设计<br /><em>持续进化</em></h2><PortraitSpotlight /></Reveal><Reveal className="about-copy" delay={.1}><p className="manifesto">我是徐德明，艺术设计专业毕业。我喜欢从产品和用户出发，把复杂的卖点整理清楚，再用合适的视觉让它更容易被理解。</p><p>商业项目的积累，让我重视画面的表现，也重视信息是否清晰、设计能否真正落地。我持续探索AI与设计的结合，希望通过新的创作方式，完成更多设计突破。</p><div className="bio-grid"><span><GraduationCap />本科 · 艺术设计<br /><small>广东财经大学华商学院</small></span><span><BriefcaseBusiness />AI电商设计师<br /><small>美的08空间 · 万翼电商</small></span><span className="ai-tools"><Sparkles />擅长AI软件：<small>PS-AI / GPT / CODEX / CLAUDE-CODE / GMINI / LOVART / DEEPSEEK / 即梦 / 豆包</small></span><span><Sparkles />平面 / 电商视觉设计<br /><small>4年设计学习与沉淀</small></span></div></Reveal></div><ContactBorderGlow><div><p>期待与你创造下一个作品</p><h3>Let’s create<br /><em>what’s next.</em></h3></div><div className="contact-actions"><a href="tel:13189434036"><Phone />131 8943 4036</a><button onClick={() => copy("13189434036", "phone")} aria-label={copied === "phone" ? "已复制电话" : copied === "phone-error" ? "电话复制失败，请手动选择号码" : "复制电话"}>{copied === "phone" ? <Check /> : copied === "phone-error" ? <X /> : <Copy />}</button><a href="mailto:1915982409@qq.com"><Mail />1915982409@qq.com</a><button onClick={() => copy("1915982409@qq.com", "mail")} aria-label={copied === "mail" ? "已复制邮箱" : copied === "mail-error" ? "邮箱复制失败，请手动选择地址" : "复制邮箱"}>{copied === "mail" ? <Check /> : copied === "mail-error" ? <X /> : <Copy />}</button></div></ContactBorderGlow><footer><span>徐德明 · AI电商设计师</span><span>视觉策划 / AI视觉呈现 / 电商落地</span></footer></section>;
}

function Lightbox({ state, onClose }) {
  useEffect(() => { document.body.style.overflow = state ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [state]);
  useEffect(() => { const esc = e => e.key === "Escape" && onClose(); window.addEventListener("keydown", esc); return () => window.removeEventListener("keydown", esc); }, [onClose]);
  if (!state) return null;
  return <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="dialog" aria-modal="true" aria-label={state.title} onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="lightbox-bar liquid-glass"><span>{state.title}</span><button onClick={onClose} aria-label="关闭预览"><X /></button></div><img src={state.src} alt={state.title} /></motion.div>;
}

export function App() {
  const [lightbox, setLightbox] = useState(null);
  const openImage = (src, title) => setLightbox({ src, title });
  const openCase = key => document.getElementById(`case-${key}`)?.scrollIntoView({ behavior: "smooth" });
  return <><main><Hero /><About /><Works onOpen={openCase} /><ProcessAndCases onImage={openImage} /><Gallery onImage={openImage} /></main><Lightbox state={lightbox} onClose={() => setLightbox(null)} /></>;
}

