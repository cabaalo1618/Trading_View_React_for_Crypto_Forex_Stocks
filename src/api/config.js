// Configuração para evitar CORS (temporário - apenas para desenvolvimento)
export const API_CONFIG = {
  // Use um proxy CORS temporário (NÃO use em produção!)
  BINANCE_PROXY: 'https://cors-anywhere.herokuapp.com/https://api.binance.com',
  
  // Ou, melhor, crie um proxy no package.json do Vite
  // Veja abaixo
};