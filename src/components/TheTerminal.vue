<template>
    <div class="terminal-wrap px-3" @click="focusInput">
        <div :class="['terminal', { 'terminal--light': theme === 'light' }]">
            <div class="terminal-bar">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
                <span class="bar-title">Martin Stewart <span class="title-dash">—</span><br class="title-break"> web designer &amp; developer</span>
                <button class="theme-toggle" @click.stop="toggleTheme" :class="{ 'is-light': theme === 'light' }" title="Toggle theme">
                    <i class="fas fa-moon"></i>
                    <span class="toggle-thumb"></span>
                    <i class="fas fa-sun"></i>
                </button>
            </div>
            <div class="terminal-body" ref="body">
                <div class="line" v-for="(line, i) in output" :key="i">
                    <span v-if="line.prompt" class="prompt">you@nuvmo&nbsp;❯&nbsp;</span>
                    <template v-if="line.selectable">
                        <span class="sel-arrow" :class="{ 'sel-arrow--on': selection.active && selection.id === line.selectionId && selection.current === line.selectIndex }">▸</span>
                        <span :class="['text', line.type, { 'sel-line-active': selection.active && selection.id === line.selectionId && selection.current === line.selectIndex }]" @click.stop="activateItem(line.selectIndex, line.selectionId, $event)" v-html="line.text"></span>
                    </template>
                    <span v-else :class="['text', line.type]" v-html="line.text"></span>
                </div>
                <div v-if="selection.active" class="sel-hint">{{ selHint }}</div>
                <div v-else class="input-line">
                    <span class="prompt">you@nuvmo&nbsp;❯&nbsp;</span>
                    <span class="typed">{{ current }}</span><span class="cursor" :class="{ 'cursor--focused': focused }"></span>
                </div>
            </div>
            <input
                ref="input"
                class="hidden-input"
                v-model="current"
                @keydown.enter="submit"
                @keydown.tab.prevent="tabComplete"
                @keydown.up.prevent="historyUp"
                @keydown.down.prevent="historyDown"
                @keydown.escape.prevent="escapeKey"
                @focus="focused = true"
                @blur="focused = false"
                autocomplete="off"
                autocapitalize="none"
                autocorrect="off"
                spellcheck="false"
                aria-hidden="true"
                tabindex="-1"
            />
        </div>
    </div>
</template>

<script>
const DATA = {
    experience: [
        { title: 'Web Team Manager',              place: 'University of Strathclyde',                  period: '2023 – present', desc: 'Leading the web team responsible for the university\'s digital presence.' },
        { title: 'Web Designer/Developer',        place: 'University of Strathclyde',                  period: '2018 – 2023',    desc: 'Design and front-end development across the university\'s web estate.' },
        { title: 'Web Designer/Developer',        place: 'BiP Solutions',                              period: '2015 – 2018',    desc: 'Web design and development for public sector procurement platforms.' },
        { title: 'Web Designer/Developer',        place: 'Edinburgh Bicycle Cooperative',              period: '2012 – 2015',    desc: 'E-commerce and web presence for a worker-owned cycling cooperative.' },
        { title: 'Web Designer/Developer',        place: 'Self Employed',                              period: '2011 – 2012',    desc: 'Freelance web design and development.' },
        { title: 'Educational Resources Tech.',   place: 'University of Glasgow',                      period: '2009 – 2011',    desc: 'Supported digital learning resources and the faculty web presence.' },
        { title: 'Multimedia Designer',           place: 'Self Employed',                              period: '2008 – 2009',    desc: 'Freelance multimedia and graphic design.' },
        { title: 'Assistant Producer',            place: 'R.A.W. Business Communications',             period: '2008',           desc: 'Video and corporate communications production.' },
        { title: 'Web Marketing Officer',         place: 'University of Glasgow',                      period: '2007',           desc: 'Online marketing and web presence for the university.' },
        { title: 'Education Projects Officer',    place: 'Scottish Screen',                            period: '2001 – 2007',    desc: 'Digital education projects for Scotland\'s national screen agency.' },
        { title: 'Event Assistant',               place: 'European Youth Film Festival of Flanders',   period: '2000 – 2001',    desc: 'Festival coordination and administration in Antwerp.' },
        { title: 'Runner',                        place: 'Scala Productions',                          period: '1999',           desc: 'Entry-level TV production in London.' },
    ],
    skills: {
        Frontend:  ['HTML', 'CSS / Sass', 'JavaScript', 'Vue'],
        Design:    ['Figma', 'UI / UX', 'Accessibility'],
        Tooling:    ['Vite', 'Git', 'Node.js', 'WordPress', 'PHP', 'DevOps', 'AI'],
        Leadership: ['Team Management', 'Mentoring'],
    },
    education: [
        { title: 'BSc Physics', place: 'University of Edinburgh', period: '1994 – 1998', desc: '' }
    ],
    projects: [
        { name: 'css-showcase',         desc: 'What\'s possible with modern CSS',                               url: '/css-showcase' },
        { name: 'ghosting',             desc: 'Squash ghosting training app',                     url: '/ghosting' },
        { name: 'word-map',             desc: 'See how any word translates across Europe',         url: '/word-map' },
        { name: 'photo-viewer',         desc: 'A clean, minimal photo gallery',                   url: '/photos' },
        { name: 'safe-plants-for-cats', desc: 'Browse houseplants safe for your cats',            url: '/safe-plants-for-cats' },
        { name: 'gifstori',             desc: 'Create and share stories with GIFs',               url: '/gifstori' },
        { name: 'squash-list',          desc: 'List of squash-related resources',                 url: '//squashlist.github.io', external: true },
    ],
    links: [
        { label: 'LinkedIn',   value: 'linkedin.com/in/martinmstewart', url: '//www.linkedin.com/in/martinmstewart/' },
        { label: 'GitHub',     value: 'github.com/nuvmo',               url: '//github.com/nuvmo' },
        { label: 'CodePen',    value: 'codepen.io/nuvmo',               url: '//codepen.io/nuvmo/' },
        { label: 'Soundcloud', value: 'soundcloud.com/nuvmo',           url: '//soundcloud.com/nuvmo' }
    ]
}

function renderExperience () {
    const lines = []
    DATA.experience.forEach(e => {
        lines.push(`<span class="accent">${e.title}</span>`)
        lines.push(`<span class="dim">${e.place} · ${e.period}</span>`)
        if (e.desc) lines.push(e.desc)
        lines.push('<span class="entry-gap"></span>')
    })
    return lines
}

function renderSkills () {
    const lines = []
    Object.entries(DATA.skills).forEach(([cat, items]) => {
        lines.push(`<span class="accent">${cat}</span>`)
        lines.push(`  ${items.join('  ·  ')}`)
        lines.push('<span class="entry-gap"></span>')
    })
    return lines
}

function renderEducation () {
    const lines = []
    DATA.education.forEach(e => {
        lines.push(`<span class="accent">${e.title}</span> — ${e.place} &nbsp;<span class="dim">${e.period}</span>`)
        if (e.desc) lines.push(e.desc)
        lines.push('<span class="entry-gap"></span>')
    })
    return lines
}

function renderProjects () {
    return DATA.projects.map(p => {
        const target = p.external ? ' target="_blank" rel="noopener noreferrer"' : ''
        return `<a class="terminal-link" href="${p.url}"${target}>${p.name}</a>  <span class="dim">${p.desc}</span>`
    })
}

function renderLinks () {
    return DATA.links.map(l =>
        `<span class="accent">${l.label}</span>  <a class="terminal-link" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.value}</a>`
    )
}

const COMMANDS = {
    help () {
        return [
            'Available commands:',
            '<span class="accent">experience</span>   — work history',
            '<span class="accent">skills</span>       — skill categories',
            '<span class="accent">education</span>    — academic background',
            '<span class="accent">projects</span>     — things I\'ve built',
            '<span class="accent">links</span>        — profiles &amp; socials',
            '<span class="accent">clear</span>        — clear the terminal',
        ]
    },
    experience: renderExperience,
    skills: renderSkills,
    education: renderEducation,
    projects: renderProjects,
    links: renderLinks
}

function getWelcome () {
    const touch = window.matchMedia('(pointer: coarse)').matches
    return [
        touch
            ? 'Type <span class="accent">help</span> for available commands.'
            : 'Type <span class="accent">help</span> for available commands. Use <span class="accent">Tab</span> to autocomplete.',
        ''
    ]
}

export default {
    name: 'TheTerminal',
    data () {
        return {
            theme: localStorage.getItem('theme') || 'dark',
            current: '',
            output: getWelcome().map(text => ({ text, type: 'info' })),
            history: [],
            historyIndex: -1,
            selection: { active: false, items: [], current: 0, id: 0 },
            selectionCounter: 0,
            focused: true,
            isTouch: window.matchMedia('(pointer: coarse)').matches
        }
    },
    computed: {
        selHint () {
            if (this.isTouch) return 'tap an item to open'
            const action = this.selection.items.length && this.selection.items[0].cmd ? 'run' : 'open'
            return `↑↓ navigate  ·  ↵ ${action}  ·  esc cancel`
        }
    },
    mounted () {
        this.$nextTick(() => this.$refs.input.focus())
        document.body.classList.toggle('theme-light', this.theme === 'light')
        this._onWinBlur  = () => { this.focused = false }
        this._onWinFocus = () => { this.focused = true }
        window.addEventListener('blur',  this._onWinBlur)
        window.addEventListener('focus', this._onWinFocus)
    },
    beforeUnmount () {
        window.removeEventListener('blur',  this._onWinBlur)
        window.removeEventListener('focus', this._onWinFocus)
    },
    methods: {
        toggleTheme () {
            this.theme = this.theme === 'dark' ? 'light' : 'dark'
            localStorage.setItem('theme', this.theme)
            document.body.classList.toggle('theme-light', this.theme === 'light')
            this.$nextTick(() => this.$refs.input.focus())
        },
        focusInput (e) {
            if (e.target.closest('a, button')) return
            this.$refs.input.focus()
        },
        activateItem (index, selectionId, event) {
            if (!this.selection.active) return
            if (selectionId !== this.selection.id) return
            if (event && event.target.closest('a')) return
            this.selection.current = index
            this.openSelected()
        },
        scrollToSelected () {
            this.$nextTick(() => {
                const el = this.$refs.body.querySelector('.sel-arrow--on')
                if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
            })
        },
        submit () {
            if (this.selection.active) {
                this.openSelected()
                return
            }

            const cmd = this.current.trim().toLowerCase()
            if (!cmd) return

            this.output.push({ prompt: true, text: cmd, type: 'cmd' })
            this.history.unshift(cmd)
            this.historyIndex = -1
            this.current = ''

            if (cmd === 'clear') {
                this.output = []
            } else if (cmd === 'help') {
                const lines = COMMANDS.help()
                this.output.push({ text: lines[0], type: 'out' })
                const cmdNames = ['experience', 'skills', 'education', 'projects', 'links', 'clear']
                const sid = ++this.selectionCounter
                lines.slice(1).forEach((text, i) => {
                    this.output.push({ text, type: 'out', selectable: true, selectIndex: i, selectionId: sid })
                    this.output.push({ text: '<span class="entry-gap"></span>', type: 'out' })
                })
                this.output.push({ text: '', type: 'out' })
                this.enterSelection(cmdNames.map(c => ({ label: c, cmd: c })), sid)
            } else if (cmd === 'projects') {
                const sid = ++this.selectionCounter
                renderProjects().forEach((text, i) => {
                    this.output.push({ text, type: 'out', selectable: true, selectIndex: i, selectionId: sid })
                    this.output.push({ text: '<span class="entry-gap"></span>', type: 'out' })
                })
                this.output.push({ text: '', type: 'out' })
                this.enterSelection(DATA.projects.map(p => ({ label: p.name, sublabel: p.desc, url: p.url, external: !!p.external })), sid)
            } else if (cmd === 'links') {
                const sid = ++this.selectionCounter
                renderLinks().forEach((text, i) => {
                    this.output.push({ text, type: 'out', selectable: true, selectIndex: i, selectionId: sid })
                    this.output.push({ text: '<span class="entry-gap"></span>', type: 'out' })
                })
                this.output.push({ text: '', type: 'out' })
                this.enterSelection(DATA.links.map(l => ({ label: l.label, sublabel: l.value, url: l.url, external: true })), sid)
            } else if (COMMANDS[cmd]) {
                const lines = COMMANDS[cmd]()
                lines.forEach(l => this.output.push({ text: l, type: 'out' }))
                this.output.push({ text: '', type: 'out' })
            } else {
                this.output.push({ text: `command not found: ${cmd}`, type: 'err' })
                this.output.push({ text: '', type: 'out' })
            }

            this.$nextTick(() => {
                const b = this.$refs.body
                b.scrollTop = b.scrollHeight
            })
        },
        enterSelection (items, id) {
            this.selection = { active: true, items, current: 0, id }
        },
        exitSelection () {
            this.selection = { active: false, items: [], current: 0, id: 0 }
            this.$nextTick(() => this.$refs.input.focus())
        },
        openSelected () {
            const item = this.selection.items[this.selection.current]
            if (item.cmd) {
                this.exitSelection()
                this.current = item.cmd
                this.submit()
                return
            }
            const url = item.url.startsWith('//') ? 'https:' + item.url : item.url
            if (item.external || item.url.startsWith('//')) {
                window.open(url, '_blank', 'noopener,noreferrer')
            } else {
                window.location.href = url
            }
            this.exitSelection()
        },
        escapeKey () {
            if (this.selection.active) this.exitSelection()
        },
        tabComplete () {
            const cmd = this.current.toLowerCase()
            const allCommands = [...Object.keys(COMMANDS), 'clear']
            const matches = cmd === '' ? allCommands : allCommands.filter(c => c.startsWith(cmd))

            if (matches.length === 0) return

            if (matches.length === 1) {
                this.current = matches[0]
                return
            }

            // Complete to longest common prefix if it extends beyond what's typed
            const prefix = matches.reduce((acc, c) => {
                let i = 0
                while (i < acc.length && i < c.length && acc[i] === c[i]) i++
                return acc.slice(0, i)
            })

            if (prefix.length > cmd.length) {
                this.current = prefix
                return
            }

            // No further prefix — show all matches
            this.output.push({ text: matches.map(m => `<span class="accent">${m}</span>`).join('    '), type: 'out' })
            this.$nextTick(() => { this.$refs.body.scrollTop = this.$refs.body.scrollHeight })
        },
        historyUp () {
            if (this.selection.active) {
                this.selection.current = (this.selection.current - 1 + this.selection.items.length) % this.selection.items.length
                this.scrollToSelected()
                return
            }
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++
                this.current = this.history[this.historyIndex]
            }
        },
        historyDown () {
            if (this.selection.active) {
                this.selection.current = (this.selection.current + 1) % this.selection.items.length
                this.scrollToSelected()
                return
            }
            if (this.historyIndex > 0) {
                this.historyIndex--
                this.current = this.history[this.historyIndex]
            } else {
                this.historyIndex = -1
                this.current = ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

@keyframes slide-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
}

.terminal-wrap {
    width: 100%;
    max-width: 900px;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    animation: slide-up 0.5s 0.1s both;
    cursor: text;
}

.terminal {
    // Dark skin — all values verified ≥ 4.5:1 against #0d1117 (body) or bar bg
    --t-bg:         #0d1117;
    --t-bar-bg:     #13181f;                // bar sits slightly lighter than body
    --t-bar-border: #1e2530;
    --t-border:     #1e2530;
    --t-text:       #dfdfdf;               // 14.4:1 ✓
    --t-info:       #a3a8b0;               // 7.9:1 ✓
    --t-title:      #8b9099;               // 5.9:1 on body / 5.3:1 on bar ✓
    --t-prompt:     #28c840;               // 8.5:1 ✓
    --t-accent:     #4a8fc4;               // 5.5:1 ✓  (was #376fa4 → 3.6:1 ✗)
    --t-dim:        #8b9099;               // 5.9:1 ✓  (was rgba(…0.35) → 2.7:1 ✗)
    --t-err:        #ff5f57;               // 6.4:1 ✓
    --t-link:       #4a8fc4;               // 5.5:1 ✓
    --t-link-hover: #6aafd8;               // 8.0:1 ✓
    --t-cursor:     #dfdfdf;
    --t-scrollbar:  #2a3040;

    &.terminal--light {
        // Light skin — all values verified ≥ 4.5:1 against #f7f3ee (body) or bar bg
        --t-bg:         #f7f3ee;
        --t-bar-bg:     #ede9e4;           // slightly darker than body
        --t-bar-border: #d8d3cd;
        --t-border:     #d8d3cd;
        --t-text:       #2c2c2c;           // 12.5:1 ✓
        --t-info:       #6a6a6a;           // 4.9:1 ✓  (was rgba(…0.65) → 4.4:1 ✗)
        --t-title:      #666666;           // 4.8:1 on bar ✓  (was rgba(…0.4) → 2.3:1 ✗)
        --t-prompt:     #2a7437;           // 5.2:1 ✓
        --t-accent:     #1a5f8a;           // 6.2:1 ✓
        --t-dim:        #6e6e6e;           // 4.6:1 ✓  (was rgba(…0.4) → 2.3:1 ✗)
        --t-err:        #c0392b;           // 4.9:1 ✓
        --t-link:       #1a5f8a;           // 6.2:1 ✓
        --t-link-hover: #2471a3;           // 4.8:1 ✓
        --t-cursor:     #2c2c2c;
        --t-scrollbar:  #c8c3bd;
    }

    display: flex;
    flex-direction: column;
    flex: 1;
    background: var(--t-bg);
    border: 1px solid var(--t-border);
    border-radius: 12px;
    overflow: hidden;
    font-family: ui-monospace, 'Cascadia Code', 'Fira Code', Menlo, monospace;
    font-size: 0.85rem;
    transition: background 0.25s, border-color 0.25s;
}

.terminal-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    background: var(--t-bar-bg);
    border-bottom: 1px solid var(--t-bar-border);
    flex-shrink: 0;
    transition: background 0.25s, border-color 0.25s;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;

    &.dot-red    { background: #ff5f57; }
    &.dot-yellow { background: #febc2e; }
    &.dot-green  { background: #28c840; }
}

.bar-title {
    flex: 1;
    text-align: center;
    color: var(--t-title);
    font-size: 0.72rem;
    transition: color 0.25s;

    .title-break, .title-dash { display: none; }

    @media (max-width: 540px) {
        .title-break { display: block; }
        .title-dash  { display: none; }
    }

    @media (min-width: 541px) {
        .title-dash { display: inline; }
    }
}

.theme-toggle {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--t-bg);
    border: 1px solid var(--t-bar-border);
    border-radius: 999px;
    padding: 3px;
    cursor: pointer;
    transition: border-color 0.25s, background 0.25s;

    i {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.65rem;
        position: relative;
        z-index: 1;
        transition: color 0.25s;
    }

    .fa-moon { color: var(--t-bg); }
    .fa-sun  { color: var(--t-dim); }

    .toggle-thumb {
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--t-text);
        left: 3px;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.25s;
    }

    &.is-light {
        .toggle-thumb { transform: translateX(18px); }
        .fa-moon { color: var(--t-dim); }
        .fa-sun  { color: var(--t-bg); }
    }

    &:hover { border-color: var(--t-dim); }
}

.terminal-body {
    flex: 1;
    padding: 16px 20px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
    color: var(--t-text);
    line-height: 1.7;
    transition: color 0.25s;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: var(--t-scrollbar); border-radius: 2px; }
}

.line {
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;

    .text {
        &.err  { color: var(--t-err); }
        &.info { color: var(--t-info); }
    }
}

.input-line {
    display: flex;
    align-items: center;
}

.sel-arrow {
    display: inline-block;
    width: 1.4em;
    color: transparent;
    transition: color 0.1s;
    user-select: none;

    &--on { color: var(--t-accent); }

    @media (pointer: coarse) { display: none; }
}

.sel-line-active {
    color: var(--t-text);

    :deep(a.terminal-link) { color: var(--t-text); }
    :deep(.dim)            { color: var(--t-text); }
}

.sel-hint {
    color: var(--t-dim);
    font-size: 0.8em;
    padding-left: 1.4em;
    margin-top: 2px;
}


.prompt {
    color: var(--t-prompt);
    flex-shrink: 0;
    transition: color 0.25s;
}

.typed {
    white-space: pre;
}

.cursor {
    display: inline-block;
    width: 8px;
    height: 1.1em;
    background: var(--t-cursor);
    vertical-align: text-bottom;
    transition: background 0.25s;

    &--focused { animation: blink 1s step-start infinite; }
}

.hidden-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
}

:deep(.accent)     { color: var(--t-accent); }
:deep(.dim)        { color: var(--t-dim); }
:deep(.entry-gap)  { display: block; height: 0.6em; }
:deep(a.terminal-link) {
    color: var(--t-link);
    text-decoration: none;
    &:hover { text-decoration: underline; color: var(--t-link-hover); }
}
</style>
