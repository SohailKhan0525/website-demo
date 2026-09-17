import Link from 'next/link';

const projects = [
  { year: '2026', name: 'Casa Sora', place: 'Algarve, PT', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', size: 'col-span-12 md:col-span-7' },
  { year: '2025', name: 'Mori House', place: 'Kyoto, JP', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85', size: 'col-span-12 md:col-span-5 md:mt-24' },
  { year: '2025', name: 'Atelier No. 08', place: 'Lisbon, PT', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85', size: 'col-span-12 md:col-span-8' },
  { year: '2024', name: 'North Light', place: 'Oslo, NO', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85', size: 'col-span-12 md:col-span-4 md:mt-24' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a09] text-[#f3f0e8] overflow-x-hidden">
      <header className="fixed top-0 inset-x-0 z-50 px-5 md:px-8 py-5 mix-blend-difference">
        <nav className="max-w-[1400px] mx-auto flex items-center justify-between text-sm">
          <Link href="#top" className="font-semibold tracking-[0.18em] uppercase">FORMA<span className="text-[#c9ff5a]">.</span></Link>
          <div className="hidden md:flex items-center gap-8 text-white/75">
            <Link href="#work" className="hover:text-white transition">Work</Link>
            <Link href="#studio" className="hover:text-white transition">Studio</Link>
            <Link href="#contact" className="hover:text-white transition">Contact</Link>
          </div>
          <Link href="#contact" className="rounded-full border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition">Start a project</Link>
        </nav>
      </header>

      <main id="top">
        <section className="min-h-screen relative flex items-end px-5 md:px-8 pb-14 md:pb-20 pt-32">
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_70%_30%,rgba(201,255,90,0.10),transparent_30%),linear-gradient(120deg,#11110f_0%,#0a0a09_55%,#171713_100%)]" />
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:80px_80px]" />
          <div className="relative max-w-[1400px] mx-auto w-full grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-9">
              <p className="text-xs uppercase tracking-[0.28em] text-[#c9ff5a] mb-7">Independent architecture studio · Lisbon / Kyoto</p>
              <h1 className="font-serif text-[clamp(4.5rem,12vw,11rem)] leading-[0.78] tracking-[-0.055em] max-w-5xl">Spaces that<br/><em className="text-white/55">stay with you.</em></h1>
            </div>
            <div className="md:col-span-3 md:pb-2">
              <p className="text-white/55 text-base leading-7 max-w-sm">FORMA creates quiet, enduring spaces where light, material and everyday rituals become architecture.</p>
              <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/50"><span className="w-10 h-px bg-[#c9ff5a]"/> Scroll to explore</div>
            </div>
          </div>
        </section>

        <section className="px-5 md:px-8 py-28 md:py-40 border-t border-white/10">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4"><span className="text-xs uppercase tracking-[0.25em] text-[#c9ff5a]">01 — Philosophy</span></div>
            <div className="md:col-span-8"><h2 className="font-serif text-4xl md:text-6xl leading-[1.02] tracking-tight max-w-4xl">We design for the moments between the photographs.</h2><p className="mt-8 text-lg leading-8 text-white/55 max-w-2xl">The morning light on a kitchen wall. The sound of a door closing. A room that feels different at dusk. Our work starts with these ordinary moments and turns them into places with a lasting sense of presence.</p></div>
          </div>
        </section>

        <section id="work" className="px-5 md:px-8 pb-32">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between mb-14"><div><span className="text-xs uppercase tracking-[0.25em] text-[#c9ff5a]">02 — Selected work</span><h2 className="font-serif text-5xl md:text-7xl mt-4 tracking-tight">A few places.</h2></div><span className="hidden md:block text-xs text-white/35">2024 — 2026</span></div>
            <div className="grid grid-cols-12 gap-x-5 gap-y-16">
              {projects.map((project) => <article key={project.name} className={project.size}><div className="group overflow-hidden bg-[#171715]"><img src={project.image} alt={`${project.name} architecture`} className="w-full aspect-[4/3] object-cover grayscale-[20%] group-hover:scale-[1.025] transition duration-1000 ease-out"/><div className="flex justify-between py-4 border-b border-white/15 text-xs uppercase tracking-[0.18em]"><span>{project.name}</span><span className="text-white/40">{project.place} · {project.year}</span></div></div></article>)}
            </div>
          </div>
        </section>

        <section id="studio" className="px-5 md:px-8 py-32 md:py-44 bg-[#dfe5d0] text-[#10110e]">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4"><span className="text-xs uppercase tracking-[0.25em] text-black/50">03 — Studio</span></div>
            <div className="md:col-span-8"><h2 className="font-serif text-5xl md:text-7xl leading-[.95] tracking-tight">Small studio.<br/>Long view.</h2><p className="mt-10 text-lg leading-8 max-w-2xl text-black/65">FORMA is an independent practice working across residential, hospitality and cultural spaces. We keep our team deliberately small so the same attention that shapes a sketch can stay present through construction.</p><div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-black/15 pt-8 text-sm"><div><strong className="block text-3xl font-serif">12</strong><span className="text-black/50">built projects</span></div><div><strong className="block text-3xl font-serif">08</strong><span className="text-black/50">countries</span></div><div><strong className="block text-3xl font-serif">14</strong><span className="text-black/50">years in practice</span></div></div></div>
          </div>
        </section>

        <section className="px-5 md:px-8 py-32 md:py-40">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4"><span className="text-xs uppercase tracking-[0.25em] text-[#c9ff5a]">04 — Services</span></div>
            <div className="md:col-span-8 grid md:grid-cols-2 gap-x-10 gap-y-12">
              {[['01','Architecture','From first principles to final detail, we design spaces that belong to their place.'],['02','Interiors','Material, furniture and light considered as one continuous language.'],['03','Hospitality','Distinctive guest experiences built around rhythm, atmosphere and memory.'],['04','Direction','A clear creative point of view for teams, brands and cultural projects.']].map(([n,t,d]) => <div key={n} className="border-t border-white/15 pt-5"><span className="text-xs text-[#c9ff5a]">{n}</span><h3 className="font-serif text-3xl mt-5">{t}</h3><p className="mt-4 text-white/50 leading-7">{d}</p></div>)}
            </div>
          </div>
        </section>

        <section className="px-5 md:px-8 py-28 border-y border-white/10 bg-[#10100f]">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-10"><div><span className="text-xs uppercase tracking-[0.25em] text-[#c9ff5a]">05 — Approach</span><h2 className="font-serif text-4xl md:text-6xl mt-4 max-w-3xl">Less, but considered all the way through.</h2></div><p className="text-white/45 leading-7 max-w-md">Every project begins with listening. We study the site, the light, the constraints and the people who will use the space. Then we remove everything that does not need to be there.</p></div>
        </section>

        <section id="contact" className="px-5 md:px-8 py-32 md:py-48">
          <div className="max-w-[1400px] mx-auto"><span className="text-xs uppercase tracking-[0.25em] text-[#c9ff5a]">06 — Contact</span><h2 className="font-serif text-[clamp(4rem,10vw,9rem)] leading-[.85] tracking-[-.04em] mt-7 max-w-6xl">Have a place<br/><em className="text-white/45">in mind?</em></h2><a href="mailto:studio@forma.example" className="inline-flex mt-12 text-xl md:text-2xl border-b border-[#c9ff5a] pb-2 hover:text-[#c9ff5a] transition">studio@forma.example</a><div className="mt-28 pt-6 border-t border-white/15 flex flex-col md:flex-row gap-4 justify-between text-xs uppercase tracking-[0.16em] text-white/35"><span>© 2026 FORMA Studio</span><span>Lisbon · Kyoto</span><span>Architecture / Interiors / Direction</span></div></div>
        </section>
      </main>
    </div>
  );
}
