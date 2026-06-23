<template>
    <div class="terminal-wrap mx-auto px-3 mt-4" @click="focusInput">
        <div class="terminal">
            <div class="terminal-bar">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
                <span class="bar-title">cv — bash</span>
            </div>
            <div class="terminal-body" ref="body">
                <div class="line" v-for="(line, i) in output" :key="i">
                    <span v-if="line.prompt" class="prompt">nuvmo@portfolio:~$&nbsp;</span>
                    <span :class="['text', line.type]" v-html="line.text"></span>
                </div>
                <div class="input-line">
                    <span class="prompt">nuvmo@portfolio:~$&nbsp;</span>
                    <span class="typed">{{ current }}</span><span class="cursor"></span>
                </div>
            </div>
            <input
                ref="input"
                class="hidden-input"
                v-model="current"
                @keydown.enter="submit"
                @keydown.up.prevent="historyUp"
                @keydown.down.prevent="historyDown"
                autocomplete="off"
                spellcheck="false"
            />
        </div>
    </div>
</template>

<script>
const DATA = {
    experience: [
        { title: 'Senior Frontend Developer', place: 'Acme Corp', period: '2022 – present', desc: 'Lead Vue 3 design system across 5 products.' },
        { title: 'Frontend Developer', place: 'Bright Labs', period: '2019 – 2022', desc: 'Interactive dashboards with React and D3.' },
        { title: 'Junior Web Developer', place: 'Pixel Studio', period: '2017 – 2019', desc: 'Responsive marketing sites and WordPress builds.' }
    ],
    skills: {
        Frontend: ['Vue 3', 'React', 'TypeScript', 'CSS / Sass', 'SVG / Canvas'],
        Backend: ['Node.js', 'Express', 'PostgreSQL', 'REST', 'GraphQL'],
        Tooling: ['Vite', 'Webpack', 'Git', 'Docker', 'GitHub Actions'],
        Creative: ['Figma', 'Blender', 'Ableton Live', 'Generative Art']
    },
    education: [
        { title: 'BSc Computer Science', place: 'University of Edinburgh', period: '2013 – 2017', desc: 'Specialised in HCI and graphics programming.' }
    ],
    contact: [
        { label: 'GitHub', value: 'github.com/nuvmo' },
        { label: 'CodePen', value: 'codepen.io/nuvmo' },
        { label: 'SoundCloud', value: 'soundcloud.com/nuvmo' }
    ]
}

function renderExperience () {
    const lines = []
    DATA.experience.forEach(e => {
        lines.push(`<span class="accent">${e.title}</span> @ ${e.place} &nbsp;<span class="dim">${e.period}</span>`)
        lines.push(`  ${e.desc}`)
        lines.push('')
    })
    return lines
}

function renderSkills () {
    const lines = []
    Object.entries(DATA.skills).forEach(([cat, items]) => {
        lines.push(`<span class="accent">${cat}</span>`)
        lines.push(`  ${items.join('  ·  ')}`)
        lines.push('')
    })
    return lines
}

function renderEducation () {
    const lines = []
    DATA.education.forEach(e => {
        lines.push(`<span class="accent">${e.title}</span> — ${e.place} &nbsp;<span class="dim">${e.period}</span>`)
        lines.push(`  ${e.desc}`)
    })
    return lines
}

function renderContact () {
    return DATA.contact.map(c => `<span class="accent">${c.label}:</span>  ${c.value}`)
}

const COMMANDS = {
    help () {
        return [
            'Available commands:',
            '  <span class="accent">experience</span>  — work history',
            '  <span class="accent">skills</span>      — skill categories',
            '  <span class="accent">education</span>   — academic background',
            '  <span class="accent">contact</span>     — where to find me',
            '  <span class="accent">clear</span>       — clear the terminal',
        ]
    },
    experience: renderExperience,
    skills: renderSkills,
    education: renderEducation,
    contact: renderContact
}

export default {
    name: 'TheCV',
    data () {
        return {
            current: '',
            output: [
                { text: 'Type <span class="accent">help</span> to see available commands.', type: 'info' }
            ],
            history: [],
            historyIndex: -1
        }
    },
    mounted () {
        this.$nextTick(() => this.$refs.input.focus())
    },
    methods: {
        focusInput () {
            this.$refs.input.focus()
        },
        submit () {
            const cmd = this.current.trim().toLowerCase()
            if (!cmd) return

            this.output.push({ prompt: true, text: cmd, type: 'cmd' })
            this.history.unshift(cmd)
            this.historyIndex = -1
            this.current = ''

            if (cmd === 'clear') {
                this.output = []
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
        historyUp () {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++
                this.current = this.history[this.historyIndex]
            }
        },
        historyDown () {
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
    max-width: 680px;
    width: 100%;
    animation: slide-up 0.5s 0.1s both;
    cursor: text;
}

.terminal {
    background: #0d1117;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    overflow: hidden;
    font-family: monospace;
    font-size: 0.8rem;
}

.terminal-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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
    color: rgba(223, 223, 223, 0.4);
    font-size: 0.72rem;
    margin-right: 30px; // offset for the dots
}

.terminal-body {
    padding: 12px 16px;
    height: 280px;
    overflow-y: auto;
    color: #dfdfdf;
    line-height: 1.6;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
}

.line {
    white-space: pre-wrap;
    word-break: break-word;

    .text {
        &.err  { color: #ff5f57; }
        &.info { color: rgba(223, 223, 223, 0.6); }
    }
}

.input-line {
    display: flex;
    align-items: center;
}

.prompt {
    color: #28c840;
    flex-shrink: 0;
}

.typed {
    white-space: pre;
}

.cursor {
    display: inline-block;
    width: 8px;
    height: 1.1em;
    background: #dfdfdf;
    vertical-align: text-bottom;
    animation: blink 1s step-start infinite;
}

.hidden-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
}

:deep(.accent) { color: #376fa4; }
:deep(.dim)    { color: rgba(223, 223, 223, 0.4); }
</style>
