/**
 * Resolve a URL do WebSocket (e da API) para o host de rede atual.
 *
 * NEXT_PUBLIC_WS_URL vem fixa em build time (ex.: ws://localhost:10023).
 * Quando o app é acessado por outro dispositivo na LAN pelo IP do servidor,
 * "localhost" no navegador não aponta ao servidor. Então, no cliente,
 * mantemos protocolo e porta da URL configurada, mas trocamos o host pelo
 * window.location.hostname. Assim funciona tanto em localhost quanto via IP.
 */
export function getWsUrl(): string {
  const configured =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WS_URL
      ? process.env.NEXT_PUBLIC_WS_URL
      : 'ws://localhost:10023';

  if (typeof window === 'undefined') {
    return configured;
  }

  try {
    const url = new URL(configured);
    url.hostname = window.location.hostname;
    return url.toString();
  } catch {
    return configured;
  }
}
