import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verifica proteção para assets estáticos críticos (imagens pesadas, vídeos WebM, etc)
  const isProtectedAsset = request.nextUrl.pathname.startsWith('/images/') || request.nextUrl.pathname.endsWith('.webm')
  
  if (isProtectedAsset) {
    const referer = request.headers.get('referer')
    const host = request.headers.get('host')
    
    // Se há referer e não contém o host oficial (nem localhost), bloqueia
    if (referer && host && !referer.includes(host)) {
      return new NextResponse(null, { status: 403, statusText: 'Forbidden' })
    }
  }

  // Deleta cabeçalhos sensíveis por garantia (Next 14 faz um pouco disso, mas garantimos no edge)
  const response = NextResponse.next()
  response.headers.delete('x-powered-by')
  return response
}

export const config = {
  // Executa o middleware focando nos assets + api
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
