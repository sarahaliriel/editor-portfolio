"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type Lang = "pt" | "en" | "es"

const DICT = {
  pt: {
    langLabel: "Idioma",
    pt: "Português",
    en: "Inglês",
    es: "Espanhol",

    menuOpen: "Abrir menu",
    menuClose: "Fechar menu",
    menuNav: "NAVEGAÇÃO",
    menuSocial: "REDES",

    linkAbout: "Sobre",
    linkWork: "Projetos",

    linkContact: "Contato",

    introStarting: "iniciando",
    introLoading: "carregando",
    introHint: "clique ou enter",
    introEnter: "entrar",
    introRouteHome: "portfolio",
    introRouteAllProjects: "projetos em vídeo",
    introRouteGallery: "galeria de designs",
    introRouteMoreAbout: "sobre mim",

    cursorView: "Ver",

    heroAvailable: "Disponível para projetos",
    heroRole1: "Editora de Vídeos",
    heroRole2: "Frontend Developer",
    heroRole3: "Mídias Sociais",
    heroLetterWords:
      "Processo|Detalhe|Ritmo|Curiosidade|Movimento|História|Ideia|Identidade|Sarah",
    heroLetterAria: "Letra",
    moreAboutMovesCta: "+ SOBRE MIM",
    moreAboutMovesCtaHover: "LER HISTÓRIA",




    allprojectsHeroTitle: "Arquivo Motion",
    allprojectsFormatLabel: "formato",
    allprojectsActiveLabel: "ativo",
    allprojectsTagsLabel: "tags",
    allprojectsToolsLabel: "tools",


    allprojectsTitle1: "MOTION LAB",


    allprojectsTitle2: "SHORT-FORM & SOCIAL",


    allprojectsTitle4: "VIDEO STORYTELLING",






    allprojectsSelectEdit: "Selecionar edição",

    allprojectsClose: "Fechar",
    allprojectsMinimize: "Diminuir",

    allprojectsSoundOn: "Ativar som",
    allprojectsSoundOff: "Silenciar",


    selectedWorkCount: "03 selecionados",
    selectedWorkTitle: "Trabalhos Selecionados",
    selectedWorkGhost: "Selecionados",
    selectedWorkDescription: "Uma seleção de designs e mockups criados para prender atenção, traduzir ideias e dar consistência visual à comunicação.",
    selectedWorkDesign: "Design",



    selectedWorkCta: "Explorar coleção",
    selectedWorkCtaHover: "Design gallery",

    motionSelectedKicker: "curadoria de vídeo",
    motionSelectedTitle: "Projetos em movimento",
    motionSelectedCopy: "Design cria a primeira impressão. O vídeo faz ela permanecer.",
    motionSelectedWatch: "assistir",
    motionSelectedCta: "Ver todas as edições",


    projectCtaLine1: "O próximo projeto",
    projectCtaLine2: "pode ser o seu",



    projectCtaScroll: "Continue a deslizar",
    selectedWork01Title: "Frigideira AI",
    selectedWork01Category: "DIREÇÃO DE ARTE • SOCIAL MEDIA",
    selectedWork01Description: "Uma identidade visual criada para tornar conteúdo técnico mais claro, memorável e compartilhável, equilibrando estratégia, personalidade e consistência em cada publicação.",
    selectedWork02Title: "The Real Tocha",
    selectedWork02Category: "DIREÇÃO DE ARTE • SOCIAL MEDIA",
    selectedWork02Description: "Uma identidade visual criada para fortalecer a presença digital de um criador ligado a empreendedorismo, investimento e comunicação, transformando temas densos em conteúdos claros, reconhecíveis e com autoridade.",
    selectedWork03Title: "SDP",
    selectedWork03Category: "SOCIAL MEDIA • COMUNIDADE TECH",
    selectedWork03Description: "Desenvolvimento de uma identidade visual consistente para uma comunidade de tecnologia em constante crescimento. Além da criação dos conteúdos para redes sociais, participei da organização de eventos, campanhas e comunicação visual, ajudando a fortalecer a presença digital da comunidade e o relacionamento com milhares de membros.",



















    galleryMetaTitle: "Galeria de Design | Sarah Aliriel Dumitrache",
    galleryMetaDescription: "Explore projetos de design, social media, mockups, posts, stories e carrosséis criados por Sarah Aliriel Dumitrache.",
    galleryArchiveGhost: "Arquivo",
    galleryHeroArchiveLabel: "arquivo visual",
    galleryHeroSocialArchive: "arquivo de social media",
    galleryHeroTitle: "Design Gallery",
    galleryHeroProjectsLabel: "projetos",
    galleryHeroPiecesLabel: "peças",
    galleryHeroOrderLabel: "ordem",
    galleryHeroOrderValue: "manual",
    gallerySelectedEyebrow: "capítulos selecionados",
    gallerySelectedTitle: "Trabalhos Selecionados",
    gallerySelectedDescription: "Uma seleção de projetos onde estratégia, identidade e execução visual trabalham juntas para gerar impacto real.",
    gallerySelectedArchiveLink: "sobre o arquivo",
    galleryPieceCountLabel: "peças",
    galleryViewMorePieces: "Ver mais peças",

    galleryPlaygroundEyebrow: "estudos e conceitos",
    galleryPlaygroundTitle: "Creative Playground",
    galleryPlaygroundDescription: "Estudos soltos, composições livres e experimentos visuais que não nasceram como projeto completo, mas ajudaram a explorar linguagem, contraste e direção visual.",
    galleryPlaygroundAnnex: "anexo 01",
    galleryFinalEyebrow: "próximo passo",
    galleryFinalTitle: "Vamos criar presença.",
    galleryFinalDescription: "Design, vídeo e código trabalhando juntos para transformar uma ideia em uma experiência clara, memorável e pronta para circular.",
    galleryFinalButton: "Vamos conversar",
    gallerySocialEmail: "Email",
    gallerySocialLinkedIn: "LinkedIn",
    gallerySocialGitHub: "GitHub",
    gallerySocialInstagram: "Instagram",
    galleryDetailMetaSuffix: "Case Study de Design",
    galleryDetailBack: "Voltar",
    galleryProcessKicker: "Processo",
    galleryProcessHeading: "O raciocínio por trás da identidade.",
    galleryProcessContext: "Contexto",
    galleryProcessDirection: "Direção",
    galleryProcessImpact: "Impacto",
    galleryProcessChallenge: "Desafio",
    galleryProcessChallengeBody: "Falar sobre inteligência artificial normalmente leva aos mesmos códigos visuais: gradientes, robôs, interfaces futuristas e uma estética genérica de tecnologia. O desafio era criar uma presença acessível, reconhecível e com personalidade, capaz de transformar temas complexos em conteúdos claros e fáceis de compartilhar.",
    galleryProcessFollowers: "Novos seguidores",
    galleryProcessDirectionBody: "A direção visual foi construída a partir de títulos grandes, contraste alto, composições modulares e uma linguagem editorial direta. Cada publicação precisava ser compreendida em poucos segundos, sem perder profundidade, consistência ou identidade.",
    galleryProcessViews: "Visualizações",
    galleryProcessResult: "Result",
    galleryProcessResultBody: "O projeto ganhou um sistema visual consistente, memorável e fácil de expandir. A identidade passou a organizar temas complexos em narrativas simples, reconhecíveis e adaptáveis a diferentes formatos de conteúdo.",
    galleryProcessActive: "Ativo",
    galleryProcessVisualSystem: "Sistema visual",
    galleryProcessSelectedPieces: "9 peças selecionadas",
    galleryProcessNext: "Próximo capítulo",
    galleryProcessOneYear: "ano de atividade",
    galleryProcessFiveMonths: "meses de atividade",
    galleryVisualSystem: "Sistema visual",
    galleryVisualObjective: "Objetivo",
    galleryVisualPurpose: "O propósito da identidade",
    galleryVisualCharacteristics: "Características",
    galleryVisualTypographyAndColors: "Tipografia & Cores",
    galleryVisualTypography: "Tipografia",
    galleryVisualColors: "Cores",
    galleryVisualDesigns: "Designs",
    galleryVisualDisplay: "Display",
    galleryVisualBody: "Body",
    galleryVisualPrimaryColor: "Cor principal",
    galleryVisualSupportColor: "Cor de apoio",
    galleryVisualHighlights: "Destaques",
    galleryVisualBackground: "Background",
    galleryVisualContrast: "Contraste",
    galleryVisualEditorial: "Editorial",
    galleryVisualModular: "Modular",
    galleryVisualConsistent: "Consistente",
    galleryVisualClear: "Clara",
    galleryVisualMemorable: "Memorável",
    galleryVisualAccessible: "Acessível",
    galleryVisualDirect: "Direta",
    galleryVisualStrong: "Forte",
    galleryVisualDynamic: "Dinâmica",
    galleryVisualCollective: "Coletiva",
    galleryVisualIdeas: "Ideias",
    galleryVisualEurope: "Europa",
    galleryVisualExecution: "Execução",
    galleryVisualBusiness: "Negócios",
    galleryVisualAI: "IA",
    galleryVisualAuthority: "Autoridade",
    galleryVisualVision: "Visão",
    galleryVisualCode: "Código",
    galleryVisualCommunity: "Comunidade",
    galleryVisualEvents: "Eventos",
    galleryVisualFuture: "Futuro",
    galleryVisualFrigideiraObjective: "Tornar inteligência artificial mais clara, memorável e compartilhável.",
    galleryVisualFrigideiraObjectiveBody: "A identidade foi construída para transformar assuntos técnicos em conteúdos acessíveis, reconhecíveis e fáceis de consumir nas redes sociais.",
    galleryVisualTochaObjective: "Transformar conhecimento denso em presença clara e reconhecível.",
    galleryVisualTochaObjectiveBody: "A identidade organiza ideias de negócio e comunicação em conteúdos diretos, fortes e preparados para criar autoridade nas redes sociais.",
    galleryVisualSdpObjective: "Dar unidade e energia a uma comunidade de tecnologia em movimento.",
    galleryVisualSdpObjectiveBody: "O sistema conecta campanhas, eventos e conteúdos recorrentes em uma linguagem acessível, reconhecível e fácil de ampliar.",









    galleryDetailAssetMockup: "Mockup",
    galleryDetailAssetPost: "Post estático",
    galleryDetailAssetStory: "Story",
    galleryDetailAssetSlides: "slides",
    galleryDetailEditorialEyebrow: "Galeria editorial",
    galleryDetailEditorialTitle: "Peças em escala editorial.",
    galleryDetailEditorialDescription: "Um arquivo visual em ritmo de revista: peças menores, respiros longos e variações de escala para deixar o olho circular.",
    galleryDetailCtaEyebrow: "CTA final",
    galleryDetailCtaTitle: "Próximo capítulo visual.",
    galleryDetailCtaBody: "Explore outro case da galeria ou volte ao arquivo completo para ver como a mesma estrutura se adapta a projetos diferentes.",
    galleryDetailCtaGallery: "Galeria",
    galleryDetailViewerClose: "Fechar visualizador",
    galleryDetailViewerPrevious: "Slide anterior",
    galleryDetailViewerNext: "Próximo slide",
    galleryDetailViewerGoToSlide: "Ir para slide",
    galleryDetailCarouselCoverAlt: "Capa do carrossel",
    galleryDetailCarouselSlideAlt: "Slide",
    galleryFormatPosts: "posts",
    galleryFormatCarousels: "carrosséis",
    galleryFormatEditorialCovers: "capas editoriais",
    galleryFormatStories: "stories",
    galleryFormatMockups: "mockups",
    galleryFormatCampaignPosts: "posts de campanha",
    galleryFormatEditorialSequences: "sequências editoriais",
    galleryMetricStaticPosts: "posts estáticos",
    galleryMetricEditorialCarousels: "carrosséis editoriais",
    galleryMetricVisualSystem: "sistema visual",
    galleryMetricCarousels: "carrosséis",
    galleryMetricStories: "stories",
    galleryMetricSequences: "sequências",
    galleryMetricSlides: "slides",
    galleryMetricCommunity: "comunidade",
    galleryProjectFrigideiraName: "Frigideira AI",
    galleryProjectFrigideiraType: "Direção de arte · Social media",
    galleryProjectFrigideiraRole: "Direção de arte, design editorial e social media",
    galleryProjectFrigideiraDescription: "Conteúdo visual para tornar tecnologia, IA e cultura digital mais claros, compartilháveis e reconhecíveis.",
    galleryProjectFrigideiraIntro: "Um sistema editorial para traduzir tecnologia em conteúdo desejável, com ritmo social-first e uma linguagem visual pronta para circular entre curiosidade, humor e autoridade.",
    galleryProjectFrigideiraChallenge: "O tema precisava parecer acessível sem perder profundidade. A marca falava sobre IA, ferramentas e cultura digital, mas precisava evitar uma estética genérica de tecnologia e criar reconhecimento imediato no feed.",
    galleryProjectFrigideiraSolution: "Construí uma direção visual com títulos grandes, contraste alto, composições modulares e capas com leitura instantânea. Cada peça foi pensada como uma entrada editorial: clara no primeiro segundo, mas com detalhe suficiente para segurar a atenção.",
    galleryProjectFrigideiraResult: "A presença visual ficou mais consistente e memorável, com peças que organizam temas complexos em narrativas simples, compartilháveis e fáceis de reconhecer dentro de uma rotina de conteúdo.",
    galleryFrigideiraPiece01: "Post manifesto",
    galleryFrigideiraPiece02: "Peça educativa",
    galleryFrigideiraPiece03: "Chamada editorial",
    galleryFrigideiraPiece04: "Conteúdo técnico",
    galleryFrigideiraPiece05: "Frame de autoridade",
    galleryFrigideiraCarousel01: "IA aplicada ao cotidiano",
    galleryFrigideiraCarousel02: "Processo visual e clareza",
    galleryFrigideiraCarousel03: "Narrativa de tecnologia",
    galleryFrigideiraCarousel04: "Conteúdo para comunidade",
    galleryFrigideiraMockup: "Mockup Frigideira AI",
    galleryProjectTochaName: "The Real Tocha",
    galleryProjectTochaType: "Identidade visual · Conteúdo de autoridade",
    galleryProjectTochaRole: "Identidade visual, direção de arte e conteúdo de autoridade",
    galleryProjectTochaDescription: "Peças para transformar temas densos de empreendedorismo, investimento e comunicação em presença digital clara e forte.",
    galleryProjectTochaIntro: "Uma presença visual construída para autoridade: direta, densa e editorial, com peças que transformam ideias de negócio, investimento e comunicação em conteúdo de impacto.",
    galleryProjectTochaChallenge: "O projeto precisava sustentar temas sérios sem parecer frio. A comunicação tinha de transmitir confiança, criar retenção e manter uma estética forte mesmo em formatos rápidos como stories e carrosséis.",
    galleryProjectTochaSolution: "Desenvolvi uma linguagem com hierarquia tipográfica agressiva, recortes precisos, ritmo de capas e sequências que guiam o olhar. A estrutura visual permite alternar análise, opinião e chamada de comunidade sem perder unidade.",
    galleryProjectTochaResult: "O arquivo passou a funcionar como um sistema de autoridade: reconhecível, expansível e preparado para diferentes níveis de profundidade, desde um post único até uma sequência completa.",
    galleryTochaPiece01: "Post de autoridade",
    galleryTochaPiece02: "Frame de análise",
    galleryTochaPiece03: "Peça de posicionamento",
    galleryTochaPiece04: "Conteúdo educativo",
    galleryTochaPiece05: "Post de retenção",
    galleryTochaPiece06: "Chamada social",
    galleryTochaPiece07: "Post de comunidade",
    galleryTochaCarousel01: "Narrativa para negócios digitais",
    galleryTochaCarousel02: "Autoridade e presença",
    galleryTochaCarousel03: "Educação visual",
    galleryTochaCarousel04: "Ritmo editorial",
    galleryTochaCarousel05: "Investimento e comunicação",
    galleryTochaCarousel06: "Construção de repertório",
    galleryTochaCarousel07: "Sequência de autoridade",
    galleryTochaCarousel08: "Clareza para conversão",
    galleryTochaCarousel09: "Mensagem de impacto",
    galleryTochaStory01: "Story de abertura",
    galleryTochaStory02: "Story de sequência",
    galleryTochaStory03: "Story de desenvolvimento",
    galleryTochaStory04: "Story de fechamento",
    galleryTochaMockup: "Mockup The Real Tocha",
    galleryProjectSdpName: "SDP",
    galleryProjectSdpHeroTitle: "Servidor dos Programadores",
    galleryProjectSdpType: "Comunidade tech · Social media",
    galleryProjectSdpRole: "Sistema visual, campanhas e comunicação de comunidade",
    galleryProjectSdpDescription: "Sistema visual para uma comunidade de tecnologia em crescimento, unindo campanhas, eventos e comunicação recorrente.",
    galleryProjectSdpIntro: "Um sistema visual para comunidade tech, pensado para organizar informação, criar energia de campanha e dar unidade a conteúdos recorrentes sem engessar a comunicação.",
    galleryProjectSdpChallenge: "A comunidade precisava comunicar eventos, chamadas e conteúdos educativos com clareza, mas também transmitir movimento e pertencimento. O risco era parecer apenas informativo, sem personalidade visual.",
    galleryProjectSdpSolution: "A solução combina grids diretos, capas com leitura rápida e sequências de carrossel que criam progressão. O template visual dá espaço para código, comunidade e chamadas fortes sem competir com a mensagem principal.",
    galleryProjectSdpResult: "O projeto ganhou uma base flexível para campanhas e comunicação contínua, com peças mais fáceis de escalar e adaptar a diferentes momentos da comunidade.",
    gallerySdpCarousel01: "Comunidade em movimento",
    gallerySdpCarousel02: "Programação e comunidade",
    gallerySdpCarousel03: "Chamada editorial",
    gallerySdpCarousel04: "Campanha tech",
    gallerySdpCarousel05: "Engajamento da comunidade",
    gallerySdpCarousel06: "Sequência especial",
    gallerySdpMockup: "Mockup SDP",
    galleryPlaygroundPiece01: "Estudo de composição",
    galleryPlaygroundPiece02: "Exploração tipográfica",
    galleryPlaygroundPiece03: "Conceito visual",
    galleryPlaygroundPiece04: "Peça experimental",
    galleryPlaygroundPiece05: "Direção visual livre",
    galleryPlaygroundPiece06: "Save Our Seas",
    galleryPlaygroundPiece07: "Estudo visual livre",















    moreAboutName: "Sarah Aliriel Dumitrache",
    moreAboutRole1: "Editora de Vídeo",
    moreAboutRole2: "Designer",
    moreAboutRole3: "Desenvolvedora Frontend",
    moreAboutLocation: "Póvoa de Varzim, Portugal",
    moreAboutStoryKicker: "linha do tempo",
    moreAboutStoryTitle: "A minha história",
    moreAboutStory2019Title: "Tudo começou com um vídeo",
    moreAboutStory2019Body: "Comecei editando vídeos para o YouTube apenas por diversão. Sem perceber, passei horas estudando cortes, ritmo e narrativa. Foi ali que entendi que uma boa edição pode transformar uma cena comum em algo impossível de ignorar.",
    moreAboutStory2022Title: "Descobri o poder do movimento",
    moreAboutStory2022Body: "Comecei a estudar motion design e percebi que cada animação, cada transição e cada detalhe visual também contam uma história. Foi quando passei a enxergar design além da estética.",
    moreAboutStory2025Title: "Levei a criatividade para o mercado",
    moreAboutStory2025Body: "Entrei no marketing digital trabalhando com conteúdos para as redes sociais. Aprendi a equilibrar criatividade e estratégia, criando peças pensadas para comunicar, conectar e gerar resultados.",
    moreAboutStory2026Title: "Design, vídeo e código no mesmo processo",
    moreAboutStory2026Body: "Hoje uno design, vídeo e desenvolvimento para criar experiências digitais com intenção. Cada detalhe, do conceito à interação final, é pensado para comunicar algo, gerar impacto e deixar uma impressão duradoura.",

    moreAboutMovesQuote: "Gosto de criar experiências que façam as pessoas pararem, sentirem e lembrarem.",
    moreAboutHelpTitle: "POSSO AJUDAR COM...",
    moreAboutHelp01Title: "Design",
    moreAboutHelp01Items: "Identidade visual|Posts para redes sociais|Carrosséis|Apresentações|Interfaces digitais|Branding",
    moreAboutHelp02Title: "Edição de Vídeo",
    moreAboutHelp02Items: "Short-form|Reels|TikTok|YouTube|Storytelling|Motion Graphics",
    moreAboutHelp03Title: "Sites",
    moreAboutHelp03Items: "Landing Pages|Portfólios|Sites institucionais|Frontend moderno|Animações|Experiências interativas",
    moreAboutHelp04Title: "✦ Pacote Completo",
    moreAboutHelp04Items: "Estratégia|Design|Conteúdo|Edição|Desenvolvimento",
    moreAboutStatsKicker: "EM NÚMEROS",
    moreAboutStatsTitle: "Nem tudo o que importa pode ser medido.",
    moreAboutStatsIntro: "Mas algumas marcas deixadas pelo caminho merecem ser registradas. Por trás de cada número, incontáveis horas aprendendo, criando e evoluindo.",
    moreAboutStatYears: "anos criando conteúdo",
    moreAboutStatYearsChapter: "tempo",
    moreAboutStatProjects: "projetos desenvolvidos",
    moreAboutStatProjectsChapter: "prática",
    moreAboutStatViews: "de visualizações acumuladas",
    moreAboutStatViewsChapter: "impacto",
    moreAboutCtaLine1: "Pronto para tirar",
    moreAboutCtaLine2: "uma ideia do papel?",
    moreAboutCtaButton: "VAMOS CONVERSAR",
    moreAboutCtaResume: "Baixar currículo",

    moreAboutFooterEdition: "Edição",
    moreAboutFooterLocalTime: "Hora local · Portugal",
    moreAboutFooterSocials: "Redes",
  },
  en: {
    langLabel: "Language",
    pt: "Portuguese",
    en: "English",
    es: "Spanish",

    menuOpen: "Open menu",
    menuClose: "Close menu",
    menuNav: "NAVIGATION",
    menuSocial: "SOCIALS",

    linkAbout: "About",
    linkWork: "Work",

    linkContact: "Contact",

    introStarting: "starting",
    introLoading: "loading",
    introHint: "click or enter",
    introEnter: "enter",
    introRouteHome: "portfolio",
    introRouteAllProjects: "video projects",
    introRouteGallery: "design gallery",
    introRouteMoreAbout: "about me",

    cursorView: "View",

    heroAvailable: "Available for projects",
    heroRole1: "Video Editor",
    heroRole2: "Frontend Developer",
    heroRole3: "Social Media",
    heroLetterWords:
      "Process|Detail|Rhythm|Curiosity|Motion|Story|Idea|Identity|Sarah",
    heroLetterAria: "Letter",
    moreAboutMovesCta: "+ ABOUT ME",
    moreAboutMovesCtaHover: "READ STORY",




    allprojectsHeroTitle: "Motion Archive",
    allprojectsFormatLabel: "format",
    allprojectsActiveLabel: "active",
    allprojectsTagsLabel: "tags",
    allprojectsToolsLabel: "tools",


    allprojectsTitle1: "MOTION LAB",


    allprojectsTitle2: "SHORT-FORM & SOCIAL",


    allprojectsTitle4: "VIDEO STORYTELLING",






    allprojectsSelectEdit: "Select edit",

    allprojectsClose: "Close",
    allprojectsMinimize: "Minimize",

    allprojectsSoundOn: "Sound on",
    allprojectsSoundOff: "Mute",


    selectedWorkCount: "03 selected",
    selectedWorkTitle: "Selected Work",
    selectedWorkGhost: "Selected",
    selectedWorkDescription: "A selection of designs and mockups created to hold attention, translate ideas and bring visual consistency to communication.",
    selectedWorkDesign: "Design",



    selectedWorkCta: "Explore collection",
    selectedWorkCtaHover: "Design gallery",

    motionSelectedKicker: "video curation",
    motionSelectedTitle: "Motion Selected",
    motionSelectedCopy: "Design creates the first impression. Video makes it stay.",
    motionSelectedWatch: "watch",
    motionSelectedCta: "See all edits",


    projectCtaLine1: "The next project",
    projectCtaLine2: "could be yours",



    projectCtaScroll: "Keep scrolling",
    selectedWork01Title: "Frigideira AI",
    selectedWork01Category: "ART DIRECTION • SOCIAL MEDIA",
    selectedWork01Description: "A visual identity created to make technical content clearer, more memorable and more shareable, balancing strategy, personality and consistency across every post.",
    selectedWork02Title: "The Real Tocha",
    selectedWork02Category: "ART DIRECTION • SOCIAL MEDIA",
    selectedWork02Description: "A visual identity created to strengthen the digital presence of a creator connected to entrepreneurship, investing and communication, turning dense topics into clear, recognizable and authoritative content.",
    selectedWork03Title: "SDP",
    selectedWork03Category: "SOCIAL MEDIA • TECH COMMUNITY",
    selectedWork03Description: "Development of a consistent visual identity for one of Brazil's largest technology communities. Alongside creating social media content, I helped organize events, campaigns and visual communication, strengthening the community's digital presence and engagement with thousands of members.",



















    galleryMetaTitle: "Design Gallery | Sarah Aliriel Dumitrache",
    galleryMetaDescription: "Explore design projects, social media work, mockups, posts, stories and carousels created by Sarah Aliriel Dumitrache.",
    galleryArchiveGhost: "Archive",
    galleryHeroArchiveLabel: "visual archive",
    galleryHeroSocialArchive: "social media archive",
    galleryHeroTitle: "Design Gallery",
    galleryHeroProjectsLabel: "projects",
    galleryHeroPiecesLabel: "pieces",
    galleryHeroOrderLabel: "order",
    galleryHeroOrderValue: "manual",
    gallerySelectedEyebrow: "selected chapters",
    gallerySelectedTitle: "Selected Work",
    gallerySelectedDescription: "A selection of projects where strategy, identity and visual execution work together to create real impact.",
    gallerySelectedArchiveLink: "about the archive",
    galleryPieceCountLabel: "pieces",
    galleryViewMorePieces: "See more pieces",

    galleryPlaygroundEyebrow: "studies and concepts",
    galleryPlaygroundTitle: "Creative Playground",
    galleryPlaygroundDescription: "Loose studies, free compositions and visual experiments that did not start as full projects, but helped explore language, contrast and art direction.",
    galleryPlaygroundAnnex: "annex 01",
    galleryFinalEyebrow: "next step",
    galleryFinalTitle: "Let’s create presence.",
    galleryFinalDescription: "Design, video and code working together to turn an idea into a clear, memorable experience ready to circulate.",
    galleryFinalButton: "Let’s talk",
    gallerySocialEmail: "Email",
    gallerySocialLinkedIn: "LinkedIn",
    gallerySocialGitHub: "GitHub",
    gallerySocialInstagram: "Instagram",
    galleryDetailMetaSuffix: "Design Case Study",
    galleryDetailBack: "Back",
    galleryProcessKicker: "Process",
    galleryProcessHeading: "The thinking behind the identity.",
    galleryProcessContext: "Context",
    galleryProcessDirection: "Direct",
    galleryProcessImpact: "Impact",
    galleryProcessChallenge: "Challen",
    galleryProcessChallengeBody: "Artificial intelligence usually leads to the same visual codes: gradients, robots, futuristic interfaces and generic tech aesthetics. The challenge was to create an accessible, recognizable presence with personality, capable of turning complex topics into clear, shareable content.",
    galleryProcessFollowers: "New followers",
    galleryProcessDirectionBody: "The visual direction was built around large titles, high contrast, modular compositions and direct editorial language. Each publication had to be understood in seconds without losing depth, consistency or identity.",
    galleryProcessViews: "Views",
    galleryProcessResult: "Result",
    galleryProcessResultBody: "The project gained a consistent, memorable visual system that is easy to expand. The identity began organizing complex topics into simple, recognizable narratives adaptable to different content formats.",
    galleryProcessActive: "Active",
    galleryProcessVisualSystem: "Visual system",
    galleryProcessSelectedPieces: "9 selected pieces",
    galleryProcessNext: "Next chapter",
    galleryProcessOneYear: "year of activity",
    galleryProcessFiveMonths: "months of activity",
    galleryVisualSystem: "Visual system",
    galleryVisualObjective: "Objective",
    galleryVisualPurpose: "The identity's purpose",
    galleryVisualCharacteristics: "Characteristics",
    galleryVisualTypographyAndColors: "Typography & Colors",
    galleryVisualTypography: "Typography",
    galleryVisualColors: "Colors",
    galleryVisualDesigns: "Designs",
    galleryVisualDisplay: "Display",
    galleryVisualBody: "Body",
    galleryVisualPrimaryColor: "Primary color",
    galleryVisualSupportColor: "Support color",
    galleryVisualHighlights: "Highlights",
    galleryVisualBackground: "Background",
    galleryVisualContrast: "Contrast",
    galleryVisualEditorial: "Editorial",
    galleryVisualModular: "Modular",
    galleryVisualConsistent: "Consistent",
    galleryVisualClear: "Clear",
    galleryVisualMemorable: "Memorable",
    galleryVisualAccessible: "Accessible",
    galleryVisualDirect: "Direct",
    galleryVisualStrong: "Strong",
    galleryVisualDynamic: "Dynamic",
    galleryVisualCollective: "Collective",
    galleryVisualIdeas: "Ideas",
    galleryVisualEurope: "Europe",
    galleryVisualExecution: "Execution",
    galleryVisualBusiness: "Business",
    galleryVisualAI: "AI",
    galleryVisualAuthority: "Authority",
    galleryVisualVision: "Vision",
    galleryVisualCode: "Code",
    galleryVisualCommunity: "Community",
    galleryVisualEvents: "Events",
    galleryVisualFuture: "Future",
    galleryVisualFrigideiraObjective: "Make artificial intelligence clearer, more memorable and shareable.",
    galleryVisualFrigideiraObjectiveBody: "The identity transforms technical subjects into accessible, recognizable content that is easy to consume on social media.",
    galleryVisualTochaObjective: "Turn dense knowledge into a clear and recognizable presence.",
    galleryVisualTochaObjectiveBody: "The identity organizes business and communication ideas into direct, strong content designed to build authority on social media.",
    galleryVisualSdpObjective: "Bring unity and energy to a technology community in motion.",
    galleryVisualSdpObjectiveBody: "The system connects campaigns, events and recurring content through an accessible, recognizable language that is easy to expand.",









    galleryDetailAssetMockup: "Mockup",
    galleryDetailAssetPost: "Static post",
    galleryDetailAssetStory: "Story",
    galleryDetailAssetSlides: "slides",
    galleryDetailEditorialEyebrow: "Editorial gallery",
    galleryDetailEditorialTitle: "Pieces at editorial scale.",
    galleryDetailEditorialDescription: "A visual archive with a magazine rhythm: smaller pieces, long pauses and shifts in scale that let the eye wander.",
    galleryDetailCtaEyebrow: "Final CTA",
    galleryDetailCtaTitle: "Next visual chapter.",
    galleryDetailCtaBody: "Explore another gallery case or return to the full archive to see how the same structure adapts to different projects.",
    galleryDetailCtaGallery: "Gallery",
    galleryDetailViewerClose: "Close viewer",
    galleryDetailViewerPrevious: "Previous slide",
    galleryDetailViewerNext: "Next slide",
    galleryDetailViewerGoToSlide: "Go to slide",
    galleryDetailCarouselCoverAlt: "Carousel cover",
    galleryDetailCarouselSlideAlt: "Slide",
    galleryFormatPosts: "posts",
    galleryFormatCarousels: "carousels",
    galleryFormatEditorialCovers: "editorial covers",
    galleryFormatStories: "stories",
    galleryFormatMockups: "mockups",
    galleryFormatCampaignPosts: "campaign posts",
    galleryFormatEditorialSequences: "editorial sequences",
    galleryMetricStaticPosts: "static posts",
    galleryMetricEditorialCarousels: "editorial carousels",
    galleryMetricVisualSystem: "visual system",
    galleryMetricCarousels: "carousels",
    galleryMetricStories: "stories",
    galleryMetricSequences: "sequences",
    galleryMetricSlides: "slides",
    galleryMetricCommunity: "community",
    galleryProjectFrigideiraName: "Frigideira AI",
    galleryProjectFrigideiraType: "Art direction · Social media",
    galleryProjectFrigideiraRole: "Art direction, editorial design and social media",
    galleryProjectFrigideiraDescription: "Visual content to make technology, AI and digital culture clearer, more memorable and more shareable.",
    galleryProjectFrigideiraIntro: "An editorial system for translating technology into desirable content, with a social-first rhythm and a visual language ready to move through curiosity, humor and authority.",
    galleryProjectFrigideiraChallenge: "The topic needed to feel accessible without losing depth. The brand talked about AI, tools and digital culture, but had to avoid generic tech aesthetics and build instant recognition in the feed.",
    galleryProjectFrigideiraSolution: "I built an art direction with large titles, high contrast, modular compositions and covers with instant readability. Each piece was designed as an editorial entry: clear in the first second, with enough detail to hold attention.",
    galleryProjectFrigideiraResult: "The visual presence became more consistent and memorable, with pieces that organize complex topics into simple, shareable narratives that are easy to recognize in a content routine.",
    galleryFrigideiraPiece01: "Manifesto post",
    galleryFrigideiraPiece02: "Educational piece",
    galleryFrigideiraPiece03: "Editorial callout",
    galleryFrigideiraPiece04: "Technical content",
    galleryFrigideiraPiece05: "Authority frame",
    galleryFrigideiraCarousel01: "AI applied to everyday life",
    galleryFrigideiraCarousel02: "Visual process and clarity",
    galleryFrigideiraCarousel03: "Technology storytelling",
    galleryFrigideiraCarousel04: "Content for community",
    galleryFrigideiraMockup: "Frigideira AI mockup",
    galleryProjectTochaName: "The Real Tocha",
    galleryProjectTochaType: "Visual identity · Authority content",
    galleryProjectTochaRole: "Visual identity, art direction and authority content",
    galleryProjectTochaDescription: "Pieces that turn dense topics around entrepreneurship, investing and communication into a clear, strong digital presence.",
    galleryProjectTochaIntro: "A visual presence built for authority: direct, dense and editorial, with pieces that turn business, investment and communication ideas into high-impact content.",
    galleryProjectTochaChallenge: "The project needed to sustain serious themes without feeling cold. The communication had to convey trust, create retention and keep a strong aesthetic even in fast formats like stories and carousels.",
    galleryProjectTochaSolution: "I developed a language with aggressive typographic hierarchy, precise cuts, cover rhythm and sequences that guide the eye. The visual structure can move between analysis, opinion and community calls without losing unity.",
    galleryProjectTochaResult: "The archive became an authority system: recognizable, expandable and ready for different levels of depth, from a single post to a complete sequence.",
    galleryTochaPiece01: "Authority post",
    galleryTochaPiece02: "Analysis frame",
    galleryTochaPiece03: "Positioning piece",
    galleryTochaPiece04: "Educational content",
    galleryTochaPiece05: "Retention post",
    galleryTochaPiece06: "Social callout",
    galleryTochaPiece07: "Community post",
    galleryTochaCarousel01: "Narrative for digital business",
    galleryTochaCarousel02: "Authority and presence",
    galleryTochaCarousel03: "Visual education",
    galleryTochaCarousel04: "Editorial rhythm",
    galleryTochaCarousel05: "Investing and communication",
    galleryTochaCarousel06: "Building repertoire",
    galleryTochaCarousel07: "Authority sequence",
    galleryTochaCarousel08: "Clarity for conversion",
    galleryTochaCarousel09: "Impact message",
    galleryTochaStory01: "Opening story",
    galleryTochaStory02: "Sequence story",
    galleryTochaStory03: "Development story",
    galleryTochaStory04: "Closing story",
    galleryTochaMockup: "The Real Tocha mockup",
    galleryProjectSdpName: "SDP",
    galleryProjectSdpHeroTitle: "Servidor dos Programadores",
    galleryProjectSdpType: "Tech community · Social media",
    galleryProjectSdpRole: "Visual system, campaigns and community communication",
    galleryProjectSdpDescription: "A visual system for a growing technology community, bringing together campaigns, events and recurring communication.",
    galleryProjectSdpIntro: "A visual system for a tech community, designed to organize information, create campaign energy and bring unity to recurring content without making communication rigid.",
    galleryProjectSdpChallenge: "The community needed to communicate events, calls and educational content clearly, while also conveying movement and belonging. The risk was becoming merely informative, without visual personality.",
    galleryProjectSdpSolution: "The solution combines direct grids, fast-reading covers and carousel sequences that create progression. The visual template gives space to code, community and strong calls without competing with the main message.",
    galleryProjectSdpResult: "The project gained a flexible base for campaigns and ongoing communication, with pieces that are easier to scale and adapt to different community moments.",
    gallerySdpCarousel01: "Community in motion",
    gallerySdpCarousel02: "Programming and community",
    gallerySdpCarousel03: "Editorial callout",
    gallerySdpCarousel04: "Tech campaign",
    gallerySdpCarousel05: "Community engagement",
    gallerySdpCarousel06: "Special sequence",
    gallerySdpMockup: "SDP mockup",
    galleryPlaygroundPiece01: "Composition study",
    galleryPlaygroundPiece02: "Typographic exploration",
    galleryPlaygroundPiece03: "Visual concept",
    galleryPlaygroundPiece04: "Experimental piece",
    galleryPlaygroundPiece05: "Free art direction",
    galleryPlaygroundPiece06: "Save Our Seas",
    galleryPlaygroundPiece07: "Free visual study",















    moreAboutName: "Sarah Aliriel Dumitrache",
    moreAboutRole1: "Video Editor",
    moreAboutRole2: "Designer",
    moreAboutRole3: "Frontend Developer",
    moreAboutLocation: "Póvoa de Varzim, Portugal",
    moreAboutStoryKicker: "timeline",
    moreAboutStoryTitle: "My story",
    moreAboutStory2019Title: "It all started with a video",
    moreAboutStory2019Body: "I started editing videos for YouTube just for fun. Before I knew it, I was spending hours studying cuts, rhythm and storytelling. That was when I realized that good editing can transform an ordinary scene into something impossible to ignore.",
    moreAboutStory2022Title: "I discovered the power of motion",
    moreAboutStory2022Body: "I started studying motion design and realized that every animation, every transition and every visual detail also tells a story. That was when I began to see design as more than aesthetics.",
    moreAboutStory2025Title: "I brought creativity into the professional world",
    moreAboutStory2025Body: "I entered digital marketing, working on content for social media. I learned to balance creativity and strategy, creating pieces designed to communicate, connect and drive results.",
    moreAboutStory2026Title: "Design, video and code in the same process",
    moreAboutStory2026Body: "Today I combine design, video and development to create intentional digital experiences. Every detail, from the concept to the final interaction, is designed to communicate something, make an impact and leave a lasting impression.",

    moreAboutMovesQuote: "I love creating experiences that make people stop, feel and remember.",
    moreAboutHelpTitle: "I CAN HELP YOU WITH...",
    moreAboutHelp01Title: "Design",
    moreAboutHelp01Items: "Visual identity|Social media posts|Carousels|Presentations|Digital interfaces|Branding",
    moreAboutHelp02Title: "Video Editing",
    moreAboutHelp02Items: "Short-form|Reels|TikTok|YouTube|Storytelling|Motion Graphics",
    moreAboutHelp03Title: "Websites",
    moreAboutHelp03Items: "Landing Pages|Portfolios|Institutional websites|Modern frontend|Animations|Interactive experiences",
    moreAboutHelp04Title: "✦ Full Package",
    moreAboutHelp04Items: "Strategy|Design|Content|Editing|Development",
    moreAboutStatsKicker: "By the numbers",
    moreAboutStatsTitle: "A story that grew in scale.",
    moreAboutStatsIntro: "What began as curiosity became practice, craft and impact. These numbers don't sum up the journey — they reveal how far it has already travelled.",
    moreAboutStatYears: "years creating content",
    moreAboutStatYearsChapter: "time",
    moreAboutStatProjects: "projects developed",
    moreAboutStatProjectsChapter: "practice",
    moreAboutStatViews: "accumulated views",
    moreAboutStatViewsChapter: "impact",
    moreAboutCtaLine1: "Ready to bring",
    moreAboutCtaLine2: "an idea to life?",
    moreAboutCtaButton: "LET'S TALK",
    moreAboutCtaResume: "Download résumé",

    moreAboutFooterEdition: "Edition",
    moreAboutFooterLocalTime: "Local time · Portugal",
    moreAboutFooterSocials: "Socials",
  },
  es: {
    langLabel: "Idioma",
    pt: "Portugués",
    en: "Inglés",
    es: "Español",

    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    menuNav: "NAVEGACIÓN",
    menuSocial: "REDES",

    linkAbout: "Sobre mí",
    linkWork: "Proyectos",

    linkContact: "Contacto",

    introStarting: "iniciando",
    introLoading: "cargando",
    introHint: "clic o enter",
    introEnter: "entrar",
    introRouteHome: "portfolio",
    introRouteAllProjects: "proyectos en video",
    introRouteGallery: "galería de diseños",
    introRouteMoreAbout: "sobre mí",

    cursorView: "Ver",

    heroAvailable: "Disponible para proyectos",
    heroRole1: "Editora de Video",
    heroRole2: "Frontend Developer",
    heroRole3: "Redes Sociales",
    heroLetterWords:
      "Proceso|Detalle|Ritmo|Curiosidad|Movimiento|Historia|Idea|Identidad|Sarah",
    heroLetterAria: "Letra",
    moreAboutMovesCta: "+ SOBRE MÍ",
    moreAboutMovesCtaHover: "LEER HISTORIA",




    allprojectsHeroTitle: "Archivo Motion",
    allprojectsFormatLabel: "formato",
    allprojectsActiveLabel: "activo",
    allprojectsTagsLabel: "tags",
    allprojectsToolsLabel: "tools",


    allprojectsTitle1: "MOTION LAB",


    allprojectsTitle2: "SHORT-FORM & SOCIAL",


    allprojectsTitle4: "VIDEO STORYTELLING",






    allprojectsSelectEdit: "Seleccionar edición",

    allprojectsClose: "Cerrar",
    allprojectsMinimize: "Minimizar",

    allprojectsSoundOn: "Activar sonido",
    allprojectsSoundOff: "Silenciar",


    selectedWorkCount: "03 seleccionados",
    selectedWorkTitle: "Trabajos Seleccionados",
    selectedWorkGhost: "Seleccionados",
    selectedWorkDescription: "Una selección de diseños y mockups creados para captar la atención, traducir ideas y dar consistencia visual a la comunicación.",
    selectedWorkDesign: "Diseño",



    selectedWorkCta: "Explorar colección",
    selectedWorkCtaHover: "Galería de diseño",

    motionSelectedKicker: "curaduría de video",
    motionSelectedTitle: "Proyectos en movimiento",
    motionSelectedCopy: "El diseño crea la primera impresión. El video hace que permanezca.",
    motionSelectedWatch: "ver",
    motionSelectedCta: "Ver todas las ediciones",


    projectCtaLine1: "El próximo proyecto",
    projectCtaLine2: "podría ser el tuyo",



    projectCtaScroll: "Sigue deslizando",
    selectedWork01Title: "Frigideira AI",
    selectedWork01Category: "DIRECCIÓN DE ARTE • SOCIAL MEDIA",
    selectedWork01Description: "Una identidad visual creada para hacer que el contenido técnico sea más claro, memorable y compartible, equilibrando estrategia, personalidad y consistencia en cada publicación.",
    selectedWork02Title: "The Real Tocha",
    selectedWork02Category: "DIRECCIÓN DE ARTE • SOCIAL MEDIA",
    selectedWork02Description: "Una identidad visual creada para fortalecer la presencia digital de un creador vinculado al emprendimiento, la inversión y la comunicación, transformando temas densos en contenidos claros, reconocibles y con autoridad.",
    selectedWork03Title: "SDP",
    selectedWork03Category: "SOCIAL MEDIA • COMUNIDAD TECH",
    selectedWork03Description: "Desarrollo de una identidad visual consistente para una de las mayores comunidades tecnológicas de Brasil. Además de crear contenidos para redes sociales, participé en la organización de eventos, campañas y comunicación visual, fortaleciendo la presencia digital de la comunidad y la interacción con miles de miembros.",



















    galleryMetaTitle: "Galería de Diseño | Sarah Aliriel Dumitrache",
    galleryMetaDescription: "Explora proyectos de diseño, social media, mockups, posts, stories y carruseles creados por Sarah Aliriel Dumitrache.",
    galleryArchiveGhost: "Archivo",
    galleryHeroArchiveLabel: "archivo visual",
    galleryHeroSocialArchive: "archivo de social media",
    galleryHeroTitle: "Design Gallery",
    galleryHeroProjectsLabel: "proyectos",
    galleryHeroPiecesLabel: "piezas",
    galleryHeroOrderLabel: "orden",
    galleryHeroOrderValue: "manual",
    gallerySelectedEyebrow: "capítulos seleccionados",
    gallerySelectedTitle: "Trabajos Seleccionados",
    gallerySelectedDescription: "Una selección de proyectos donde estrategia, identidad y ejecución visual trabajan juntas para generar impacto real.",
    gallerySelectedArchiveLink: "sobre el archivo",
    galleryPieceCountLabel: "piezas",
    galleryViewMorePieces: "Ver más piezas",

    galleryPlaygroundEyebrow: "estudios y conceptos",
    galleryPlaygroundTitle: "Creative Playground",
    galleryPlaygroundDescription: "Estudios sueltos, composiciones libres y experimentos visuales que no nacieron como proyectos completos, pero ayudaron a explorar lenguaje, contraste y dirección visual.",
    galleryPlaygroundAnnex: "anexo 01",
    galleryFinalEyebrow: "próximo paso",
    galleryFinalTitle: "Vamos a crear presencia.",
    galleryFinalDescription: "Diseño, vídeo y código trabajando juntos para transformar una idea en una experiencia clara, memorable y lista para circular.",
    galleryFinalButton: "Hablemos",
    gallerySocialEmail: "Email",
    gallerySocialLinkedIn: "LinkedIn",
    gallerySocialGitHub: "GitHub",
    gallerySocialInstagram: "Instagram",
    galleryDetailMetaSuffix: "Caso de Estudio de Diseño",
    galleryDetailBack: "Volver",
    galleryProcessKicker: "Proceso",
    galleryProcessHeading: "El razonamiento detrás de la identidad.",
    galleryProcessContext: "Contexto",
    galleryProcessDirection: "Direc",
    galleryProcessImpact: "Impacto",
    galleryProcessChallenge: "Desafío",
    galleryProcessChallengeBody: "Hablar de inteligencia artificial suele llevar a los mismos códigos visuales: degradados, robots, interfaces futuristas y una estética tecnológica genérica. El desafío era crear una presencia accesible, reconocible y con personalidad, capaz de transformar temas complejos en contenidos claros y fáciles de compartir.",
    galleryProcessFollowers: "Nuevos seguidores",
    galleryProcessDirectionBody: "La dirección visual se construyó a partir de títulos grandes, alto contraste, composiciones modulares y un lenguaje editorial directo. Cada publicación debía comprenderse en pocos segundos sin perder profundidad, consistencia o identidad.",
    galleryProcessViews: "Visualizaciones",
    galleryProcessResult: "Result",
    galleryProcessResultBody: "El proyecto ganó un sistema visual consistente, memorable y fácil de ampliar. La identidad pasó a organizar temas complejos en narrativas simples, reconocibles y adaptables a diferentes formatos de contenido.",
    galleryProcessActive: "Activo",
    galleryProcessVisualSystem: "Sistema visual",
    galleryProcessSelectedPieces: "9 piezas seleccionadas",
    galleryProcessNext: "Próximo capítulo",
    galleryProcessOneYear: "año de actividad",
    galleryProcessFiveMonths: "meses de actividad",
    galleryVisualSystem: "Sistema visual",
    galleryVisualObjective: "Objetivo",
    galleryVisualPurpose: "El propósito de la identidad",
    galleryVisualCharacteristics: "Características",
    galleryVisualTypographyAndColors: "Tipografía & Colores",
    galleryVisualTypography: "Tipografía",
    galleryVisualColors: "Colores",
    galleryVisualDesigns: "Diseños",
    galleryVisualDisplay: "Display",
    galleryVisualBody: "Body",
    galleryVisualPrimaryColor: "Color principal",
    galleryVisualSupportColor: "Color de apoyo",
    galleryVisualHighlights: "Destacados",
    galleryVisualBackground: "Background",
    galleryVisualContrast: "Contraste",
    galleryVisualEditorial: "Editorial",
    galleryVisualModular: "Modular",
    galleryVisualConsistent: "Consistente",
    galleryVisualClear: "Clara",
    galleryVisualMemorable: "Memorable",
    galleryVisualAccessible: "Accesible",
    galleryVisualDirect: "Directa",
    galleryVisualStrong: "Fuerte",
    galleryVisualDynamic: "Dinámica",
    galleryVisualCollective: "Colectiva",
    galleryVisualIdeas: "Ideas",
    galleryVisualEurope: "Europa",
    galleryVisualExecution: "Ejecución",
    galleryVisualBusiness: "Negocios",
    galleryVisualAI: "IA",
    galleryVisualAuthority: "Autoridad",
    galleryVisualVision: "Visión",
    galleryVisualCode: "Código",
    galleryVisualCommunity: "Comunidad",
    galleryVisualEvents: "Eventos",
    galleryVisualFuture: "Futuro",
    galleryVisualFrigideiraObjective: "Hacer que la inteligencia artificial sea más clara, memorable y compartible.",
    galleryVisualFrigideiraObjectiveBody: "La identidad transforma temas técnicos en contenidos accesibles, reconocibles y fáciles de consumir en las redes sociales.",
    galleryVisualTochaObjective: "Transformar conocimiento denso en una presencia clara y reconocible.",
    galleryVisualTochaObjectiveBody: "La identidad organiza ideas de negocio y comunicación en contenidos directos, fuertes y preparados para generar autoridad en redes sociales.",
    galleryVisualSdpObjective: "Dar unidad y energía a una comunidad tecnológica en movimiento.",
    galleryVisualSdpObjectiveBody: "El sistema conecta campañas, eventos y contenidos recurrentes mediante un lenguaje accesible, reconocible y fácil de ampliar.",









    galleryDetailAssetMockup: "Mockup",
    galleryDetailAssetPost: "Post estático",
    galleryDetailAssetStory: "Story",
    galleryDetailAssetSlides: "slides",
    galleryDetailEditorialEyebrow: "Galería editorial",
    galleryDetailEditorialTitle: "Piezas a escala editorial.",
    galleryDetailEditorialDescription: "Un archivo visual con ritmo de revista: piezas menores, respiros largos y variaciones de escala para dejar que la mirada circule.",
    galleryDetailCtaEyebrow: "CTA final",
    galleryDetailCtaTitle: "Próximo capítulo visual.",
    galleryDetailCtaBody: "Explora otro caso de la galería o vuelve al archivo completo para ver cómo la misma estructura se adapta a proyectos diferentes.",
    galleryDetailCtaGallery: "Galería",
    galleryDetailViewerClose: "Cerrar visualizador",
    galleryDetailViewerPrevious: "Slide anterior",
    galleryDetailViewerNext: "Siguiente slide",
    galleryDetailViewerGoToSlide: "Ir al slide",
    galleryDetailCarouselCoverAlt: "Portada del carrusel",
    galleryDetailCarouselSlideAlt: "Slide",
    galleryFormatPosts: "posts",
    galleryFormatCarousels: "carruseles",
    galleryFormatEditorialCovers: "portadas editoriales",
    galleryFormatStories: "stories",
    galleryFormatMockups: "mockups",
    galleryFormatCampaignPosts: "posts de campaña",
    galleryFormatEditorialSequences: "secuencias editoriales",
    galleryMetricStaticPosts: "posts estáticos",
    galleryMetricEditorialCarousels: "carruseles editoriales",
    galleryMetricVisualSystem: "sistema visual",
    galleryMetricCarousels: "carruseles",
    galleryMetricStories: "stories",
    galleryMetricSequences: "secuencias",
    galleryMetricSlides: "slides",
    galleryMetricCommunity: "comunidad",
    galleryProjectFrigideiraName: "Frigideira AI",
    galleryProjectFrigideiraType: "Dirección de arte · Social media",
    galleryProjectFrigideiraRole: "Dirección de arte, diseño editorial y social media",
    galleryProjectFrigideiraDescription: "Contenido visual para hacer que la tecnología, la IA y la cultura digital sean más claras, memorables y compartibles.",
    galleryProjectFrigideiraIntro: "Un sistema editorial para traducir tecnología en contenido deseable, con ritmo social-first y un lenguaje visual listo para circular entre curiosidad, humor y autoridad.",
    galleryProjectFrigideiraChallenge: "El tema necesitaba parecer accesible sin perder profundidad. La marca hablaba de IA, herramientas y cultura digital, pero debía evitar una estética tecnológica genérica y crear reconocimiento inmediato en el feed.",
    galleryProjectFrigideiraSolution: "Construí una dirección visual con títulos grandes, alto contraste, composiciones modulares y portadas de lectura instantánea. Cada pieza fue pensada como una entrada editorial: clara en el primer segundo, pero con suficiente detalle para mantener la atención.",
    galleryProjectFrigideiraResult: "La presencia visual se volvió más consistente y memorable, con piezas que organizan temas complejos en narrativas simples, compartibles y fáciles de reconocer dentro de una rutina de contenido.",
    galleryFrigideiraPiece01: "Post manifiesto",
    galleryFrigideiraPiece02: "Pieza educativa",
    galleryFrigideiraPiece03: "Llamada editorial",
    galleryFrigideiraPiece04: "Contenido técnico",
    galleryFrigideiraPiece05: "Frame de autoridad",
    galleryFrigideiraCarousel01: "IA aplicada al día a día",
    galleryFrigideiraCarousel02: "Proceso visual y claridad",
    galleryFrigideiraCarousel03: "Narrativa de tecnología",
    galleryFrigideiraCarousel04: "Contenido para comunidad",
    galleryFrigideiraMockup: "Mockup Frigideira AI",
    galleryProjectTochaName: "The Real Tocha",
    galleryProjectTochaType: "Identidad visual · Contenido de autoridad",
    galleryProjectTochaRole: "Identidad visual, dirección de arte y contenido de autoridad",
    galleryProjectTochaDescription: "Piezas para transformar temas densos de emprendimiento, inversión y comunicación en una presencia digital clara y fuerte.",
    galleryProjectTochaIntro: "Una presencia visual construida para la autoridad: directa, densa y editorial, con piezas que transforman ideas de negocio, inversión y comunicación en contenido de impacto.",
    galleryProjectTochaChallenge: "El proyecto necesitaba sostener temas serios sin parecer frío. La comunicación debía transmitir confianza, crear retención y mantener una estética fuerte incluso en formatos rápidos como stories y carruseles.",
    galleryProjectTochaSolution: "Desarrollé un lenguaje con jerarquía tipográfica agresiva, recortes precisos, ritmo de portadas y secuencias que guían la mirada. La estructura visual permite alternar análisis, opinión y llamada a comunidad sin perder unidad.",
    galleryProjectTochaResult: "El archivo pasó a funcionar como un sistema de autoridad: reconocible, expansible y preparado para distintos niveles de profundidad, desde un post único hasta una secuencia completa.",
    galleryTochaPiece01: "Post de autoridad",
    galleryTochaPiece02: "Frame de análisis",
    galleryTochaPiece03: "Pieza de posicionamiento",
    galleryTochaPiece04: "Contenido educativo",
    galleryTochaPiece05: "Post de retención",
    galleryTochaPiece06: "Llamada social",
    galleryTochaPiece07: "Post de comunidad",
    galleryTochaCarousel01: "Narrativa para negocios digitales",
    galleryTochaCarousel02: "Autoridad y presencia",
    galleryTochaCarousel03: "Educación visual",
    galleryTochaCarousel04: "Ritmo editorial",
    galleryTochaCarousel05: "Inversión y comunicación",
    galleryTochaCarousel06: "Construcción de repertorio",
    galleryTochaCarousel07: "Secuencia de autoridad",
    galleryTochaCarousel08: "Claridad para conversión",
    galleryTochaCarousel09: "Mensaje de impacto",
    galleryTochaStory01: "Story de apertura",
    galleryTochaStory02: "Story de secuencia",
    galleryTochaStory03: "Story de desarrollo",
    galleryTochaStory04: "Story de cierre",
    galleryTochaMockup: "Mockup The Real Tocha",
    galleryProjectSdpName: "SDP",
    galleryProjectSdpHeroTitle: "Servidor dos Programadores",
    galleryProjectSdpType: "Comunidad tech · Social media",
    galleryProjectSdpRole: "Sistema visual, campañas y comunicación de comunidad",
    galleryProjectSdpDescription: "Sistema visual para una comunidad de tecnología en crecimiento, uniendo campañas, eventos y comunicación recurrente.",
    galleryProjectSdpIntro: "Un sistema visual para comunidad tech, pensado para organizar información, crear energía de campaña y dar unidad a contenidos recurrentes sin rigidizar la comunicación.",
    galleryProjectSdpChallenge: "La comunidad necesitaba comunicar eventos, llamadas y contenidos educativos con claridad, pero también transmitir movimiento y pertenencia. El riesgo era parecer solo informativa, sin personalidad visual.",
    galleryProjectSdpSolution: "La solución combina grids directos, portadas de lectura rápida y secuencias de carrusel que crean progresión. El template visual da espacio al código, la comunidad y llamadas fuertes sin competir con el mensaje principal.",
    galleryProjectSdpResult: "El proyecto ganó una base flexible para campañas y comunicación continua, con piezas más fáciles de escalar y adaptar a diferentes momentos de la comunidad.",
    gallerySdpCarousel01: "Comunidad en movimiento",
    gallerySdpCarousel02: "Programación y comunidad",
    gallerySdpCarousel03: "Llamada editorial",
    gallerySdpCarousel04: "Campaña tech",
    gallerySdpCarousel05: "Engagement de la comunidad",
    gallerySdpCarousel06: "Secuencia especial",
    gallerySdpMockup: "Mockup SDP",
    galleryPlaygroundPiece01: "Estudio de composición",
    galleryPlaygroundPiece02: "Exploración tipográfica",
    galleryPlaygroundPiece03: "Concepto visual",
    galleryPlaygroundPiece04: "Pieza experimental",
    galleryPlaygroundPiece05: "Dirección visual libre",
    galleryPlaygroundPiece06: "Save Our Seas",
    galleryPlaygroundPiece07: "Estudio visual libre",















    moreAboutName: "Sarah Aliriel Dumitrache",
    moreAboutRole1: "Editora de Video",
    moreAboutRole2: "Diseñadora",
    moreAboutRole3: "Desarrolladora Frontend",
    moreAboutLocation: "Póvoa de Varzim, Portugal",
    moreAboutStoryKicker: "línea de tiempo",
    moreAboutStoryTitle: "Mi historia",
    moreAboutStory2019Title: "Todo empezó con un vídeo",
    moreAboutStory2019Body: "Empecé editando vídeos para YouTube solo por diversión. Sin darme cuenta, pasé horas estudiando cortes, ritmo y narrativa. Fue entonces cuando entendí que una buena edición puede transformar una escena común en algo imposible de ignorar.",
    moreAboutStory2022Title: "Descubrí el poder del movimiento",
    moreAboutStory2022Body: "Empecé a estudiar motion design y comprendí que cada animación, cada transición y cada detalle visual también cuentan una historia. Fue entonces cuando empecé a ver el diseño más allá de la estética.",
    moreAboutStory2025Title: "Llevé la creatividad al mercado",
    moreAboutStory2025Body: "Entré en el marketing digital trabajando con contenidos para redes sociales. Aprendí a equilibrar creatividad y estrategia, creando piezas pensadas para comunicar, conectar y generar resultados.",
    moreAboutStory2026Title: "Diseño, vídeo y código en un mismo proceso",
    moreAboutStory2026Body: "Hoy combino diseño, vídeo y desarrollo para crear experiencias digitales con intención. Cada detalle, desde el concepto hasta la interacción final, está pensado para comunicar algo, generar impacto y dejar una impresión duradera.",

    moreAboutMovesQuote: "Me gusta crear experiencias que hagan que las personas se detengan, sientan y recuerden.",
    moreAboutHelpTitle: "PUEDO AYUDAR CON...",
    moreAboutHelp01Title: "Diseño",
    moreAboutHelp01Items: "Identidad visual|Posts para redes sociales|Carruseles|Presentaciones|Interfaces digitales|Branding",
    moreAboutHelp02Title: "Edición de Video",
    moreAboutHelp02Items: "Short-form|Reels|TikTok|YouTube|Storytelling|Motion Graphics",
    moreAboutHelp03Title: "Sitios Web",
    moreAboutHelp03Items: "Landing Pages|Portfolios|Sitios institucionales|Frontend moderno|Animaciones|Experiencias interactivas",
    moreAboutHelp04Title: "✦ Paquete Completo",
    moreAboutHelp04Items: "Estrategia|Diseño|Contenido|Edición|Desarrollo",
    moreAboutStatsKicker: "En números",
    moreAboutStatsTitle: "Una historia que ganó escala.",
    moreAboutStatsIntro: "Lo que empezó por curiosidad se convirtió en práctica, experiencia e impacto. Estos números no resumen el camino: revelan hasta dónde ha llegado.",
    moreAboutStatYears: "años creando contenido",
    moreAboutStatYearsChapter: "tiempo",
    moreAboutStatProjects: "proyectos desarrollados",
    moreAboutStatProjectsChapter: "práctica",
    moreAboutStatViews: "de visualizaciones acumuladas",
    moreAboutStatViewsChapter: "impacto",
    moreAboutCtaLine1: "¿Lista para llevar",
    moreAboutCtaLine2: "una idea a la realidad?",
    moreAboutCtaButton: "HABLEMOS",
    moreAboutCtaResume: "Descargar currículum",

    moreAboutFooterEdition: "Edición",
    moreAboutFooterLocalTime: "Hora local · Portugal",
    moreAboutFooterSocials: "Redes",
  },
} as const

export type I18nKey = keyof typeof DICT.pt

type I18nCtx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (k: I18nKey) => string
}

const Ctx = createContext<I18nCtx | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt")

  useEffect(() => {
    const stored = (typeof window !== "undefined" ? window.localStorage.getItem("lang") : null) as Lang | null
    if (stored === "pt" || stored === "en" || stored === "es") {
      window.setTimeout(() => setLangState(stored), 0)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("lang", lang)
    if (typeof document !== "undefined") document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])

  const t = useCallback(
    (k: I18nKey) => {
      const table = DICT[lang] ?? DICT.pt
      return (table[k] ?? DICT.pt[k]) as string
    },
    [lang]
  )

  const value = useMemo<I18nCtx>(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider")
  return ctx
}
