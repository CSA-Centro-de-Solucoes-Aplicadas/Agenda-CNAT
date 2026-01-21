import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Role to distinguish normal users and super admins
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: [
        {
          label: 'Usuário',
          value: 'user',
        },
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
