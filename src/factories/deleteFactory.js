import connection from '../database/database';


const cleanTableDatabase = async (tableName) => {
  await connection.query(`DELETE FROM ${tableName};`);
};


export { cleanTableDatabase };
