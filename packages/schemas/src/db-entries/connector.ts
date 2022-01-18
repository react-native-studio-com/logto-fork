// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import { z } from 'zod';

import { ConnectorConfig, connectorConfigGuard, GeneratedSchema, Guard } from '../foundations';
import { ConnectorType } from './custom-types';

export type CreateConnector = {
  id: string;
  enabled?: boolean;
  type: ConnectorType;
  config?: ConnectorConfig;
  createdAt?: number;
};

export type Connector = {
  id: string;
  enabled: boolean;
  type: ConnectorType;
  config: ConnectorConfig;
  createdAt: number;
};

const createGuard: Guard<CreateConnector> = z.object({
  id: z.string(),
  enabled: z.boolean().optional(),
  type: z.nativeEnum(ConnectorType),
  config: connectorConfigGuard.optional(),
  createdAt: z.number().optional(),
});

export const Connectors: GeneratedSchema<CreateConnector> = Object.freeze({
  table: 'connectors',
  tableSingular: 'connector',
  fields: {
    id: 'id',
    enabled: 'enabled',
    type: 'type',
    config: 'config',
    createdAt: 'created_at',
  },
  fieldKeys: ['id', 'enabled', 'type', 'config', 'createdAt'],
  createGuard,
});
