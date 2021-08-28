import { buildInsertInto } from '@/database/insert-into';
import pool from '@/database/pool';
import { buildUpdateWhere } from '@/database/update-where';
import { convertToIdentifiers, OmitAutoSetFields } from '@/database/utils';
import RequestError from '@/errors/RequestError';
import { ApplicationDBEntry, Applications } from '@logto/schemas';
import { sql } from 'slonik';

const { table, fields } = convertToIdentifiers(Applications);

export const findApplicationById = async (id: string) =>
  pool.one<ApplicationDBEntry>(sql`
    select ${sql.join(Object.values(fields), sql`, `)}
    from ${table}
    where ${fields.id}=${id}
  `);

export const insertApplication = buildInsertInto<ApplicationDBEntry>(pool, Applications, {
  returning: true,
});

const updateApplication = buildUpdateWhere<ApplicationDBEntry>(pool, Applications, true);

export const updateApplicationById = async (
  id: string,
  set: Partial<OmitAutoSetFields<ApplicationDBEntry>>
) => updateApplication({ set, where: { id } });

export const deleteApplicationById = async (id: string) => {
  const { rowCount } = await pool.query(sql`
    delete from ${table}
    where id=${id}
  `);
  if (rowCount < 1) {
    throw new RequestError({
      code: 'entity.not_exists_with_id',
      name: Applications.tableSingular,
      id,
      status: 404,
    });
  }
};