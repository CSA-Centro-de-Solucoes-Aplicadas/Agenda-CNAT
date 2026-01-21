import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Eventos: CollectionConfig = {
  slug: 'eventos',
  labels: {
    singular: 'Evento',
    plural: 'Eventos',
  },
  admin: {
    useAsTitle: 'titulo',
  },
  timestamps: true,
  access: {
    read: () => true, // leitura pública
    create: ({ req }) => !!req.user, // qualquer usuário autenticado
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
    },
    {
      name: 'descricao',
      type: 'text'
    },
    {
      name: 'dataInscricaoInicio',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'dataInscricaoFinal',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'dataEventoInicio',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'dataEventoFinal',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'categorias',
      type: 'array',
      fields: [
        {
          name: 'nome',
          type: 'text',
        },
      ],
    },
    {
      name: 'local',
      type: 'text',
    },
    {
      name: 'colaboradores',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'visivel',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
