# Space Mission Monitor

Central de Monitoramento de Missões Espaciais — App Cross-Platform em React Native + Expo

##  Integrantes

| Nome Completo | RM |
|---|---|
| Sofia Bill Franken | RM562767 |
| Ana Luiza Santos Bertão | RM563171 |
## Sobre o Projeto

Aplicativo mobile desenvolvido em **React Native + Expo** que simula uma central de monitoramento de missões espaciais em tempo real. O app oferece uma interface temática e funcional para acompanhar os dados da missão, sensores, alertas automáticos e configurações.

## Funcionalidades Implementadas

### Telas

- **Dashboard** — Telemetria em tempo real com gauges animados, status geral da missão, cards de resumo e informações principais
- **Sensores** — Painel detalhado de todos os sensores com indicação visual de status (Normal / Atenção / Crítico)
- **Alertas** — Central de alertas automáticos e manuais com histórico, categorias e opção de limpar
- **Missão** — Formulário completo com validação para editar e salvar dados da missão

### Requisitos Técnicos

| Requisito | Implementação |
|---|---|
| Context API | `MissionContext.js` — compartilha sensores, missão e alertas entre todas as telas |
| AsyncStorage | Persiste dados da missão e histórico de alertas entre sessões |
| Expo Router | Navegação por abas com `app/(tabs)/_layout.js` |
| Formulários com validação | Tela "Missão" com validação de campos obrigatórios, formatos e limites |
| Alertas automáticos | Gerados quando energia < 20%, oxigênio < 25%, radiação > 8 Sv, etc. |
| Design temático espacial | Tema escuro com cores ciano, verde e tons de azul espacial |