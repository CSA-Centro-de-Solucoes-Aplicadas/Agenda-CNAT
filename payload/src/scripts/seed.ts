import 'dotenv/config'
import { getPayload, Payload } from 'payload'
import config from '../payload.config'

// Helper para criar datas relativas a hoje
function addDays(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

function setTime(date: Date, hours: number, minutes: number = 0): string {
  const d = new Date(date)
  d.setHours(hours, minutes, 0, 0)
  return d.toISOString()
}

async function run() {
  const payloadConfig = await config
  const payload: Payload = await getPayload({ config: payloadConfig })

  console.log('🌱 Iniciando seed de eventos...\n')

  const events = [
    // ══════════════════════════════════════════════════════════════════
    // TECNOLOGIA
    // ══════════════════════════════════════════════════════════════════
    {
      titulo: 'Hackathon IFRN 2026',
      descricao: 'Maratona de programação com desafios reais de empresas parceiras. Forme sua equipe e desenvolva soluções inovadoras em 48 horas.',
      dataInscricaoInicio: setTime(addDays(-10), 9),
      dataInscricaoFinal: setTime(addDays(5), 23, 59),
      dataEventoInicio: setTime(addDays(10), 8),
      dataEventoFinal: setTime(addDays(12), 18),
      categorias: [{ nome: 'Tecnologia' }],
      local: 'Laboratório de Informática - Bloco A',
      organizadores: [{ email: 'tecnologia@ifrn.edu.br' }, { email: 'eventos@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Workshop de Inteligência Artificial',
      descricao: 'Introdução prática ao Machine Learning e Deep Learning usando Python e TensorFlow. Aprenda a criar seus próprios modelos de IA.',
      dataInscricaoInicio: setTime(addDays(-5), 8),
      dataInscricaoFinal: setTime(addDays(3), 23, 59),
      dataEventoInicio: setTime(addDays(7), 14),
      dataEventoFinal: setTime(addDays(7), 18),
      categorias: [{ nome: 'Tecnologia' }],
      local: 'Auditório Central',
      organizadores: [{ email: 'ia@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Semana de Tecnologia da Informação',
      descricao: 'Uma semana inteira dedicada à tecnologia com palestras, minicursos e apresentações de projetos dos alunos.',
      dataInscricaoInicio: setTime(addDays(-15), 8),
      dataInscricaoFinal: setTime(addDays(8), 23, 59),
      dataEventoInicio: setTime(addDays(14), 8),
      dataEventoFinal: setTime(addDays(18), 17),
      categorias: [{ nome: 'Tecnologia' }],
      local: 'Bloco de Informática',
      organizadores: [{ email: 'coord.ti@ifrn.edu.br' }],
      visivel: true,
    },

    // ══════════════════════════════════════════════════════════════════
    // ENSINO
    // ══════════════════════════════════════════════════════════════════
    {
      titulo: 'Feira de Ciências 2026',
      descricao: 'Apresentação de projetos científicos desenvolvidos pelos alunos durante o semestre. Venha conhecer as inovações dos nossos estudantes!',
      dataInscricaoInicio: setTime(addDays(-20), 8),
      dataInscricaoFinal: setTime(addDays(-2), 23, 59),
      dataEventoInicio: setTime(addDays(3), 9),
      dataEventoFinal: setTime(addDays(4), 17),
      categorias: [{ nome: 'Ensino' }],
      local: 'Pátio Central',
      organizadores: [{ email: 'pedagogia@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Olimpíada de Matemática IFRN',
      descricao: 'Competição matemática aberta a todos os alunos do campus. Prêmios para os três primeiros colocados de cada categoria.',
      dataInscricaoInicio: setTime(addDays(-7), 8),
      dataInscricaoFinal: setTime(addDays(7), 18),
      dataEventoInicio: setTime(addDays(14), 9),
      dataEventoFinal: setTime(addDays(14), 12),
      categorias: [{ nome: 'Ensino' }],
      local: 'Salas de Aula - Bloco B',
      organizadores: [{ email: 'matematica@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Aulão Preparatório ENEM',
      descricao: 'Revisão intensiva das principais matérias para o ENEM. Professores de todas as áreas reunidos para ajudar você a alcançar seus objetivos.',
      dataInscricaoInicio: setTime(addDays(-3), 8),
      dataInscricaoFinal: setTime(addDays(1), 23, 59),
      dataEventoInicio: setTime(addDays(5), 8),
      dataEventoFinal: setTime(addDays(6), 18),
      categorias: [{ nome: 'Ensino' }],
      local: 'Auditório Principal',
      organizadores: [{ email: 'enem@ifrn.edu.br' }, { email: 'coordenacao@ifrn.edu.br' }],
      visivel: true,
    },

    // ══════════════════════════════════════════════════════════════════
    // PESQUISA E EXTENSÃO
    // ══════════════════════════════════════════════════════════════════
    {
      titulo: 'Congresso de Iniciação Científica',
      descricao: 'Apresentação de trabalhos de pesquisa desenvolvidos por alunos bolsistas PIBIC e voluntários. Premiação para os melhores trabalhos.',
      dataInscricaoInicio: setTime(addDays(-30), 8),
      dataInscricaoFinal: setTime(addDays(-5), 23, 59),
      dataEventoInicio: setTime(addDays(2), 8),
      dataEventoFinal: setTime(addDays(4), 18),
      categorias: [{ nome: 'Pesquisa e Extensão' }],
      local: 'Centro de Convenções',
      organizadores: [{ email: 'pesquisa@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Palestra: Sustentabilidade e Meio Ambiente',
      descricao: 'Discussão sobre práticas sustentáveis e a importância da preservação ambiental. Palestrante convidado do IBAMA.',
      dataInscricaoInicio: setTime(addDays(-5), 8),
      dataInscricaoFinal: setTime(addDays(2), 18),
      dataEventoInicio: setTime(addDays(6), 14),
      dataEventoFinal: setTime(addDays(6), 17),
      categorias: [{ nome: 'Pesquisa e Extensão' }],
      local: 'Biblioteca Central',
      organizadores: [{ email: 'extensao@ifrn.edu.br' }],
      visivel: true,
    },

    // ══════════════════════════════════════════════════════════════════
    // ARTE E CULTURA
    // ══════════════════════════════════════════════════════════════════
    {
      titulo: 'Festival de Música IFRN',
      descricao: 'Apresentações musicais de alunos, servidores e convidados. Diversos gêneros musicais em uma noite especial.',
      dataInscricaoInicio: setTime(addDays(-10), 8),
      dataInscricaoFinal: setTime(addDays(5), 23, 59),
      dataEventoInicio: setTime(addDays(15), 19),
      dataEventoFinal: setTime(addDays(15), 23),
      categorias: [{ nome: 'Arte e Cultura' }],
      local: 'Anfiteatro',
      organizadores: [{ email: 'cultura@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Exposição de Artes Visuais',
      descricao: 'Mostra de trabalhos artísticos desenvolvidos nas disciplinas de artes. Pinturas, esculturas e instalações.',
      dataInscricaoInicio: setTime(addDays(-15), 8),
      dataInscricaoFinal: setTime(addDays(-1), 18),
      dataEventoInicio: setTime(addDays(1), 9),
      dataEventoFinal: setTime(addDays(7), 18),
      categorias: [{ nome: 'Arte e Cultura' }],
      local: 'Galeria de Arte - Bloco C',
      organizadores: [{ email: 'artes@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Oficina de Teatro',
      descricao: 'Aprenda técnicas de improvisação, expressão corporal e interpretação. Aberto a iniciantes.',
      dataInscricaoInicio: setTime(addDays(-8), 8),
      dataInscricaoFinal: setTime(addDays(3), 23, 59),
      dataEventoInicio: setTime(addDays(8), 14),
      dataEventoFinal: setTime(addDays(10), 17),
      categorias: [{ nome: 'Arte e Cultura' }],
      local: 'Sala de Artes',
      organizadores: [{ email: 'teatro@ifrn.edu.br' }],
      visivel: true,
    },

    // ══════════════════════════════════════════════════════════════════
    // ESPORTE
    // ══════════════════════════════════════════════════════════════════
    {
      titulo: 'Campeonato de Futsal Intercursos',
      descricao: 'Competição de futsal entre as turmas do campus. Inscreva sua equipe e dispute o título de campeão!',
      dataInscricaoInicio: setTime(addDays(-12), 8),
      dataInscricaoFinal: setTime(addDays(4), 23, 59),
      dataEventoInicio: setTime(addDays(10), 8),
      dataEventoFinal: setTime(addDays(24), 18),
      categorias: [{ nome: 'Esporte' }],
      local: 'Ginásio Poliesportivo',
      organizadores: [{ email: 'esportes@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Corrida IFRN 5K',
      descricao: 'Corrida de rua aberta à comunidade acadêmica. Percurso de 5km com largada no campus.',
      dataInscricaoInicio: setTime(addDays(-20), 8),
      dataInscricaoFinal: setTime(addDays(1), 23, 59),
      dataEventoInicio: setTime(addDays(8), 6),
      dataEventoFinal: setTime(addDays(8), 10),
      categorias: [{ nome: 'Esporte' }],
      local: 'Entrada Principal',
      organizadores: [{ email: 'educacaofisica@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Torneio de Vôlei',
      descricao: 'Torneio de vôlei misto aberto a todas as turmas. Venha participar e torcer pelo seu time!',
      dataInscricaoInicio: setTime(addDays(-5), 8),
      dataInscricaoFinal: setTime(addDays(6), 18),
      dataEventoInicio: setTime(addDays(12), 14),
      dataEventoFinal: setTime(addDays(14), 18),
      categorias: [{ nome: 'Esporte' }],
      local: 'Quadra Descoberta',
      organizadores: [{ email: 'volei@ifrn.edu.br' }],
      visivel: true,
    },

    // ══════════════════════════════════════════════════════════════════
    // GESTÃO
    // ══════════════════════════════════════════════════════════════════
    {
      titulo: 'Workshop de Empreendedorismo',
      descricao: 'Aprenda a transformar suas ideias em negócios. Palestras com empreendedores de sucesso e mentoria.',
      dataInscricaoInicio: setTime(addDays(-7), 8),
      dataInscricaoFinal: setTime(addDays(5), 23, 59),
      dataEventoInicio: setTime(addDays(9), 9),
      dataEventoFinal: setTime(addDays(9), 17),
      categorias: [{ nome: 'Gestão' }],
      local: 'Sala de Reuniões - Administrativo',
      organizadores: [{ email: 'empreendedorismo@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Capacitação em Gestão de Projetos',
      descricao: 'Curso introdutório sobre metodologias ágeis e gestão de projetos. Certificado de participação.',
      dataInscricaoInicio: setTime(addDays(-10), 8),
      dataInscricaoFinal: setTime(addDays(2), 23, 59),
      dataEventoInicio: setTime(addDays(5), 14),
      dataEventoFinal: setTime(addDays(7), 18),
      categorias: [{ nome: 'Gestão' }],
      local: 'Auditório Secundário',
      organizadores: [{ email: 'gestao@ifrn.edu.br' }],
      visivel: true,
    },

    // ══════════════════════════════════════════════════════════════════
    // RECURSOS NATURAIS
    // ══════════════════════════════════════════════════════════════════
    {
      titulo: 'Dia de Campo: Agricultura Sustentável',
      descricao: 'Atividades práticas no campo experimental. Aprenda técnicas de plantio sustentável e compostagem.',
      dataInscricaoInicio: setTime(addDays(-5), 8),
      dataInscricaoFinal: setTime(addDays(3), 18),
      dataEventoInicio: setTime(addDays(7), 7),
      dataEventoFinal: setTime(addDays(7), 12),
      categorias: [{ nome: 'Recursos naturais' }],
      local: 'Campo Experimental',
      organizadores: [{ email: 'agronomia@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Semana do Meio Ambiente',
      descricao: 'Palestras, oficinas e plantio de mudas. Uma semana dedicada à conscientização ambiental.',
      dataInscricaoInicio: setTime(addDays(-14), 8),
      dataInscricaoFinal: setTime(addDays(7), 23, 59),
      dataEventoInicio: setTime(addDays(14), 8),
      dataEventoFinal: setTime(addDays(19), 17),
      categorias: [{ nome: 'Recursos naturais' }],
      local: 'Área Verde - Campus',
      organizadores: [{ email: 'meioambiente@ifrn.edu.br' }],
      visivel: true,
    },

    // ══════════════════════════════════════════════════════════════════
    // SAÚDE
    // ══════════════════════════════════════════════════════════════════
    {
      titulo: 'Campanha de Doação de Sangue',
      descricao: 'Doe sangue e salve vidas! Parceria com o Hemocentro. Atendimento das 8h às 16h.',
      dataInscricaoInicio: setTime(addDays(-7), 8),
      dataInscricaoFinal: setTime(addDays(0), 23, 59),
      dataEventoInicio: setTime(addDays(3), 8),
      dataEventoFinal: setTime(addDays(3), 16),
      categorias: [{ nome: 'Saúde' }],
      local: 'Ambulatório',
      organizadores: [{ email: 'saude@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Palestra: Saúde Mental na Universidade',
      descricao: 'Discussão sobre ansiedade, depressão e estratégias de autocuidado para estudantes.',
      dataInscricaoInicio: setTime(addDays(-5), 8),
      dataInscricaoFinal: setTime(addDays(4), 23, 59),
      dataEventoInicio: setTime(addDays(8), 14),
      dataEventoFinal: setTime(addDays(8), 16),
      categorias: [{ nome: 'Saúde' }],
      local: 'Auditório Central',
      organizadores: [{ email: 'psicologia@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Feira de Saúde e Bem-Estar',
      descricao: 'Aferição de pressão, glicemia, orientação nutricional e muito mais. Cuide da sua saúde!',
      dataInscricaoInicio: setTime(addDays(-3), 8),
      dataInscricaoFinal: setTime(addDays(4), 18),
      dataEventoInicio: setTime(addDays(6), 9),
      dataEventoFinal: setTime(addDays(6), 15),
      categorias: [{ nome: 'Saúde' }],
      local: 'Pátio Central',
      organizadores: [{ email: 'enfermagem@ifrn.edu.br' }],
      visivel: true,
    },

    // ══════════════════════════════════════════════════════════════════
    // PALESTRAS
    // ══════════════════════════════════════════════════════════════════
    {
      titulo: 'Palestra: Carreira em TI',
      descricao: 'Profissionais do mercado compartilham suas experiências e dão dicas para quem quer ingressar na área de tecnologia.',
      dataInscricaoInicio: setTime(addDays(-8), 8),
      dataInscricaoFinal: setTime(addDays(2), 23, 59),
      dataEventoInicio: setTime(addDays(5), 19),
      dataEventoFinal: setTime(addDays(5), 21),
      categorias: [{ nome: 'Palestra' }],
      local: 'Auditório Central',
      organizadores: [{ email: 'carreiras@ifrn.edu.br' }],
      visivel: true,
    },
    {
      titulo: 'Palestra: O Futuro da Educação',
      descricao: 'Tendências educacionais para os próximos anos. Como a tecnologia está transformando o ensino.',
      dataInscricaoInicio: setTime(addDays(-6), 8),
      dataInscricaoFinal: setTime(addDays(6), 18),
      dataEventoInicio: setTime(addDays(10), 14),
      dataEventoFinal: setTime(addDays(10), 16),
      categorias: [{ nome: 'Palestra' }],
      local: 'Biblioteca Central',
      organizadores: [{ email: 'pedagogia@ifrn.edu.br' }],
      visivel: true,
    },
  ]

  let criados = 0
  let existentes = 0

  for (const ev of events) {
    // Se um evento com o mesmo título existe, pula
    const exists = await payload.find({
      collection: 'eventos',
      where: { titulo: { equals: ev.titulo } },
    })

    if (exists.totalDocs > 0) {
      console.log(`⏭️  Já existe: ${ev.titulo}`)
      existentes++
      continue
    }

    await payload.create({ collection: 'eventos', data: ev })
    console.log(`✅ Criado: ${ev.titulo}`)
    criados++
  }

  console.log('\n═══════════════════════════════════════')
  console.log(`🌱 Seed finalizado!`)
  console.log(`   ✅ Criados: ${criados}`)
  console.log(`   ⏭️  Já existentes: ${existentes}`)
  console.log(`   📊 Total de eventos no seed: ${events.length}`)
  console.log('═══════════════════════════════════════\n')

  process.exit(0)
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Erro durante o seed:', err)
  process.exit(1)
})
