<template>
    <div class="terminal-wrap px-3" @click="focusInput">
        <div :class="['terminal', skinClass]">
            <div class="terminal-bar">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
                <span class="bar-title">Martin Stewart <span class="title-dash">—</span><br class="title-break"> web designer &amp; developer</span>
            </div>
            <div class="terminal-body" ref="body">
                <div v-if="loading" :class="['boot-screen', { 'boot-screen--fading': bootFading }]">
                    <div class="boot-header">NUVMO TERMINAL <span class="boot-ver">v1.0.0</span></div>
                    <div class="boot-sep">────────────────────────────────────────</div>
                    <div class="boot-item" v-for="(item, i) in bootItems.slice(0, bootVisibleCount)" :key="i">
                        <span class="boot-item-label">{{ item.label }}...</span>
                        <span class="boot-ok" v-if="item.done">&nbsp;OK</span>
                        <span class="boot-pending" v-else>{{ bootSpinnerChar }}</span>
                    </div>
                    <div class="boot-progress-line" v-if="bootProgress > 0" v-html="bootProgressDisplay"></div>
                    <div class="boot-ready" v-if="bootReady">SYSTEM READY.</div>
                </div>
                <template v-else>
                    <div class="line" v-for="(line, i) in output" :key="i">
                        <span v-if="line.prompt" class="prompt">you@nuvmo&nbsp;❯&nbsp;</span>
                        <template v-if="line.selectable">
                            <span class="sel-arrow" :class="{ 'sel-arrow--on': selection.active && selection.id === line.selectionId && selection.current === line.selectIndex }">▸</span>
                            <span :class="['text', line.type, { 'sel-line-active': selection.active && selection.id === line.selectionId && selection.current === line.selectIndex }]" @click.stop="activateItem(line.selectIndex, line.selectionId, $event)" v-html="line.text"></span>
                        </template>
                        <span v-else :class="['text', line.type]" v-html="line.text"></span>
                    </div>
                    <template v-if="cmdAnim.active">
                        <div class="cmd-anim-line">
                            <span class="cmd-anim-arrow">▸&nbsp;</span>
                            <span class="cmd-anim-label">{{ cmdAnim.label }}...</span>
                            <span class="cmd-anim-bar" v-html="cmdAnimBar"></span>
                            <span class="cmd-anim-spinner">{{ cmdAnimSpinnerChar }}</span>
                        </div>
                    </template>
                    <template v-else>
                        <div v-if="selection.active" class="sel-hint" v-html="selHint"></div>
                        <div v-else class="input-line">
                            <span class="prompt">you@nuvmo&nbsp;❯&nbsp;</span>
                            <span class="typed">{{ current }}</span><span class="cursor" :class="{ 'cursor--focused': focused }"></span>
                        </div>
                    </template>
                </template>
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
    cv: [
        { title: 'Web Team Manager',              place: 'University of Strathclyde',                  period: '2023 – present', desc: 'Leading the web team responsible for the university\'s digital presence.' },
        { title: 'Web Designer/Developer',        place: 'University of Strathclyde',                  period: '2018 – 2023',    desc: 'Design and front-end development across the university\'s web estate.' },
        { title: 'Web Designer/Developer',        place: 'BiP Solutions',                              period: '2015 – 2018',    desc: 'Web design and development for public sector procurement platforms.' },
        { title: 'Web Designer/Developer',        place: 'Edinburgh Bicycle Cooperative',              period: '2012 – 2015',    desc: 'E-commerce and web presence for a worker-owned cycling cooperative.' },
        { title: 'Web Designer/Developer',        place: 'Self Employed',                              period: '2011 – 2012',    desc: 'Freelance web design and development.' },
        { title: 'Educational Resources Technician',   place: 'University of Glasgow',                      period: '2009 – 2011',    desc: 'Supported digital learning resources and the faculty web presence.' },
        { title: 'Multimedia Designer',           place: 'Self Employed',                              period: '2008 – 2009',    desc: 'Freelance multimedia and graphic design.' },
        { title: 'Assistant Producer',            place: 'R.A.W. Business Communications',             period: '2008',           desc: 'Video and corporate communications production.' },
        { title: 'Web Marketing Officer',         place: 'University of Glasgow',                      period: '2007',           desc: 'Online marketing and web presence for the university.' },
        { title: 'Education Projects Officer',    place: 'Scottish Screen',                            period: '2001 – 2007',    desc: 'Digital education projects for Scotland\'s national screen agency.' },
        { title: 'Event Assistant',               place: 'European Youth Film Festival of Flanders',   period: '2000 – 2001',    desc: 'Festival coordination and administration in Antwerp.' },
        { title: 'Runner',                        place: 'Scala Productions',                          period: '1999',           desc: 'Entry-level film production in London.' },
    ],
    skills: {
        Frontend:  ['HTML', 'CSS / Sass', 'JavaScript', 'Vue'],
        Design:    ['Figma', 'UI / UX', 'Accessibility'],
        Tooling:    ['Vite', 'Git', 'Node.js', 'WordPress', 'PHP', 'DevOps', 'AI'],
        Leadership: ['Team Management', 'Mentoring'],
    },
    education: [
        { title: 'The client side of application development', place: 'Open University', period: '2011', desc: '' },
        { title: 'Web applications: design, development & management', place: 'Open University', period: '2010', desc: '' },
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

const SKINS = [
    { name: 'dark',   desc: 'dark charcoal  — default' },
    { name: 'light',  desc: 'warm cream' },
    { name: 'matrix', desc: 'green on black' },
    { name: 'amber',  desc: 'retro CRT amber' },
    { name: 'nord',   desc: 'cool nordic blues' },
]

function getInitialSkin () {
    // Migrate from old 'theme' key
    const legacy = localStorage.getItem('theme')
    if (legacy) {
        localStorage.setItem('skin', legacy)
        localStorage.removeItem('theme')
    }
    return localStorage.getItem('skin') || 'dark'
}

function renderCv () {
    const lines = []
    DATA.cv.forEach(e => {
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
        lines.push(`${items.join(' · ')}`)
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

function renderAbout () {
    return ['Hello, my name is Martin. I\'m a Web Designer and Developer with a passion for designing and building websites and apps. I\'ve worked across commercial and public sector organisations, and outside of work I\'m a keen photographer and squash player. ;-)']
}

function renderLinks () {
    return DATA.links.map(l =>
        `<span class="accent">${l.label}</span>  <a class="terminal-link" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.value}</a>`
    )
}

function renderSkins (currentSkin) {
    return SKINS.map(s => {
        const active = s.name === currentSkin ? ' <span class="dim">(active)</span>' : ''
        return `<span class="accent">${s.name}</span>  <span class="dim">${s.desc}</span>${active}`
    })
}

function countVisibleChars (html) {
    let count = 0
    let i = 0
    while (i < html.length) {
        if (html[i] === '<') { i = html.indexOf('>', i) + 1; continue }
        if (html[i] === '&') {
            const end = html.indexOf(';', i)
            i = (end !== -1 && end - i <= 8) ? end + 1 : i + 1
        } else { i++ }
        count++
    }
    return count
}

function revealHtml (html, visibleCount) {
    let visible = 0
    let result = ''
    let i = 0
    while (i < html.length && visible < visibleCount) {
        if (html[i] === '<') {
            const end = html.indexOf('>', i)
            result += end !== -1 ? html.slice(i, end + 1) : html[i]
            i = end !== -1 ? end + 1 : i + 1
        } else if (html[i] === '&') {
            const end = html.indexOf(';', i)
            if (end !== -1 && end - i <= 8) {
                result += html.slice(i, end + 1); i = end + 1
            } else { result += html[i]; i++ }
            visible++
        } else {
            result += html[i++]; visible++
        }
    }
    return result
}

const COMMANDS = {
    help () {
        return [
            'Available commands:',
            '<span class="accent">about</span>        — about me',
            '<span class="accent">cv</span>           — work history',
            '<span class="accent">skills</span>       — skill categories',
            '<span class="accent">education</span>    — academic background',
            '<span class="accent">projects</span>     — things I\'ve built',
            '<span class="accent">links</span>        — profiles &amp; socials',
            '<span class="accent">skin</span>         — change the terminal skin',
            '<span class="accent">clear</span>        — clear the terminal',
        ]
    },
    about: renderAbout,
    cv: renderCv,
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
            skin: getInitialSkin(),
            loading: true,
            bootFading: false,
            bootItems: [
                { label: 'Initialising system',      done: false },
                { label: 'Loading kernel modules',   done: false },
                { label: 'Mounting filesystems',     done: false },
                { label: 'Starting terminal daemon', done: false },
                { label: 'Loading user profile',     done: false },
            ],
            bootVisibleCount: 0,
            bootProgress: 0,
            bootSpinnerFrame: 0,
            bootReady: false,
            cmdAnim: { active: false, label: '', progress: 0, spinnerFrame: 0 },
            typewriterActive: false,
            typewriterAbort: false,
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
        skinClass () {
            return this.skin !== 'dark' ? `terminal--skin-${this.skin}` : ''
        },
        bootSpinnerChar () {
            return ['|', '/', '─', '\\'][this.bootSpinnerFrame]
        },
        bootProgressDisplay () {
            const total = 28
            const filled = Math.round(this.bootProgress / 100 * total)
            const empty = total - filled
            return `<span class="boot-bar-fill">${'█'.repeat(filled)}</span><span class="boot-bar-empty">${'░'.repeat(empty)}</span> ${String(this.bootProgress).padStart(3)}%`
        },
        cmdAnimSpinnerChar () {
            return ['|', '/', '─', '\\'][this.cmdAnim.spinnerFrame]
        },
        cmdAnimBar () {
            const total = 14
            const filled = Math.round(this.cmdAnim.progress / 100 * total)
            const empty = total - filled
            return `<span class="boot-bar-fill">${'█'.repeat(filled)}</span><span class="boot-bar-empty">${'░'.repeat(empty)}</span>`
        },
        selHint () {
            if (this.isTouch) return '<i class="fas fa-hand-pointer"></i> tap an item to open'
            const action = this.selection.items.length && this.selection.items[0].cmd ? 'run' : 'open'
            return `↑↓ navigate  ·  ↵ ${action}  ·  esc cancel`
        }
    },
    mounted () {
        this.applySkin(this.skin)
        this.runBoot()
        this._onWinBlur  = () => { this.focused = false }
        this._onWinFocus = () => { this.focused = true }
        this._onPageShow = (e) => {
            if (e.persisted) {
                this.selection = { active: false, items: [], current: 0, id: 0 }
                this.$nextTick(() => {
                    this.$refs.input.focus()
                    this.focused = true
                })
            }
        }
        window.addEventListener('blur',     this._onWinBlur)
        window.addEventListener('focus',    this._onWinFocus)
        window.addEventListener('pageshow', this._onPageShow)
    },
    beforeUnmount () {
        window.removeEventListener('blur',     this._onWinBlur)
        window.removeEventListener('focus',    this._onWinFocus)
        window.removeEventListener('pageshow', this._onPageShow)
    },
    methods: {
        async typewriteLines (lines) {
            this.typewriterActive = true
            const delay = ms => new Promise(r => setTimeout(r, ms))
            const CHARS_PER_TICK = 2
            const TICK = 18

            outer: for (let li = 0; li < lines.length; li++) {
                const raw = lines[li]

                if (this.typewriterAbort) {
                    for (let r = li; r < lines.length; r++) this.output.push({ text: lines[r], type: 'out' })
                    break
                }

                if (!raw || raw === '<span class="entry-gap"></span>') {
                    this.output.push({ text: raw, type: 'out' })
                    if (!this.typewriterAbort) await delay(30)
                    continue
                }

                const total = countVisibleChars(raw)
                this.output.push({ text: '', type: 'out' })
                const idx = this.output.length - 1

                for (let v = CHARS_PER_TICK; v < total; v += CHARS_PER_TICK) {
                    if (this.typewriterAbort) {
                        this.output[idx].text = raw
                        for (let r = li + 1; r < lines.length; r++) this.output.push({ text: lines[r], type: 'out' })
                        break outer
                    }
                    await delay(TICK)
                    this.output[idx].text = revealHtml(raw, v)
                    if (v % 8 === 0) this.$nextTick(() => { const b = this.$refs.body; if (b) b.scrollTop = b.scrollHeight })
                }

                this.output[idx].text = raw
                if (!this.typewriterAbort) await delay(50)
            }

            this.output.push({ text: '', type: 'out' })
            this.typewriterActive = false
            this.typewriterAbort = false
            this.$nextTick(() => { const b = this.$refs.body; if (b) b.scrollTop = b.scrollHeight })
        },
        async runCmdAnim (label) {
            const delay = ms => new Promise(r => setTimeout(r, ms))
            this.cmdAnim = { active: true, label, progress: 0, spinnerFrame: 0 }
            this.$nextTick(() => { const b = this.$refs.body; if (b) b.scrollTop = b.scrollHeight })

            const spinInterval = setInterval(() => {
                this.cmdAnim.spinnerFrame = (this.cmdAnim.spinnerFrame + 1) % 4
            }, 80)

            const steps = 10
            for (let i = 1; i <= steps; i++) {
                await delay(32)
                this.cmdAnim.progress = Math.round(i / steps * 100)
            }

            clearInterval(spinInterval)
            await delay(60)
            this.cmdAnim.active = false
        },
        async runBoot () {
            const delay = ms => new Promise(r => setTimeout(r, ms))
            const spinInterval = setInterval(() => {
                this.bootSpinnerFrame = (this.bootSpinnerFrame + 1) % 4
            }, 90)

            await delay(150)

            for (let i = 0; i < this.bootItems.length; i++) {
                this.bootVisibleCount = i + 1
                await delay(220 + Math.floor(Math.random() * 280))
                this.bootItems[i].done = true
                this.bootProgress = Math.round((i + 1) / this.bootItems.length * 100)
            }

            await delay(350)
            clearInterval(spinInterval)
            this.bootReady = true
            await delay(650)
            this.bootFading = true
            await delay(280)
            this.loading = false
            this.$nextTick(() => this.$refs.input.focus())
        },
        applySkin (name) {
            this.skin = name
            localStorage.setItem('skin', name)
            SKINS.forEach(s => document.body.classList.remove(`skin-${s.name}`))
            if (name !== 'dark') document.body.classList.add(`skin-${name}`)
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
        async submit () {
            if (this.selection.active) {
                this.openSelected()
                return
            }

            // Interrupt any running typewriter before processing the new command
            if (this.typewriterActive) {
                this.typewriterAbort = true
                await new Promise(resolve => {
                    const poll = setInterval(() => { if (!this.typewriterActive) { clearInterval(poll); resolve() } }, 10)
                })
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
                await this.runCmdAnim('running help')
                const lines = COMMANDS.help()
                this.output.push({ text: lines[0], type: 'out' })
                const cmdNames = ['about', 'cv', 'skills', 'education', 'projects', 'links', 'skin', 'clear']
                const sid = ++this.selectionCounter
                lines.slice(1).forEach((text, i) => {
                    this.output.push({ text, type: 'out', selectable: true, selectIndex: i, selectionId: sid })
                    this.output.push({ text: '<span class="entry-gap"></span>', type: 'out' })
                })
                this.output.push({ text: '', type: 'out' })
                this.enterSelection(cmdNames.map(c => ({ label: c, cmd: c })), sid)
            } else if (cmd === 'projects') {
                await this.runCmdAnim('running projects')
                const sid = ++this.selectionCounter
                renderProjects().forEach((text, i) => {
                    this.output.push({ text, type: 'out', selectable: true, selectIndex: i, selectionId: sid })
                    this.output.push({ text: '<span class="entry-gap"></span>', type: 'out' })
                })
                this.output.push({ text: '', type: 'out' })
                this.enterSelection(DATA.projects.map(p => ({ label: p.name, sublabel: p.desc, url: p.url, external: !!p.external })), sid)
            } else if (cmd === 'links') {
                await this.runCmdAnim('running links')
                const sid = ++this.selectionCounter
                renderLinks().forEach((text, i) => {
                    this.output.push({ text, type: 'out', selectable: true, selectIndex: i, selectionId: sid })
                    this.output.push({ text: '<span class="entry-gap"></span>', type: 'out' })
                })
                this.output.push({ text: '', type: 'out' })
                this.enterSelection(DATA.links.map(l => ({ label: l.label, sublabel: l.value, url: l.url, external: true })), sid)
            } else if (cmd === 'skin' || cmd.startsWith('skin ')) {
                const arg = cmd === 'skin' ? '' : cmd.slice(5).trim()
                if (arg) {
                    const found = SKINS.find(s => s.name === arg)
                    if (found) {
                        await this.runCmdAnim(`applying skin: ${found.name}`)
                        this.applySkin(found.name)
                        this.output.push({ text: `skin set to <span class="accent">${found.name}</span>`, type: 'out' })
                        this.output.push({ text: '', type: 'out' })
                    } else {
                        this.output.push({ text: `unknown skin: ${arg}`, type: 'err' })
                        this.output.push({ text: `available: ${SKINS.map(s => s.name).join(', ')}`, type: 'out' })
                        this.output.push({ text: '', type: 'out' })
                    }
                } else {
                    await this.runCmdAnim('loading skins')
                    const sid = ++this.selectionCounter
                    renderSkins(this.skin).forEach((text, i) => {
                        this.output.push({ text, type: 'out', selectable: true, selectIndex: i, selectionId: sid })
                        this.output.push({ text: '<span class="entry-gap"></span>', type: 'out' })
                    })
                    this.output.push({ text: '', type: 'out' })
                    this.enterSelection(SKINS.map(s => ({ label: s.name, cmd: `skin ${s.name}` })), sid)
                }
            } else if (cmd === 'about' || cmd === 'skills' || cmd === 'education' || cmd === 'cv') {
                await this.runCmdAnim(`running ${cmd}`)
                await this.typewriteLines(COMMANDS[cmd]())
            } else if (COMMANDS[cmd]) {
                await this.runCmdAnim(`running ${cmd}`)
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
            this.exitSelection()
            const url = item.url.startsWith('//') ? 'https:' + item.url : item.url
            if (item.external || item.url.startsWith('//')) {
                window.open(url, '_blank', 'noopener,noreferrer')
            } else {
                window.location.href = url
            }
        },
        escapeKey () {
            if (this.selection.active) this.exitSelection()
        },
        tabComplete () {
            const cmd = this.current.toLowerCase()

            // skin <name> sub-completion
            if (cmd === 'skin ' || (cmd.startsWith('skin ') && cmd.length > 5)) {
                const arg = cmd.slice(5)
                const skinNames = SKINS.map(s => s.name)
                const matches = arg === '' ? skinNames : skinNames.filter(n => n.startsWith(arg))

                if (matches.length === 0) return

                if (matches.length === 1) {
                    this.current = `skin ${matches[0]}`
                    return
                }

                const prefix = matches.reduce((acc, n) => {
                    let i = 0
                    while (i < acc.length && i < n.length && acc[i] === n[i]) i++
                    return acc.slice(0, i)
                })

                if (prefix.length > arg.length) {
                    this.current = `skin ${prefix}`
                    return
                }

                this.output.push({ text: matches.map(m => `<span class="accent">${m}</span>`).join('    '), type: 'out' })
                this.$nextTick(() => { this.$refs.body.scrollTop = this.$refs.body.scrollHeight })
                return
            }

            const allCommands = [...Object.keys(COMMANDS), 'skin', 'clear']
            const matches = cmd === '' ? allCommands : allCommands.filter(c => c.startsWith(cmd))

            if (matches.length === 0) return

            if (matches.length === 1) {
                this.current = matches[0]
                return
            }

            const prefix = matches.reduce((acc, c) => {
                let i = 0
                while (i < acc.length && i < c.length && acc[i] === c[i]) i++
                return acc.slice(0, i)
            })

            if (prefix.length > cmd.length) {
                this.current = prefix
                return
            }

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
    // dark skin (default)
    --t-bg:         #0d1117;
    --t-bar-bg:     #13181f;
    --t-bar-border: #1e2530;
    --t-border:     #1e2530;
    --t-text:       #dfdfdf;
    --t-info:       #a3a8b0;
    --t-title:      #8b9099;
    --t-prompt:     #28c840;
    --t-accent:     #4a8fc4;
    --t-dim:        #8b9099;
    --t-err:        #ff5f57;
    --t-link:       #4a8fc4;
    --t-link-hover: #6aafd8;
    --t-cursor:     #dfdfdf;
    --t-scrollbar:  #2a3040;

    &.terminal--skin-light {
        --t-bg:         #f7f3ee;
        --t-bar-bg:     #ede9e4;
        --t-bar-border: #d8d3cd;
        --t-border:     #d8d3cd;
        --t-text:       #2c2c2c;
        --t-info:       #6a6a6a;
        --t-title:      #666666;
        --t-prompt:     #2a7437;
        --t-accent:     #1a5f8a;
        --t-dim:        #6e6e6e;
        --t-err:        #c0392b;
        --t-link:       #1a5f8a;
        --t-link-hover: #2471a3;
        --t-cursor:     #2c2c2c;
        --t-scrollbar:  #c8c3bd;
    }

    &.terminal--skin-matrix {
        --t-bg:         #020d02;
        --t-bar-bg:     #051205;
        --t-bar-border: #0d2e0d;
        --t-border:     #0d2e0d;
        --t-text:       #39ff14;
        --t-info:       #22cc00;
        --t-title:      #1a9900;
        --t-prompt:     #00ff41;
        --t-accent:     #00ff41;
        --t-dim:        #228b22;
        --t-err:        #ff4444;
        --t-link:       #00ff41;
        --t-link-hover: #66ff66;
        --t-cursor:     #39ff14;
        --t-scrollbar:  #0a3a0a;
    }

    &.terminal--skin-amber {
        --t-bg:         #0c0700;
        --t-bar-bg:     #140b00;
        --t-bar-border: #2e1800;
        --t-border:     #2e1800;
        --t-text:       #ffb000;
        --t-info:       #cc8a00;
        --t-title:      #996500;
        --t-prompt:     #ffd000;
        --t-accent:     #ffd000;
        --t-dim:        #8a6000;
        --t-err:        #ff4422;
        --t-link:       #ffd000;
        --t-link-hover: #ffe566;
        --t-cursor:     #ffb000;
        --t-scrollbar:  #2e1800;
    }

    &.terminal--skin-nord {
        --t-bg:         #2e3440;
        --t-bar-bg:     #262b38;
        --t-bar-border: #3b4252;
        --t-border:     #3b4252;
        --t-text:       #eceff4;
        --t-info:       #d8dee9;
        --t-title:      #9099a8;
        --t-prompt:     #a3be8c;
        --t-accent:     #88c0d0;
        --t-dim:        #616e88;
        --t-err:        #bf616a;
        --t-link:       #88c0d0;
        --t-link-hover: #8fbcbb;
        --t-cursor:     #eceff4;
        --t-scrollbar:  #3b4252;
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

    @media (pointer: coarse) {
        color: var(--t-link);
        :deep(a.terminal-link) {
            color: var(--t-link);
        }
    }
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

// ── Command animation ─────────────────────────────────────────────────────────

.cmd-anim-line {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--t-dim);
}

.cmd-anim-arrow { color: var(--t-accent); }

.cmd-anim-bar {
    font-size: 0.88em;
    :deep(.boot-bar-fill)  { color: var(--t-accent); }
    :deep(.boot-bar-empty) { color: var(--t-dim); opacity: 0.3; }
}

.cmd-anim-spinner {
    display: inline-block;
    width: 1em;
    text-align: center;
}

// ── Boot screen ──────────────────────────────────────────────────────────────

.boot-screen {
    padding: 20px 24px;
    line-height: 1.9;
    opacity: 1;
    transition: opacity 0.28s ease;

    &.boot-screen--fading { opacity: 0; }
}

.boot-header {
    color: var(--t-accent);
    letter-spacing: 0.06em;
    font-size: 0.95em;
    margin-bottom: 2px;
}

.boot-ver {
    color: var(--t-dim);
}

.boot-sep {
    color: var(--t-dim);
    margin-bottom: 8px;
    letter-spacing: 0;
    opacity: 0.5;
}

.boot-item {
    display: flex;
    align-items: baseline;
    gap: 12px;
    color: var(--t-text);
}

.boot-item-label {
    min-width: 260px;
}

.boot-ok {
    color: var(--t-prompt);
}

.boot-pending {
    color: var(--t-dim);
    display: inline-block;
    width: 1em;
    text-align: center;
}

.boot-progress-line {
    margin-top: 12px;
    font-size: 0.9em;
    letter-spacing: 0.02em;

    :deep(.boot-bar-fill)  { color: var(--t-accent); }
    :deep(.boot-bar-empty) { color: var(--t-dim); opacity: 0.4; }
}

.boot-ready {
    margin-top: 10px;
    color: var(--t-prompt);
    letter-spacing: 0.08em;
}
</style>
