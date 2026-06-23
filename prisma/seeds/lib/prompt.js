/**
 * prompt.js — Interactive CLI prompt utility for seed scripts.
 *
 * Uses /dev/tty to guarantee direct terminal access.
 * This is immune to stdin/stdout redirection by parent processes (Prisma, pnpm).
 *
 * Fallback (Windows / non-Unix): uses process.stdin as best-effort.
 * If stdin is not a TTY → defaults to "supplement".
 *
 * Also supports CLI args: node index.js --clean | --supplement
 */

const fs = require('fs')
const readline = require('readline')

// ── Banner ────────────────────────────────────────────────────────────────
const BANNER = `
🌱 ═══════════════════════════════════════════
   Database Seed — Modo de ejecución
═══════════════════════════════════════════════

  clean      → Elimina TODOS los datos existentes y siembra desde cero
  supplement → Conserva los datos actuales y solo añade/actualiza los del seed
`

const PROMPT = 'Selecciona el modo [clean/supplement] (supplement): '
const INVALID = '  ⚠️  Opción inválida. Escribe "clean" o "supplement".\n'

// ── Helpers ───────────────────────────────────────────────────────────────

function normalize(raw) {
  const input = (raw || '').trim().toLowerCase() || 'supplement'
  if (input === 'c') return 'clean'
  if (input === 's') return 'supplement'
  return input
}

/**
 * Attempts to open /dev/tty for direct terminal I/O.
 * Returns { input, output } streams on success, or null on failure.
 */
function openTty() {
  try {
    const fd = fs.openSync('/dev/tty', 'r+')
    const stream = fs.createReadStream(null, { fd })
    const output = fs.createWriteStream(null, { fd })
    return { input: stream, output }
  } catch {
    return null
  }
}

/**
 * Interactive prompt using readline on the given input/output streams.
 * Re-prompts on invalid input. Resolves with 'clean' or 'supplement'.
 */
function promptOnStream(input, output) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input, output, terminal: true })

    const ask = () => {
      rl.question(PROMPT, (raw) => {
        const mode = normalize(raw)

        if (mode === 'clean' || mode === 'supplement') {
          rl.close()
          console.log('')
          resolve(mode)
        } else {
          output.write(INVALID)
          ask()
        }
      })
    }

    ask()

    rl.on('SIGINT', () => {
      rl.close()
      console.log('\n\n❌ Seed cancelado por el usuario.')
      process.exit(1)
    })
  })
}

// ── Main ──────────────────────────────────────────────────────────────────

/**
 * Asks the seed mode: clean (delete all then seed) or supplement (upsert).
 *
 * Strategy (tried in order):
 *   1. /dev/tty      → direct terminal access (immune to stdio redirection)
 *   2. process.stdin → fallback for platforms without /dev/tty
 *   3. default       → "supplement" (non-TTY / CI environments)
 *
 * @returns {Promise<'clean'|'supplement'>}
 */
function askSeedMode() {
  return new Promise((resolve) => {
    // 1. Try /dev/tty first (Unix/macOS — always the real terminal)
    const tty = openTty()
    if (tty) {
      console.log(BANNER)
      promptOnStream(tty.input, tty.output).then(resolve)
      return
    }

    // 2. Fallback to process.stdin (Windows or other)
    if (process.stdin.isTTY) {
      console.log(BANNER)
      promptOnStream(process.stdin, process.stdout).then(resolve)
      return
    }

    // 3. Non-interactive environment
    console.log(BANNER)
    console.log('ℹ️  Entorno no interactivo — usando modo "supplement".')
    console.log('   Usa --clean o --supplement para forzar el modo:\n')
    console.log('     node prisma/seeds/index.js --clean')
    console.log('     node prisma/seeds/index.js --supplement\n')
    resolve('supplement')
  })
}

module.exports = { askSeedMode }



