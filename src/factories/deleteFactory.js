import connection from '../database/database';


const clearAllTables = async () => {
  const tables = [
    'sessions',
    'sales_products',
    'sales',
    'carts_products',
    'products',
    'categories',
    'carts',
    'users',
  ];

  const deleteStr = tableName => `DELETE FROM ${tableName};`;

  const deleteAllStr = tables.reduce((acc, cur) => acc + deleteStr(cur), '');

  await connection.query(deleteAllStr);
};


export {
  clearAllTables,
};
