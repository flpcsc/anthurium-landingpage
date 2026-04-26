import { NextResponse } from 'next/server'

// Rate Limiter em memória (Camada 6) - Atenção: em Serverless (Vercel) isso é local à instância lambda
const rateLimit = new Map<string, { count: number; time: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 min
const MAX_REQUESTS = 5

// Sanitizador básico (Camada 3)
function sanitizeInput(str: string) {
  if (typeof str !== 'string') return ''
  return str.replace(/[<>]/g, '').trim()
}

export async function POST(req: Request) {
  try {
    // Camada 4 & 9: Verificação de Origem (CSRF rudimentar via header e método garantido)
    const referer = req.headers.get('referer') || ''
    const host = req.headers.get('host') || ''
    
    // Obs: Em dev host é localhost:3001, referer é http://localhost:3001/...
    if (process.env.NODE_ENV === 'production' && !referer.includes(host)) {
      return new NextResponse(null, { status: 403, statusText: 'Forbidden' })
    }

    // Camada 6: Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'anon'
    const now = Date.now()
    const rateRecord = rateLimit.get(ip)

    if (rateRecord) {
      if (now - rateRecord.time < RATE_LIMIT_WINDOW) {
        if (rateRecord.count >= MAX_REQUESTS) {
          return new NextResponse(null, { status: 429, statusText: 'Too Many Requests' })
        }
        rateRecord.count++
      } else {
        rateLimit.set(ip, { count: 1, time: now })
      }
    } else {
      rateLimit.set(ip, { count: 1, time: now })
    }

    // Analisando corpo
    const body = await req.json()
    
    // Sanitização e validação das entradas
    const sanitizedBody = {
      tipo: sanitizeInput(body.tipo),
      empresa: sanitizeInput(body.empresa),
      nome: sanitizeInput(body.nome),
      origem: sanitizeInput(body.origem),
      email: sanitizeInput(body.email),
      telefone: sanitizeInput(body.telefone),
    }

    const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbyA7zFbcoEhbPRmLNw6tBinCMDc4ZIvn7nEbHifgXbXfW99iG_8U39E5aBRCeIuyMhhSQ/exec'

    const response = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedBody),
      redirect: 'follow'
    })

    if (response.ok) {
      // Camada 7: Retornar Cookies Seguros não se aplica diretamente aqui (é via Next auth/config),
      // mas estamos garantindo segurança no payload.
      return NextResponse.json({ success: true })
    } else {
      // Camada 8: Tratamento Oculto - o erro do apps script não sobe pro cliente
      return new NextResponse(null, { status: 502, statusText: 'Bad Gateway' })
    }
  } catch (err) {
    // Erros genéricos
    return new NextResponse(null, { status: 500, statusText: 'Internal Server Error' })
  }
}
