
exports.seed = async function(knex) {
  
  await knex('users').truncate()
  await knex('users').insert([
    { username: 'tim', password: '$2a$08$5zop3UOeaIAoBYMp/nVg.uyr2M6u/jS4qNZkGj8s2cfXmhH/497d2'}, // 1234
    { username: 'pam', password: '$2a$08$KdEWPGwK6O1ZsdnpzIRDd.193nDPLB46JHlLOSdDAM7Uk6iQfuX46'} // 5678
  ]);
};
