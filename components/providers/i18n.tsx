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
    menuFun: "Vamos criar algo fora do padrão XD",
    linkAbout: "Sobre",
    linkWork: "Projetos",
    linkGallery: "Galeria",
    linkContact: "Contato",

    introStarting: "iniciando",
    introLoading: "carregando",
    introHint: "clique ou enter",

    cursorView: "Ver",

    heroAvailable: "Disponível para projetos",
    heroRole1: "Editora de Vídeos",
    heroRole2: "Frontend Developer",
    heroRole3: "Mídias Sociais",

    aboutHello: "Olá, sou\nSarah Aliriel\nDumitrache!",
    aboutBio:
      "Desde os 13 anos, atuo com edição de vídeos para redes sociais, iniciando como prática pessoal e evoluindo para uma atuação profissional focada em performance e storytelling digital.\nTenho experiência sólida com ferramentas como Alight Motion e CapCut Pro, aplicadas na criação de conteúdos otimizados para alcance, retenção e engajamento.\nAtualmente, trabalho na área de marketing, desenvolvendo conteúdos estratégicos para redes sociais e para todo o ecossistema do Bitalk Negócios à Portuguesa, alinhando criatividade, identidade visual e objetivos de comunicação.",
    aboutManifestAuxStart: "(edit)",
    aboutManifestLine1: "transformo vídeos,",
    aboutManifestLine2: "design e direção criativa",
    aboutManifestLine3: "em experiências digitais",
    aboutManifestLine4: "para marcas que precisam",
    aboutManifestLine5: "de presença,",
    aboutManifestLine6: "ritmo,",
    aboutManifestLine7: "clareza",
    aboutManifestAuxEnd: "(and strategy)",
    aboutManifestLine8: "e movimento.",
    aboutManifestLine9: "também desenvolvo",
    aboutManifestLine10: "social media,",
    aboutManifestLine11: "identidade visual,",
    aboutManifestLine12: "sites",
    aboutManifestLine13: "e sistemas criativos",
    aboutManifestLine14: "para negócios que querem ser lembrados.",
    aboutManifestCta: "+ SOBRE MIM",
    aboutManifestCtaHover: "LER HISTÓRIA",

    projectsTitle: "Projetos",
    projectsEntries: "entradas",
    projectsCuration: "Curadoria editorial",
    projectsDesc:
      "Trabalhos selecionados com foco em performance e estética: estrutura narrativa, ritmo de corte, consistência visual e execução pensada para plataformas sociais.",
    projectsColClient: "CLIENT",
    projectsColLocation: "LOCATION",
    projectsColServices: "SERVICES",
    projectsColYear: "YEAR",
    projectsOpen: "ABRIR",
    projectsPlay: "Play",
    projectsModalAria: "Vídeo do projeto",
    projectsClose: "Fechar",
    projectsNoVideoTitle: "Sem vídeo associado",
    projectsNoVideoBody: "Adiciona o campo video neste projeto para abrir aqui.",
    projectsClickOutside: "clique fora para fechar",
    projectsServicesLabel: "SERVICES",
    projectsModalHeadline: "Social first, digitally native campaigns para marcas que toda a gente reconhece.",
    projectsModalBody: "Aqui tu mostras o projeto com um layout editorial bem forte. Podes trocar este texto por um mini case study: objetivo, abordagem, ferramentas e resultado.",
    projectsModalMeta1Title: "SERVIÇOS",
    projectsModalMeta2Title: "LOCAL",
    projectsModalMeta3Title: "ANO",
    projectsBack: "Voltar",

    allprojectsHeroTitle: "Projetos",

    allprojectsKicker1: "capítulo 01",
    allprojectsTitle1: "CREATIVE LAB",
    allprojectsDesc1: "Edições experimentais onde exploro ritmo, transitions, glitch e typography. É aqui que a minha linguagem visual fica mais forte.",

    allprojectsKicker2: "capítulo 02",
    allprojectsTitle2: "SHORT-FORM & SOCIAL",
    allprojectsDesc2: "Edições rápidas focadas em retenção, clareza e ritmo. Feitas para TikTok, Reels e Shorts.",

    allprojectsKicker4: "capítulo 04",
    allprojectsTitle4: "STORYTELLING",
    allprojectsDesc4: "Edições mais longas com foco em estrutura, narrativa e flow.",

    allprojectsCount: "vídeos",
    allprojectsView: "ver",
    allprojectsClipLabel: "clip",
    allprojectsClipTitle: "Edição selecionada",
    allprojectsFloating: "mini player",

    allprojectsClose: "Fechar",
    allprojectsMinimize: "Diminuir",
    allprojectsExpand: "Expandir",
    allprojectsSoundOn: "Ativar som",
    allprojectsSoundOff: "Silenciar",

    projectsAllCta: "Todos os Projetos",

    p1Client: "Cortes",
    p1Services: "Edição Short-form, Motion",
    p1Location: "Lisboa",

    p2Client: "Cortes dinâmicos",
    p2Services: "Direção, Edição, Identidade",
    p2Location: "Lisboa",

    p3Client: "Storytelling",
    p3Services: "Edição Long-form, stop motion",
    p3Location: "Remoto",

    p4Client: "UGC Blablabla",
    p4Services: "Edição",
    p4Location: "Remoto",

    galleryTitle: "Designs que seguram o scroll",
    galleryDesc:
      "Seleção de peças criadas para Instagram e LinkedIn, incluindo feed, stories e carrosséis. O foco é clareza, ritmo visual e consistência de marca entre formatos.",
    galleryTagFeed: "feed",
    galleryTagStory: "story",
    galleryTagCarousel: "carrossel",
    galleryCaptionA: "Movimento contínuo para mostrar variedade.",
    galleryCaptionB: "Pausa no hover para observar tipografia, hierarquia e tratamento visual.",

    contactKicker: "contacto",
    contactTitle: "VAMOS CONVERSAR",
    contactBody:
      "Algum projeto em mente, precisa de uma edição profissional ou quer simplesmente trocar ideias? Envia uma mensagem e começamos por aí!",
    contactNamePh: "O teu nome",
    contactEmailPh: "O teu email",
    contactMsgPh: "Me conte sobre o projeto",
    contactSend: "Enviar mensagem",
    contactSending: "a enviar",
    contactOkKicker: "Enviado com sucesso",
    contactOkTitle: "Mensagem recebida!",
    contactOkBody:
      "Obrigada por confiar no meu trabalho. Se for algo urgente, pode chamar também pelas minhas redes sociais. Fico no aguardo para conversarmos sobre o seu projeto!",
    contactSendAnother: "Enviar outra mensagem",
    contactErrSend: "Não foi possível enviar agora.",
    contactErrGeneric: "Ocorreu um erro.",

    moreAboutMetaTitle: "Mais Sobre Sarah Aliriel Dumitrache",
    moreAboutMetaDescription:
      "Conheça a evolução criativa de Sarah Aliriel Dumitrache, do vídeo ao design e desenvolvimento frontend.",
    moreAboutHeroTitle1: "MAIS",
    moreAboutHeroTitle2: "SOBRE",
    moreAboutHeroTitle3: "MIM",
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
    moreAboutMovesKicker: "O que me move",
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
    moreAboutCtaEyebrow: "Uma ideia pode começar aqui",
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
    menuFun: "Let’s build something not basic XD",
    linkAbout: "About",
    linkWork: "Work",
    linkGallery: "Gallery",
    linkContact: "Contact",

    introStarting: "starting",
    introLoading: "loading",
    introHint: "click or enter",

    cursorView: "View",

    heroAvailable: "Available for projects",
    heroRole1: "Video Editor",
    heroRole2: "Frontend Developer",
    heroRole3: "Social Media",

    aboutHello: "Hi, I’m\nSarah Aliriel\nDumitrache!",
    aboutBio:
      "Since I was 13, I’ve been editing videos for social media, starting as a personal passion and evolving into professional work focused on performance and digital storytelling.\nI have solid experience with tools like Alight Motion and CapCut Pro, used to create content optimized for reach, retention and engagement.\nCurrently, I work in marketing, building strategic content for social media and for the full Bitalk Negócios à Portuguesa ecosystem, aligning creativity, visual identity and communication goals.",
    aboutManifestAuxStart: "(edit)",
    aboutManifestLine1: "I transform video,",
    aboutManifestLine2: "design and creative direction",
    aboutManifestLine3: "into digital experiences",
    aboutManifestLine4: "for brands that need",
    aboutManifestLine5: "presence,",
    aboutManifestLine6: "rhythm,",
    aboutManifestLine7: "clarity",
    aboutManifestAuxEnd: "(and strategy)",
    aboutManifestLine8: "and motion.",
    aboutManifestLine9: "I also build",
    aboutManifestLine10: "social media,",
    aboutManifestLine11: "visual identity,",
    aboutManifestLine12: "sites",
    aboutManifestLine13: "and creative systems",
    aboutManifestLine14: "for businesses made to be remembered.",
    aboutManifestCta: "+ ABOUT ME",
    aboutManifestCtaHover: "READ STORY",

    projectsTitle: "Projects",
    projectsEntries: "entries",
    projectsCuration: "Editorial curation",
    projectsDesc:
      "Selected work with performance and aesthetics in mind: narrative structure, cutting rhythm, visual consistency and platform focused execution.",
    projectsColClient: "CLIENT",
    projectsColLocation: "LOCATION",
    projectsColServices: "SERVICES",
    projectsColYear: "YEAR",
    projectsOpen: "OPEN",
    projectsPlay: "Play",
    projectsModalAria: "Project video",
    projectsClose: "Close",
    projectsNoVideoTitle: "No video attached",
    projectsNoVideoBody: "Add the video field in this project to open it here.",
    projectsClickOutside: "click outside to close",
    projectsServicesLabel: "SERVICES",
    projectsModalHeadline: "Social first, digitally native campaigns for brands people instantly recognize.",
    projectsModalBody: "Show the project with an editorial layout. Replace this with a short case study: goal, approach, tools and outcome.",
    projectsModalMeta1Title: "SERVICES",
    projectsModalMeta2Title: "LOCATION",
    projectsModalMeta3Title: "YEAR",
    projectsBack: "Back",

    allprojectsHeroTitle: "Projects",

    allprojectsKicker1: "chapter 01",
    allprojectsTitle1: "CREATIVE LAB",
    allprojectsDesc1: "Experimental edits where I explore rhythm, transitions, glitch and typography. This is where my strongest visual language comes from.",

    allprojectsKicker2: "chapter 02",
    allprojectsTitle2: "SHORT-FORM & SOCIAL",
    allprojectsDesc2: "Fast-paced edits focused on retention, clarity and rhythm. Built for TikTok, Reels and Shorts.",

    allprojectsKicker4: "chapter 04",
    allprojectsTitle4: "STORYTELLING",
    allprojectsDesc4: "Longer edits focused on structure, narrative and flow.",

    allprojectsCount: "videos",
    allprojectsView: "view",
    allprojectsClipLabel: "clip",
    allprojectsClipTitle: "Selected edit",
    allprojectsFloating: "mini player",

    allprojectsClose: "Close",
    allprojectsMinimize: "Minimize",
    allprojectsExpand: "Expand",
    allprojectsSoundOn: "Sound on",
    allprojectsSoundOff: "Mute",

    projectsAllCta: "All Projects →",

    p1Client: "Cuts with rhythm and retention",
    p1Services: "Short-form editing, Motion",
    p1Location: "Lisbon, PT",

    p2Client: "Editorial content for a brand",
    p2Services: "Direction, Editing, Identity",
    p2Location: "Porto, PT",

    p3Client: "Storytelling",
    p3Services: "Long-form editing, stop motion",
    p3Location: "Remote",

    p4Client: "UGC Blablabla",
    p4Services: "Editing",
    p4Location: "Remote",

    galleryTitle: "Designs that stop the scroll",
    galleryDesc:
      "A selection of pieces created for Instagram and LinkedIn, including feed, stories and carousels. The focus is clarity, visual rhythm and brand consistency across formats.",
    galleryTagFeed: "feed",
    galleryTagStory: "story",
    galleryTagCarousel: "carousel",
    galleryCaptionA: "Continuous movement to show variety.",
    galleryCaptionB: "Pause on hover to see typography, hierarchy and visual treatment.",

    contactKicker: "contact",
    contactTitle: "LET’S TALK",
    contactBody:
      "Got a project in mind, need pro editing, or just want to brainstorm? Send a message and we’ll start there!",
    contactNamePh: "Your name",
    contactEmailPh: "Your email",
    contactMsgPh: "Tell me about the project",
    contactSend: "Send message",
    contactSending: "sending",
    contactOkKicker: "Sent successfully",
    contactOkTitle: "Message received!",
    contactOkBody:
      "Thanks for trusting my work. If it’s urgent, you can also reach me on my social channels. Can’t wait to talk about your project!",
    contactSendAnother: "Send another message",
    contactErrSend: "Could not send right now.",
    contactErrGeneric: "Something went wrong.",

    moreAboutMetaTitle: "More About Sarah Aliriel Dumitrache",
    moreAboutMetaDescription:
      "Explore Sarah Aliriel Dumitrache's creative evolution across video, design and frontend development.",
    moreAboutHeroTitle1: "MORE",
    moreAboutHeroTitle2: "ABOUT",
    moreAboutHeroTitle3: "ME",
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
    moreAboutMovesKicker: "What moves me",
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
    moreAboutCtaEyebrow: "An idea can start here",
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
    menuFun: "Vamos a crear algo fuera de lo común XD",
    linkAbout: "Sobre mí",
    linkWork: "Proyectos",
    linkGallery: "Galería",
    linkContact: "Contacto",

    introStarting: "iniciando",
    introLoading: "cargando",
    introHint: "clic o enter",

    cursorView: "Ver",

    heroAvailable: "Disponible para proyectos",
    heroRole1: "Editora de Video",
    heroRole2: "Frontend Developer",
    heroRole3: "Redes Sociales",

    aboutHello: "Hola, soy\nSarah Aliriel\nDumitrache!",
    aboutBio:
      "Desde los 13 años edito videos para redes sociales, empezando como una pasión personal y evolucionando hacia un trabajo profesional enfocado en rendimiento y storytelling digital.\nTengo experiencia sólida con herramientas como Alight Motion y CapCut Pro, aplicadas a la creación de contenido optimizado para alcance, retención y engagement.\nActualmente trabajo en marketing, creando contenido estratégico para redes sociales y para todo el ecosistema de Bitalk Negócios à Portuguesa, alineando creatividad, identidad visual y objetivos de comunicación.",
    aboutManifestAuxStart: "(edit)",
    aboutManifestLine1: "transformo videos,",
    aboutManifestLine2: "diseño y dirección creativa",
    aboutManifestLine3: "en experiencias digitales",
    aboutManifestLine4: "para marcas que necesitan",
    aboutManifestLine5: "presencia,",
    aboutManifestLine6: "ritmo,",
    aboutManifestLine7: "claridad",
    aboutManifestAuxEnd: "(and strategy)",
    aboutManifestLine8: "y movimiento.",
    aboutManifestLine9: "también desarrollo",
    aboutManifestLine10: "social media,",
    aboutManifestLine11: "identidad visual,",
    aboutManifestLine12: "sites",
    aboutManifestLine13: "y sistemas creativos",
    aboutManifestLine14: "para negocios que quieren ser recordados.",
    aboutManifestCta: "+ SOBRE MÍ",
    aboutManifestCtaHover: "LEER HISTORIA",

    projectsTitle: "Proyectos",
    projectsEntries: "entradas",
    projectsCuration: "Curaduría editorial",
    projectsDesc:
      "Trabajos seleccionados con foco en rendimiento y estética: estructura narrativa, ritmo de corte, consistencia visual y ejecución pensada para plataformas sociales.",
    projectsColClient: "CLIENT",
    projectsColLocation: "LOCATION",
    projectsColServices: "SERVICES",
    projectsColYear: "YEAR",
    projectsOpen: "ABRIR",
    projectsPlay: "Play",
    projectsModalAria: "Video del proyecto",
    projectsClose: "Cerrar",
    projectsNoVideoTitle: "Sin video asociado",
    projectsNoVideoBody: "Agrega el campo video en este proyecto para abrirlo aquí.",
    projectsClickOutside: "clic fuera para cerrar",
    projectsServicesLabel: "SERVICES",
    projectsModalHeadline: "Campañas social first y digitales para marcas que todo el mundo reconoce.",
    projectsModalBody: "Muestra el proyecto con un layout editorial. Cambia este texto por un mini caso: objetivo, enfoque, herramientas y resultado.",
    projectsModalMeta1Title: "SERVICIOS",
    projectsModalMeta2Title: "UBICACIÓN",
    projectsModalMeta3Title: "AÑO",
    projectsBack: "Volver",

    allprojectsHeroTitle: "Proyectos",

    allprojectsKicker1: "capítulo 01",
    allprojectsTitle1: "CREATIVE LAB",
    allprojectsDesc1: "Ediciones experimentales donde exploro ritmo, transiciones, glitch y tipografía. Aquí es donde mi lenguaje visual se hace más fuerte.",

    allprojectsKicker2: "capítulo 02",
    allprojectsTitle2: "SHORT-FORM & SOCIAL",
    allprojectsDesc2: "Ediciones rápidas enfocadas en retención, claridad y ritmo. Pensadas para TikTok, Reels y Shorts.",

    allprojectsKicker4: "capítulo 04",
    allprojectsTitle4: "STORYTELLING",
    allprojectsDesc4: "Ediciones más largas centradas en estructura, narrativa y flow.",

    allprojectsCount: "videos",
    allprojectsView: "ver",
    allprojectsClipLabel: "clip",
    allprojectsClipTitle: "Edición seleccionada",
    allprojectsFloating: "mini player",

    allprojectsClose: "Cerrar",
    allprojectsMinimize: "Minimizar",
    allprojectsExpand: "Expandir",
    allprojectsSoundOn: "Activar sonido",
    allprojectsSoundOff: "Silenciar",

    projectsAllCta: "Todos los Proyectos →",

    p1Client: "Cortes con ritmo y retención",
    p1Services: "Edición short-form, Motion",
    p1Location: "Lisboa, PT",

    p2Client: "Contenido editorial para marca",
    p2Services: "Dirección, Edición, Identidad",
    p2Location: "Porto, PT",

    p3Client: "Storytelling con cortes invisibles",
    p3Services: "Edición long-form, Sonido",
    p3Location: "Remoto",

    p4Client: "UGC Blablabla",
    p4Services: "Edición",
    p4Location: "Remoto",

    galleryTitle: "Diseños que frenan el scroll",
    galleryDesc:
      "Selección de piezas creadas para Instagram y LinkedIn, incluyendo feed, stories y carruseles. El foco es claridad, ritmo visual y consistencia de marca entre formatos.",
    galleryTagFeed: "feed",
    galleryTagStory: "story",
    galleryTagCarousel: "carrusel",
    galleryCaptionA: "Movimiento continuo para mostrar variedad.",
    galleryCaptionB: "Pausa en hover para observar tipografía, jerarquía y tratamiento visual.",

    contactKicker: "contacto",
    contactTitle: "HABLEMOS",
    contactBody:
      "¿Tienes un proyecto en mente, necesitas una edición profesional o quieres intercambiar ideas? Envíame un mensaje y empezamos por ahí.",
    contactNamePh: "Tu nombre",
    contactEmailPh: "Tu email",
    contactMsgPh: "Cuéntame sobre el proyecto",
    contactSend: "Enviar mensaje",
    contactSending: "enviando",
    contactOkKicker: "Enviado con éxito",
    contactOkTitle: "¡Mensaje recibido!",
    contactOkBody:
      "Gracias por confiar en mi trabajo. Si es urgente, también puedes contactarme por mis redes sociales. ¡Quedo atenta para hablar de tu proyecto!",
    contactSendAnother: "Enviar otro mensaje",
    contactErrSend: "No se pudo enviar ahora.",
    contactErrGeneric: "Ocurrió un error.",

    moreAboutMetaTitle: "Más Sobre Sarah Aliriel Dumitrache",
    moreAboutMetaDescription:
      "Conoce la evolución creativa de Sarah Aliriel Dumitrache entre video, diseño y desarrollo frontend.",
    moreAboutHeroTitle1: "MÁS",
    moreAboutHeroTitle2: "SOBRE",
    moreAboutHeroTitle3: "MÍ",
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
    moreAboutMovesKicker: "Lo que me mueve",
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
    moreAboutCtaEyebrow: "Una idea puede empezar aquí",
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