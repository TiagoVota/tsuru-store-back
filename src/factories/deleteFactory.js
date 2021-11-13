import connection from '../database/database';


// TODO: Acho que esta função aqui é código legado, pode ser substituida pela nova
const clearTableDatabase = async (tableName) => {
  await connection.query(`DELETE FROM ${tableName};`);
};


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
  clearTableDatabase,
  clearAllTables,
};
